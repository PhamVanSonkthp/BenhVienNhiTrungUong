const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/Admin/Admin')
const UserModel = require('./../../../model/User/User')

const prefixApi = '/api/admin/user'
module.exports = function(app) {

    // //#region sign up
    // app.post(prefixApi + '/signup', async(req, res) => {
    //         const object = new ObjectModel({
    //             user_name: helper.sanitize(req.body.user_name),
    //             password: helper.sanitize(req.body.password),
    //         })

    //         try {
    //             const savedObject = await object.save()
    //             if (savedObject) {
    //                 res.json(savedObject)
    //             } else {
    //                 res.status(400).json(savedObject)
    //             }

    //         } catch (err) {
    //             res.status(500).json(err)
    //         }
    //     })
    //     //#endregion

    // //#region update
    // app.put(prefixApi, helper.authenToken, async(req, res) => {
    //         try {
    //             let objForUpdate = {}
    //             if (validator.isDefine(req.body.name)) objForUpdate.name = helper.sanitize(req.body.name)
    //             if (validator.isDefine(req.body.gender)) objForUpdate.gender = helper.sanitize(req.body.gender)
    //             if (validator.isDefine(req.body.date_of_birth)) objForUpdate.date_of_birth = helper.sanitize(req.body.date_of_birth)
    //             if (validator.isDefine(req.body.identity)) objForUpdate.identity = helper.tryParseJson(req.body.identity)
    //             if (validator.isDefine(req.body.phone)) objForUpdate.phone = helper.sanitize(req.body.phone)
    //             if (validator.isDefine(req.body.address)) objForUpdate.address = helper.sanitize(req.body.address)
    //             if (validator.isDefine(req.body.password)) objForUpdate.password = helper.sanitize(req.body.password)
    //             if (validator.isDefine(req.body.uuid)) objForUpdate.uuid = helper.sanitize(req.body.uuid)

    //             objForUpdate = { $set: objForUpdate }

    //             const object = await ObjectModel.updateOne({ _id: req.body._caller._id }, objForUpdate);
    //             res.json(object);
    //         } catch (err) {
    //             helper.throwError(err)
    //             res.status(500).json(err)
    //         }

    //     })
    //     //#endregion


    // //#region signin
    // app.post(prefixApi + '/signin', async(req, res) => {
    //         try {
    //             const query = {
    //                 user_name: helper.sanitize(req.body.user_name),
    //                 password: helper.sanitize(req.body.password),
    //             }
    //             let user = await ObjectModel.findOne(query)
    //             if (user) {
    //                 user = {
    //                     ...user._doc
    //                 }
    //                 const accessToken = helper.jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    //                 await helper.signToken(accessToken)
    //                 res.json({ accessToken })
    //             } else {
    //                 res.sendStatus(400)
    //             }
    //         } catch (error) {
    //             helper.throwError(error)
    //             res.status(500).json(error)
    //         }
    //     })
    //     //#endregion

    // //#region logout
    // app.post(prefixApi + '/logout', helper.authenToken, async(req, res) => {
    //         try {
    //             await helper.unSignToken(req.headers.token)
    //             res.sendStatus(200)
    //         } catch (err) {
    //             res.sendStatus(500)
    //             helper.throwError(err)
    //         }
    //     })
    //     //#endregion

    //#region get users
    app.get(prefixApi, helper.authenToken, async(req, res) => {
            try {
                const query = {
                    
                }

                const limit = Math.min(100, validator.tryParseInt(req.query.limit)) || 10
                const page = Math.max(validator.tryParseInt(req.query.page), 1)

                const objects = await UserModel.find(query).limit(limit).skip(limit * (page - 1))
                const total = await UserModel.countDocuments(query)


                res.json({
                    total: total,
                    page: page,
                    limit: limit,
                    data: objects
                })

            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion
}