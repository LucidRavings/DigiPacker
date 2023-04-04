require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {SERVER_PORT} = process.env
const app = express()
const {
    seed,
    addItem,
    getUnassignedItems,
    deleteUnassignedItem,
    packItem,
    addBox,
    getBoxes,
    getItemWeight,
    emptyBox,
    deleteBox,
    getBoxItems,
    unpackItem
    
} = require('./controller.js')

app.use(express.json())
app.use(cors())
app.use(express.static(`${__dirname}/../client`))

app.post('/seed', seed)
app.get('/getUnassignedItems', getUnassignedItems )
app.get('/getBoxes', getBoxes)
app.get('/getItemWeight/:id', getItemWeight)
app.put('/getBoxItems', getBoxItems)
app.post('/addItem', addItem)
app.post('/addBox', addBox)
app.delete('/deleteUnassignedItem/:id', deleteUnassignedItem)
app.delete('/deleteBox/:id', deleteBox)
app.put('/packItem', packItem)
app.put('/unpackItem', unpackItem)
app.put('/emptyBox', emptyBox)


app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))