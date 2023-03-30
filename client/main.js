// const document.addEventListener('DOMContentLoaded', getItems()
const itemNameInput = document.querySelector("#item-name-input")
const itemWeightInput = document.querySelector("#item-weight-input")
const boxNameInput = document.querySelector("#box-name-input")
const boxWeightInput = document.querySelector("#box-weight-input")
const boxWeightCapacityInput= document.querySelector("#box-weight-capacity-input")
const itemForm = document.querySelector("#item-form")
const unassignedItemList = document.querySelector("#unassigned-item-list")
const boxedItemsList = document.querySelector("#boxed-items-list")



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
        for (i = 0; i < res.data.length; i++){
            // console.log(res.data[i].row)
            const li = document.createElement("li")
            const p = document.createElement("p")
            let output = res.data[i].row
            output = output.replaceAll("(", "")
            output = output.replaceAll(`"`, "")
            output = output.replaceAll(")", "")
            output = output.replaceAll(",", " - ")
            p.innerHTML = output
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
            // console.log(res.data[i].row)
            const li = document.createElement("li")
            const p = document.createElement("p")
            let output = res.data[i].row
            output = output.replaceAll("(", "")
            output = output.replaceAll(`"`, "")
            output = output.replaceAll(")", "")
            output = output.replaceAll(",", " - ")
            p.innerHTML = output
            li.appendChild(p)
            boxedItemsList.appendChild(li)
        }
    })
}

getBoxItems()
getUnassignedItems()
itemForm.addEventListener('submit', itemSubmit)