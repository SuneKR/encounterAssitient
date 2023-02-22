import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import canvasTintImage from "canvas-tint-image"
import getCanvasContext from "get-canvas-context"
import AsyncPreloader from "async-preloader"

import "./assets/main.css";

let canvas = document.getElementById("board")
let context = canvas.getContext("2d")

let cellSize = 75

let tokens = []

const app = createApp(App);

app.use(router);

app.mount("#app");

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

addEventListener('resize', () => {
    location.reload()
})

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

canvas.addEventListener('click', () => {
    let currentX = Math.floor((mouse.x-canvas.getBoundingClientRect().left)/cellSize)
    let currentY = Math.floor((canvas.height-mouse.y+canvas.getBoundingClientRect().top)/cellSize)

    console.log("x: %s, y: %s", currentX, currentY)

    tokens.forEach(token => {
        if(currentX == token.gridX && currentY == token.gridY) {
            if(token.selected) {
                token.deselect()
            }
            else {
                token.select()
            }
        }
        else if (!multiSelect) {
            token.deselect()
        }
    })
    update()
})


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

    update()
})


window.addEventListener('keyUp', function(event) {
    const keyUpCallback = {
        "Shift" : multiSelectLater,
    }[event.key]
    keyUpCallback?.()
})

function changeTokenPosition(changeX=0, changeY=0){
    tokens.forEach(token => {
        if(token.selected) {
            if(0 <= (token.gridX+changeX) && (token.gridX+changeX) < canvas.cellInWidth) {  token.gridX += changeX  }
            if(0 <= (token.gridY+changeY) && (token.gridY+changeY) < canvas.cellInHeight) {  token.gridY += changeY  }
        }
    })
}

function changeTokenPositionXplus(){  changeTokenPosition(1,0)  }
function changeTokenPositionXminus(){  changeTokenPosition((-1),0)  }
function changeTokenPositionYplus(){  changeTokenPosition(0,1)  }
function changeTokenPositionYminus(){  changeTokenPosition(0,(-1))  }

function multiSelectNow(){  multiSelect = true  }
function multiSelectLater(){  multiSelect = false  }

class Token{
    tokenImage = new Image()

    constructor(imageSource,gridX = Math.floor(Math.random() * canvas.cellInWidth),gridY = Math.floor(Math.random() * canvas.cellInHeight),tokenSize=1){
        this.tokenImage.src = "../tokens/" + imageSource + ".png" 
        this.gridX = gridX
        this.gridY = gridY
        this.tokenSize = tokenSize
        this.selected = false
        this.name = ("token%s", tokens.length+1)
    }

    draw(){
        (async () => {
            let actualImage = await AsyncPreloader.loadImage(this.tokenImage)
            if(this.selected) {  actualImage = canvasTintImage(actualImage, "#00ff00", 0.5)  }
            context.drawImage(actualImage, this.gridX*cellSize, (Math.floor(canvas.height/cellSize)-(this.gridY+1))*cellSize, this.tokenSize*cellSize, this.tokenSize*cellSize)
        })();
        //console.log("x: %s, y: %s, selected: %s", this.gridX, this.gridY, this.selected)
    }
    
    deselect(){
        this.selected = false
    }

    select(){
        this.selected = true
    }
}

class Party {

    setup(){
        for (let i = 1; i < 5; i++) {
            tokens.push(new Token([i]))
        }
    }

    depict(){
        tokens.forEach(token => {
            token.draw()
        });
    }
}

function drawGrid(){
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
    party.setup()
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