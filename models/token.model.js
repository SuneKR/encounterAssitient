module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            tokenimagesource: String,
            gridx: Number,
            gridy: Number,
            tokensize: Number,
            selected: Boolean
        },
        {  timestamps: true  }
    )

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Token = mongoose.model("token", schema)
    return Token
}