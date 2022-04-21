const Staff = require("../models/Staff");
//const setFlashMessage = require("../lib/setFlashMessage");
module.exports = async function checkLogin(req, res, next) {
    //console.log(req.session.user_id)
    const account = await Staff.findOne({ _id: req.session.user_id }).lean();
    //console.log(account)
    if (account) {
        req.account = account;
        next();
    } else {
        /*req.session.flash = setFlashMessage(
            "error",
            "Invalid account",
            "Please Login!"
        );*/
        console.log('không tìm thấy account trong check_staff');
        res.redirect("/login");
    }
};