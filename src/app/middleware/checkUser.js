const Account = require("../models/Account");
//const setFlashMessage = require("../lib/setFlashMessage");
module.exports = async function checkLogin(req, res, next) {
    const account = await Account.findOne({ _id: req.session.user_id }).lean();
    if (account) {
        if (account.role === "user") {
            req.account = account;
            next();
        } else {
            /*req.session.flash = setFlashMessage(
              "error",
              "Invalid account",
              "Please Login!"
            );*/
            console.log('role user không hợp lệ');
            res.redirect("/login");
        }
    } else {
        /*req.session.flash = setFlashMessage(
            "error",
            "Invalid account",
            "Please Login!"
        );*/
        console.log('không tìm thấy account trong check_user');
        res.redirect("/login");
    }
};