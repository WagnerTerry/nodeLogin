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
    it('Deve inserir um novo usuário com sucesso', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                id: 1,
                nome: 'Joao'
            })
        expect(response.statusCode).toEqual(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Usuario adicionado com sucesso')
    })
})