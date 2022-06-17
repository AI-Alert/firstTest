const {Schema, model, ObjectId} = require("mongoose")

/*
Модель пользователя с email, паролем, выделяемое дисковое пространство,
используемое пространство, аватар пользователя, связь с моделью файла
 */

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    files : [{type: ObjectId, ref:'File'}]
})

module.exports = model('User', User)