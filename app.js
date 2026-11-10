// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const ex = require('express');
const cors = require('cors');
const session = require('express-session')
// const MongoStore = require('connect-mongo')

const port = 3001;
const app = ex();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado com sucesso ao MongoDB na Nuvem!"))
    .catch((err) => console.error("Erro ao conectar com MongoDB:", err));

app.use(cors());
app.use(ex.json());
app.use(ex.static("public"));

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
//     cookie: {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 1000 * 60 * 60 * 24
//     }
// }))

app.use('/usuarios', require('./routes/usuarios'));
app.use('/comentarios', require('./routes/comentarios'));
app.use('/paginas', require('./routes/paginas'));
app.use('/login', require('./routes/login'))

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});