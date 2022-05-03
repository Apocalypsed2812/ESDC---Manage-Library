const express = require('express');
const router = express.Router()
const StaffController = require('../app/controllers/StaffController');
const checkStaff = require("../app/middleware/checkStaff");
//const flash = require("../app/middleware/flashMessage");

router.use(checkStaff);
router.get('/home', StaffController.renderHome)
router.get('/book/:slug', StaffController.bookDetail);
router.get('/book', StaffController.renderBook)
router.get('/add', StaffController.renderAdd);
router.get('/loan', StaffController.renderLoan);
router.post('/add', StaffController.addBook);
router.delete('/delete/:id', StaffController.deleteBook)
router.post('/update', StaffController.updateBook)
router.post('/bookImage', StaffController.bookImage)
router.post('/search', StaffController.searchBook);
router.post('/addloan', StaffController.addLoan);
router.post('/updateLoan', StaffController.updateLoan);
router.get('/statistic', StaffController.renderStatistic);
router.post('/changeQuantity', StaffController.changeQuantity);
router.post('/changeStatusSuccess1book', StaffController.changeStatusSuccess1book);
router.post('/changeStatusSuccess2book', StaffController.changeStatusSuccess2book);
router.post('/changeStatusSuccess3book', StaffController.changeStatusSuccess3book);
router.post('/changeStatuslate1book', StaffController.changeStatusLate1book);
router.post('/changeStatuslate2book', StaffController.changeStatusLate2book);
router.post('/changeStatuslate3book', StaffController.changeStatusLate3book);
router.post('/getIdBook', StaffController.getIdBook)
router.get('/material', StaffController.renderMaterial)
router.get('/materialE', StaffController.renderMaterialE)
router.get('/addMaterial', StaffController.renderAddMaterial);
router.get('/addMaterialE', StaffController.renderAddMaterialE);
router.post('/addMaterial', StaffController.addMaterial);
router.post('/addMaterialE', StaffController.addMaterialE);
router.post('/updateMaterial', StaffController.updateMaterial);
router.post('/bookImageMaterial', StaffController.bookImageMaterial)
router.post('/updateMaterialE', StaffController.updateMaterialE);
router.post('/bookImageMaterialE', StaffController.bookImageMaterialE)
router.post('/bookFileMaterialE', StaffController.bookFileMaterialE)
router.post('/searchMaterial', StaffController.searchMaterial);
router.post('/searchMaterialE', StaffController.searchMaterialE);
router.get('/money', StaffController.renderMoney)
router.post('/searchUser', StaffController.searchUser);
router.post('/updateMoney', StaffController.updateMoney);
router.post('/changeStatusBookStill', StaffController.changeStatusBookStill);
router.post('/changeStatusBookEnd', StaffController.changeStatusBookEnd);
router.post('/getStatistic', StaffController.getStatistic);


module.exports = router;