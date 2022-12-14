const bcrypt = require('bcrypt')
const db = require('../db/database')
const {checkUserExistance} = require('../utils/dbFunctions')
const createError = require('http-errors')

class userService {
    async getFullName(userId) {
        let sql = `select name, surname from user where id = ${userId}`
        const [rows, _] = await db.execute(sql)
        const fullName = `${rows[0].name} ${rows[0].surname}`
        return fullName
    }

    async getUserInfo(userId, next) {
        const isUser = await checkUserExistance('id', userId)
        if(!isUser) return next(createError.BadRequest('User not found'))

        let sql = `select name, surname, email, phone from user where id = ${userId}`
        const [rows, _] = await db.execute(sql)

        const user = rows[0]

        const userInfo = {
            fullName: `${user.name} ${user.surname}`,
            email: user.email,
            phone: user.phone
        }

        return userInfo
    }

    async updatePassword(userInfo, next){
        try
        {
            const {email, newPassword} = userInfo

            const isUser = await checkUserExistance('email', email)
            if(!isUser) return next(createError.BadRequest('User not found'))

            const hashedNewPassword = bcrypt.hashSync(newPassword, 10)

            let sql = `update user set password = '${hashedNewPassword}' where email = '${email}'`
            await db.execute(sql)

            return isUser
        }
        catch (err) {
            console.log(err.message)
        }
    }

    async delete(userInfo, next) {
        try {
            const {email} = userInfo

            const isUser = await checkUserExistance('email', email)
            if(!isUser) return next(createError.BadRequest('User not found'))

            let sql = `delete from user where email = '${email}'`
            await db.execute(sql)

            return true
        }
        catch (err){
            console.error(err.message)
        }
    }
}

module.exports = new userService()
