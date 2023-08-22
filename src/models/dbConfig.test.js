const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testdb'
})

connection.connect((err) => {
    if(err){
        console.log("Erro ao conectar ao banco de testes: ", err)
    }
    console.log("Conexão bem sucedida ao banco de testes")
})