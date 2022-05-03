const Account = require('../models/Account');
//const Post = require('../models/Post');
const bcrypt = require("bcrypt");
//const uploadImage = require("../lib/uploadImage");
//const setFlashMessage = require('../lib/setFlashMessage')
const Book = require('../models/Book');
const Staff = require('../models/Staff');
const Statistic = require('../models/Statistic');
const Material = require('../models/Material');
const MaterialE = require('../models/Material_e');
const Loan = require('../models/Loan');
const {multipleMongooseToObject, mongooseToOject} = require('../../util/mongoose');
const upload = require('../../upload');
const upload_file = require('../../upload_file');
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
        //console.log(books)
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
        let {id, name, quantity, description, slug} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Book.findByIdAndUpdate(id, {name, quantity, description, slug}, {
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

    bookImage(req, res){
        const form1 = new multiparty.Form()
        form1.parse(req, (err, fields, files) => {
            console.log(fields)
            console.log(files)
            if (err) return res.status(500).send(err.message)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            Book.findByIdAndUpdate(fields.id[0], {image: files.image[0].originalFilename}, {
                new: true
            })
            .then(p => {
                if(p){
                    //return res.json({code: 0, message: "Cập nhật thành công"})
                    console.log('Thành công')
                    res.redirect('/staff/book')
                }
                else{
                    //return res.json({code: 2, message: "Không tìm thấy sách để cập nhật"})
                    console.log('Thất bại')
                    res.redirect('/staff/book')
                }  
            })
            .catch(e => {
                //return res.json({code: 3, message: e.message})
                console.log('Có lỗi xảy ra do' + e.message)
            })
            
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
        let count = await Loan.count({})

        let loan = await Loan
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        console.log(loan)
        // let book = await Book.find({}).lean()
        // let temp = new Array()
        // for(i = 1; i <= book.quantity; i++){
        //     temp.push(i)
        // }
        let temp = new Array()
        loan.forEach(item => {
            if(item.status === 'Bình Thường'){
                temp.push(item)
            }
        })
        //console.log(temp)

        let bookList = await Book
                .find({})
                .lean()
        let book = new Array()
        bookList.forEach(item => {
            if(item.quantity > 0 && item.status === 'Bình Thường'){
                book.push(item)
            }
        })
        console.log(temp)

        let account = await Account
                .find({})
                .lean()
        
        res.render('./staff/loan', {data: temp, count, page, book, account})
    }

    // [POST] /staff/addloan
    async addLoan(req, res){
        let acc = req.account
        let {username, name, dateb, dater, book1, book2, book3} = req.body;
        let staff = acc.username
        let id1 = req.body.id_book1
        let id2 = req.body.id_book2
        let id3 = req.body.id_book3

        let date = new Date()
        let month = date.getMonth() + 1

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookb = statistic.bookb
        let count = 0


        let account = await Account.findOne({username})
        let credit_account = account.credit
        let id_account = account._id

        if(credit_account < 20000){
            console.log('Không đủ tiền thế chân')
            return
        }
        else{
            let books = new Array();
            if(book1 !== ""){
                books.push(book1)
                count += 1
            }
            if(book2 !== ""){
                books.push(book2)
                count += 1
            }
            if(book3 !== ""){
                books.push(book3)
                count += 1
            }
            
            let data = {
                username,
                name,
                book: books,
                staff,
                dateb,
                dater,
                status: 'Bình Thường'
            };
            
            const loan = new Loan(data);
            loan.save();

            console.log(id1)
            console.log(id2)
            console.log(id3)

            // Book 1 selected
            if(id1 && id1 !== 'None'){
                let b1 = await Book.find({_id: id1}).lean()

                let result = b1[0].quantity - 1
                if(result < 0){
                    result = 0
                }
                console.log(result)

                if(result === 0){
                    Book.findByIdAndUpdate(id1, {status: "Đã hết"}, {
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
                
                Book.findByIdAndUpdate(id1, {quantity: result}, {
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

            // Book 2 selected
            if(id2 && id2 !== 'None'){
                let b2 = await Book.find({_id: id2}).lean()

                let result = b2[0].quantity - 1
                if(result < 0){
                    result = 0
                }
                console.log(result)

                if(result === 0){
                    Book.findByIdAndUpdate(id2, {status: "Đã hết"}, {
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
                
                Book.findByIdAndUpdate(id2, {quantity: result}, {
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

            // Book 3 selected
            if(id3 && id3 !== 'None'){
                let b3 = await Book.find({_id: id3}).lean()

                let result = b3[0].quantity - 1
                if(result < 0){
                    result = 0
                }
                console.log(result)

                if(result === 0){
                    Book.findByIdAndUpdate(id3, {status: "Đã mượn"}, {
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
                
                Book.findByIdAndUpdate(id3, {quantity: result}, {
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
            let credit = credit_account - 20000
            Account.findByIdAndUpdate(id_account, {credit}, {
                new: true
            })
            .then(p => {
                if(p){
                    console.log("Thanh cong")
                }
                else{
                    console.log("That bai")
                }  
            })
            .catch(e => {
                console.log(e.message)
            })

            if(count === 3){
                bookb += 3
                Statistic.findByIdAndUpdate(id_statistic, {bookb}, {
                    new: true
                })
                .then(p => {
                    if(p){
                        console.log("Thanh cong")
                    }
                    else{
                        console.log("That bai")
                    }  
                })
                .catch(e => {
                    console.log(e.message)
                })
            }
            else if(count === 2){
                bookb += 2
                Statistic.findByIdAndUpdate(id_statistic, {bookb}, {
                    new: true
                })
                .then(p => {
                    if(p){
                        console.log("Thanh cong")
                    }
                    else{
                        console.log("That bai")
                    }  
                })
                .catch(e => {
                    console.log(e.message)
                })
            }
            else if(count === 1){
                bookb += 1
                Statistic.findByIdAndUpdate(id_statistic, {bookb}, {
                    new: true
                })
                .then(p => {
                    if(p){
                        console.log("Thanh cong")
                    }
                    else{
                        console.log("That bai")
                    }  
                })
                .catch(e => {
                    console.log(e.message)
                })
            }
        //req.session.user_id = account._id;
        }

        
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

    async getIdBook(req, res){
        let book = await Book
            .find({})
            .lean()
        let books = req.body.book
        let arrayBook = new Array()
        if(books.includes(',')){
            books = books.split(',')
            book.forEach(item => {
                books.forEach(item1 => {
                    if(item.name === item1){
                        arrayBook.push(item)
                    }
                })
            })
            return res.json({code: 0, message: 'Tìm thấy sách', data: arrayBook})
        }
        else{
            let name = books
            book.forEach(item => {
                if(item.name === name){
                    console.log("Lấy được đúng item")
                    arrayBook.push(item)
                    return res.json({code: 0, message: 'Tìm thấy sách', data: arrayBook})
                }
            })
        }
        
    }

    async findBookbyid(id){
        let book = await Book.findById(id).lean()
        return book
    }

    async changeStatusSuccess3book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1
        let id_book2 = req.body.id_book2
        let id_book3 = req.body.id_book3

        let book1 = await Book.findById(id_book1)
        let book2 = await Book.findById(id_book2)
        let book3 = await Book.findById(id_book3)
        let account = await Account.findOne({username})

        let loan = await Loan.findById(id)
        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookd = statistic.bookd + 3

        console.log(username)
        console.log(account)

        let credit_account = account.credit
        let id_account = account._id
        
        let quantity1 = book1.quantity
        let quantity2 = book2.quantity
        let quantity3 = book3.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book2, {quantity : quantity2 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book3, {quantity : quantity3 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 20000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookd}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Đã xong'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    async changeStatusSuccess2book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1
        let id_book2 = req.body.id_book2
    
        let book1 = await Book.findById(id_book1)
        let book2 = await Book.findById(id_book2)
        let account = await Account.findOne({username})
        
        let credit_account = account.credit
        let id_account = account._id

        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookd = statistic.bookd + 2
        
        let quantity1 = book1.quantity
        let quantity2 = book2.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book2, {quantity : quantity2 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 20000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookd}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Đã xong'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    async changeStatusSuccess1book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1

        let book1 = await Book.findById(id_book1)
        let account = await Account.findOne({username})
        
        let credit_account = account.credit
        let id_account = account._id

        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookd = statistic.bookd + 1
        
        let quantity1 = book1.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 20000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookd}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Đã xong'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    // [POST] /staff/changeStatusLate3Book
    async changeStatusLate3book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1
        let id_book2 = req.body.id_book2
        let id_book3 = req.body.id_book3

        let book1 = await Book.findById(id_book1)
        let book2 = await Book.findById(id_book2)
        let book3 = await Book.findById(id_book3)
        let account = await Account.findOne({username})

        console.log(username)
        console.log(account)

        let credit_account = account.credit
        let id_account = account._id

        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookl = statistic.bookl + 3
        
        let quantity1 = book1.quantity
        let quantity2 = book2.quantity
        let quantity3 = book3.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book2, {quantity : quantity2 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book3, {quantity : quantity3 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 10000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookl}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Trễ'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    async changeStatusLate2book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1
        let id_book2 = req.body.id_book2
    
        let book1 = await Book.findById(id_book1)
        let book2 = await Book.findById(id_book2)
        let account = await Account.findOne({username})
        
        let credit_account = account.credit
        let id_account = account._id

        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookl = statistic.bookl + 2
        
        let quantity1 = book1.quantity
        let quantity2 = book2.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        Book.findByIdAndUpdate(id_book2, {quantity : quantity2 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //return res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 10000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookl}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Trễ'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    async changeStatusLate1book(req, res){
        let id = req.body.id
        let username = req.body.username
        let id_book1 = req.body.id_book1

        let book1 = await Book.findById(id_book1)
        let account = await Account.findOne({username})
        
        let credit_account = account.credit
        let id_account = account._id

        let date = new Date()
        console.log(date)

        let month = date.getMonth() + 1

        console.log(month)

        let statistic = await Statistic.findOne({month})
        let id_statistic = statistic._id
        let bookl = statistic.bookl + 1
        
        let quantity1 = book1.quantity

        Book.findByIdAndUpdate(id_book1, {quantity : quantity1 + 1}, {
            new: true
        })
        .then(p => {
            if(p){
                //res.json({code: 0, message: "Cộng thêm số lượng sách thành công"})
                console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                //return res.json({code: 2, message: "Không tìm thấy sách để thay đổi số lượng"})
                console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            //return res.json({code: 3, message: e.message})
            console.log("Có lỗi xảy ra")
        })

        let credit = credit_account + 10000
        Account.findByIdAndUpdate(id_account, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        Statistic.findByIdAndUpdate(id_statistic, {bookl}, {
            new: true
        })
        .then(p => {
            if(p){
                console.log("Thanh cong")
            }
            else{
                console.log("That bai")
            }  
        })
        .catch(e => {
            console.log(e.message)
        })

        let tt = 'Trễ'

        Loan.findByIdAndUpdate(id, {status: tt}, {
            new: true
        })
        .then(p => {
            if(p){
                res.json({code: 0, message: "Chuyển trạng thái phiếu thành công"})
                //console.log("Cộng thêm số lượng sách thành công")
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy phiếu để cập nhật"})
                //console.log("Không tìm thấy sách để thay đổi số lượng")
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
            //console.log("Có lỗi xảy ra")
        })
    }

    // [GET] /staff/material
    async renderMaterial(req, res){
        let PAGE_SKIP = 8
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Material.count({});
        let materials = await Material
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        res.render('./staff/material', {data: materials, count, page}) 
    }

    // [GET] /staff/materialE
    async renderMaterialE(req, res){
        let PAGE_SKIP = 8
        let page = req.query.page || 0
        //console.log(page)
        let skip = PAGE_SKIP * page
        let count = await Material.count({});
        let materials = await MaterialE
                .find({})
                .skip(skip)
                .limit(PAGE_SKIP)
                .lean()
        res.render('./staff/material_e', {data: materials, count, page}) 
    }

    // [GET] /staff/addMaterial
    renderAddMaterial(req, res, next) {
        const account = req.account;
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        res.render('./staff/addMaterial');
    } 

    // [GET] /staff/addMaterialE
    renderAddMaterialE(req, res, next) {
        const account = req.account;
        //const first_10_posts = await Post.find({}).sort({ date: -1 }).limit(10).lean();
        res.render('./staff/addMaterialE');
    } 

    // [POST] /staff/material
    addMaterial(req, res){
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) return res.status(500).send(err.message)
            console.log(fields)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            let material = new Material({
                name: fields.name[0], 
                quantity: fields.quantity[0], 
                description: fields.description[0],
                slug: fields.name[0],
                image: files.image[0].originalFilename,
                status: "Normal",
            })
            material.save()
            .then(() => {
                console.log("Thêm tài liệu thành công")
                res.redirect('/staff/material')
            })
            .catch(e => {
                console.log("Thêm tài liệu thất bại" + e.message)
                res.redirect('/staff/material')
            })
            //res.redirect('/photo')
        })
    }

    // [POST] /staff/material
    addMaterialE(req, res){
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) return res.status(500).send(err.message)
            console.log(fields)
            console.log(files)
            var oldPath = files.image[0].path
            var oldPathFile = files.file_material[0].path
            upload(oldPath, files.image[0].originalFilename)
            upload_file(oldPathFile, files.file_material[0].originalFilename)
            let material = new MaterialE({
                name: fields.name[0], 
                quantity: fields.quantity[0], 
                description: fields.description[0],
                slug: fields.name[0],
                image: files.image[0].originalFilename,
                file: files.file_material[0].originalFilename,
                status: "Normal",
                category: fields.category[0],
            })
            material.save()
            .then(() => {
                console.log("Thêm tài liệu thành công")
                res.redirect('/staff/materialE')
            })
            .catch(e => {
                console.log("Thêm tài liệu thất bại" + e.message)
                res.redirect('/staff/materialE')
            })
        })
    }

    // [POST] /staff/updateMaterial
    updateMaterial(req, res){
        let {id, name, quantity, description} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        Material.findByIdAndUpdate(id, {name, quantity, description}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài liệu để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    bookImageMaterial(req, res){
        const form1 = new multiparty.Form()
        form1.parse(req, (err, fields, files) => {
            console.log(fields)
            console.log(files)
            if (err) return res.status(500).send(err.message)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            Material.findByIdAndUpdate(fields.id[0], {image: files.image[0].originalFilename}, {
                new: true
            })
            .then(p => {
                if(p){
                    //return res.json({code: 0, message: "Cập nhật thành công"})
                    console.log('Thành công')
                    res.redirect('/staff/material')
                }
                else{
                    //return res.json({code: 2, message: "Không tìm thấy sách để cập nhật"})
                    console.log('Thất bại')
                    res.redirect('/staff/material')
                }  
            })
            .catch(e => {
                //return res.json({code: 3, message: e.message})
                console.log('Có lỗi xảy ra do' + e.message)
            })
            
        })
    }

    // [POST] /staff/updateMaterialE
    updateMaterialE(req, res){
        let {id, name, quantity, description} = req.body
        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }
        MaterialE.findByIdAndUpdate(id, {name, quantity, description}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài liệu để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    bookImageMaterialE(req, res){
        const form1 = new multiparty.Form()
        form1.parse(req, (err, fields, files) => {
            console.log(fields)
            console.log(files)
            if (err) return res.status(500).send(err.message)
            var oldPath = files.image[0].path
            upload(oldPath, files.image[0].originalFilename)
            MaterialE.findByIdAndUpdate(fields.id[0], {image: files.image[0].originalFilename}, {
                new: true
            })
            .then(p => {
                if(p){
                    //return res.json({code: 0, message: "Cập nhật thành công"})
                    console.log('Thành công')
                    res.redirect('/staff/materialE')
                }
                else{
                    //return res.json({code: 2, message: "Không tìm thấy sách để cập nhật"})
                    console.log('Thất bại')
                    res.redirect('/staff/materialE')
                }  
            })
            .catch(e => {
                //return res.json({code: 3, message: e.message})
                console.log('Có lỗi xảy ra do' + e.message)
            })
            
        })
    }

    bookFileMaterialE(req, res){
        const form1 = new multiparty.Form()
        form1.parse(req, (err, fields, files) => {
            console.log(fields)
            console.log(files)
            if (err) return res.status(500).send(err.message)
            var oldPath = files.file[0].path
            upload_file(oldPath, files.file[0].originalFilename)
            MaterialE.findByIdAndUpdate(fields.id[0], {file: files.file[0].originalFilename}, {
                new: true
            })
            .then(p => {
                if(p){
                    //return res.json({code: 0, message: "Cập nhật thành công"})
                    console.log('Thành công')
                    res.redirect('/staff/materialE')
                }
                else{
                    //return res.json({code: 2, message: "Không tìm thấy sách để cập nhật"})
                    console.log('Thất bại')
                    res.redirect('/staff/materialE')
                }  
            })
            .catch(e => {
                //return res.json({code: 3, message: e.message})
                console.log('Có lỗi xảy ra do' + e.message)
            })
            
        })
    }

    // [POST] /staff/searchMaterial
    async searchMaterial(req, res){
        let search = req.body
        //console.log(search)
        let materialArray = new Array()
        let material = await Material
                .findOne({name: search.material})
                .lean()
        materialArray.push(material)
        console.log(materialArray)
        res.render('./staff/material', {search: material}) 
    }

    // [POST] /staff/searchMaterial
    async searchMaterialE(req, res){
        let search = req.body
        //console.log(search)
        let materialArray = new Array()
        let material = await MaterialE
                .findOne({name: search.materialE})
                .lean()
        materialArray.push(material)
        console.log(materialArray)
        res.render('./staff/material_e', {search: material}) 
    }

    // [GET] /staff/money
    renderMoney(req, res){
        res.render('./staff/money')
    }

    // [POST] /staff/searchUser
    async searchUser(req, res){
        let search = req.body
        //console.log(search)
        let user = await Account
                .findOne({username: search.user})
                .lean()

        res.render('./staff/money', {search: user}) 
    }

    // [POST] /staff/updateMoney
    async updateMoney(req, res){
        let id = req.body.id
        let money = req.body.money

        console.log(id)
        console.log(money)
        

        if(!id){
            return res.json({code: 1, message: "Thiếu tham số id"})
        }

        let account = await Account.findById(id)

        console.log(account)
        
        let credit_account = account.credit

        let credit =  parseInt(credit_account) + parseInt(money)

        Account.findByIdAndUpdate(id, {credit}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })
    }

    // [POST] /staff/changeStatusBookStill
    changeStatusBookStill(req, res){
        let id = req.body.id

        let status = 'Bình Thường'
        Book.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })        
    }

    // [POST] /staff/changeStatusBookEnd
    changeStatusBookEnd(req, res){
        let id = req.body.id

        let status = 'Đã Hết'
        Book.findByIdAndUpdate(id, {status}, {
            new: true
        })
        .then(p => {
            if(p){
                return res.json({code: 0, message: "Cập nhật thành công"})
            }
            else{
                return res.json({code: 2, message: "Không tìm thấy tài khoản để cập nhật"})
            }  
        })
        .catch(e => {
            return res.json({code: 3, message: e.message})
        })        
    }

    async getStatistic(req, res){
        let {month, year} = req.body
        let statistic = await Statistic.find({year}).lean()

        // console.log("Dữ liệu theo năm")
        // console.log(statistic)
        let temp = new Array()
        statistic.forEach(item => {
            if(item.month === month){
                temp.push(item)
                let bookn = item.bookn
                bookn = item.bookb - (item.bookd + item.bookl)
                Statistic.findByIdAndUpdate(item._id, {bookn}, {
                    new: true
                })
                .then(p => {
                    if(p){
                        return res.json({code: 0, message: 'Tìm thấy dữ liệu thống kê', data: temp[0]})
                    }
                    else{
                        return res.json({code: 2, message: "Không tìm thấy thống kê để cập nhật"})
                    }  
                })
                .catch(e => {
                    return res.json({code: 3, message: e.message})
                })
            }
        })
    }
}

module.exports = new StaffController;