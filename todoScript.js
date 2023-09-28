
const toDoInput = document.getElementById("inputbox");
const toDoList = document.getElementById("to-do-list");
const submit = document.querySelector('.form-submit');
const inputImage = document.querySelector('#input-img')
submit.addEventListener('click', function (e) {
    e.preventDefault();
    var todoText = toDoInput.value;
    var image = inputImage.value;
    if (todoText === '') {
        alert("Please enter a todo");
        toDoInput.value = '';
        return;
    }
    else {
        const todo = {
            todoText,
            "completed": false,
            "imagePath": image,
        }
        // debugger;
        const formData = new FormData();
        formData.append('todoText', todo.todoText);
        formData.append('image', document.querySelector('#input-img').files[0]);

        //send form data from server
        fetch("/todo", {
            method: "POST",
            body: formData,
        }).then(function (res) {
            if (res.status === 200) {
                return res.json(res);

            } else {
                alert("something wrong");
            }
        }).then(function (todo) {
            showtodoInUI(todo);
        })

        toDoInput.value = '';
        inputImage.value = '';

    }

})

fetch("/todo-data").then(function (resp) {
    if (resp.status === 200)
        return resp.json();

    else {
        alert("somthing wrong");
    }
}).then(function (todos) {                        //recevied todo from server side    
    console.log("Received todos:", todos);
    todos.forEach(function (todo) {
        showtodoInUI(todo);
    });
}).catch(function (error) {
    console.error('Error fetching todo data:', error);
});



// Function to show a todo item in the UI
function showtodoInUI(todo) {
    const todolistitem = document.createElement("li");
    todolistitem.innerHTML = todo.todoText;

    showDeleteButton(todo, todolistitem);
    showCheckedButton(todo, todolistitem);
    toDoList.appendChild(todolistitem);

    // add image in list
    const image = document.createElement('img');
    image.className = "inputimage";
    const imagePath = todo.imagePath;
    console.log(imagePath);
    if (imagePath) {
        image.src = imagePath;
        todolistitem.appendChild(image);
    } else {
        console.log('Image path is empty or invalid.');
    }
    // image.src = imagePath;
    // todolistitem.appendChild(image);

}



// Function to show the Delete for each todo item in the UI
function showDeleteButton(todo, todolistitem) {
    const delbutton = document.createElement("button");
    delbutton.innerHTML = "X";
    delbutton.addEventListener("click", function () {
        deltodoFromServer(todo);
        toDoList.removeChild(todolistitem);
    })
    todolistitem.appendChild(delbutton);
}

// Function to send the  delete  state of a todo item to the server
function deltodoFromServer(todo) {
    fetch('/todoDEl', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todoText: todo }), // Sending the todoText to be deleted in the request body
    })
        .then(function (res) {
            if (res.status === 200) {
                // alert('Todo deleted successfully');
            } else {
                alert('Failed to delete todo item');
            }
        })
        .catch(function (error) {
            console.error('Error deleting todo:', error);
        });
}



// Function to show the checkbox for each todo item in the UI
function showCheckedButton(todo, todolistitem) {
    const checkbox = document.createElement("input");
    checkbox.type = 'checkbox';
    // console.log("checktodo",todo);
    checkbox.checked = todo.completed;
    if (todo.completed) { checkbox.disabled = true };
    checkbox.innerHTML = 'checkbox';


    if (todo.completed) {
        todolistitem.style.textDecoration = "line-through";
        checkbox.disabled = true;
    }
    checkbox.addEventListener("click", function () {
        todo.completed = checkbox.checked;

        checkbox.disabled = true;
        todolistitem.style.textDecoration = todo.completed ? "line-through" : "none";

        // Send checkbox state to the server
        checkboxfromserver(todo);
    });

    todolistitem.appendChild(checkbox);
}


// Function to send the checkbox state of a todo item to the server
function checkboxfromserver(todo) {

    fetch("/todocheck", {
        method: 'Post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ checkbox: todo }),
    }).then(function (res) {
        // console.log(res);
        if (res.status === 200) {
            alert('Todo checked successfully');
        } else {
            alert('Failed to checked todo item');
        }
    })
        .catch(function (error) {
            console.error('Error checked todo:', error);
        });
}




