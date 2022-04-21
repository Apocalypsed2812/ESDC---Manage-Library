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
router.post('/search', StaffController.searchBook);
router.post('/addloan', StaffController.addLoan);
router.post('/updateLoan', StaffController.updateLoan);
router.get('/statistic', StaffController.renderStatistic);
router.post('/changeQuantity', StaffController.changeQuantity);

module.exports = router;