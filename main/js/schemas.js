const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    body: String,
});
const Item = mongoose.model('Item', itemSchema);

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model('List', listSchema);

module.exports = {
    itemSchema,
    Item,
    listSchema,
    List
}