const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/User/User')
const prefixApi = '/api/user/authorization'

module.exports = function(app) {

    //#region sign up
    app.post(prefixApi + '/sign-up', async(req, res) => {
            const object = new ObjectModel({
                user_name: helper.sanitize(req.body.user_name),
                password: helper.sanitize(req.body.password),
                name: helper.sanitize(req.body.name),
                place: helper.sanitize(req.body.place),
                identity: helper.sanitize(req.body.identity),
                date_of_birth: helper.sanitize(req.body.date_of_birth),
                national: helper.sanitize(req.body.national),
                city: helper.sanitize(req.body.city),
                district: helper.sanitize(req.body.district),
                sub_district: helper.sanitize(req.body.sub_district),
                detail: helper.sanitize(req.body.detail),
                phone: helper.sanitize(req.body.phone),
            })

            try {
                const savedObject = await object.save()
                if (savedObject) {
                    res.sendStatus(200)
                } else {
                    res.status(400).json(savedObject)
                }

            } catch (err) {
                validator.throwError(err)
                res.status(500).json(err)
            }
        })
        //#endregion

    //#region signin
    app.post(prefixApi + '/sign-in', async(req, res) => {
            try {
                const query = {
                    user_name: helper.sanitize(req.body.user_name),
                    password: helper.sanitize(req.body.password),
                }
                let user = await ObjectModel.findOne(query)
                if (user) {
                    user = {
                        ...user._doc
                    }
                    const accessToken = helper.jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                    await helper.signToken(accessToken)

                    user = {
                        ...user,
                        accessToken: accessToken
                    }

                    delete user.password
                    res.json(user)
                } else {
                    res.sendStatus(400)
                }
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    //#region logout
    app.post(prefixApi + '/logout', helper.authenToken, async(req, res) => {
            try {
                await helper.unSignToken(req.headers.token)
                res.sendStatus(200)
            } catch (err) {
                res.sendStatus(500)
                helper.throwError(err)
            }
        })
        //#endregion

    //#region update
    app.put(prefixApi, helper.authenToken, async(req, res) => {
            try {
                const query = {
                    _id: req.body._caller._id,
                }

                let objForUpdate = {}

                if (validator.isDefine(req.body.name)) objForUpdate.name = helper.sanitize(req.body.name)
                if (validator.isDefine(req.body.place)) objForUpdate.place = helper.sanitize(req.body.place)
                if (validator.isDefine(req.body.identity)) objForUpdate.identity = helper.sanitize(req.body.identity)
                if (validator.isDefine(req.body.date_of_birth)) objForUpdate.date_of_birth = helper.sanitize(req.body.date_of_birth)
                if (validator.isDefine(req.body.national)) objForUpdate.national = helper.sanitize(req.body.national)
                if (validator.isDefine(req.body.city)) objForUpdate.city = helper.sanitize(req.body.city)
                if (validator.isDefine(req.body.district)) objForUpdate.district = helper.sanitize(req.body.district)
                if (validator.isDefine(req.body.sub_district)) objForUpdate.sub_district = helper.sanitize(req.body.sub_district)
                if (validator.isDefine(req.body.detail)) objForUpdate.detail = helper.sanitize(req.body.detail)
                if (validator.isDefine(req.body.phone)) objForUpdate.phone = helper.sanitize(req.body.phone)
                objForUpdate = { $set: objForUpdate }

                const object = await ObjectModel.updateOne(query, objForUpdate)
                res.json(object)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    //#region update password
    app.put(prefixApi + '/password', helper.authenToken, async(req, res) => {
            try {
                const query = {
                    _id: helper.sanitize(req.body._caller._id),
                    password: helper.sanitize(req.body.old_password),
                }

                if (!validator.isDefine(req.body.new_password)) return res.json('Mật khẩu mới bị trống').end()

                let objForUpdate = {}
                objForUpdate.password = helper.sanitize(req.body.new_password)

                objForUpdate = { $set: objForUpdate }

                const object = await ObjectModel.findOneAndUpdate(query, objForUpdate)
                if (object) {
                    res.json(object)
                } else {
                    res.status(400).send('Mật khẩu cũ không chính xác')
                }

            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion
}