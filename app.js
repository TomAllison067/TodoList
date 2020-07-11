const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('./main/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views', './main/views');


const routes = require('./main/routes/routes');
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("Server started on port " + PORT);
});

