const mysql = require('mysql2')

const connectionTest = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testdb'
})

connectionTest.connect((err) => {
    if(err){
        console.error('Erro ao conectar ao banco de testes: ', err);
        return;
    }
    console.log('Conexão bem sucedida ao banco de testes mysql')
})

module.exports = connectionTest;