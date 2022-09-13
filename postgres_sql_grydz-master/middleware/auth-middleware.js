const validator = require('../helpers/validate');
var jwt = require('jsonwebtoken');
const secret = 'BHRTPO(TY&';
const db = require("../config/db")

module.exports = (req, res, next) => {
    console.log("request--------------------------->", req)
    var token = req.headers['authorization'];
    let errors = [];
    if (!token){
        res.status(401).send({ message: "Unauthorise User"});
    } else {
        jwt.verify(token.split(" ")[1], secret, async function(err, decoded) {
            if (err) return res.status(406).send({ message: 'Invalid Token.', err:err });
            let user = await db.query(`SELECT _id from users`);
            console.log("user-->",user?.rows);
            if(!user) res.status(401).send({ message: "Unauthorise User"});
            if(user) req.authInfo = user;
            next();
        });
        }
}