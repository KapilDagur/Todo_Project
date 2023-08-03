const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const {v1:uuid1} = require('uuid');

//Custom Modules require
const todo_helper = require('./utils/todo_helper');
const user_helper = require('./utils/user_helper');

const app = express();

//middlewares...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse json 
app.use(bodyParser.json());
//Session setup
app.use(session({
    secret:'secretkeyhere', //change this in production!
    saveUninitialized : true,
    resave:false
}));

//set views
app.set('views','templates');
// set view engine to ejs (templating language)
app.set('view engine','ejs');

//Auth Routes...
app.get('/auth',function(req,res){
    if(!req.session.is_logged_in){
        res.render('auth');
    }
    else{
        res.redirect('/');
    }
});

app.get('/login', function(req,res){
    if(!req.session.is_logged_in){
        res.render('login');
    }
    else{
        res.redirect('/');
    }
});

app.post('/login', function(req,res){
    let username = req.body["username"];
    let password = req.body["password"];
    user_helper.userReader(function(err,users){
        if(err){
            console.log("Error Occured while reading the file");
            res.render('login',{err:err.message});
        }
        for (let userid in users) {
            let uname = Object.keys(users[userid]).toString();
            if((uname === username
                || users[userid][uname]["username"] === username)
                && users[userid][uname]["password"] === password){
                req.session.is_logged_in = true;
                req.session.username = req.body['username'];
                req.session.userid = userid;
                res.redirect('/');
                return;
            }
        }
        res.render('login', {err: "Invalid Login Credentials"});
    });
});

app.get('/register',function(req,res){
    if(!req.session.is_logged_in){
        res.render('register');
    }
    else{
        res.redirect('/');
    }
});

app.post('/register', function(req,res){
    let user_id = uuid1();
    let user_username = req.body['username'];
    let user_email = req.body['email'];
    let user_password = req.body['password'];

    let user = {};
    user[user_email] = {
        username:user_username,
        password:user_password
    };
    user_helper.userWriter(user_id,user,function(err){
        if(err){
            res.render('register',{error:err.message});
            return;
        }
        req.session.userid = user_id;
        req.session.username = user_username;
        req.session.is_logged_in = true;
        res.redirect('/');
    });
});

//Todo Routes...
app.get('/', function(req,res){
    if(!req.session.is_logged_in){
        res.redirect('/auth');
    }
    else{
        console.log(`User ${req.session.username} Connected`);
        res.render('index',{username:req.session.username});
    }
});

app.get('/todos', function(req,res){
    todo_helper.todoReader(req.session.userid, function(err,todos){
        return res.status(200).json(todos);
    });
});

app.post('/add-task', function(req,res){
    const task = {
        id:uuid1(),
        title:req.body['title'],
        description:req.body['description'],
        status:req.body['status'],
    };
    todo_helper.todoWriter(req.session.userid,task);
    res.status(200).json(task);
});


app.listen(3000, ()=>{
    console.log("Server is running on port : http://localhost:3000");
});
