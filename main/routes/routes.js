const express = require('express')
const router = express.Router()
const date = require('../js/date');
const db = require('../../app').db

// let tasks = ['Buy food', 'Cook food', 'Eat food'];
// let worktasks = ['Study']


router.route('/')
    .get((req, res) => {
        today = date.getToday();
        tasks = db.getList('list');
        return res.render('../views/list', { title: "ToDo List", today: today, tasks: tasks, formAction: "/" });
    })
    .post((req, res) => {
        if (req.body.newTask !== "") {
            db.addTask(req.body.newTask, "list");
            return res.redirect('/');
        }
    });

router.route('/work')
    .get((req, res) => {
        today = date.getToday();
        tasks = db.getList('work');
        return res.render('../views/list', { title: "ToDo List", today: today, tasks: tasks, formAction: "/work"});
    })
    .post((req, res) => {
        if (req.body.newTask !== "") {
            db.addTask(req.body.newTask, "work");
            return res.redirect('/work');
        }
    });
module.exports = router