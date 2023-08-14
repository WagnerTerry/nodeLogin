const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./src/models/db')

const app = express();

// Configuração de middleware
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true
}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'));

// Rotas View
app.get('/', (req, res) => {
    res.render('login', {title: "teste"})
})

app.get('/home', (req, res) => {
    if(req.session.loggedIn){
        res.render('home')
    } else {
        res.redirect('/')
    }
})

app.get('/logout', (req, res) => {
    req.session.loggedIn = false
    res.redirect('/')

})

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    
    if(username === 'usuario' && password === '123'){
        req.session.loggedIn = true
        // res.status(200).json({success: true, message: "Login realizado com sucesso"})
         return res.redirect('/home')

    } else {
        return res.status(401).json({success: false, message: 'Login inválido'})
    }
})

// Rotas banco de dados
app.get('/users', (req, res) => {
    db.query('select * from users', (err, results) => {
        if(err){
            console.error('erro ao executar consulta: ', err);
            res.status(500).send('Erro no servidor')
            return
        }
        res.json(results)

    })
})

app.post('/users', (req, res) => {
    const {nome} = req.body

    db.query('insert into users (nome) values (?)',
     [nome],
     (err, results) => {
        if(err){
            res.status(500).json({success: false, error: err});
            return;
        }
        res.status(201).json({success: true, message: "Usuario adicionado com sucesso", id: results.insertId})
    })
})

app.put('/users/:id', (req, res) => {
    const id = req.params.id
    const nome = req.body


    db.query('update users set nome = ? where id = ?', 
    
    [nome, id],
    (err, results) => {

        if(err){
            return res.status(500).json({success: false, error: err})
        }

        if(results.affectedRows === 0){
            return res.status(404).json({success: false, message: "Usuário não encontrado"})
        }

        return res.status(200).json({success: true, message: 'Usuário atualizado'})
    }
    )
})


app.listen(3000, () => console.log("servidor na porta 3000"))