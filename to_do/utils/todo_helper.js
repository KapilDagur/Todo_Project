const fs = require('fs');
const path = require('path');

module.exports.todoReader = function(user_id = "Ram",callback) {
    fs.readFile(path.dirname(__dirname) + '/models/todos_db.json','utf-8', function(err,data){
        let todos = {}
        if (err){
            callback(new Error("Server Not Able to read Todos"));
            return;
        }
        try{
            todosData=JSON.parse(data);
        }
        catch(error){
            console.log("JSON Parsing Failed");
            callback(new Error("Server Error"));
            return;
        }
        todos = todosData[user_id];
        callback(null,todos);
        return;
    });
}

module.exports.todoWriter = function(user_id = "Ram",todo,callback){
    fs.readFile(path.dirname(__dirname)+'/models/todos_db.json', "utf-8", function(err,content){
        let data;
        if(err){
            callback(new Error("Server Not Able to read Todos"));
            return;
        }
        try{
            data=JSON.parse(content);
        }
        catch(e){
            console.log("Json Parse EError")
        }
        data = data === undefined ? {} : data;
        if(!data[user_id]){
            data[user_id]={};
        }
    
        data[user_id][todo['id']] = {
            'title':todo["title"],
            'description' :  todo["description"],
            'status' :  todo["status"]
        }

        fs.writeFile(path.dirname(__dirname) + '/models/todos_db.json', JSON.stringify(data,null,2), function(err){
            if(err){}
        });
    });
    
}
