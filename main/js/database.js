
module.exports = () => {
    /**
     * Contains functionality for the database, allowing access.
     */
    var module = {};

    const Database = require('better-sqlite3')
    const db = new Database(':memory:', {verbose: console.log});

    module.createTable = () => {
        const stmt = db.prepare("CREATE TABLE tasks(\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            body STRING,\
            type STRING\
            )")
        stmt.run();
    }

    module.addTask = (arg1, arg2) => {
        const stmt = db.prepare("INSERT INTO tasks(body, type)\
                VALUES (?, ?)")
        stmt.run(arg1, arg2);
        
    }

    module.printTasks = () => {
        const tasks = db.prepare("SELECT * FROM tasks").all();
        for (i in tasks){
            console.log(tasks[i]);
        }
    }

    return module;
}


  


