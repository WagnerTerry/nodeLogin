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

// Rotas
app.get('/', (req, res) => {
    res.render('login', {title: "teste"})
})

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

app.listen(3000, () => console.log("servidor na porta 3000"))