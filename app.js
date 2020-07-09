const express = require("express");
const app = express();
app.use(express.static('./main/public'));
app.set('view engine', 'ejs');
app.set('views', './main/views');

const db = require('./main/js/database.js')()

function testDb() {
    // db.fuckYou('foo', 'bar');
    db.createTable();
    
    db.addTask('foo', 'bar');

    db.printTasks();
}

const routes = require('./main/routes/routes');
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("Server started on port " + PORT);
});
