const express = require('express');
const router = express.Router()

const AccountController = require('../app/controllers/AccountController');

// [GET] /login
router.get('/', AccountController.render)

// [GET] /login
router.get('/login', AccountController.renderLogin)

// [POST] /login
router.post('/login', AccountController.loginByAccount)

// [GET] /register
router.get('/register', AccountController.renderRegister)

// [POST] /register
router.post('/register', AccountController.register)

// log out
router.get('/logout', AccountController.logOut)

/*router.get('/admin/home', (req, res) => {
    res.render('./admin/home')
})

router.get('/staff/home', (req, res) => {
    res.render('./staff/home')
})

router.get('/user/home', (req, res) => {
    res.render('./user/home')
})*/

module.exports = router