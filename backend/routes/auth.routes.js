const Router = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

//маршрутизация для регистрации
router.post('/registration',
    //обработчики для email и длины пароля
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    ],
    async (req, res) => {
        try {
            //инициализация переменной ошибки
            const errors = validationResult(req)
            //если есть ошибка
            if (!errors.isEmpty()) {
                //вывод сообщения "Неверный запрос"
                return res.status(400).json({message: "Uncorrect request", errors})
            }
            //если нет ошибки
            //Инициализация запроса (email и пароль)
            const {email, password} = req.body
            //Поиск зарегистрированных пользователей с таким же email-ом
            const candidate = await User.findOne({email})
            //Если есть зарегистрированный пользователь
            if(candidate) {
                //вернуть ошибку "Пользователь с таким email уже существует"
                return res.status(400).json({message: `User with email ${email} already exist`})
            }
            //Хэширование пароля с помощью библиотеки bcrypt (8 итераций хэширования)
            const hashPassword = await bcrypt.hash(password, 8)
            //формирование экземпляра пользователя с email и захэшированным паролем
            const user = new User({email, password: hashPassword})
            //сохранение данных пользователя
            await user.save()
            //выполнение функции createDir (из конроллера) - создание корневой безымянной папки
            await fileService.createDir(new File({user:user.id, name: ''}))
            //вывод сообщения "Пользователь создан"
            res.json({message: "User was created"})
        } catch (e) {
            //вывод серверной ошибки
            console.log(e)
            res.send({message: "Server error"})
        }
    })


//маршрутизация для входа в систему
router.post('/login',
    async (req, res) => {
        try {
            //Инициализация запроса (email и пароль)
            const {email, password} = req.body
            //Проверка зарегистрированного пользователя
            const user = await User.findOne({email})
            //если пользователя не существует
            if (!user) {
                //вывод ошибки "Пользователь не найден"
                return res.status(404).json({message: "User not found"})
            }
            //Проверка валидности введенного пароля с синхронным сравнением
            const isPassValid = bcrypt.compareSync(password, user.password)
            //если пароль неверный
            if (!isPassValid) {
                //вывод ошибки "Неверный пароль"
                return res.status(400).json({message: "Invalid password"})
            }
            //Создание токена для сессии, которая длится 1 час (далее она завершается и необходима повторная авторизация)
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            //возвращение токена и данных пользователя (id, email, предоставленное пространство, используемое протранство, аватарка пользователя)
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            //вывод серверной ошибки
            console.log(e)
            res.send({message: "Server error"})
        }
    })


//маршрутизация для авторизации
router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            //поиск пользователя
            const user = await User.findOne({_id: req.user.id})
            //Создание токена для сессии, которая длится 1 час (далее она завершается и необходима повторная авторизация)
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            //вывод серверной ошибки
            console.log(e)
            res.send({message: "Server error"})
        }
    })


module.exports = router