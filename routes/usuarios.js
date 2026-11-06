const ex = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const router = ex.Router();

router.get('/', async (req, res) => {
    try {
        const users = await Usuario.find().select('-senha'); // não expõe o hash
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: "Erro ao acessar o banco de dados" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const senhaHash = await bcrypt.hash(senha, 12);

        await Usuario.create({ nome, email, senha: senhaHash });

        return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email já cadastrado" });
        }
        return res.status(400).json({ message: err.message });
    }
});

module.exports = router;