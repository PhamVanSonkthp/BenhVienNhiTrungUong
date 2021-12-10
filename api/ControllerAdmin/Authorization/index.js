const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/Admin/Admin')
const prefixApi = '/api/admin/authorization'

module.exports = function(app) {

    //#region sign up
    app.post(prefixApi + '/sign-up', async(req, res) => {
            const object = new ObjectModel({
                user_name: helper.sanitize(req.body.user_name),
                password: helper.sanitize(req.body.password),
            })

            try {
                const savedObject = await object.save()
                if (savedObject) {
                    res.sendStatus(200)
                } else {
                    res.status(400).json(savedObject)
                }

            } catch (err) {
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
                    res.json({ accessToken })
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

    //#region update password
    app.put(prefixApi + '/password', helper.authenToken, async(req, res) => {
            try {
                const query = {
                    _id: helper.sanitize(req.body._caller._id),
                }

                let objForUpdate = {}
                objForUpdate.password = helper.sanitize(req.body.password)

                objForUpdate = { $set: objForUpdate }

                const object = await ObjectModel.findOneAndUpdate(query, objForUpdate)
                res.json(object)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion
}