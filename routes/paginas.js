const ex = require('express');
const Pagina = require('../models/Pagina');

const router = ex.Router()

router.get('/:slug', async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase()
        const paginaExiste = await Pagina.findOne({ slug: slug })

        if (!paginaExiste) {
            return res.status(404).json({ message: "Página não encontrada" })
        }

        return res.status(200).json(paginaExiste)

    } catch (err) {
        return res.status(500).json({ message: "Erro ao se conectar com o servidor" })
    }
})

module.exports = router;