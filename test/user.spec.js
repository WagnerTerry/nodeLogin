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

        expect(response.status).toBe(200)
        expect(response.body).toEqual(expect.any(Array)); // Verifica se a resposta é um array
        expect(response.body.length).toBeGreaterThan(0); // Verifica se há pelo menos um usuário na resposta.
        // expect(response.body).toHaveLength(0); // Verifica se a resposta está vazia
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

    it.only("Deve excluir um usuário com sucesso", async () => {
        const response = await request(app)
        .get('/users')
        .send()

        console.log("res", response)
        // const response = await request(app)
        //  .delete(`/users/37`)
        //  .send()

        //  if(response.statusCode === 204){
        //     expect(response.status).toBe(204)
        //  }  else {
        //     expect(response.statusCode).toEqual(404)
        //  }
    })
    it('Deve retornar status 404 para usuário inexistente', async () => {
           //Verificar se o usuário foi removido do banco de dados
           const [rows] = await connection.promise().query('select * from users where  id = ?', ['9999']);
           expect(rows.length).toBe(0);
    })
})