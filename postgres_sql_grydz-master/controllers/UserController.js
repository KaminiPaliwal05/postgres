const db = require("../config/db");
const validator = require('../helpers/validate');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const secret = 'BHRTPO(TY&'
const customEmail = require("../packages/Email");
const request = require('request');
const moment = require("moment")


const UserController = {

    async register(req, res) {

        try {
            const Users = `CREATE TABLE IF NOT EXISTS users(
             name STRING,email STRING,
             mobile STRING, image STRING,
             wifi_name STRING, wifi_password STRING,
             dob STRING,location STRING,type STRING,
             password STRING,token STRING, created_at TIMESTAMP WITH TIME ZONE,
             updated_at TIMESTAMP WITH TIME ZONE)`;

            const data = await db.query(Users);
            console.log("~~~~~~~~~~", data);

            const validationRule = {
                "name": "required|string",
                "email": 'required|email',
                "mobile": 'required|regex:/^([2346789]{1})([0-9]{9})$/',
                "password": 'required|string',

            }
            validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    return res.status(422)
                        .send({
                            success: false,
                            message: 'Errors',
                            data: err
                        });
                }
            });
            const { name, email, mobile, wifi_name, wifi_password, dob, location, image, type, password, token } = req.body;
            var hashedPassword = bcrypt.hashSync(password, 8);
            let errors = {};
            console.log("query construct")
            let isEmailExists = await db.query(`SELECT * FROM users WHERE email = '${email.toLowerCase()}'`);
            console.log("isEmailExists-->", isEmailExists);
            if (isEmailExists?.rowCount > 0) {
                errors = {
                    ...errors,
                    "email": [
                        "Email Must Be Uniqued"
                    ]
                }
            }

            let isMobileExists = await db.query(`SELECT * FROM users WHERE mobile = '${mobile}'`);
            if (isMobileExists?.rowCount > 0) {
                errors = {
                    ...errors,
                    "mobile": [
                        "Mobile Must Be Uniqued"
                    ]
                }
            }

            if (Object.keys(errors).length > 0) {
                return res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: {
                            "errors": errors
                        }
                    });
            } else {

                //    var token = jwt.sign({
                //       id: user._id
                //   }, secret, {
                //       expiresIn: "30d"
                //   });
                // console.log("token---->", token)

                const insertData = `INSERT INTO users(name,email,mobile,image,wifi_name,wifi_password,dob,location,type,password,token) VALUES('${name}',
               '${email.toLowerCase()}','${mobile}','${image}','${wifi_name}','${wifi_password}','${dob}','${location}','${type}','${hashedPassword}','${token}') RETURNING *`;
                console.log("data--->", data);

                console.log("req-->", req);

                const Data = await db.query(insertData);

                const user = await db.query(`select _id,* from "grydz"."users" where mobile ='${mobile}'`);
                console.log("user-->",user);

                var tokens = jwt.sign({
                          id: user._id
                      }, secret, {
                          expiresIn: "30d"
                      });
                    console.log("token---->", tokens)

                return res.status(200).send({
                    message: "Register Successfully.",
                    data:{ ...Data?.rows[0], token: `Bearer ${tokens}` }
                });
            }

        } catch (err) {
            console.log("err---->", err);
            res.status(422).send(err);
        }
    },

    async login(req, res) {

        const validationRule = {
            "username": "required|string",
            "password": "required|string"
        }
        console.log("Admin Login ")

        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try {

            let username = req.body.username.toLowerCase();
            let user = {};
            let errors = {};
            let password = req.body.password;
            if (username.includes("@")) {
                user = await db.query(`SELECT * FROM users WHERE email = '${username}'`);
                console.log("user-->", user?.rowCount);
                if (!user?.rowCount) {
                    errors['username'] = ["Email Not Exists!"]

                    // res.status(422).send({
                    //     success: false,
                    //     message: 'Invalid email.',
                    // });
                }
            } else {
                user = await db.query(`SELECT * FROM users WHERE mobile = '${username}'`);
                if (!user?.rowCount) {
                    errors['username'] = ["Mobile Number Not Exists!"]
                    // res.status(422).send({
                    //     success: false,
                    //     message: 'Invalid mobile number.',
                    // });
                }

            }
            console.log("user?.rows?.password-->", user?.rows[0]?.password && user?.rows);
            if (user?.rows[0] && user?.rows[0]?.password) {
                let valid = await bcrypt.compare(password, user?.rows[0]?.password);
                console.log("valid--->", valid);

                if (!valid) {
                    errors['username'] = ["Invalid Password!"];
                }
            }
            if (Object.keys(errors).length < 1) {
                var token = jwt.sign({
                    id: user._id
                }, secret, {
                    expiresIn: "30d"
                });
                console.log("token---->", token)

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({
                    message: 'Login Successfully',
                    data: { ...user?.rows[0], token: `Bearer ${token}` }
                });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: errors
                    });
            }
        } catch (err) {
            console.log("err", err);
            res.status(406).send(err)
        }
    },

    async sendOtp(req, res) {
        const validationRule = {
            "username": 'required',
            "token": "required"
        }
        console.log("Admin otp login api")

        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(422)
                    .json({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try {
            let username = req.body.username.toLowerCase();
            const query = `CREATE TABLE IF NOT EXISTS otps(mobile STRING, token STRING, otp STRING)`;
            await db.query(query).then(res => {
                console.log("Otp Tables created Successfully.");
            })
            let user = {};
            let otp = Math.floor(100000 + Math.random() * 900000);


            let mobile = req.body && req.body.username.includes("@") ? req.body.username.toLowerCase() : req.body.username ? req.body.username.toString() : '';
            // otp = otp;
            let token = req.body.token;


            if (username.includes("@")) {
                user = await db.query(`SELECT * FROM users WHERE email = '${username}'`);
                console.log("user", user?.rows);
                if (user?.rows) {
                    let userInfo = {
                        otp: otp
                    };

                    await customEmail.EmailSend({
                        ...userInfo,
                        to: user['email'],
                        from: user['email'],
                        subject: user['email']
                    }, {
                        template_name: "welcome.ejs",
                    });
                }
            } else {
                user = await db.query(`SELECT * FROM users WHERE mobile = '${username}'`);

                let message = encodeURIComponent(
                    `Your Solarbees login OTP is ${otp}, Valid for the Next 1 hour. Do not share your OTP with anyone for security reason
                  ${req.body.device_id ? req.body.device_id : ''
                    }.`,
                );
                request(
                    `http://smsuser.stewindia.com/http-api.php?username=novel&password=Novel@india&senderid=solrbz&route=2&number=${req.body.username}&message=${message}&templateid=1207164024100456253`,
                    function (error, response, body) {
                        console.error('error:', error);
                        console.log('statusCode:', response && response.statusCode);
                        console.log('body:', body);
                    },
                );
                phone = req.body.phone ? req.body.phone.toString() : '';
            }

            console.log("user--->", user)

            const otpInsert = `INSERT INTO otps(mobile, token,otp) VALUES ('${mobile}','${token}','${otp}')`;
            await db.query(otpInsert);
            //await new Otp(otpObject).save();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                message: "Otp Send Successfully.",
                // data: {
                //     otp: otp,
                // },
            });
        } catch (err) {
            console.log("err-->", err);
            res.status(422).send(err);
        }
    },

    async verifyOtp(req, res) {
        const validationRule = {
            "username": "required",
            "token": "required",
            "otp": "required"
        }
  console.log("req--->",req.authInfo?.rows[0]);
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                console.log("err-->", err);
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try {
            console.log("request-->", req.body);
            let user = {};
            let bodyData = req.body ? req.body : {};

            console.log("welcome", req.body)

            let token = bodyData.token;
            var otp = bodyData.otp;
            var mobile = bodyData && bodyData.username.includes("@")
                ? bodyData.username.toLowerCase()
                : bodyData.username ? bodyData.username.toString() : '';

            let otpVerified = await db.query(`SELECT _id,* FROM otps WHERE mobile = '${mobile}'AND otp = '${otp}' AND token = '${token}'`);
            console.log("otpVerified--->", otpVerified?.rows[0]);

            if (!otpVerified?.rows[0]) {
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: {
                            "errors": {
                                "otp": [
                                    "Invalid Otp"
                                ],
                            }
                        }
                    });
            }

            if (bodyData.username.includes("@")) {
                let username = bodyData.username.toLowerCase();
                user = await db.query(`SELECT _id,* FROM users WHERE email = '${username}'`);
            } else {
                let username = req.body.username.toString();
                user = await db.query(`SELECT _id,* FROM users WHERE mobile = '${username}'`);
            }
            if (!user?.rows) res.status(401).send({ message: "Unauthorise User" });
            let tokens = '';
            if (user?.rows) {
                tokens = jwt.sign({
                    id: user._id
                }, secret, {
                    expiresIn: "30d"
                });
                delete user?.rows[0]?.password
                res.status(200).send({
                    message: "Otp Verified Successfully",
                    data: { ...user?.rows[0], token: `Bearer ${tokens}` }
                });
            }
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err);
        }
    },

    async changePassword(req, res) {
        console.log("change password");

        const validationRule = {
            "password": "required|string"
        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
                res.status(406)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });

        try {
            let password = bcrypt.hashSync(req.body.password, 8)

            const data = await db.query(`UPDATE users SET password = '${password}' WHERE _id = '${req.authInfo?.rows[0]}'`);
            console.log("data-->", data);

            const _data = await db.query(`SELECT _id,* FROM users WHERE _id = '${req.authInfo?.rows[0]}'`); 
 
            res.status(200).send({
                message: "Change Password Successfully.",
                //  data: _data['_doc']
            });
            console.log("change password---->", _data?.rows[0]);
        } catch (err) {
            console.log("err", err);
            res.status(406).send(err)
        }
    },

    async auth_user(req, res) {
        console.log("hello -->", req.headers['authorization']);
        try {
            var token = req.headers['authorization'].split(" ")[1];
            console.log("token--->", token);
            if (!token) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(401).send({
                    message: 'Token Required.'
                });
            }

            jwt.verify(token, secret, async function (err, decoded) {
                if (err) return res.status(422).send({
                    message: 'Invalid Token.'
                });
                let user = await db.query(`SELECT `); Users.findById(decoded['id'])
                console.log("user--->", user)
                if (!user) res.status(401).send({
                    message: "Unauthorise User"
                });
                delete user['_doc']['password']
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({
                    message: "Data Retrived Successfully",
                    data: user['_doc']
                });
            });
        } catch (err) {
            console.log("err--->", err);
            res.status(422).send(err);
        }
    },

    async updateProfile(req, res) {
        const validationRule = {
            "name": "required|string",
            "email": 'required|email',
            "mobile": 'required|regex:/^([2346789]{1})([0-9]{9})$/',
            "location": 'required|string',

        }
        validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {

                res.setHeader('Content-Type', 'application/json');
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: err
                    });
            }
        });
        try {
          //  let updateObject = {};
            let errors = {};
            let isEmailExists = await db.query(`SELECT email, _id <> '${req.authInfo?.rows[0]}' FROM users`); 
            console.log("Is--->",isEmailExists?.rows);
            if (isEmailExists?.rows > 0) {
                errors = {
                    ...errors,
                    "email": [
                        "Email Must Be Uniqued"
                    ]
                }
            }
            let isMobileExists = await db.query(`SELECT mobile, _id <> '${req.authInfo?.rows[0]}' FROM users`);
            console.log("isMObileExists---->",isMobileExists?.rows[0]);
            if (isMobileExists?.rows[0] > 0) {
                errors = {
                    ...errors,
                    "mobile": [
                        "Mobile Must Be Uniqued"
                    ]
                }
            }
            if (Object.keys(errors).length > 0) {
               
                res.status(422)
                    .send({
                        success: false,
                        message: 'Errors',
                        data: {
                            "errors": errors
                        }
                    });
            } else {
            
                let name = req.body.name ? req.body.name : req.authInfo?.rows[0]?.name;
                let email= req.body.email ? req.body.email.toLowerCase() : req.authInfo?.rows[0]?.email;
                let mobile=  req.body.mobile ? req.body.mobile : req.authInfo?.rows[0]?.mobile;
                let location= req.body.location ? req.body.location : req.authInfo?.rows[0]?.location;
                let image= req.body.image ? req.body.image : req.authInfo?.rows[0]?.image;
                let dob= req.body.dob ? moment(req.body.dob).format('YYYY-MM-DD') : moment(req.authInfo?.rows[0]?.dob).format('YYYY-MM-DD');
                let wifi_name= req.body.wifi_name ? req.body.wifi_name : req.authInfo?.rows[0]?.wifi_name;
                let wifi_password= req.body.wifi_password ? req.body.wifi_password : req.authInfo?.rows[0]?.wifi_password;

                const _data = await db.query(`UPDATE users SET name = '${name}', email= '${email}',
                mobile = '${mobile}', location = '${location}', image = '${image}',dob = '${dob}',
                wifi_name = '${wifi_name}',wifi_password = '${wifi_password}' WHERE _id = '${req.authInfo?.rows[0]}' RETURNING *`);
            
               console.log("_data--->",_data);
                res.status(200).send({
                    message: "Profile Updated Successfully",
                    data: {..._data?.rows[0],dob:moment(dob).format('YYYY-MM-DD')}
                });
            }
        } catch (err) {
            console.log("Error", err)
            res.setHeader('Content-Type', 'application/json');
            res.status(422).send('Error')
        }
    },
}

module.exports = UserController;