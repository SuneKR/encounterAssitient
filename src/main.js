import { createApp } from "vue";
import App from "./App.vue";
//import router from "./router/index.js.old";
//import router from "./router/router.js";
import canvasTintImage from "canvas-tint-image"
//import getCanvasContext from "get-canvas-context"
import AsyncPreloader from "async-preloader"
import DragSelect from "dragselect"
import TokenDataService from "./services/tokenDataService"

/*
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
*/

let canvas = document.getElementById("board")
let context = canvas.getContext("2d")

let cellSize = 75

let tokens = []

const app = createApp(App)

//app.use(router)

app.mount("#app")

canvas.cellInWidth = Math.floor(window.innerWidth / cellSize)
canvas.width = canvas.cellInWidth * cellSize
canvas.cellInHeight = Math.floor(window.innerHeight / cellSize)
canvas.height = canvas.cellInHeight * cellSize

document.getElementById("board").style.marginLeft = "auto"
document.getElementById("board").style.marginRight = "auto"
canvas.style.display = "block"

let multiSelect = false;

const mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

addEventListener('resize', (event) => {
    location.reload()
})

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

canvas.addEventListener('click', (event) => {
    let currentX = Math.floor((mouse.x-canvas.getBoundingClientRect().left)/cellSize)
    let currentY = Math.floor((canvas.height-mouse.y+canvas.getBoundingClientRect().top)/cellSize)

    //console.log("x: %s, y: %s", currentX, currentY)

    TokenDataService.getAll().then(response => {
        for (let i = 0; i < response.data.length; i++) {
            if((response.data[i].gridx <= currentX) && (currentX < (response.data[i].gridx+response.data[i].tokensize)) && (currentY <= response.data[i].gridy) && ((response.data[i].gridy-response.data[i].tokensize) < currentY)) {
                if(response.data[i].selected) {
                    var updatedData = {
                        id: response.data[i].id,
                        tokenimagesource: response.data[i].tokenimagesource,
                        gridx: response.data[i].gridx,
                        gridy: response.data[i].gridy,
                        tokensize:response.data[i].tokensize,
                        selected: false
                    }
                    TokenDataService.update(response.data[i].id, updatedData)
                }
                else {
                    var updatedData = {
                        id: response.data[i].id,
                        tokenimagesource: response.data[i].tokenimagesource,
                        gridx: response.data[i].gridx,
                        gridy: response.data[i].gridy,
                        tokensize:response.data[i].tokensize,
                        selected: true
                    }
                    TokenDataService.update(response.data[i].id, updatedData)
                }
            }
            else if(!multiSelect) {
                var updatedData = {
                    id: response.data[i].id,
                    tokenimagesource: response.data[i].tokenimagesource,
                    gridx: response.data[i].gridx,
                    gridy: response.data[i].gridy,
                    tokensize:response.data[i].tokensize,
                    selected: false
                }
                TokenDataService.update(response.data[i].id, updatedData)
            }
        }
    }).then(() => update())
})

/*
canvas.addEventListener('mousedown', (event) => {
    
    const selectedTokens = new DragSelect({        
        selectables: document.querySelectorAll('.token'),
    })

    selectedTokens.subscribe('callback', (e) => console.log(e))
})
*/

window.addEventListener('keydown', function(event) {
    const keyDownCallback = {
        "ArrowUp" : changeTokenPositionYplus,
        "w" : changeTokenPositionYplus, 
        "ArrowLeft" : changeTokenPositionXminus, 
        "a" : changeTokenPositionXminus, 
        "ArrowRight" : changeTokenPositionXplus, 
        "d" : changeTokenPositionXplus, 
        "ArrowDown" : changeTokenPositionYminus, 
        "s" : changeTokenPositionYminus,
        "Shift" : multiSelectNow,
    }[event.key]
    keyDownCallback?.()
})


window.addEventListener('keyUp', function(event) {
    const keyUpCallback = {
        "Shift" : multiSelectLater,
    }[event.key]
    keyUpCallback?.()
})

