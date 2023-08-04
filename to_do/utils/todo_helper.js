const fs = require('fs');
const path = require('path');

module.exports.todoReader = function(user_id,callback) {
    reader(function(err,todos){
        if(err){
            callback(err);
            return;
        }
        callback(null,todos[user_id]);
        return;
    });
}

module.exports.todoWriter = function(user_id,todo,callback){
    reader(function(err,data){
        if(err){
            callback(err);
            return;
        }
        data = data === undefined ? {} : data;
        if(!data[user_id]){
            data[user_id]= {};
        }
        data[user_id][todo['id']] = {
            title:todo["title"],
            description:todo["description"],
            status:todo['status']
        }
        writer(data,function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

module.exports.todoRemoval = function(user_id,task_id,callback){
    reader(function(err,data){
        if(err){
            callback(err);
            return;
        }
        delete data[user_id][task_id];
        writer(data,function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

module.exports.todoModifier = function(user_id,task_id,key,value,callback){
    reader(function(err,data){
        if(err){
            callback(err);
            return;
        }
        data[user_id][task_id][key] = value;
        writer(data,function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

function reader(callback){
    fs.readFile('models/todos_db.json',"utf-8", function(err,data){
        let parsedData = {};
        if(err){
            callback(new Error("Error : ServerErrorR "));
            return;
        }
        try {
            parsedData = JSON.parse(data);
        } catch (err) {
            callback(new Error("Error : JSONParsingError "));
            return;
        }
        callback(null,parsedData);
    });
}

function writer(data,callback){
    fs.writeFile(path.dirname(__dirname)+'/models/todos_db.json',JSON.stringify(data,null,2),function(err){
        if(err){
            callback(new Error("Error : ServerErrorW"));
            return;
        }
        callback(null);
    });
}