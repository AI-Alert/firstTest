const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        //инициализация переменной токена, который разбит на массив с сепаратором ' '
        const token = req.headers.authorization.split(' ')[1]
        //Если нет токена
        if (!token) {
            //Возврат ошибки "Ошибка аутентификации"
            return res.status(401).json({message: 'Auth error'})
        }
        //инициализация переменной декодера, которая проверяет действителен ли токен по секретному ключу
        const decoded = jwt.verify(token, config.get('secretKey'))
        req.user = decoded
        next()
    } catch (e) {
        //Возврат ошибки "Ошибка аутентификации"
        return res.status(401).json({message: 'Auth error'})
    }
}