function changeTokenPosition(changeX=0, changeY=0){
    TokenDataService.getAll().then(response => {
        for (let i = 0; i < response.data.length; i++) {
            if(response.data[i].selected) {
                if(0 <= (response.data[i].gridx+changeX) && (response.data[i].gridx+changeX) < canvas.cellInWidth) {
                    var updatedData = {
                        id: response.data[i].id,
                        tokenimagesource: response.data[i].tokenimagesource,
                        gridx: response.data[i].gridx += changeX,
                        gridy: response.data[i].gridy,
                        tokensize: response.data[i].tokensize,
                        selected: response.data[i].selected
                    }
                    TokenDataService.update(response.data[i].id, updatedData)
                }
                if(0 <= (response.data[i].gridy+changeY) && (response.data[i].gridy+changeY) < canvas.cellInHeight) {
                    var updatedData = {
                        id: response.data[i].id,
                        tokenimagesource: response.data[i].tokenimagesource,
                        gridx: response.data[i].gridx,
                        gridy: response.data[i].gridy += changeY,
                        tokensize: response.data[i].tokensize,
                        selected: response.data[i].selected
                    }
                    TokenDataService.update(response.data[i].id, updatedData)
                }
            }
        }    
    }).then(() => update())
}

function changeTokenPositionXplus(){  changeTokenPosition(1,0)  }
function changeTokenPositionXminus(){  changeTokenPosition((-1),0)  }
function changeTokenPositionYplus(){  changeTokenPosition(0,1)  }
function changeTokenPositionYminus(){  changeTokenPosition(0,(-1))  }

function multiSelectNow(){  multiSelect = true  }
function multiSelectLater(){  multiSelect = false  }

class Token{
    tokenImage = new Image()

    constructor(imageSource, gridX = (Math.floor(Math.random()*canvas.cellInWidth)-1), gridY = (Math.floor(Math.random()*canvas.cellInHeight)-1), tokenSize = 1, id, selected){        this.tokenImage.src = "../tokens/" + imageSource + ".png" 
        this.gridX = gridX
        this.gridY = gridY
        this.tokenSize = tokenSize
        this.selected = selected
        this.id = id
    }

    draw(){
        (async () => {
            let actualImage = await AsyncPreloader.loadImage(this.tokenImage)
            if(this.selected) {  actualImage = canvasTintImage(actualImage, "#00ff00", 0.5)  }
            context.drawImage(actualImage, this.gridX*cellSize, (canvas.cellInHeight-(this.gridY+1))*cellSize, this.tokenSize*cellSize, this.tokenSize*cellSize)
        })()
    }
    
    deselect(){
        this.selected = false
    }

    select(){
        this.selected = true
        console.log(this.id)
        TokenDataService.update(this.id, reponse.data).then(response => {
            response.data.selected = true
            console.log(response.data)
        })
    }
}

class Party {

    setup(){
        for (let i = 1; i < 5; i++) {
            tokens.push(new Token([i]))
        }
    }

    retireParty(){
        TokenDataService.deleteAll()
    }

    addMember(){
        var newBorn = {
            tokenimagesource: Math.floor(Math.random()*3+1),
            gridx: (Math.floor(Math.random()*canvas.cellInWidth)-1),
            gridy: (Math.floor(Math.random()*canvas.cellInHeight)-1),
            tokensize: 1,
            selected: false
        }
        TokenDataService.create(newBorn).then(() => update())
    }

    newParty(){
        this.retireParty()
        for (let i = 1; i < 5; i++) {
            var newBorn = {
                tokenimagesource: i,
                gridx: (Math.floor(Math.random()*canvas.cellInWidth)-1),
                gridy: (Math.floor(Math.random()*canvas.cellInHeight)-1),
                tokensize: 1,
                selected: false
            }
            TokenDataService.create(newBorn).then(() => update())
        }
    }

