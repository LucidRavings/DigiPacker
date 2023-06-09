const itemForm = document.querySelector("#item-form")
const itemNameInput = document.querySelector("#item-name-input")
const itemWeightInput = document.querySelector("#item-weight-input")

const boxForm = document.querySelector("#box-form")
const boxNameInput = document.querySelector("#box-name-input")
const boxWeightInput = document.querySelector("#box-weight-input")
const boxWeightCapacityInput= document.querySelector("#box-weight-capacity-input")

const unassignedItemList = document.querySelector("#unassigned-item-list")
const boxList = document.querySelector("#box-list")
const boxedItemsList = document.querySelector("#boxed-items-list")

const deleteButtons = document.querySelectorAll('.delete-button')



const itemSubmit = (e) => {
    e.preventDefault()
    if (itemNameInput.value === "") {
        alert ('You must enter an Item Name')
        return
    }

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
        axios.post('/addItem', body).then(() => {
            getUnassignedItems()
            getBoxes()
        })
        
}

const boxSubmit = (e) => {
    e.preventDefault()
    if (boxNameInput.value === "") {
        alert ('You must enter a Box name')
        return
    }

    if (boxWeightInput.value === "") {
        alert ('You must enter a Box Weight')
        return
    } else if (isNaN(+boxWeightInput.value))  {
        alert ('Invalid Box Weight')
        return
    }

    if (boxWeightCapacityInput.value === "") {
        alert ('You must enter a Box Weight Capacity')
        return
    } else if (isNaN(+boxWeightCapacityInput.value))  {
        alert ('Invalid Box Weight Capacity')
        return
    }

    let body = {
        name: boxNameInput.value,
        weight: +boxWeightInput.value,
        weight_capacity: +boxWeightCapacityInput.value
    }
        axios.post('/addBox', body).then(() => {
            getUnassignedItems()
            getBoxes()
        })
        
}

const getUnassignedItems = () => {
    unassignedItemList.innerHTML = ""
    axios.get('/getUnassignedItems')
    .then(res => {
        for (i = 0; i < res.data.length; i++){
            const li = document.createElement("li")
            const p = document.createElement("p")
            let output = res.data[i].name + ": " + res.data[i].weight + " (lbs) "
            p.innerHTML = output
            p.id = res.data[i].item_id

            let button = document.createElement("button")
            button.classList.add("delete-button")
            button.innerHTML = "X"
            button.addEventListener('click', (event) => {
                axios.delete(`/deleteUnassignedItem/${p.id}`)
                event.srcElement.parentNode.parentNode.remove()
                getUnassignedItems()
                getBoxes()
                getBoxItems()
            })

            let select = document.createElement("select")
            select.classList.add("select-bar")
            axios.get('/getBoxes')
            .then(res => {
                for (i = 0; i < res.data.length; i++){
                    let opt = document.createElement("option")
                    opt.value = res.data[i].box_id
                    opt.innerHTML = res.data[i].name
                    select.append(opt)
                }
            })
            
            let pack = document.createElement("button")
            pack.classList.add("pack-button")
            pack.innerHTML = "Pack"
            pack.addEventListener('click', (event) => {
                let body = {
                    boxId: select.value,
                    itemId: p.id
                }
                axios.put('/packItem', body).then(() => {
                    getUnassignedItems()
                    getBoxes()
                    getBoxItems()
                })
            }) 

            p.appendChild(select)
            p.appendChild(pack)
            p.appendChild(button)
            li.appendChild(p)
            unassignedItemList.appendChild(li)
        }
    })
}

const getBoxes = () => {
    boxList.innerHTML = ""
    axios.get('/getBoxes')
    .then(res => {
        for (i = 0; i < res.data.length; i++){
            const li = document.createElement("li")
            const p = document.createElement("p")
            let boxName = res.data[i].name
            let boxWeight = res.data[i].weight
            let boxWeightCapacity = res.data[i].weight_capacity
            p.id = res.data[i].box_id
            
            axios.get(`/getItemWeight/${p.id}`)
            .then((res) => {
                answer = []
                res.data.forEach((e) => {
                    answer.push(e.weight)
                })
                let sum = 0
                for (i = 0; i < answer.length; i++){
                    sum += answer[i]
                }
                if (sum > boxWeightCapacity){
                    p.style.color = 'red'
                }
                let output = boxName + ": " + boxWeight + " (lbs) | " + sum + "/" + boxWeightCapacity + " | " + "Total Weight: " + (sum + boxWeight)
                
                    p.innerHTML = output
                
                

                let button = document.createElement("button")
                button.classList.add("delete-button")
                button.innerHTML = "X"
                button.addEventListener('click', (event) => {
                    axios.delete(`/deleteBox/${p.id}`)
                    event.srcElement.parentNode.parentNode.remove()
                    getUnassignedItems()
                    getBoxes()
                    getBoxItems()
                })

                let open = document.createElement("button")
                open.classList.add("open-button")
                open.innerHTML = "Open"
                open.addEventListener('click', (event) => {
                    boxedItemsList.setAttribute("box-id-placeholder", p.id)
                    getBoxItems()
                })

                let empty = document.createElement("button")
                empty.classList.add("empty-button")
                empty.innerHTML = "Empty"
                empty.addEventListener('click', (event) => {
                    let body = {
                        boxId: p.id
                    }
                    axios.put('/emptyBox', body).then(() => {
                        getUnassignedItems()
                        getBoxes()
                        getBoxItems()
                    })
                })
                p.appendChild(open)
                p.appendChild(empty)
                p.appendChild(button)
                li.appendChild(p)
                boxList.appendChild(li)

            }).catch((err) => {console.log(err)})
        }
    })
}

const getBoxItems = () => {
    boxedItemsList.innerHTML = ""
    let boxIdPlaceholder = boxedItemsList.getAttribute("box-id-placeholder")
    let body = {
        boxId: boxIdPlaceholder
    }
    axios.put('/getBoxItems', body)
    .then(res => {
        if (res.data === "OK"){
        } else {
            for (i = 0; i < res.data.length; i++){
                const li = document.createElement("li")
                const p = document.createElement("p")
                let output = res.data[i].name + ": " + res.data[i].weight + " (lbs) "
                p.innerHTML = output
                p.id = res.data[i].item_id
    
                let button = document.createElement("button")
                button.classList.add("delete-button")
                button.innerHTML = "X"
                button.addEventListener('click', (event) => {
                    axios.delete(`/deleteUnassignedItem/${p.id}`)
                    event.srcElement.parentNode.parentNode.remove()
                    getUnassignedItems()
                    getBoxes()
                    getBoxItems()
                })

                let unpack = document.createElement("button")
                unpack.classList.add("unpack-button")
                unpack.innerHTML = "Unpack"
                unpack.addEventListener('click', (event) => {
                let body = {
                    itemId: p.id
                }
                axios.put('/unpackItem', body).then(() => {
                    getUnassignedItems()
                    getBoxes()
                    getBoxItems()
                })
            })
                p.appendChild(unpack)
                p.appendChild(button)
                li.appendChild(p)
                boxedItemsList.appendChild(li)
            }
        }
    })
}

getUnassignedItems()
getBoxes()
getBoxItems()


boxForm.addEventListener('submit', boxSubmit)
itemForm.addEventListener('submit', itemSubmit)