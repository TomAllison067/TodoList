const express = require('express')
const router = express.Router()
const date = require('../js/date');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    body: String,
    list: String
});

const Item = mongoose.model('Item', itemSchema);

// const defaultItem1 = new Item({body: 'item1'});
// const defaultItem2 = new Item({body: 'item2'});
// const defaultItem3 = new Item({body: 'item3'});
// let defaultItems = [defaultItem1, defaultItem2, defaultItem3];

// defaultItems.forEach((item) => {
//     Item.update({body: item.body}, {item}, {upsert: true}, ((err) => {
//         if (err) {console.log(err)};
//     }));
// });

function insertDefaults(callback) {
    const defaultItem1 = new Item({ body: 'item1', list: 'defaultList' });
    const defaultItem2 = new Item({ body: 'item2', list: 'defaultList' });
    const defaultItem3 = new Item({ body: 'item3', list: 'defaultList' });
    let defaultItems = [defaultItem1, defaultItem2, defaultItem3];

    defaultItems.forEach((item) => {
        Item.updateOne({ body: item.body, list: item.list }, { item }, { upsert: true }, ((err) => {
            if (err) {
                console.log(err)
            }
        }));
    });
    console.log("Default items inserted");
    callback();
}

function getItems(res, list) {
    Item.find({ list: list }, (err, items) => {
        if (err) {
            console.log(err);
        } else {
            if (list === 'defaultList' && items.length === 0) {
                insertDefaults(() => {
                    res.redirect('/');
                });
            } else {
                res.render('../views/list', { title: "ToDo List", today: today, items: items, list: list, formAction: "/" });
            }
        }
    });
}

function postItem(body, list, callback) {
    if (list == null) {
        list = 'defaultList';
    }
    var item = new Item({ body: body, list: list });
    item.save((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Item saved.");
        }
    });
    callback();
}

function removeItem(itemId) {
    Item.deleteOne({ _id: itemId }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Item removed.");
        }
    })
}

// Default list
router.route('/')
    .get((req, res) => {
        today = date.getToday();
        getItems(res, 'defaultList');
    })
    .post((req, res) => {
        console.log(req.body.itemBody);
        console.log(req.body.list);
        if (req.body.taskBody !== "") {
            postItem(req.body.itemBody, req.body.list, () => {
                res.redirect('/');
            });

        }
    });

// Custom lists
// router.route('/:customList')
//     .get((req, res) => {
//         console.log(req.params.customList);
//         res.redirect('/');
//     });

router.route('/delete')
    .post((req, res) => {
        let itemId = req.body.checkbox;
        removeItem(itemId);
        res.redirect('/');
    });

module.exports = router