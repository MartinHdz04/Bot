const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos
const db = new sqlite3.Database('tasks.db', (err) => {
    if (err) console.error('Error al conectar con la base de datos:', err.message);
    else console.log('Conectado a la base de datos de tareas.');
});

// Crear la tabla de tareas
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId TEXT,
    task TEXT,
    dueDate TEXT
)`);

// Función para agregar una tarea
const addTask = (chatId, task, dueDate, callback) => {
    db.run(`INSERT INTO tasks (chatId, task, dueDate) VALUES (?, ?, ?)`,
        [chatId, task, dueDate],
        (err) => callback(err)
    );
};

// Función para obtener tareas por chatId
const getTasksByChatId = (chatId, callback) => {
    db.all(`SELECT task, dueDate FROM tasks WHERE chatId = ?`, [chatId], (err, rows) => {
        callback(err, rows);
    });
};

// Función para obtener tareas pendientes para una fecha específica
const getTasksByDate = (date, callback) => {
    db.all(`SELECT chatId, task FROM tasks WHERE dueDate = ?`, [date], (err, rows) => {
        callback(err, rows);
    });
};

// Exportar las funciones
module.exports = {
    addTask,
    getTasksByChatId,
    getTasksByDate,
};
