// models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Opcional: contas criadas pelo Google não têm senha.
    // Usuários antigos continuam com o hash que já existe.
    senha: { type: String, select: false },

    // "sub" do Google: identificador estável da conta (o e-mail pode mudar).
    // sparse permite vários usuários sem googleId sem violar o índice único.
    googleId: { type: String, unique: true, sparse: true },

    // URL da foto de perfil do Google
    foto: { type: String }
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'truckplace_users');