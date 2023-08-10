const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

// Configuração de middleware
app.use(bodyParser.urlencoded({ extended: true}))
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Rotas
app.get('/', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    console.log("tela login")
})

app.listen(3000, () => console.log("servidor na porta 3000"))