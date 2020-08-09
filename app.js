/**
 * A simple toDo list app made in nodeJS, using express for templating.
 */

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('./main/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views', './main/views');

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
  }
app.use(ignoreFavicon);
const routes = require('./main/routes/routes');
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("Server started on port " + PORT);
});



