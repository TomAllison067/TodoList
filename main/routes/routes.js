const express = require('express')
const router = express.Router()
const date = require('../js/date');
const db = require('../../app').db


let lists = {
    'tasks': ['Buy food', 'Cook food', 'Eat food'],
    'work': ['Study']
}


router.route('/')
    .get((req, res) => {
        today = date.getToday();
        return res.render('../views/list', { title: "ToDo List", today: today, list: lists['tasks'], formAction: "/" });
    })
    .post((req, res) => {
        if (req.body.taskBody !== "") {
            lists.tasks.push(req.body.taskBody);
            return res.redirect('/');
        }
    });

router.route('/:list')
    .get((req, res) => {
        let list = req.params.list;
        today = date.getToday();
        if(list in lists){
            return res.render('../views/list', { title: "ToDo List", today: today, list: lists[list], formAction: "/work" });
        } else {
            return res.redirect('/');
        }
    })
    .post((req, res) => {
        if (req.body.taskBody !== "") {
            let list = req.params.list;
            lists.list.push(req.body.taskBody);
            return res.redirect('/work');
        }
    });
    
module.exports = router