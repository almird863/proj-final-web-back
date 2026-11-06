const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    pagina: { type: String, required: true },
    comentario: { type: String, required: true }
});

module.exports = mongoose.model('truckplace_comments', comentarioSchema);