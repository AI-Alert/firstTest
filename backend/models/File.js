const {model, Schema, ObjectId} = require('mongoose')

/*
Модель файла с именем, тип (папка (dir), либо mime-type файла), ссылка для доступа, размер, путь, дата добавления,
пользователь (из модели USER), родитель (папка из данной модели), дочерний файл (файл или папка из данной модели)
*/

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    accessLink: {type:String},
    size: {type: Number, default: 0},
    path: {type: String, default: ''},
    date: {type: Date, default: Date.now()},
    user: {type: ObjectId, ref: 'User'},
    parent: {type: ObjectId, ref: 'File'},
    childs: [{type: ObjectId, ref: 'File'}],
})

module.exports = model('File', File)