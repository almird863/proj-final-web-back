const ex = require('express');
const Comentario = require('../models/Comentario');
const Usuario = require('../models/Usuario');

const router = ex.Router();

router.get('/', async (req, res) => {
    try {
        const comments = await Comentario.find();
        return res.json(comments);
    } catch (err) {
        return res.status(500).json({ message: "Erro ao acessar o banco de dados" });
    }
});

router.post('/', async (req, res) => {
    const dados = req.body
    try {
        const novo = await Comentario.create({
            nome: dados.nome,
            pagina: dados.pagina,
            comentario: dados.comentario
        })

        return res.status(201).json(novo)
    } catch (err) {
        return res.status(400).json({ message: "Erro ao salvar comentário"})
    }
});

module.exports = router;