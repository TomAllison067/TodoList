const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/js/date");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let tasks = ['Buy food', 'Cook food', 'Eat food'];
let worktasks = ['Study']

app.get("/", function(req, res){
    today = date.getToday();
    return res.render('list', {title: "ToDo List", today: today, tasks: tasks, listTitle: "list"});
});

app.get("/work", function(req, res){
    today = date.getToday();
    return res.render('list', {title: "Work Todo List", today: today, tasks: worktasks, listTitle: "worklist"});
});


app.post("/", function(req, res){
    console.log(req.body);
    let newTask = req.body.newTask;
    let redirectUrl = "/"
    let title = "";
    if (newTask !== ""){
        if (req.body.button === "list"){
            tasks.push(newTask);
        } else {
            worktasks.push(newTask);
            redirectUrl="/work";
        }
    }
    return res.redirect(redirectUrl);
});

app.listen(PORT, function() {
    console.log("Server started on port " + PORT);
});