    enlargement(increase){
        TokenDataService.getAll().then(response => {
            for (let i = 0; i < response.data.length; i++) {
                if(response.data[i].selected) {
                    if(0 < parseInt(response.data[i].tokensize+increase) && (parseInt(response.data[i].tokensize+increase) <= canvas.cellInHeight) && (parseInt(response.data[i].tokensize+increase) <= canvas.cellInWidth) ) {
                        var updatedData = {
                            id: response.data[i].id,
                            tokenimagesource: response.data[i].tokenimagesource,
                            gridx: response.data[i].gridx,
                            gridy: response.data[i].gridy,
                            tokensize: response.data[i].tokensize + increase,
                            selected: response.data[i].selected
                        }
                        TokenDataService.update(response.data[i].id, updatedData)
                    }
                    if(parseInt(response.data[i].gridy) <= parseInt(response.data[i].tokensize)) {
                        var updatedData = {
                            id: response.data[i].id,
                            tokenimagesource: response.data[i].tokenimagesource,
                            gridx: response.data[i].gridx,
                            gridy: response.data[i].gridy + 1,
                            tokensize: response.data[i].tokensize,
                            selected: response.data[i].selected
                        }
                        TokenDataService.update(response.data[i].id, updatedData)
                    }
                    if(canvas.cellInWidth < parseInt(response.data[i].gridx + response.data[i].tokensize)) {
                        var updatedData = {
                            id: response.data[i].id,
                            tokenimagesource: response.data[i].tokenimagesource,
                            gridx: response.data[i].gridx -1,
                            gridy: response.data[i].gridy,
                            tokensize: response.data[i].tokensize,
                            selected: response.data[i].selected
                        }
                        TokenDataService.update(response.data[i].id, updatedData)
                    }
                }
            }    
        }).then(() => update())
    }

    depict(){
        TokenDataService.getAll().then(response => {
            for (let i = 0; i < response.data.length; i++) {
                new Token(response.data[i].tokenimagesource,response.data[i].gridx,response.data[i].gridy,response.data[i].tokensize,response.data[i].id,response.data[i].selected).draw()
            }
        })
        this.depict2()
    }

    depict2(){
        tokens.forEach(token => {
            token.draw()
        })
    }
}

function drawGrid(){
    canvas.cellInWidth = Math.floor(window.innerWidth / cellSize)
    canvas.width = canvas.cellInWidth * cellSize
    canvas.cellInHeight = Math.floor(window.innerHeight / cellSize)
    canvas.height = canvas.cellInHeight * cellSize

    document.getElementById("board").style.marginLeft = "auto"
    document.getElementById("board").style.marginRight = "auto"
    canvas.style.display = "block"

    for (let x = 0; x <= canvas.width; x += cellSize) {
        context.moveTo(x,0)
        context.lineTo(x,canvas.height)
    }
    for (let y = 0; y < canvas.height; y += cellSize) {
        context.moveTo(0,y)
        context.lineTo(canvas.width,y)
    }

    context.fillStyle='#00ff6a'
    context.fillRect(0,0,canvas.width,canvas.height)
    
    context.strokeStyle ="black"
    context.stroke()
}

function setupBoard(){
    document.getElementById("cellSizeSlider").value = cellSize
    //party.setup()
    drawGrid()
    party.depict()
}

function update(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    party.depict()
}

const party = new Party()

setupBoard()

document.querySelector("#cellSizeSlider").onmouseup = function () {
    cellSize = parseInt(this.value)
    update()
}

document.querySelector("#partyNew").onclick = function () {
    party.newParty()
    update()
}

document.querySelector("#partyDel").onclick = function () {
    party.retireParty()
    update()
}

document.querySelector("#partyAdd").onclick = function () {
    party.addMember()
    update()
}

document.querySelector("#memEnl").onclick = function () {
    party.enlargement(1)
    update()
}

document.querySelector("#memRed").onclick = function () {
    party.enlargement(-1)
    update()
}