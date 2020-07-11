const express = require('express')
const router = express.Router()
const date = require('../js/date');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    body: String
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

function insertDefaults() {
    const defaultItem1 = new Item({ body: 'item1' });
    const defaultItem2 = new Item({ body: 'item2' });
    const defaultItem3 = new Item({ body: 'item3' });
    let defaultItems = [defaultItem1, defaultItem2, defaultItem3];

    defaultItems.forEach((item) => {
        Item.updateOne({ body: item.body }, { item }, { upsert: true }, ((err) => {
            if (err) {
                console.log(err)
            }
        }));
    });
    console.log("Default items inserted");
}

router.route('/')
    .get((req, res) => {
        today = date.getToday();
        Item.find({}, (items) => {
            if (items.length === 0) {
                insertDefaults();
                res.redirect('/');
            } else {
                res.render('../views/list', { title: "ToDo List", today: today, items: items, formAction: "/" });
            }
        })
    })
    .post((req, res) => {
        if (req.body.taskBody !== "") {
            return res.redirect('/');
        }
    });

router.route('/delete')
    .post((req, res) => {
        console.log(req.body.checkbox);
    });

module.exports = router