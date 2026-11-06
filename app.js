const path = require('path');
const mongoose = require('mongoose');
const ex = require('express');
const cors = require('cors');
const port = 3000

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = ex();

app.use(cors());
app.use(ex.json());

const linkDb = process.env.MONGO_URI;

mongoose.connect(linkDb)
    .then(() => {
        console.log("Conectado com sucesso ao MongoDB na Nuvem!")
    })
    .catch((err) => {
        console.error("Erro ao conectar com Mongo DB:", err)
    })

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    senha: { type: String, required: true }
})

const comentarioSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    pagina: {type: String, required: true},
    comentario: {type: String, required: true}
})

const usuarios = mongoose.model('truckplace_users', usuarioSchema);
const comentarios = mongoose.model('truckplace_comments', comentarioSchema);

app.get('/usuarios', (req, res) => {
    usuarios.find()
        .then((users) => {
            return res.json(users);
        })
        .catch((err) => {
            return res.status(500).json({ message: "Erro ao Acessar o banco de dados" })
        })
})

app.get('/comentarios', (req, res) => {
    comentarios.find()
        .then((comments) => {
            return res.json(comments)
        })
        .catch((err) => {
            return res.status(500).json({ message: "Erro ao Acessar o banco de dados" })
        })
})

