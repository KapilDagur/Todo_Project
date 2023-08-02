const bodyParser = require('body-parser');
const express = require('express');
const {v1:uuid1} = require('uuid');

//Custom Modules require
const todo_helper = require('./utils/todo_helper');

const app = express();

//middlewares...
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse json 
app.use(bodyParser.json());
//set views
app.set('views','templates');
// set view engine to ejs (templating language)
app.engine('.html',require('ejs').__express); //this line will render the html
app.set('view engine','html')

//Todo DB here...
let db = [];

app.get('/', function(req,res){
    res.render('todo');
});

app.get('/todos', function(req,res){
    todo_helper.todoReader("Ram", function(err,todos){
        return res.json(todos);
    });
});

app.post('/add-task', function(req,res){
    const task = {
        id:uuid1(),
        title:req.body['title'],
        description:req.body['description'],
        status:req.body['status'],
    };
    todo_helper.todoWriter("Ram",task);
    res.status(200).json(task);
});


app.listen(3000, ()=>{
    console.log("Server is running on port : http://localhost:3000");
});
