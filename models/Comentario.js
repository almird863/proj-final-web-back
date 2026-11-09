const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    pagina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pagina',
        required: true,
        index: true
    },
    comentario: {
        type: String,
        required: true,
        trim: true,
        maxlength: 350
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('truckplace_comment', comentarioSchema);