const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options={} ) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const mailOptions = {
    from: 'Emad Ahmed <emad1997@gmail.com>',
    to: options.user.email,
    subject: options.subject,
    html: html,
    text: htmlToText.fromString(html),
    filename: 'password-reset'
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}