module.exports = mongoose => {
    const token = mongoose.model(
        "token",
        mongoose.Schema(
            {
                tokenImage: String,
                gridX: Int,
                gridY: Int,
                tokenSize: Int,
            },
            {  timestamps: true  }
        )
    )
    schema.method("toJSON", function() {
        const {  __v, _id, ...object  } = this.toObject()
        object.id = _id
        return object
    })

    return token
}


/*
constructor(imageSource, gridX = (Math.floor(Math.random()*canvas.cellInWidth)-1), gridY = (Math.floor(Math.random()*canvas.cellInHeight)-1), tokenSize = 1){
        this.tokenImage.src = "../tokens/" + imageSource + ".png" 
        this.gridX = gridX
        this.gridY = gridY
        this.tokenSize = tokenSize
        this.selected = false
        this.name = ("token%s", tokens.length+1)
*/