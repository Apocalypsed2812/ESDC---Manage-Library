const Account = require('../models/Account');
//const Post = require('../models/Post');
const bcrypt = require("bcrypt");
//const uploadImage = require("../lib/uploadImage");
//const setFlashMessage = require('../lib/setFlashMessage')
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const {multipleMongooseToObject, mongooseToOject} = require('../../util/mongoose');
const upload = require('../../upload');
const fs = require('fs');
const multiparty = require('multiparty');

class StaffController {
    
    // [GET] /staff/home
    renderHome(req, res, next) {
        const account = req.account;
        res.render('./staff/home');
    }  

    // [GET] /staff/book
    async renderBook(req, res){
        let PAGE_SKIP = 8
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Book.count({});
        let books = await Book
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        // console.log(books)
        res.render('./staff/book', {data: books, count, page}) 
    }

    // [GET] /staff/book/:slug
    bookDetail(req, res, next){
        Book.findOne({slug: req.params.slug})
            .then(book => {
                res.render('./staff/book_detail', {book: mongooseToOject(book)})
            })
            .catch(next);
    }

    // [GET] /staff/add
    renderAdd(req, res, next) {
        const account = req.account;
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        res.render('./staff/add');
    } 
    
    // [POST] /staff/add
    addBook(req, res){
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) return res.status(500).send(err.message)
            console.log(fields)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            let book = new Book({
                name: fields.name[0], 
                quantity: fields.quantity[0], 
                description: fields.description[0],
                slug: fields.slug[0],
                image: files.image[0].originalFilename,
                status: "Normal",
            })
            book.save()
            .then(() => {
                console.log("Thêm sách thành công")
                res.redirect('/staff/book')
            })
            .catch(e => {
                console.log("Thêm sách thất bại" + e.message)
                res.redirect('/staff/book')
            })
            //res.redirect('/photo')
        })
    }

    deleteBook(req, res){
        let {id} = req.params
        //console.log(id)
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Book.findByIdAndDelete(id)
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Xóa thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy sách để xóa"})
            }
        
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    updateBook(req, res){
        let {id, name, quantity, description, slug, image} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Book.findByIdAndUpdate(id, {name, quantity, description, slug, image}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy sách để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    // [POST] /admin/search
    async searchBook(req, res){
        let search = req.body
        //console.log(search)
        let books = await Book
                .findOne({name: search.book})
                .lean()
        //console.log(books)
        res.render('./staff/search_book', {search: books}) 
    }

    // [GET] /staff/loan
    async renderLoan(req, res){
        let PAGE_SKIP = 4
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Loan.count({});
        let loan = await Loan
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        //console.log(loan)
        // let book = await Book.find({}).lean()
        // let temp = new Array()
        // for(i = 1; i <= book.quantity; i++){
        //     temp.push(i)
        // }
        let temp = new Array()
        loan.forEach(item => {
            if(item.status === 'normal'){
                temp.push(item)
            }
        })
        //console.log(temp)

        let book = await Book
                .find({})
                .lean()

        res.render('./staff/loan', {data: temp, count, page, book})
    }

    // [POST] /staff/addloan
    async addLoan(req, res){
        let {username, name, book, staff, dateb, dater} = req.body;
        let quantityBook = req.body.quantity
        let id = req.body.id_book
    
        let data = {
            username,
            name,
            book,
            staff,
            dateb,
            dater,
            status: 'normal'
        };
        
        const loan = new Loan(data);
        loan.save();

        book = await Book.find({_id: id}).lean()

        let result = book[0].quantity - quantityBook
        console.log(result)

        if(result === 0){
            Book.findByIdAndUpdate(id, {status: "Đã mượn"}, {
                new: true
            })
            .then(p => {
                if(p){
                    //return res.json({code: 0, message: "Cập nhật phiếu mượn thành công"})
                    console.log("Thanh cong")
                }
                else{
                    //return res.json({code: 2, message: "Không tìm thấy phiếu mượn để cập nhật"})
                    console.log("That bai")
                }  
            })
            .catch(e => {
                //return res.json({code: 3, message: e.message})
                console.log("Co loi xay ra")
            })
        }
        
        Book.findByIdAndUpdate(id, {quantity: result}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cập nhật phiếu mượn thành công"})
                console.log("Thanh cong")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy phiếu mượn để cập nhật"})
                console.log("That bai")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Co loi xay ra")
        })
        //req.session.user_id = account._id;
        res.redirect("/staff/loan");
    }

    // [POST] /admin/updateLoan
    updateLoan(req, res){
        let {id, username, name, book, staff, dateb, dater} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
    
        Loan.findByIdAndUpdate(id, {name, book, username, staff, dateb, dater}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật phiếu mượn thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu mượn để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    // [GET] /staff/statistic
    renderStatistic(req, res){
        res.render('./staff/statistic')
    }

    // [POST] /staff/changeQuantity
    async changeQuantity(req, res){
        let name = req.body.name
        //console.log(name)
        let book = await Book
                .find({name})
                .lean()
        //console.log(book)
        if(book){
            res.json({code: 0, message: 'Tìm thấy sách', data: book})
        }
        else{
            res.json({code: 1, message: 'Có lỗi xảy ra'})
        }
    }
}

module.exports = new StaffController;