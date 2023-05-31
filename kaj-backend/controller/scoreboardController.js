'use strict'

const response = require('./response');
const connection = require('../settings/db');


exports.handleNewDataScore = async function(req, res) {
    try {
        const collection = await connection.db("racing_info").collection("scoreboard");
        const doc = await collection.findOne({username: req.body.username });

        if (doc && doc.value < req.body.value) {
            await collection.updateOne({ username : req.body.username }, {$set: { value: req.body.value }});
            // response.status(200, "Рекорд успешно обновлен!", res);
        } else if (doc && doc.value >= req.body.value) {
            // response.status(200, "Запрос обработан, но предыдущий рекорд не побит!", res);
        }
         else if (!doc) {
            await collection.insertOne({ username : req.body.username, value: req.body.value});
            // response.status(200, "Рекорд успешно добавлен!", res);
        } else {
            // response.status(200, "Текущий рекорд не был превзойден.", res);
        }
    } catch (err) {
        // response.status(500, err, res);
    } finally {
        connection.close();
    }
}

exports.findValueByUsername = async function(req, res) {
    try {
        const collection = await client.db("racing_info").collection("scoreboard");
        const doc = await collection.findOne({ username: req.query.username });

        if (doc) {
            response.status(200, doc.value, res);
        } else {
            response.status(404, 'Пользователь не найден', res);
        }
    } catch (err) {
        response.status(500, err, res);
    } finally {
        connection.close();
    }
}

exports.getAllSortedRecords = async function(req, res) {
    try {
        const collection = await client.db("racing_info").collection("scoreboard");
        const cursor = await collection.find().sort({ value: -1 }); // Сортируем по убыванию value
        const results = await cursor.toArray();

        response.status(200, records, res);
    } catch (err) {
        response.status(500, err, res);
    } finally {
        connection.close();
    }
}