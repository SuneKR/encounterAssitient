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

//const app = createApp(App);

//app.use(router);

//app.mount("#app");

canvas.width = Math.floor(window.innerWidth / cellSize) * cellSize
canvas.height = Math.floor(window.innerHeight / cellSize) * cellSize

document.getElementById("board").style.marginLeft = "auto"
document.getElementById("board").style.marginRight = "auto"
canvas.style.display = "block"

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
        else {
            token.deselect()
        }
    })
    update()
})



window.addEventListener('keydown', function(event) {
    
    //let appropiateToken = new Token
    /*
    tokens.forEach(token => {
        console.log("testing %s", token.name)
        if(token.selected) {  console.log("%s is selected",token.name); token.changePositionByKeyStroke(event)  }
    })
    const callback = {
        "ArrowUp" : appropiateToken.changeRelativePosition(0,1), 
        "KeyW" : appropiateToken.changeRelativePosition(0,1), 
        "ArrowLeft" : appropiateToken.changeRelativePosition((-1),0), 
        "KeyA" : appropiateToken.changeRelativePosition((-1),0), 
        "ArrowRight" : appropiateToken.changeRelativePosition(1,0), 
        "KeyD" : appropiateToken.changeRelativePosition(1,0), 
        "ArrowDown" : appropiateToken.changeRelativePosition(0,(-1)), 
        "KeyS" : appropiateToken.changeRelativePosition(0,(-1)),
    }[event.key]
    //console.log(appropiateToken)
    let x = 0
    let y = 0
    
    const callback = {
        "ArrowUp" : heyheyhey, 
        "KeyW" : y = 1,
        "ArrowLeft" : x = -1,
        "KeyA" : x = -1,
        "ArrowRight" : x = 1,
        "KeyD" : x = 1,
        "ArrowDown" : y = -1,
        "KeyS" : y = -1,
    }[event.key]
    callback?.()
    */

    console.log("%s",event.key)

    const callback = {
        "ArrowUp" : changeTokenPositionYplus, 
        "w" : changeTokenPositionYplus, 
        "ArrowLeft" : changeTokenPositionXminus, 
        "a" : changeTokenPositionXminus, 
        "ArrowRight" : changeTokenPositionXplus, 
        "KeyD" : changeTokenPositionXplus, 
        "ArrowDown" : changeTokenPositionYminus, 
        "KeyS" : changeTokenPositionYminus,
    }[event.key]
    callback?.()

    console.log("result: %s",callback?.())


    console.log("before update")

    //console.log("%s/%s pressed",event.key, event.code)
    update()
})

function changeTokenPosition(changeX=1, changeY=0, callbacks){
    tokens.forEach(token => {
        if(token==token.selected) {
            token.gridX += changeX
            token.gridY += changeY
        }
    })
}

function changeTokenPositionXplus(){  changeTokenPosition(1,0)  }
function changeTokenPositionXminus(){  changeTokenPosition((-1),0)  }
function changeTokenPositionYplus(){  changeTokenPosition(0,1)  }
function changeTokenPositionYminus(){  changeTokenPosition(0,(-1))  }


class Token{
    tokenImage = new Image()

    constructor(imageSource,gridX = Math.floor(Math.random() * Math.floor(window.innerWidth / cellSize)),gridY = Math.floor(Math.random() * Math.floor(window.innerHeight / cellSize)),tokenSize=1){
        this.tokenImage.src = "../tokens/" + imageSource + ".png" 
        this.gridX = gridX
        this.gridY = gridY
        this.tokenSize = tokenSize
        this.selected = false
        this.name = ("token%s", tokens.length+1)
    }

    changePositionByKeyStroke(event) {
        const callback = {
            "ArrowUp" : this.changeRelativePosition(0,1), 
            "KeyW" : this.changeRelativePosition(0,1), 
            "ArrowLeft" : this.changeRelativePosition((-1),0), 
            "KeyA" : this.changeRelativePosition((-1),0), 
            "ArrowRight" : this.changeRelativePosition(1,0), 
            "KeyD" : this.changeRelativePosition(1,0), 
            "ArrowDown" : this.changeRelativePosition(0,(-1)), 
            "KeyS" : this.changeRelativePosition(0,(-1)),
        }[event.key]
        callback?.()
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

    firstTimeDepiction(){
        tokens.forEach(token => {
            token.tokenImage.onload = function(){  token.draw()  }
        });
    }

    laterDepiction(){
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
    party.firstTimeDepiction()
}

function update(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    party.laterDepiction()
}

const party = new Party()

setupBoard()