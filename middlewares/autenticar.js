const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startWith('Bearer')) {
        return res.status(401).json({ message: "Token não informado " })
    }

    const token = header.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.usuarioId = payload.id
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." })
    }
}

module.exports = autenticar