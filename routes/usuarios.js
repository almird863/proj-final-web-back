const ex = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const router = ex.Router();

function escapeRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
        const dados = req.body;

        const senhaHash = await bcrypt.hash(dados.senha, 12);

        await Usuario.create({
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash
        });

        return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email já cadastrado" });
        }
        return res.status(400).json({ message: err.message });
    }
});

router.put('/:nome', (req, res) => {
    const nomeParametro = decodeURIComponent(req.params.nomeParametro)
    const dados = req.body
    Usuario.findOneAndUpdate(
        { nome: { $regex: new RegExp("^" + escapeRegex(nomeParametro) + "$", "i") } }, // Acha o usuário
        { nome: dados.nome, email: dados.email, senha: dados.senha },                                      // Atualiza o usuário
        { new: true }
    )
        .then((usuarioAtualizado) => {
            if (!usuarioAtualizado) {
                return res.status(404).json({ erro: "Usuário não encontrado" })
            }
            return res.json(usuarioAtualizado)
        })

})

router.delete('/:nome', (req, res) => {
    const nomeParametro = decodeURIComponent(req.params.nomeParametro)
    const dados = req.body

    
})

module.exports = router;