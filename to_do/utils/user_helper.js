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
    })

    // fs.readFile(path.dirname(__dirname)+'/models/users_db.json','utf-8',function(err,users){
    //     let users_data;
    //     if(err){
    //         callback(new Error("FileReadingError: Unable to Reading File"));
    //         return;
    //     }
    //     else{
    //         try{
    //             users_data=JSON.parse(users);
    //         }
    //         catch(e){}
    //     }
    //     if(users_data === undefined){
    //         users_data={};
    //         users_data[user_id] = user;
    //     }
    //     else{
    //         for(let uid in users_data){
    //             if(Object.keys(users_data[uid]).toString()=== Object.keys(user).toString()){
    //                 callback(new Error("Email Already exist, Try Another!!! "));
    //                 return;
    //             }
    //         }
    //         users_data[user_id] = user;
    //     }
    //     fs.writeFile(path.dirname(__dirname)+"/models/users_db.json",JSON.stringify(users_data,null,2),function(err){
    //         if(err){
    //             callback(new Error("Server Error"));
    //         }
    //     });
    //     callback(null);
    // });
}

function reader(callback){
    fs.readFile('./models/users_db.json',"utf-8", function(error,content){
        let data = {};
        if(error){
            callback(new Error("Error : ServerErrorFRE"));
            return;
        }
        try{
            data = JSON.parse(content)
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