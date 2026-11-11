const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "informe email e senha." })
        }

        const usuario = await Usuario.findOne({ email: String(email).toLocaleLowerCase().trim() })
            .select('+senha')

        const senhaCorreta = usuario && await bcrypt.compare(senha, usuario.senha)

        if (!usuario || !senhaCorreta) {
            return res.status(401).json({ message: "Email ou senha incorretos" })
        }

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        return res.status(200).json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        })
    } catch (err) {
        return res.status(500).json({ message: "Erro ao fazer login" })
    }
})

const autenticar = require('../middlewares/autenticar');

router.get('/teste', autenticar, (req, res) => {
    res.json({ message: "Autenticado", usuarioId: req.usuarioId });
});

module.exports = router

