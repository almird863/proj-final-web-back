const ex = require('express');
const Comentario = require('../models/Comentario');
const Pagina = require('../models/Pagina');

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

module.exports = router;