const ex = require('express');
const bcrypt = require('bcrypt');
const Usuarios = require('../models/Usuario');

const router = ex.Router()

router.post('/', async (req, res) => {
    try {
        const dados = req.body

        const usuario = await Usuarios.findOne({ email: dados.email })
        const senhaOk = usuario && await bcrypt.compare(dados.senha, usuario.senha)

        if (!senhaOk) {
            return res.status(401).json({ message: "E-mail ou senha inválidos" })
        }

        req.session.regenerate((err) => {
            if (err) return res.status(500).json({ message: "Erro no servidor" })

            req.session.userId = usuario.id
            req.session.nome = usuario.nome

            return res.json({ ok: true })

        })
    } catch (err) {
        return res.status(500).json({ message: "Erro no servidor" })
    }

})

module.exports = router