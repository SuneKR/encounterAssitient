module.exports = app => {
    const tokens = require("../../controllers/token.controller.js")

    var router = require("express").Router()

    router.post("/", tokens.create)

    router.get("/:id", tokens.find)
    router.get("/", tokens.findAll)
    router.get("/selected", tokens.findAllSelected)
    
    router.put("/:id", tokens.update)

    router.delete("/:id", tokens.delete)
    router.delete("/", tokens.deleteAll)

    app.use('/api/tokens', router)
}