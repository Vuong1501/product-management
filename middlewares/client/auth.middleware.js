
const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    
    if(!req.cookies.tokenUser){
        res.redirect(`/user/login`);
    } 

    const user = await User.findOne({token: req.cookies.tokenUser});

    if(!user) {
        res.redirect(`/user/login`);
        return;
    } 
    next();
}
