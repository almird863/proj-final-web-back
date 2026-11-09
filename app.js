const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const ex = require('express');
const cors = require('cors');

const port = 3001;
const app = ex();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado com sucesso ao MongoDB na Nuvem!"))
    .catch((err) => console.error("Erro ao conectar com MongoDB:", err));
    
    app.use(cors());
    app.use(ex.json());

app.use('/usuarios', require('./routes/usuarios'));
app.use('/comentarios', require('./routes/comentarios'));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});