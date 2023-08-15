const request = require('supertest')
const app = require('../app')
const mysql = require('mysql2')

describe('Testes usando o banco mysql', () => {
    let connection;

    beforeAll(() => {
        // configuração da conexão com um banco de dados de teste
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'testdb' // banco de dados para teste
        })

        app.set('dbConnection', connection)
    })

    afterAll(() => {
        connection.end();
    })
    it('Listar usuários do banco', async () => {
        // Inserindo alguns usuarios
        // await connection.promise().query('insert into users (nome) values (?)', ['joao']);
        // await connection.promise().query('insert into users (nome) values (?)', ['gabi']);

        const response = await request(app)
            .get('/users')
            .send()

        expect(response.statusCode).toEqual(200)
    })
})