const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Usuario = require('../models/Usuario')
const Comentario = require('../models/Comentario')
const autenticar = require('../middlewares/autenticar')

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 8
const SENHA_MAX = 72

router.use(autenticar)

function paraResposta(user) {
    return { id: user._id, nome: user.nome, email: user.email }
}

router.get('/', async (req, res) => {
    try {
        const user = await Usuario.findById(req.usuarioId).select('nome email')

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        return res.status(200).json(paraResposta(usuario))
    } catch (err) {
        return res.status(500).json({ message: "Erro ao buscar usuário" })
    }
})

router.put('/', async (req, res) => {
    try {
        const nome = String(req.body.nome || '').trim()
        const email = String(req.body.email || '').trim().toLocaleLowerCase()

        if (!nome) {
            return res.status(400).json({ message: "Informe o seu nome" })
        }

        if (nome.length > 80) {
            return res.status(400).json({ message: "O nome deve ter no máximo 80 caracteres" })
        }

        if (!REGEX_EMAIL.test(email)) {
            return res.status(400).json({ message: "Informe um e-mail válido" })
        }

        const emailEmUso = await Usuario.exists({ email, _id: { $ne: req.usuarioId } })

        if (emailEmUso) {
            return res.status(409).json({ message: "Este e-mail já está em uso" });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.usuarioId,
            { nome, email },
            { new: true, runValidators: true }
        ).select('nome email');

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(paraResposta(usuario));
    } catch (err) {
        // Índice único do e-mail: cobre a corrida entre duas requisições simultâneas
        if (err.code === 11000) {
            return res.status(409).json({ message: "Este e-mail já está em uso" });
        }

        console.error(err);
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
});

// ---------- PUT /usuarios/me/senha ----------
router.put('/senha', async (req, res) => {
    try {
        const senhaAtual = String(req.body.senhaAtual || '');
        const senhaNova = String(req.body.senhaNova || '');

        if (!senhaAtual || !senhaNova) {
            return res.status(400).json({ message: "Informe a senha atual e a nova senha" });
        }

        if (senhaNova.length < SENHA_MIN) {
            return res.status(400).json({ message: `A nova senha deve ter pelo menos ${SENHA_MIN} caracteres` });
        }

        if (senhaNova.length > SENHA_MAX) {
            return res.status(400).json({ message: `A nova senha deve ter no máximo ${SENHA_MAX} caracteres` });
        }

        if (senhaNova === senhaAtual) {
            return res.status(400).json({ message: "A nova senha deve ser diferente da atual" });
        }

        // O campo senha pode ter select:false no schema, por isso o +senha
        const usuario = await Usuario.findById(req.usuarioId).select('+senha');

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);

        if (!senhaCorreta) {
            // 400 e NÃO 401: o front trata 401 como "token expirado" e deslogaria o usuário
            return res.status(400).json({ message: "Senha atual incorreta" });
        }

        const hash = await bcrypt.hash(senhaNova, 12);
        await Usuario.updateOne({ _id: req.usuarioId }, { senha: hash });

        return res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao atualizar senha" });
    }
});

// ---------- DELETE /usuarios/me ----------
router.delete('/', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.usuarioId);

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Apaga também os comentários da pessoa
        await Comentario.deleteMany({ autor: req.usuarioId });

        return res.status(200).json({ message: "Conta excluída com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao excluir conta" });
    }
});

module.exports = router;