require('dotenv').config()
let { CONNECTION_STRING } = process.env
let Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
  })

  module.exports = {
    addItem: (req, res) => {
        let {name, weight} = req.body

        sequelize.query(`
        INSERT INTO items (name, weight, box_id)
        VALUES ('${name}', ${weight}, null);
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
        
    },

    getBoxItems: (req, res) => {
        sequelize.query(`
        SELECT (name, weight)
        FROM items
        WHERE box_id = 1
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    getUnassignedItems: (req, res) => {
        sequelize.query(`
        SELECT (name, weight)
        FROM items
        WHERE box_id IS null
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    getboxes: (req, res) => {
        sequelize.query(`
        SELECT (name, weight, weight_capacity)
        FROM boxes
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    seed: (req, res) => {
        sequelize.query(`
            drop table if exists items;
            drop table if exists boxes;

            CREATE TABLE boxes (
                box_id SERIAL PRIMARY KEY,
                name VARCHAR,
                weight INT,
                weight_capacity INT
            );

            CREATE TABLE items (
                item_id SERIAL PRIMARY KEY,
                name VARCHAR,
                weight INT
                box_id INT REFERENCES boxes (box_id)
            );

            INSERT INTO boxes (name, weight, weight_capacity)
            VALUES ('Box 1', null, 50),
            ('Box 2', 5, 100);

            INSERT INTO items (name, weight, box_id)
            VALUES ('Item 1', 10, 1)

        `).then(() => {
            console.log('DataBase seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding Database', err))
    }
  }