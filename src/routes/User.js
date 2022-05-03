const express = require('express');
const router = express.Router()
const UserController = require('../app/controllers/UserController');
const checkUser = require("../app/middleware/checkUser");
//const flash = require("../app/middleware/flashMessage");

router.use(checkUser);
router.get('/home', UserController.renderHome);
router.get('/book', UserController.renderBook);
router.get('/infor', UserController.renderInfor);
router.get('/book/:slug', UserController.bookDetail);
router.get('/comment', UserController.renderComment);
router.get('/rule', UserController.rendeRule);
router.get('/loan', UserController.renderLoan);
router.post('/addComment', UserController.addComment);
router.post('/search', UserController.searchBook);
router.post('/change-password', UserController.change_password);
router.get('/material', UserController.renderMaterial)
router.get('/materialE', UserController.renderMaterialE)
router.post('/searchMaterial', UserController.searchMaterial);
router.get('/material/:slug', UserController.materialDetail);
router.get('/materialE/:slug', UserController.materialEDetail);
router.post('/searchMaterialE', UserController.searchMaterialE)

module.exports = router;