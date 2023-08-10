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

app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    
    if(username === 'usuario' && password === '123'){
        req.session.loggedIn = true
        res.redirect('/home')
    } else {
        res.redirect('/')
    }
})

app.listen(3000, () => console.log("servidor na porta 3000"))