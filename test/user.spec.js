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

    it('Deve buscar um usuário por id', async () => {
        const userId = 60

        const response = await request(app)
            .get(`/users/${userId}`)

        const { success, message } = response.body

        if (success) {
            expect(response.status).toBe(200)
            return;
        }

        expect(response.statusCode).toEqual(404)
        expect(message).toBe("Usuário não encontrado")
        return;


    })

    it('Deve inserir um novo usuário com sucesso', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                nome: 'Joao'
            })
        expect(response.statusCode).toEqual(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Usuario adicionado com sucesso')
    })

    it('Deve atualizar um usuário e retornar status code 200', async () => {
        const userIdToUpdate = 591; // Id do usuario para atualizar
        const updatedUserData = { id: userIdToUpdate, nome: "Joao Jest" }

        // Usando o supertest para enviar uma solicitação PUT à rota de atualização
        const response = await request(app)
            .put(`/users/${userIdToUpdate}`)
            .send(updatedUserData)

        const { success, message } = response.body

        if (success) {
            expect(response.status).toBe(200)
            return;
        }

        expect(response.statusCode).toEqual(404)
        expect(message).toBe("Usuário não encontrado")
        return;

    })

    it("Deve excluir um usuário com sucesso", async () => {
        const [users] = await connection.promise().query('select * from users');

        if (!users.length) {
            expect(users).toHaveLength(0)
            return
        }
        const userId = users[0].id

        const response = await request(app)
            .delete(`/users/${userId}`)

        expect(response.status).toBe(204)
        return
    })

    it('Deve retornar status 404 para usuário inexistente', async () => {
        const [rows] = await connection.promise().query('select * from users where  id = ?', ['9999']);
        expect(rows.length).toBe(0);
    })

})