const { security } = require('../config/email')

module.exports.accountVerification = async function (data) {
    try {
        security.sendMail({
            from: `TrooHQ ${security.options.auth.user}`,
            to: data.email, 
           subject: `Account verification`,
            template: 'account_verification_email',
            context: {
               ...data
            },
        })
        console.error(`Email sent to: ${data.email}`)
    } catch (error) {
        console.error('Error sending email', error)
    }
}

