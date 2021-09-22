const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();

(async () => {
    const url = "mongodb://localhost:27017";
    const dbName = "ocean_bancodados_22_09_2021";

    const client = await MongoClient.connect(url);

    const db = client.db(dbName);

    const collection = db.collection("personagens");

    // Sinalizamos para o Express que todo body da requisição
    // estará estruturado em JSON
    app.use(express.json());

    app.get("/", function (req, res) {
        res.send("Hello World");
    });

    // CRUD -> Create, Read (All & Single/byId), Update, Delete

    // "CRUD em memória"

    // Lista de textos (strings)
    const lista = [
        {
            id: 1,
            nome: "Rick Sanchez",
        },
        {
            id: 2,
            nome: "Morty Smith",
        },
    ];

    // [GET] /personagens
    // Read All
    app.get("/personagens", async function (req, res) {
        const listaPersonagens = await collection.find().toArray();
        res.send(listaPersonagens);
    });

    function findById(id) {
        return collection.findOne({ _id: new ObjectId(id) });
    }

    // [GET] /personagens/:id
    // Read By Id
    app.get("/personagens/:id", async function (req, res) {
        const id = req.params.id;

        const item = await findById(id);

        if (!item) {
            res.status(404).send("Personagem não encontrado.");

            return;
        }

        res.send(item);
    });

    // [POST] /personagens
    // Create
    app.post("/personagens", function (req, res) {
        // Obtém o corpo da requisição e coloca na variável item
        const item = req.body;

        if (!item) {
            res.status(400).send(
                "Chave 'nome' não foi encontrada no corpo da requisição."
            );

            return;
        }

        item.id = lista.push(item);

        res.status(201).send(item);
    });

    // [PUT] /personagens/:id
    // Update
    app.put("/personagens/:id", function (req, res) {
        /*
    Objetivo: Atualizar uma personagem
    Passos:
    - Pegar o ID dessa personagem
    - Pegar a nova informação que eu quero atualizar
    - Atualizar essa nova informação na lista de personagens
    - Exibir que deu certo
    */

        const id = +req.params.id;

        const itemEncontrado = findById(id);

        if (!itemEncontrado) {
            res.status(404).send("Personagem não encontrado.");

            return;
        }

        const novoItem = req.body;

        if (!novoItem || !novoItem.nome) {
            res.status(400).send(
                "Chave 'nome' não foi encontrada no corpo da requisição."
            );

            return;
        }

        const index = lista.indexOf(itemEncontrado);

        novoItem.id = id;

        lista[index] = novoItem;

        res.send("Personagem atualizada com sucesso!");
    });

    // [DELETE] /personagens/:id
    // Delete
    app.delete("/personagens/:id", function (req, res) {
        const id = +req.params.id;

        const itemEncontrado = findById(id);

        if (!itemEncontrado) {
            res.status(404).send("Personagem não encontrado.");

            return;
        }

        const index = lista.indexOf(itemEncontrado);

        lista.splice(index, 1);

        res.send("Personagem removida com sucesso!");
    });

    app.listen(3000);
})();
