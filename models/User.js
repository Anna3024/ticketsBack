const {Schema, model, Types} = require ('mongoose')

const schema = new Schema({
    email:{
        type: String,
        require: true, //обязательное поле
        unique: true //уникальный e-mail
    },
    password: {
        type: String,
        require: true
    },
    gender: {
        type: Boolean,
    },
    phone: {
        type: Number
    },
    birthday: {
        type: String
    },
    orders: [{                       //заказанные билеты
        type: Types.ObjectId,
        ref: 'Order'
    }]


})

module.exports = model('User', schema)