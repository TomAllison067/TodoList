var express = require('express')
var router = express.Router()

const date = require('../js/date');

let tasks = ['Buy food', 'Cook food', 'Eat food'];
let worktasks = ['Study']

router.route('/')
    .get((req, res) => {
        today=date.getToday();
        return res.render('../views/list', {title: "ToDo List", today: today, tasks: tasks, listTitle: "list"});
    })
    .post((req,res) => {
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

router.route('/work')
    .get((req, res) => {
        today=date.getToday();
        return res.render('list', {title: "ToDo List", today: today, tasks: worktasks, listTitle: "workList"});
    });

module.exports = router