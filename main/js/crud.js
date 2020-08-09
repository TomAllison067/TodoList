const date = require('./date');
const schemas = require('./schemas');
const Item = schemas.Item;
const itemSchema = schemas.itemSchema;
const List = schemas.List;
const listSchema = schemas.listSchema;


/**
 * Inserts default items into the default list.
 * Precondition: The default list does not exist in the database.(ie it is empty, or the app is running for the first time.)
 * @param {*} callback 
 */
function insertDefaultListAndItems(callback) {
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

/**
 * Queries the db for a list and redirects the user to it. If no list is found, it creates a new list first.
 * @param {*} res the express response object
 * @param {*} listName the name of the existing or new list
 */
function showListOrCreateNew(res, listName) {
    List.findOne({ name: listName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                if (listName === 'Default') {
                    insertDefaultListAndItems(() => {
                        res.redirect('/');
                    });
                } else {
                    createNewList(listName, () => {
                        let url = "/" + (listName === 'Default' ? '' : listName);
                        res.redirect(url);
                    });
                }
            } else {
                res.render('../views/list', { list: foundList, items: foundList.items, formAction: "/", today: date.getToday(), });
            }
        }
    });
}

/**
 * Creates a new list and saves it to the db
 * @param {*} listName the name of the list
 * @param {*} callback the desired callback (eg, a redirect)
 */
function createNewList(listName, callback) {
    list = new List({
        name: listName,
        items: []
    });
    list.save();
    callback();
}

/**
 * Adds a new item to a given list.
 * If no list is found, it first creates the list.
 * @param {*} itemBody 
 * @param {*} listName 
 * @param {*} callback 
 */
function postItem(itemBody, listName, callback) {
    List.findOne({ name: listName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                createNewList(listName, () => {
                    postItem(itemBody, listName, callback);
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

/**
 * Removes an item from a list in the database.
 * @param {*} itemId the id of the item
 * @param {*} listName the name of the list the item is in
 * @param {*} callback a callback (probably a redirect)
 */
function removeItem(itemId, listName, callback) {
    List.updateOne({ name: listName }, { $pull: { items: { _id: itemId } } }, () => {
        callback();
    });
}

module.exports = {
    insertDefaultListAndItems,
    showListOrCreateNew,
    createNewList,
    postItem,
    removeItem
}