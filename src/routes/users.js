const express = require('express')

const router = express()

const db =
    process.env.DB_ENV === "test"
        ? require("../models/dbConfig.test")
        : require("../models/dbConfig");


router.use(express.json())


router.get("/", (req, res) => {
    db.query("select * from users", (err, results) => {
        if (err) {
            console.error("erro ao executar consulta: ", err);
            res.status(500).send("Erro no servidor");
            return;
        }
        res.json(results);
    });
});

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    db.query("select * from users where id = ?", [id], (err, results) => {
        if (err) {
            return res
                .status(500)
                .json({ success: false, error: "Erro interno no servidor" });
        }

        if (results.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Usuário não encontrado" });
        }

        return res.status(200).json({ success: true, data: results[0] });
    });
});

router.post("/", (req, res) => {
    const { nome, senha } = req.body;

    db.query("insert into users (nome, senha) values (?, ?)", [nome, senha], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, error: err });
            return;
        }
        res
            .status(201)
            .json({
                success: true,
                message: "Usuario adicionado com sucesso",
                id: results.insertId,
            });
    });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const nome = req.body;

    db.query(
        "update users set nome = ? where id = ?",

        [nome, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, error: err });
            }

            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Usuário não encontrado" });
            }

            return res
                .status(200)
                .json({ success: true, message: "Usuário atualizado" });
        }
    );
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.query("delete from users where id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ sucess: false, error: err });
        }

        if (results.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, error: "Usuário não encontrado" });
        }
        return res.status(204).send();
    });
});

module.exports = router



