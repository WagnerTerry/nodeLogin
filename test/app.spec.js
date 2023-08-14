const request = require('supertest')
const app = require('../app')

describe('Teste simples', () => {
    it('teste primerio', async () => {
        const res = await request(app).get('/')

        expect(res.statusCode).toEqual(200)
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