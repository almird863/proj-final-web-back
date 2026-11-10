const mongoose = require("mongoose")

const paginaSchema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    descricao: { type: String, required: true },
    oferece: { type: String, required: true },
    imagem:  { type: String, required: true },   // ex.: "assets/truck2.jpg"
    horario: { type: String, required: true },  
    local:   { type: String, required: true },
    mapa: { type: String, required: true }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('truckplace_page', paginaSchema);