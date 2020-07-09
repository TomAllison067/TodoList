const { addTask, createTable } = require('../../app');
const app = require('../../app').app;

module.exports = () => {
    /**
     * Contains functionality for the database, allowing access.
     * The db object is kept in the module - so requiring this module will actually provide access to the module (but still call the import db)
     */
    var module = {};

    const Database = require('better-sqlite3')

    let db_type = (process.argv[2]);
    if (!(db_type === "temp" || db_type === "perm")) {
        console.log("Args: temp or perm");
        process.exit(1);
    }
    let types = {
        'temp': ':memory:',
        'perm': 'app.db'
    }
   
    const db = new Database(types[db_type], { verbose: console.log });

    /**
     * Creates a test table.
     * @param {*} arg1 
     * @param {*} arg2 
     */
    module.initTables = (err) => {
        try {
            let stmt = db.prepare("CREATE TABLE tasks(\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                body STRING,\
                type STRING\
                )")
            stmt.run();
            console.log("New table created.");
        } catch (err) {
            console.log("Tables already created.");
        }
    }

    module.addTask = (arg1, arg2) => {
        let stmt = db.prepare("INSERT INTO tasks(body, type)\
                VALUES (?, ?)")
        stmt.run(arg1, arg2);
    }

    module.getList = (typeOfList) => {
        let tasks = db.prepare("SELECT * FROM tasks WHERE type='" + typeOfList + "'").all();
        console.log("Tasks: " + tasks.length);
        for (i in tasks) {
            console.log(tasks[i].body + ": " + tasks[i].type);
        }
        return tasks
    }

    module.dropTables = () => {
        let stmts = [db.prepare("DROP TABLE IF EXISTS tasks")];
        for (i in stmts) {
            stmts[i].run();
        }
        console.log("Tables dropped");
    }

    module.insertDefault = () => {
        try {
            let stmt1 = db.prepare("CREATE TABLE tasks(\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                body STRING,\
                type STRING\
                )");
            stmt1.run();

            let insert = db.prepare("INSERT INTO tasks\
            (body, type)\
            VALUES\
            (@body, @type)");
            
            let insertMany = db.transaction((tasks) => {
                for (let task of tasks) insert.run(task);
            });

            // DEFAULT TASKS
            insertMany([
                {body: 'default_1', type: 'list'},
                {body: 'default_2', type:'list'},
                {body: 'work_1', type: 'work'}
            ]);

        } catch (err) {
            console.log(err);
        }
    }

    if (process.argv[3] === 'resetdb'){
        module.dropTables();
        module.insertDefault();
    }

    return module;
}





