const database = require("../models")
const { response } = require("express")
const Token = database.tokens

exports.create = (request, response) => {
    if(!request.body.tokenimagesource){
        response.status(400).send({  message: "no Token"  })
        return
    }
    const token = new Token({
        tokenimagesource: request.body.tokenimagesource,
        gridx: request.body.gridx,
        gridy: request.body.gridy,
        tokensize: request.body.tokensize ? request.body.tokensize : "1",
        selected: request.body.selected ? request.body.selected : false
    })

    token
        .save(token)
        .then(data => {  response.send(data)  })
        .catch(err => {  request.status(500).send({  message: err.message || "Error. Token not created"  })  })

}

exports.find = (request, response) => {
    const id = request.params.id

    Token.findById(id)
        .then(data => {  if(!data) {  response.status(404).send({  message: "No token with id: ${id}. Can't find"  })  } else response.send(data)  })
        .catch(err => {  response.status(500).send({  message: err.message || "Error! Didn't find token with id: ${id}"  })  })
}

exports.findAll = (request, response) => {
    const tokenImageSource = request.query.tokenImageSource
    var condition = tokenImageSource ?  {  tokenImageSource: {  $regex: new RegExp(tokenImageSource), $options: "i"  }  } : {}

    Token.find(condition)
        .then(data => {  response.send(data)  })
        .catch(err => {  response.status(500).send({  message: err.message || "Error occured while trying to find all tokens"  })  })

}

exports.findAllCoordinates = (request, response) => {
    const x = request.query.gridX
    const y = request.query.gridY
    var condition = "ørh det skal lige regnes ud"

    Token.find({condition})
        .then(data => {  response.send(data)  })
        .catch(err => {  response.status(500).send({  message: err.message || "Error occured while trying to find all tokens at coordiantes"  })  })

}

exports.findAllSelected = (request, response) => {
    Token.find({  selected: true  })
        .then(data => {  response.send(data)  })
        .catch(err => {  response.status(500).send({  message: err.message || "Error occured while trying to find all selected tokens"  })  })

}

exports.update = (request, response) => {
    if(!request.body) {
        return response.status(400).send({  message: "No Token. Didn't update"  })
    }
    const id = request.params.id

    Token.findByIdAndUpdate(id, request.body, {  useFindAndmodify: false  })
    .then(data => {  if(!data) {  response.status(404).send({  message: "No token with id: ${id}. Can't delete"  })  } else response.send({  message: "token updated"  })  })
    .catch(err => {  response.status(500).send({  message: "Error! Didn't update token with id: ${id}"  })  })
}

exports.delete = (request, response) => {
    const id = req.params.id

    Token.findByIdAndRemove(id)
    .then(data => {  if(!data) {  response.status(404).send({  message: "No token with id: ${id}. Can't delete"  })  } else response.send({  message: "token deleted"  })  })
    .catch(err => {  response.status(500).send({  message: "Error! Didn't delete token with id: ${id}"  })  })

}

exports.deleteAll = (request, response) => {
    Token.deleteMany({})
        .then(data => {  response.send({  message: `${data.deletedCount} tokens deleted`  })  })
        .catch(err => {  response.status(500).send({  message: err.message || "Error occured while trying to delete all tokens"  })  })

}


/*
constructor(imageSource, gridX = (Math.floor(Math.random()*canvas.cellInWidth)-1), gridY = (Math.floor(Math.random()*canvas.cellInHeight)-1), tokenSize = 1){
        this.tokenImage.src = "../tokens/" + imageSource + ".png" 
        this.gridX = gridX
        this.gridY = gridY
        this.tokenSize = tokenSize
        this.selected = false
        this.name = ("token%s", tokens.length+1)
    }
*/