
module.exports = () => {
    module = {}

    const mongoose = require('mongoose');
    mongoose.connect("mongodb://localhost:27017/todoDB", {useNewUrlParser: true});
    
    return module;
}