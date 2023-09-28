const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const session = require('express-session');

//db
const todomodel = require('./models/user');
const db = require('./models/db');
const signupmodel = require('./models/auth');


// middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single("image"));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'dont know',
    resave: false,
    saveUninitialized: true,
}));

//routes
app.get("/", (req, resp) => {
    resp.render('home');
})
app.get("/contact", (req, resp) => {
    if (!req.session.isLoggedIn) {
        resp.redirect("login");
        return;
    }
    resp.render('contact', { username: req.session.username });
})
app.get("/todo", (req, resp) => {
    if (!req.session.isLoggedIn) {
        resp.redirect("login");
        return;
    }
    resp.render("todo", { username: req.session.username });
})
app.get("/todoScript.js", (req, res) => {
    res.sendFile(__dirname + '/todoScript.js');
})
app.get("/login", (req, resp) => {
    resp.render('login', { error: null });
})
app.get("/signup", (req, resp) => {
    resp.render('signup', { error: null });
})
app.get("/logout", (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect("/");
})


//signup 
app.post('/signup', (req, res) => {

    const { username, email, password } = req.body;
    const userexit = signupmodel.findOne({
        username: username,
    })
    if (userexit) {
        return res.render("signup", { error: 'User Already exist! Please login..' });
    }
    const newUser = {
        username: username,
        email: email,
        password: password
    };

    signupmodel.create(newUser)
        .then((data) => {

            res.redirect('login');
        })
        .catch(err => {

            console.error(err);
            res.status(500).json({
                error: "An error occurred while creating the todo.",
            });
        });
})

//login
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const name = await signupmodel.findOne({ username: username });
        if (name.password === password) {
            req.session.isLoggedIn = true;
            req.session.username = username;
            res.status(200).redirect('todo');
        } else {
            res.render("login", { error: "invalid login Details" });
        }
    } catch (error) {
        res.status(400).send("invalid login Details");
    }

})



// Handle POST request for creating a new todo

app.post("/todo", (req, res) => {
    const todoText = req.body.todoText;
    const image = req.file;

    const imagePath = `/uploads/${image.filename}`;


    const todo = {
        "todoText": todoText,
        "completed": false,
        "imagePath": imagePath,
    }
    // console.log(todo);
    console.log("curent path", __filename);
    // Insert the todo into the database
    todomodel.create(todo)
        .then((todos) => {

            res.status(200).json(todos);
        })
        .catch(err => {

            console.error(err);
            res.status(500).json({
                error: "An error occurred while creating the todo.",
            });
        });

})
// Fetch all todos
app.get("/todo-data", function (req, res) {
    todomodel.find()
        .then(function (todos) {
            console.log("lslsl", todos);
            res.status(200).json(todos);
        })
        .catch(function (err) {
            res.status(500).json(err);
        });
});



//check-todo 

app.post("/todocheck", (req, res) => {
    let todocheck = req.body.checkbox;
    // console.log("checkbox is ", todocheck);

    todomodel.updateOne({ _id: todocheck }, { completed: true })
        .then(function (result) {

            res.status(200).send("success");
            console.log("Update successful");

        }).catch(function (err) {
            res.status(500).send("error");
        });
});



// Delete todo come todo delete list from client side
app.post('/todoDEL', function (req, res) {
    let todo = req.body.todoText;
    todoText = todo.todoText;
    const todoim = todo.imagePath;

    if (!todoText) {
        res.status(400).send('Todo text not provided in the request body');
        return;
    }
    // Delete the todo from the database
    todomodel.deleteOne({ todoText: todoText })
        .then(function () {
            // Delete the associated image file
            fs.unlink('./' + todo.imagePath, function (err) {
                if (err) {
                    res.status(500).send('error');
                    // console.log("Error:", err);
                    return;
                }
            })

            res.status(200).send('Todo deleted successfully');
        }).catch(function (err) {
            res.status(500).send('Error deleting todo');
        })
});

// Initialize the database and start the server
db.init()
    .then(function () {
        console.log("db connected");

        app.listen(2000, () => {
            console.log(" successfully executed");
        })
    }).catch(function (err) {
        console.log(err);
    })