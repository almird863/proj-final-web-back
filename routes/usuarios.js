const ex = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const autenticar = require('../middlewares/autenticar')

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

router.put('/:nome', autenticar, async (req, res) => {
    try {
        const nomeParametro = req.params.nome
        const dados = req.body
        
        const atualizacao = {};
        if (dados.nome) atualizacao.nome = dados.nome
        if (dados.email) atualizacao.email = dados.email
        if (dados.senha) atualizacao.senha = await bcrypt.hash(dados.senha, 12)
            
            const usuarioAtualizado = await Usuario.findOneAndUpdate(
                { nome: { $regex: new RegExp("^" + escapeRegex(nomeParametro) + "$", "i") } }, // Acha o usuário
                atualizacao,                                                                   // Atualiza o usuário
                { new: true }
            ).select(-senha)

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }
        
        return res.json(usuarioAtualizado)
    } catch (err) {
        return res.status(500).json({ message: "Erro ao atualizar usuário" })
    }
})

router.delete('/:nome', autenticar, async (req, res) => {
    try {
        const nomeParametro = req.params.nome
        const dados = req.body
        const usuario = Usuario.findOneAndDelete(
            { nome: { $regex: new RegExp("^" + escapeRegex(nomeParametro) + "$", "i") } }, // Acha o usuário
        )
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        return res.status(200).json({ message: "Usuário deletado com sucesso" })
        
    } catch (err) {
        return res.status(500).json({ message: "Erro ao deletar usuário" })
    }
})

module.exports = router;