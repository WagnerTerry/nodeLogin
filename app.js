const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

// Configuração de middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());
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
    if(req.session.loggedIn){
        res.render('home')
    } else {
        res.redirect('/')
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('loggedIn');
    req.session.loggedIn = false
    res.redirect('/')
    console.log("req, depois", req.session)


})

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    console.log("user", username, "login", password)
    
    if(username === 'usuario' && password === '123'){
        req.session.loggedIn = true
        res.status(200).json({sucess: true, message: "Login realizado com sucesso"})
        //return res.redirect('/home')

    } else {
        return res.status(401).json({success: false, message: 'Login inválido'})
    }
})

app.listen(3000, () => console.log("servidor na porta 3000"))