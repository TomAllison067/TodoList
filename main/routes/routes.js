const express = require('express')
const router = express.Router()
const date = require('../js/date');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Default list
router.route('/')
    .get((req, res) => {
        today = date.getToday();
        showList(res, 'Default');
    })
    .post((req, res) => {
        let itemBody = req.body.itemBody;
        let listName = _.capitalize(req.body.listName);

        if (req.body.taskBody !== "") {
            postItem(itemBody, listName, () => {
                if (listName === 'Default') {
                    res.redirect('/');
                } else {
                    res.redirect('/' + listName);
                }
            });
        }
    });

// Custom lists
router.route('/:customList')
    .get((req, res) => {
        let listName = _.capitalize(req.params.customList);
        showList(res, listName);
    });

router.route('/delete')
    .post((req, res) => {
        let itemId = req.body.checkbox;
        let listName = _.capitalize(req.body.listName);
        removeItem(itemId, listName, () => {
            res.redirect('/' + listName);
        });
    });

router.route('/favicon.ico', (req, res) => res.status(204));
module.exports = router


const itemSchema = new mongoose.Schema({
    body: String,
});

const Item = mongoose.model('Item', itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('List', listSchema);
// const defaultItem1 = new Item({body: 'item1'});
// const defaultItem2 = new Item({body: 'item2'});
// const defaultItem3 = new Item({body: 'item3'});
// let defaultItems = [defaultItem1, defaultItem2, defaultItem3];

// defaultItems.forEach((item) => {
//     Item.update({body: item.body}, {item}, {upsert: true}, ((err) => {
//         if (err) {console.log(err)};
//     }));
// });

function insertdefault(callback) {
    const defaultItem1 = new Item({ body: 'item1', list: 'Default' });
    const defaultItem2 = new Item({ body: 'item2', list: 'Default' });
    const defaultItem3 = new Item({ body: 'item3', list: 'Default' });
    let defaultItems = [defaultItem1, defaultItem2, defaultItem3];

    let defaultList = new List({
        name: 'Default',
        items: defaultItems
    });
    defaultList.save();
    console.log("Default items inserted");
    callback();
}

function showList(res, listName) {
    List.findOne({ name: listName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                if (listName === 'Default') {
                    insertdefault(() => {
                        res.redirect('/');
                    });
                } else {
                    let newList = new List({
                        name: listName,
                        items: []
                    });
                    newList.save();
                    let url = "/" + (listName === 'Default' ? '' : listName);
                    res.redirect(url);
                }
            } else {
                res.render('../views/list', { list: foundList, items: foundList.items, formAction: "/", today: date.getToday(), });
            }
        }
    });
}

function createNewList(itemBody, listName, callback) {
    item = new Item({ body: itemBody });
    list = new List({
        name: listName,
        items: [item]
    });
    list.save();
    callback();
}

function postItem(itemBody, listName, callback) {
    List.findOne({ name: listName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                createNewList(itemBody, listName, () => {
                    callback();
                });
            } else {
                item = new Item({ body: itemBody });
                foundList.items.push(item);
                foundList.save();
                callback();
            }
        }
    });
}

function removeItem(itemId, listName, callback) {
    List.updateOne({ name: listName }, { $pull: { items: { _id: itemId } } }, () => {
        callback();
    });
}