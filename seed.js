const mongoose = require('mongoose');
const Pagina = require('./models/Pagina');

const paginas = [
    {
        slug: 'smash-do-benfica',
        titulo: 'Smash do Benfica',
        descricao: 'Os clássicos smash burgers com crosta crocante, muito queijo cheddar derretido, bacon artesanal e molhos secretos da casa.',
        oferece: 'Hamburgers smash, espaço de lazer, mesas instagramáveis',
        local_horario: '<li>Quarta a Domingo, das 18h30 às 00h00</li><li>Praça da Gentilândia, Benfica</li>',
        mapa: 'https://www.google.com/maps?q=Pra%C3%A7a+da+Gentil%C3%A2ndia+Fortaleza+CE&output=embed'
    },
    {
        slug: 'taco-da-beira-mar',
        titulo: 'Taco da Beira-Mar',
        descricao: 'Tacos mexicanos com tortilhas feitas na hora, carne desfiada no tempero chipotle, guacamole fresco e pimentas na medida certa.',
        oferece: 'Tacos, nachos, margaritas sem álcool, vista para o pôr do sol',
        local_horario: '<li>Terça a Domingo, das 16h00 às 23h00</li><li>Avenida Beira-Mar, Meireles</li>',
        mapa: 'https://www.google.com/maps?q=Avenida+Beira+Mar+Meireles+Fortaleza+CE&output=embed'
    },
    {
        slug: 'forno-da-praia-de-iracema',
        titulo: 'Forno da Praia de Iracema',
        descricao: 'Pizzas artesanais assadas em forno a lenha portátil, massa de longa fermentação e coberturas com ingredientes nordestinos.',
        oferece: 'Pizzas, calzones, cervejas artesanais, música ao vivo',
        local_horario: '<li>Quinta a Domingo, das 18h00 às 01h00</li><li>Rua dos Tabajaras, Praia de Iracema</li>',
        mapa: 'https://www.google.com/maps?q=Rua+dos+Tabajaras+Praia+de+Iracema+Fortaleza+CE&output=embed'
    },
    {
        slug: 'cremosinho-da-lagoa',
        titulo: 'Cremosinho da Lagoa',
        descricao: 'Açaí cremoso, crepes doces e salgados e vitaminas de frutas regionais, perfeitos para um passeio ao ar livre.',
        oferece: 'Açaí, crepes, sucos naturais, área kids',
        local_horario: '<li>Todos os dias, das 09h00 às 20h00</li><li>Parque do Cocó – Entrada pela Av. Sebastião de Abreu</li>',
        mapa: 'https://www.google.com/maps?q=Parque+do+Coc%C3%B3+Fortaleza+CE&output=embed'
    },
    {
        slug: 'churros-do-dragao',
        titulo: 'Churros do Dragão',
        descricao: 'Churros recheados na hora com doce de leite, goiabada com queijo, Nutella e cocada cremosa, finalizados com açúcar e canela.',
        oferece: 'Churros recheados, chocolate quente, cafés especiais',
        local_horario: '<li>Segunda a Sábado, das 17h00 às 23h00</li><li>Rua Dragão do Mar, Centro</li>',
        mapa: 'https://www.google.com/maps?q=Centro+Dragao+do+Mar+Fortaleza+CE&output=embed'
    },
    {
        slug: 'dog-da-aldeota',
        titulo: 'Dog da Aldeota',
        descricao: 'Hot dogs gourmet com salsichas artesanais, pão brioche tostado, purê de batata, vinagrete e molho especial da casa.',
        oferece: 'Hot dogs, batata rústica, refrigerantes artesanais, mesas na calçada',
        local_horario: '<li>Quarta a Domingo, das 17h30 às 00h00</li><li>Praça Portugal, Aldeota</li>',
        mapa: 'https://www.google.com/maps?q=Pra%C3%A7a+Portugal+Aldeota+Fortaleza+CE&output=embed'
    },
    {
        slug: 'baiao-na-roda',
        titulo: 'Baião na Roda',
        descricao: 'A culinária cearense em versão street food: baião de dois em cumbuca, tapioca recheada, paçoca de carne de sol e caldinhos fumegantes.',
        oferece: 'Baião de dois, tapiocas, caldinhos, sobremesas regionais',
        local_horario: '<li>Quinta a Domingo, das 11h30 às 22h00</li><li>Parque das Crianças – Av. Presidente Castelo Branco</li>',
        mapa: 'https://www.google.com/maps?q=Parque+das+Crian%C3%A7as+Fortaleza+CE&output=embed'
    },
    {
        slug: 'brasa-do-mucuripe',
        titulo: 'Brasa do Mucuripe',
        descricao: 'Espetinhos de carne, frango e queijo coalho na brasa, acompanhados de farofa crocante, vinagrete e pão de alho caseiro.',
        oferece: 'Espetinhos, caldos, cervejas geladas, mesas ao ar livre',
        local_horario: '<li>Quarta a Domingo, das 17h00 às 00h00</li><li>Feirinha da Beira-Mar, Mucuripe</li>',
        mapa: 'https://www.google.com/maps?q=Feirinha+da+Beira+Mar+Fortaleza+CE&output=embed'
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Pagina.deleteMany({});
        await Pagina.insertMany(paginas);
        console.log('Páginas criadas com sucesso');
    } catch (err) {
        console.error('Erro no seed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();