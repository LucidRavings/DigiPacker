// const document.addEventListener('DOMContentLoaded', getItems()
const itemNameInput = document.querySelector("#item-name-input")
const itemWeightInput = document.querySelector("#item-weight-input")
const boxNameInput = document.querySelector("#box-name-input")
const boxWeightInput = document.querySelector("#box-weight-input")
const boxWeightCapacityInput= document.querySelector("#box-weight-capacity-input")
const itemForm = document.querySelector("#item-form")
const unassignedItemList = document.querySelector("#unassigned-item-list")
const boxedItemsList = document.querySelector("#boxed-items-list")
const deleteButtons = document.querySelectorAll('.delete-button')



const itemSubmit = (e) => {
    e.preventDefault()
    if (itemNameInput.value === "") {
        alert ('You must enter an Item Name')
        return
    }
    console.log(itemWeightInput.value)
    if (itemWeightInput.value === "") {
        alert ('You must enter an Item Weight')
        return
    } else if (isNaN(+itemWeightInput.value))  {
        alert ('Invalid Item Weight')
        return
    }
    let body = {
        name: itemNameInput.value,
        weight: +itemWeightInput.value
    }
        axios.post('/addItem', body).then(() => {getItems()})
        
}

const getUnassignedItems = () => {
    unassignedItemList.innerHTML = ""
    axios.get('/getUnassignedItems')
    .then(res => {
        console.log(res.data)
        for (i = 0; i < res.data.length; i++){
            const li = document.createElement("li")
            const p = document.createElement("p")
            let output = res.data[i].name + ": " + res.data[i].weight + "(lbs)"
            p.innerHTML = output
            p.id = res.data[i].item_id
            let button = document.createElement("button")
            button.classList.add("delete-button")
            button.innerHTML = "X"
            button.addEventListener('click', (event) => {
                console.log("Button clicked!",  event)
                console.log(p.id)
                axios.delete(`/deleteUnassignedItem/${p.id}`)
                event.srcElement.parentNode.parentNode.remove()
            })
            p.appendChild(button)
            li.appendChild(p)
            unassignedItemList.appendChild(li)
        }
    })
}

const getBoxItems = () => {
    boxedItemsList.innerHTML = ""
    axios.get('/getBoxItems')
    .then(res => {
        for (i = 0; i < res.data.length; i++){
            const li = document.createElement("li")
            const p = document.createElement("p")
            let output = res.data[i].name + ": " + res.data[i].weight
            p.innerHTML = output
            p.id = res.data[i].item_id
            let button = document.createElement("button")
            button.classList.add("delete-button")
            button.innerHTML = "X"
            button.addEventListener('click', (event) => {
                console.log("Button clicked!",  event)
                console.log(p.id)
                axios.delete(`/deleteUnassignedItem/${p.id}`)
                event.srcElement.parentNode.parentNode.remove()
            })
            p.appendChild(button)
            li.appendChild(p)
            boxedItemsList.appendChild(li)
        }
    })
}

getBoxItems()
getUnassignedItems()

itemForm.addEventListener('submit', itemSubmit)