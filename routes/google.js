// routes/google.js
// POST /auth/google  body: { credential }  (ID token entregue pelo Google ao front)

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const Usuario = require('../models/Usuario');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
    try {
        const credential = req.body.credential;

        if (typeof credential !== 'string' || !credential) {
            return res.status(400).json({ message: "Credencial do Google não informada" });
        }

        // Valida assinatura, validade e se o token foi emitido para o NOSSO app (audience)
        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            payload = ticket.getPayload();
        } catch (err) {
            return res.status(401).json({ message: "Não foi possível validar o login com o Google" });
        }

        if (!payload || !payload.email || !payload.email_verified) {
            return res.status(401).json({ message: "O e-mail da conta Google não está verificado" });
        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase();
        const nome = (payload.name || email.split('@')[0]).trim();
        const foto = payload.picture;

        // 1) Já entrou antes pelo Google
        let usuario = await Usuario.findOne({ googleId });

        // 2) Conta antiga com o mesmo e-mail: vincula ao Google
        //    (seguro porque o Google garante que o e-mail é verificado)
        if (!usuario) {
            usuario = await Usuario.findOne({ email });

            if (usuario) {
                usuario.googleId = googleId;
            }
        }

        // 3) Primeiro acesso: cria a conta
        if (!usuario) {
            usuario = new Usuario({ nome, email, googleId, foto });
        }

        // Mantém a foto em dia
        if (foto && usuario.foto !== foto) {
            usuario.foto = foto;
        }

        await usuario.save();

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                foto: usuario.foto
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao fazer login com o Google" });
    }
});

module.exports = router;