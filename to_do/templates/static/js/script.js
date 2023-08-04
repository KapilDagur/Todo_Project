const task_title = document.getElementById("todo-title")
const task_text = document.getElementById("todo-text");
const task_icon = document.getElementById("todo-icon");
const add_task_btn = document.getElementById("todo-add-btn");
const ul = document.getElementById("todo-list");

fetch('/todos').then(function(res){
    if(res.status === 200){
        return res.json();
    }
    else if(res.status === 401){
        window.location.href = '/login';
    }
    else{
        alert("Something went wrong");
    }
})
.then(function(todos){
    for(let todo in todos){
        putItemInList(todo,todos[todo]);
    }
}).catch((err)=>{
    console.log(err.message);
});


function putItemInList(id,todo) {
    let li = document.createElement('li');
    li.id = id;

    let task_title = document.createElement("h1");
    task_title.textContent = "Title : " + todo['title'];
    //Title Style...
    task_title.style.color = "#1F1F1F";
    task_title.style.backgroundColor = "#25D366";
    task_title.style.paddingLeft = "2%";

    let task_description = document.createElement("p");
    task_description.textContent = "Description : " + todo["description"];
    //paragraph style...
    task_description.style.backgroundColor = "#212121";
    task_description.style.color = "#EDEDED";
    task_description.style.paddingLeft = "5%";


    let task_status = document.createElement("input");
    task_status.type = "checkbox";
    task_status.checked = todo['status'];
    //checkbox style...
    task_status.style.backgroundColor = "#000000";
    task_status.style.color = "#ffffff";
    task_status.style.margin = "10px";
    task_status.style.padding = "10px";

    let delete_btn = document.createElement("input");
    delete_btn.type = "button";
    delete_btn.value = "X" ;
    delete_btn.width = "32px";
    //button style...
    delete_btn.style.width = "60px";
    delete_btn.style.height = "20px";
    delete_btn.style.color = "#ffffff";
    delete_btn.style.backgroundColor = "#ff0000";
    delete_btn.style.borderRadius = "25px";
    delete_btn.style.marginLeft = "10px";
    li.appendChild(task_title);
    li.appendChild(task_description);
    li.appendChild(task_status);
    li.appendChild(delete_btn);
    ul.appendChild(li);

    task_status.addEventListener("change", function(ev){
        const target_node = ev.target.parentElement;
        const status = task_status.checked.valueOf();
        fetch('/status-task',{
            method:"PUT",
            headers:{ "content-type": "application/json" },
            body: JSON.stringify({task_id:target_node.id, task_status:status})
        })
        .then(function(res){
            if(res.status === 200){
                if(!status){
                    target_node.style.textDecoration = "none";
                }
                else{
                    target_node.style.textDecoration = "line-through";
                }
            }
            else{
                    task_status.checked["value"] = !status;
                    alert("Task Not Updated");
            }
        })
        .catch(function(err){
            task_status.checked["value"] = !status;
            alert("Response with Error "+err.message);
        });
    });


    delete_btn.addEventListener("click", function(ev){
        const target_node =ev.target.parentElement;
        let del_cnfrm = confirm('Are you sure to delete task');
        if(!del_cnfrm)
            return;
        else{
            fetch('/remove-task',{
                method:"DELETE",
                headers : {'content-type': 'application/json'},
                body: JSON.stringify({task_id:target_node.id})
            })
            .then(function(req){
                if(req.status === 200){
                    ul.removeChild(target_node);
                    return;
                }
                else if(req.status === 501){
                    alert("Please Login First!!!");
                    return;
                }
            })
            .catch(function(){
                console.log('Error in deleting Task');
            });
        }
    });
}


function addTask(){
    let task = {
        id:null,
        title:task_title.value,
        description:task_text.value,
        status:false,
    };

    fetch('/add-task', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(task),
    })
    .then((res)=>{
            if(res.status === 200){
                return res.json();
            }
            else{
                alert("Server Error");
            }
        })
        .then((todo)=>{
            putItemInList(Object.keys(todo),todo);
        })
        .catch((err)=>{
            console.log(err.message);
    });
}