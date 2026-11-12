const ex = require('express');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Comentario = require('../models/Comentario');
const Pagina = require('../models/Pagina');
const autenticar = require('../middlewares/autenticar');

const router = ex.Router();

router.get('/:slug', async (req, res) => {
    try {
        const paginaEncontrada = await Pagina.findOne({ slug: req.params.slug.toLowerCase() });

        if (!paginaEncontrada) {
            return res.status(404).json({ message: "Página não encontrada" })
        }

        const comentarios = await Comentario.find({ pagina: paginaEncontrada._id })
            .populate('autor', 'nome')
            .sort({ createdAt: -1 });
        return res.json(comentarios);

    } catch (err) {
        return res.status(500).json({ message: "Erro ao buscar comentários" });
    }
});

router.post('/:slug', autenticar, async (req, res) => {
    try {
        const texto = String(req.body.comentario || '').trim();

        if (!texto) {
            return res.status(400).json({ message: "O comentário não pode estar vazio" });
        }

        if (texto.length > 350) {
            return res.status(400).json({ message: "O comentário deve ter no máximo 350 caracteres" });
        }

        const pagina = await Pagina.findOne({ slug: req.params.slug.toLowerCase() });

        if (!pagina) {
            return res.status(404).json({ message: "Página não encontrada" });
        }

        const novo = await Comentario.create({
            autor: req.usuarioId,
            pagina: pagina._id,
            comentario: texto
        });

        await novo.populate('autor', 'nome');

        return res.status(201).json(novo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao criar comentário" });
    }
});

router.put('/:id', autenticar, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const texto = String(req.body.comentario || '').trim();

        if (!texto) {
            return res.status(400).json({ message: "O comentário não pode estar vazio" });
        }

        if (texto.length > 350) {
            return res.status(400).json({ message: "O comentário deve ter no máximo 350 caracteres" });
        }

        const comentario = await Comentario.findById(req.params.id);

        if (!comentario) {
            return res.status(404).json({ message: "Comentário não encontrado" });
        }

        if (comentario.autor.toString() !== req.usuarioId) {
            return res.status(403).json({ message: "Você não pode editar este comentário" });
        }

        comentario.comentario = texto;
        await comentario.save();
        await comentario.populate('autor', 'nome');

        return res.status(200).json(comentario);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao editar comentário" });
    }
});

router.delete('/:id', autenticar, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const comentario = await Comentario.findById(req.params.id);

        if (!comentario) {
            return res.status(404).json({ message: "Comentário não encontrado" });
        }

        if (comentario.autor.toString() !== req.usuarioId) {
            return res.status(403).json({ message: "Você não pode deletar este comentário" });
        }

        await comentario.deleteOne();

        return res.status(200).json({ message: "Comentário deletado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao deletar comentário" });
    }
});

module.exports = router;