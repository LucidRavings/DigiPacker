require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {SERVER_PORT} = process.env
const app = express()
const {
    //seed
    getBoxItems,
    getUnassignedItems,
    addItem
} = require('./controller.js')

app.use(express.json())
app.use(cors())
app.use(express.static(`${__dirname}/../client`))

// app.post('/seed', seed)
app.get('/getUnassignedItems', getUnassignedItems )
app.get('/getBoxItems', getBoxItems)
app.post('/addItem', addItem)


app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))