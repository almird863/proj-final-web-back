require('dotenv').config();
const mongoose = require('mongoose');
const Pagina = require('./models/Pagina');

// Gera uma URL de mapa incorporável a partir do endereço/local
const mapaDe = (local) =>
    `https://www.google.com/maps?q=${encodeURIComponent(local + ', Fortaleza, CE')}&output=embed`;

const paginas = [
    {
        slug: 'smash-do-benfica',
        titulo: 'Smash do Benfica',
        descricao: 'Os clássicos smash burgers com crosta crocante, muito queijo cheddar derretido, bacon artesanal e molhos secretos da casa.',
        oferece: 'Smash burgers, batata rústica, milkshakes',
        horario: 'Quarta a Domingo, das 18h30 às 00h00',
        local: 'Praça da Gentilezas, Benfica',
        imagem: 'assets/truck1.jpg'
    },
    {
        slug: 'tapioca-da-iracema',
        titulo: 'Tapioca da Iracema',
        descricao: 'Tapiocas recheadas na hora, doces e salgadas, com coco fresco e queijo coalho de verdade.',
        oferece: 'Tapiocas, cuscuz recheado, sucos naturais',
        horario: 'Todos os dias, das 16h às 23h',
        local: 'Av. Beira Mar, Praia de Iracema',
        imagem: 'assets/truck2.jpg'
    },
    {
        slug: 'churrasquinho-do-mucuripe',
        titulo: 'Churrasquinho do Mucuripe',
        descricao: 'Espetinhos de carne, frango e queijo coalho na brasa, acompanhados de farofa e vinagrete.',
        oferece: 'Espetinhos, baião de dois, cerveja gelada',
        horario: 'Terça a Domingo, das 17h às 01h',
        local: 'Av. Beira Mar, Mucuripe',
        imagem: 'assets/truck3.jpg'
    },
    {
        slug: 'taco-cearense',
        titulo: 'Taco Cearense',
        descricao: 'Tacos com recheios regionais, como carne de sol, paçoca e queijo coalho, em tortilhas feitas na chapa.',
        oferece: 'Tacos, nachos, molhos artesanais',
        horario: 'Quinta a Domingo, das 18h às 23h30',
        local: 'Praça Portugal, Aldeota',
        imagem: 'assets/truck4.jpg'
    },
    {
        slug: 'pizza-na-roda',
        titulo: 'Pizza na Roda',
        descricao: 'Pizzas de massa fina assadas em forno a lenha dentro do truck, com ingredientes frescos e borda crocante.',
        oferece: 'Pizzas salgadas e doces, calzones, refrigerantes',
        horario: 'Quarta a Domingo, das 18h às 23h',
        local: 'Parque do Cocó, entrada da Av. Sebastião de Abreu',
        imagem: 'assets/truck5.jpg'
    },
    {
        slug: 'doce-sobre-rodas',
        titulo: 'Doce Sobre Rodas',
        descricao: 'Churros recheados, waffles, brownies e sobremesas geladas para fechar a noite com chave de ouro.',
        oferece: 'Churros, waffles, brownies, sorvetes',
        horario: 'Sexta a Domingo, das 17h às 23h',
        local: 'Praça do Ferreira, Centro',
        imagem: 'assets/truck6.jpg'
    },
    {
        slug: 'hot-dog-do-dragao',
        titulo: 'Hot Dog do Dragão',
        descricao: 'Cachorros-quentes gourmet com salsichas artesanais, purê de batata, queijo gratinado e molhos exclusivos.',
        oferece: 'Hot dogs, batata frita, limonada',
        horario: 'Terça a Sábado, das 18h às 00h',
        local: 'Rua Dragão do Mar, Praia de Iracema',
        imagem: 'assets/truck7.jpg'
    },
    {
        slug: 'sabor-do-sertao',
        titulo: 'Sabor do Sertão',
        descricao: 'Comida nordestina de verdade: carne de sol com macaxeira, paçoca, baião de dois e rapadura de sobremesa.',
        oferece: 'Carne de sol, baião de dois, paçoca, rapadura',
        horario: 'Segunda a Sábado, das 11h às 15h',
        local: 'Parque Rio Branco, Farias Brito',
        imagem: 'assets/truck8.jpg'
    }
].map((p) => ({ ...p, mapa: mapaDe(p.local) }));

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Pagina.deleteMany({});
        await Pagina.insertMany(paginas);
        console.log(`${paginas.length} páginas criadas com sucesso`);
    } catch (err) {
        console.error('Erro no seed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();