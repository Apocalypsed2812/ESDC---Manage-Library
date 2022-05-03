const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Staff = require('../models/Staff');

class AccountController{

    render(req,res){
        res.render('./index')
    }

    renderLogin(req, res, next) {
        //delete req.session.user_id;
        let error = req.flash('error') || ''
        console.log(error)
        res.render("./login", {error});
    }

    renderRegister(req, res, next) {
        //delete req.session.user_id;
        let error = req.flash('error') || ''
        res.render("./register", {error});
    }

    async loginByAccount(req, res, next) {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username)
        console.log(password)
        let error = ' '
        if(!username || username === ' '){
            error = 'Vui lòng nhập Username'
            req.flash('error', error)
            res.redirect("/login");
        }
        else if(!password || password === ' '){
            error = 'Vui lòng nhập Password'
            req.flash('error', error)
            res.redirect("/login");
        }
        else{
            let account = await Account.findOne({ username });
            let staff = await Staff.findOne({username})
            if (account) {
                if (bcrypt.compareSync(password, account.password)) {
                    req.session.user_id = account._id;
                    if (account.role === "admin") {
                        res.redirect("/admin/home");
                    } 
                    else if(account.role === "user") {
                        res.redirect("/user/home");
                    } 
                } else {
                    //req.session.flash = setFlashMessage('error', 'Invalid account', "Tài khoản hoặc mật khẩu không chính xác")
                    console.log("Đăng nhập thất bại")
                    error = 'Sai mật khẩu'
                    req.flash('error', error)
                    res.redirect("/login");
                }
                /*if(password === account.password){
                    res.redirect("/admin/home");
                }
                else{
                    console.log("Đăng nhập thất bại, Sai username hoặc password");
                }*/
            } 
            else if(staff){
                //console.log(staff)
                if(staff.password === password){
                    req.session.user_id = staff._id;
                    res.redirect("/staff/home");
                }
                else{
                    error = 'Sai mật khẩu nhân viên'
                    req.flash('error', error)
                    res.redirect("/login");
                }
            }
            else {
                //req.session.flash = setFlashMessage('error', 'Invalid account', "Tài khoản hoặc mật khẩu không chính xác")
                console.log("Không tìm thấy account")
                error = 'Không tìm thấy tài khoản, vui lòng thử lại'
                req.flash('error', error)
                res.redirect("/login");

            }
        }
    }

    logOut(req, res, next) {
        delete req.session.user_id;
        res.redirect("/login");
    }

    async register(req, res, next) {
        let error = ' '
        let email = req.body.email
        let name = req.body.name
        let username = req.body.username
        let password = req.body.password
        let phone = req.body.phone
        let rePassword = req.body.rePassword
        let identity = req.body.identity
        let address = req.body.address
        let credit = 20000


        if(password.length < 6 || rePassword.length < 6){
            error = 'Mật khẩu phải có từ 6 ký tự'
            req.flash('error', error)
            res.redirect("/register");
        }
        else if(password !== rePassword){
            error = 'Mật khẩu không khớp'
            req.flash('error', error)
            res.redirect("/register");
        }
        else if(!email.includes("@")){
            error = 'Email không hợp lệ'
            req.flash('error', error)
            res.redirect("/register");
        }
        else{
            const hashed = bcrypt.hashSync(password, 10)

            const data = {
                email,
                name,
                username,
                role: "user",
                password: hashed,
                phone,
                identity,
                address,
                credit,
                status: 'Bình Thường',
            };
            const account = new Account(data);
            await account.save();
            req.session.user_id = account._id;
            res.redirect("/login");
        }

    }

}

module.exports = new AccountController

// // [POST] /staff/updateMaterial
// updateMaterial(req, res){
//     const form = new multiparty.Form()
//     form.parse(req, (err, fields, files) => {
//         if (err) return res.status(500).send(err.message)
//         // console.log(fields)
//         // console.log(files)
//         var oldPath = files.image[0].path
//         //var oldPathFile = files.file_material[0].path
//         upload(oldPath, files.image[0].originalFilename)
//         //upload_file(oldPathFile, files.file_material[0].originalFilename)
//         let name = fields.name[0]
//         let quantity = fields.quantity[0]
//         let description = fields.description[0]
//         let image = fields.image[0]
//         Material.findByIdAndUpdate(fields.id[0], {name, quantity, description, image}, {
//             new: true
//         })
//         .then(p => {
//             if(p){
//                 return res.json({code: 0, message: "Cập nhật thành công"})
//             }
//             else{
//                 return res.json({code: 2, message: "Không tìm thấy tài liệu để cập nhật"})
//             }  
//         })
//         .catch(e => {
//             return res.json({code: 3, message: e.message})
//         })
//     })
    
// }