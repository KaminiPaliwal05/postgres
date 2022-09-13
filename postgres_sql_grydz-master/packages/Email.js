var nodemailer = require("nodemailer");
const {join} = require('path')
var templatePath = join(__dirname, '../../../', '/grydz/views/emails');
let emailTemplate = require('email-templates');
let ejs = require('ejs');

exports.EmailSend = async function(emailData, emailContent) {
    console.log("mail send arrived--->");
    console.log("emailData--->",emailData);
    console.log("emailContent--->",emailContent);
    let  transporter =nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "noreply@hoicko.com",
            pass: "Hoicko@noreply1"
        },
    });

    try{
        let mailObject = {
            from:emailData['from'] ? emailData['from'] :'"Lalit 👻" <lalitn.novelerp@gmail.com>',
            to: emailData['to'],
            subject: "OTP From Solarbess"
        }

        await new emailTemplate({
            views: {
                options: {
                  extension: 'ejs'
                }
              }
        }).render({
            path:join(templatePath, `/${emailContent['template_name']}`)
        },
        {
              otp:emailData['otp']
        }
        ).then((result) => {
            console.log("join(templatePath, `/${emailContent['template_name']}`)", join(templatePath, `/${emailContent['template_name']}`))
            mailObject = {
                ...mailObject,
                html: result,
            };
        }).catch((err)=>{
            console.log("mail template error", err)
        });
        let info = await transporter.sendMail(mailObject);
        console.log("info-->",info);
        return info;
    }catch(err){
        console.log("err-->",err);
        return "Welcome mail send";
    }
}




