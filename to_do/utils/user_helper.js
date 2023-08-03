const fs = require('fs');
const path = require('path');
module.exports.userReader = function(callback){
    fs.readFile(path.dirname(__dirname)+'/models/users_db.json','utf-8',function(err,users){
        let users_data;
        if(err){
            callback(new Error("FileReadingError: Unable to Reading File"));
            return;
        }
        else{
            try{
                users_data=JSON.parse(users);
            }
            catch(e){
                callback(new Error("Server Error"));
                return;
            }
            callback(null,users_data);
            return;
        }
    });
}

module.exports.userWriter = function(user_id,user,callback){
    fs.readFile(path.dirname(__dirname)+'/models/users_db.json','utf-8',function(err,users){
        let users_data;
        if(err){
            callback(new Error("FileReadingError: Unable to Reading File"));
            return;
        }
        else{
            try{
                users_data=JSON.parse(users);
            }
            catch(e){}
        }
        if(users_data === undefined){
            users_data={};
            users_data[user_id] = user;
        }
        else{
            for(let uid in users_data){
                if(Object.keys(users_data[uid]).toString()=== Object.keys(user).toString()){
                    callback(new Error("Email Already in use"));
                    return;
                }
            }
            users_data[user_id] = user;
        }
        fs.writeFile(path.dirname(__dirname)+"/models/users_db.json",JSON.stringify(users_data,null,2),function(err){
            if(err){
                callback(new Error("Server Error"));
            }
        });
        callback(null);
    });
}