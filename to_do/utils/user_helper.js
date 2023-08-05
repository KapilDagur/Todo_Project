const fs = require('fs');
const path = require('path');
module.exports.userReader = function(callback){
    reader(function(err,users){
        if(err){
            callback(err);
            return;
        }
        callback(null,users);
    });
}

module.exports.userWriter = function(user_id,user,callback){
    reader(function(err,users){
        if(err){
            callback(err);
            return;
        }
        if(users === undefined){
            users = {};
        }
        else{
            for(let uid in users){
                if(Object.keys(users[uid]).toString()=== Object.keys(user).toString()){
                    callback(new Error("Email Already exist, Try Another!!! "));
                    return;
                }
            }
        }
        users[user_id] = user;
        writer(users,function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

module.exports.userModifier = function(userid,password,update,callback){
    reader(function(err,users){
        let username;
        if(err){
            callback(err);
            return;
        }
        username = Object.keys(users[userid]).toString();
        if(users[userid][username]["password"] !== password){
            return callback(new Error("Password doesn't Matched !!!"));
        }
        else if(update.password){
            users[userid][username]["password"] = update.password;
        }
        if(update.username){
            users[userid][username]["username"] = update.username;
        }
        if(update.picture){
            users[userid][username]["picture"]  = update.picture;
        }
        writer(users,function(err){
            if(err){
                callback(err);
                return;
            }
            callback(null);
        });
    });
}

module.exports.userRemoval = function(userid,password,callback){
    reader(function(err,users){
        let username;
        if(err){
            return callback(err);
        }
        username = Object.keys(users[userid]).toString();
        if(users[userid][username]["password"] !== password){
            return callback(new Error("Password Doesn't Match !!!"));
        }
        delete users[userid];
        writer(users,function(err){
            if(err){
                return callback(err);
            }
            return callback(null);
        });
    });
}

function reader(callback){
    fs.readFile('./models/users_db.json',"utf-8", function(error,content){
        let data = {};
        if(error){
            callback(new Error("Error : ServerErrorFRE"));
            return;
        }
        try{
            data = JSON.parse(content);
        }
        catch(err){
            callback(new Error("Error : ServerErrorJPE"));
            return;
        }
        callback(null,data);
    });
}

function writer(data,callback){
    fs.writeFile(path.dirname(__dirname)+'/models/users_db.json',JSON.stringify(data,null,2),function(err){
        if(err){
            callback(new Error("Error : ServerErrorFWE"));
            return;
        }
        callback(null);
    });
}