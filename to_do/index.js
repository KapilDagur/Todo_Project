const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const {v1:uuid1} = require('uuid');
const multer = require('multer');

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
//static file serve
app.use(express.static('templates'));
//media static file serve
app.use(express.static('media'));

const multerStorage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"media");
    },
    filename:function(req,file,callback){
        callback(null,uuid1());
    }
});

const upload = multer({
    storage:multerStorage,
})

app.use(upload.single("picture"));

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
        res.render('login',{err:null});
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
            if((uname === username || users[userid][uname]["username"] === username) && users[userid][uname]["password"] === password){
                req.session.is_logged_in = true;
                req.session.username = uname === username ? users[userid][uname]["username"] : username;
                req.session.userid = userid;
                req.session.picture = users[userid][uname]["picture"];
                res.redirect('/');
                return;
            }
        }
        res.render('login', {err: "Invalid Login Credentials"});
    });
});

app.get('/register',function(req,res){
    if(!req.session.is_logged_in){
        res.render('register',{err:null});
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
    let user_picture = req.file === undefined ? null : req.file.filename;

    let user = {};
    user[user_email] = {
        username:user_username,
        password:user_password,
        picture:user_picture
    };
    user_helper.userWriter(user_id,user,function(err){
        if(err){
            res.render('register',{err:err.message});
            return;
        }
        req.session.userid = user_id;
        req.session.username = user_username;
        req.session.picture = user_picture;
        req.session.is_logged_in = true;
        res.redirect('/');
    });
});

app.get('/logout', function(req,res){
    if(!req.session.is_logged_in){
        res.redirect('/login');
        return;
    }
    else{
        console.log(`User Disconnected : ${req.session.username}`);
        req.session.destroy(function(err){
            if(err){
                res.redirect('/login',{err:err.message});
                return;
            }
            res.redirect('/login');
        });
    }
})

//Todo Routes...
app.get('/', function(req,res){
    if(!req.session.is_logged_in){
        res.redirect('/auth');
    }
    else{
        console.log(`User Connected : ${req.session.username}`);
        res.render('index',{username:req.session.username,picture:req.session.picture});
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
    todo_helper.todoWriter(req.session.userid,task,function(err){
        if(err){
            res.sendstatus(501);
            return;
        }
        res.status(200).json(task);
    });
});

app.delete('/remove-task', function(req,res){
    const user_id = req.session.userid;
    const task_id = req.body['task_id'];
    todo_helper.todoRemoval(user_id,task_id,function(err){
        if(!err){
            res.sendStatus(200);
            return;
        }
        res.sendStatus(501);
    });
});

app.put('/status-task', function(req,res){
    const user_id = req.session.userid;
    const task_id = req.body['task_id'];
    const task_status = req.body['task_status'];
    todo_helper.todoModifier(user_id,task_id,"status",task_status,function(err){
        if(!err){
            res.sendStatus(200);
            return;
        }
        res.sendStatus(501);
    });
});

app.listen(3000, ()=>{
    console.log("Server is running on port : http://localhost:3000");
});
