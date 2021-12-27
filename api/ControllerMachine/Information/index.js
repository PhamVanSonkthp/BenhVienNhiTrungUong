const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/Machine/Machine')
const prefixApi = '/api/machine/information'

module.exports = function(app) {

    //#region sign up
    app.post(prefixApi, helper.authenToken, async(req, res) => {
            try {
                const object = new ObjectModel({
                    name: helper.sanitize(req.body.name),
                    code: helper.sanitize(req.body.code),
                    place: helper.sanitize(req.body.place),
                    status: helper.sanitize(req.body.status),
                    history: helper.sanitize(req.body.history),
                })

                try {
                    const savedObject = await object.save()
                    res.json(savedObject)
                } catch (err) {
                    res.status(400).json(err)
                }
            } catch (err) {
                res.status(500).json(err)
            }
        })
        //#endregion


    //#region update
    app.put(prefixApi + '/:objectId', helper.authenToken, async(req, res) => {
            try {
                const query = {
                    _id: helper.sanitize(req.params.objectId),
                }

                let objForUpdate = {}
                if (validator.isDefine(req.body.name)) objForUpdate.name = helper.sanitize(req.body.name)
                if (validator.isDefine(req.body.code)) objForUpdate.code = helper.sanitize(req.body.code)
                if (validator.isDefine(req.body.place)) objForUpdate.place = helper.sanitize(req.body.place)
                if (validator.isDefine(req.body.status)) objForUpdate.status = helper.sanitize(req.body.status)
                if (validator.isDefine(req.body.history)) objForUpdate.history = helper.sanitize(req.body.history)

                objForUpdate = { $set: objForUpdate }

                try {
                    const object = await ObjectModel.updateOne(query, objForUpdate)
                    res.json(object)
                } catch (err) {
                    res.status(400).json(err)
                }

            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    //#region delete
    app.delete(prefixApi + '/:objectId', helper.authenToken, async(req, res) => {
            // try {
            //     const query = {
            //         _id: helper.sanitize(req.params.objectId),
            //     }

            //     let objForUpdate = {}
            //     objForUpdate.status = -1

            //     try {
            //         const object = await ObjectModel.updateOne(query, objForUpdate)
            //         res.json(object)
            //     } catch (err) {
            //         res.status(400).json(err)
            //     }

            // } catch (error) {
            //     helper.throwError(error)
            //     res.status(500).json(error)
            // }

            try {
                const query = {
                    _id: helper.sanitize(req.params.objectId),
                }

                try {
                    const object = await ObjectModel.deleteOne(query)
                    res.json(object)
                } catch (err) {
                    res.status(400).json(err)
                }

            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    //#region get
    app.get(prefixApi, helper.authenToken, async(req, res) => {
            try {
                let query = {}

                if (validator.isDefine(req.query.q)) {
                    query = {
                        ...query,
                        $or: [
                            { name: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                            { code: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                            { place: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                        ]
                    }
                }

                const limit = Math.min(100, validator.tryParseInt(req.query.limit)) || 10
                const page = Math.max(validator.tryParseInt(req.query.page), 1)

                try {
                    const objects = await ObjectModel.find(query).limit(limit).skip(limit * (page - 1))
                    const total = await ObjectModel.countDocuments(query)

                    res.json({
                        key: req.query.q || '',
                        total: total,
                        page: page,
                        limit: limit,
                        data: objects
                    })
                } catch (err) {
                    res.status(400).json(err)
                }
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion  
}