require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const users = require('./src/routes/users')

const app = express();

// Configuração de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "segredo",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Rotas View
app.get("/", (req, res) => {
  res.render("login", { title: "teste" });
});

app.get("/home", (req, res) => {
  if (req.session.loggedIn) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  res.redirect("/");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "usuario" && password === "123") {
    req.session.loggedIn = true;
    // res.status(200).json({success: true, message: "Login realizado com sucesso"})
    return res.redirect("/home");
  } else {
    return res.status(401).json({ success: false, message: "Login inválido" });
  }
});

// Rotas com banco de dados
app.use('/users', users)

module.exports = app;

//app.listen(3000, () => console.log("servidor na porta 3000"))
