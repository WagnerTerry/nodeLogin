const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'nodelogin'
})

connection.connect((err) => {
    if(err){
        console.error('Erro ao conectar ao banco de dados: ', err);
        return;
    }
    console.log('Conexão bem sucedida ao banco mysql')
})

module.exports = connection;