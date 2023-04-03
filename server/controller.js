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

    addBox: (req, res) => {
        let {name, weight, weight_capacity} = req.body

        sequelize.query(`
        INSERT INTO boxes (name, weight, weight_capacity)
        VALUES ('${name}', ${weight}, ${weight_capacity})
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    getBoxItems: (req, res) => {
        sequelize.query(`
        SELECT item_id, name, weight
        FROM items
        WHERE box_id = 1
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    getUnassignedItems: (req, res) => {
        sequelize.query(`
        SELECT item_id, name, weight
        FROM items
        WHERE box_id IS null
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    getBoxes: (req, res) => {
        sequelize.query(`
        SELECT box_id, name, weight, weight_capacity
        FROM boxes
        `).then((dbRes) => {res.status(200).send(dbRes[0])})
        .catch(err => console.log(err))
    },

    deleteUnassignedItem: (req, res) => {
    let { id } = req.params
    
        sequelize.query(`
            DELETE FROM items
            WHERE item_id = ${id};
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
                weight INT NOT NULL,
                weight_capacity INT NOT NULL
            );

            CREATE TABLE items (
                item_id SERIAL PRIMARY KEY,
                name VARCHAR,
                weight INT NOT NULL
                box_id INT REFERENCES boxes (box_id)
            );

            INSERT INTO boxes (name, weight, weight_capacity)
            VALUES ('Box 1', 0, 50),
            ('Box 2', 5, 100);

            INSERT INTO items (name, weight, box_id)
            VALUES ('Item 1', 10, 1)

        `).then(() => {
            console.log('DataBase seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding Database', err))
    }
  }