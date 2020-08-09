const date = require('../js/date');
const express = require('express')
const router = express.Router()
const crud = require('../js/crud');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

/*
* Route shows the default list, or posts to it.
* The post route also handles our custom lists, as the list name is drawn from a button value in list.ejs
*/
router.route('/')
    .get((req, res) => {
        today = date.getToday();
        crud.showListOrCreateNew(res, 'Default');
    })
    .post((req, res) => {
        let itemBody = req.body.itemBody;
        let listName = _.capitalize(req.body.listName);

        if (req.body.taskBody !== "") {
            crud.postItem(itemBody, listName, () => {
                if (listName === 'Default') {
                    res.redirect('/');
                } else {
                    res.redirect('/' + listName);
                }
            });
        }
    });


/**
 * Routes user to a new list, creating it if it does not already exist.
 */
router.route('/favicon.ico', (req, res) => res.status(204));
router.route('/:customList')
    .get((req, res) => {
        let listName = _.capitalize(req.params.customList);
        crud.showListOrCreateNew(res, listName);
    });

/**
 * Deletes items from list.
 */
router.route('/delete')
    .post((req, res) => {
        let itemId = req.body.checkbox;
        let listName = _.capitalize(req.body.listName);
        crud.removeItem(itemId, listName, () => {
            res.redirect('/' + listName);
        });
    });



// app.js can now use these routes
module.exports = router


