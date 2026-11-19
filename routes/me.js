// routes/me.js
// Rotas do próprio usuário logado. O id vem SEMPRE do token (req.usuarioId),
// nunca do corpo ou da URL, então ninguém consegue mexer na conta de outra pessoa.
//
// Contas são criadas pelo login com Google, então:
//  - não existe troca de senha;
//  - o e-mail pertence à conta Google e não pode ser alterado aqui.

const express = require('express');
const router = express.Router();

const Usuario = require('../models/Usuario');
const Comentario = require('../models/Comentario');
const autenticar = require('../middlewares/autenticar');

const NOME_MAX = 80;

// Todas as rotas deste arquivo exigem login
router.use(autenticar);

function paraResposta(usuario) {
    return {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto
    };
}

// ---------- GET /usuarios/me ----------
router.get('/', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuarioId).select('nome email foto');

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(paraResposta(usuario));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
});

// ---------- PUT /usuarios/me ----------
// Só o nome pode ser alterado. Qualquer outro campo enviado é ignorado.
router.put('/', async (req, res) => {
    try {
        // String() evita que alguém envie um objeto no lugar do texto
        const nome = String(req.body.nome || '').trim();

        if (!nome) {
            return res.status(400).json({ message: "Informe o seu nome" });
        }

        if (nome.length > NOME_MAX) {
            return res.status(400).json({ message: `O nome deve ter no máximo ${NOME_MAX} caracteres` });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.usuarioId,
            { nome },
            { new: true, runValidators: true }
        ).select('nome email foto');

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(paraResposta(usuario));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao atualizar usuário" });
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