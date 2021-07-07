const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
      check('email', 'Некорректный e-mail').isEmail(),
      check('password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
      
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const {email, password} = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким e-mail уже зарегистрирован.' })
      }
        
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword }) //создать нового пользователя
      
      await user.save()

      console.log(user)

      res.status(201).json({ message: 'Пользователь добавлен' })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так при регистрации, попробуйте снова' })
    }
  })

// /api/auth/login
router.post(
    '/login',
    [
    check('email', 'Некорректный e-mail').normalizeEmail().isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],

async (req, res) => {
try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }

    const {email, password} = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
        { userId: user.id }, //1-й параметр - указать те данные, которые зашифрованы в jwt-token
        config.get('jwtSecret'), // 2-й параметр - секретный ключ
        { expiresIn: '1h' } //3-й параметр  - через сколько jwt-token перестанет существовать
    )

    res.json({ token, userId: user.id }) //передать результат
    
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router