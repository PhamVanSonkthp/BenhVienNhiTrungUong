const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/HealthDeclaretion/HealthDeclaretion')
const prefixApi = '/api/health-declaretion/information'
module.exports = function(app) {

    //#region get infor
    app.get(prefixApi, async(req, res) => {
            try {

                const limit = Math.min(100, parseInt(req.query.limit)) || 10
                const page = Math.max(parseInt(req.query.page), 1) || 1

                let query = {}
                if (validator.isDefine(req.query.q) && req.query.q.length) {
                    query = {
                        ...query,
                        $or: [
                            { name: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                            { phone: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                            { identity: { $regex: ".*" + helper.sanitize(req.query.q) + ".*", $options: "$i" } },
                        ]
                    }
                }


                const objects = await ObjectModel.find(query).limit(limit).skip(limit * (page - 1)).lean()
                const total = await ObjectModel.countDocuments(query)

                res.json({
                    key_word: req.query.q || '',
                    total: total,
                    page: page,
                    limit: limit,
                    data: objects
                })
            } catch (error) {
                console.error(error)
                    //helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    //#region get QR
    app.get(prefixApi + '/QR', async(req, res) => {
            try {

                res.json({
                    'qr': 'https://benhviennhitrunguong.gov.vn/'
                })
            } catch (error) {
                console.error(error)
                    //helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    // //#region update
    // app.put(prefixApi + '/:objectId', helper.authenToken, async(req, res) => {
    //         try {
    //             const query = {
    //                 _id: req.params.objectId,
    //             }

    //             let objForUpdate = {}

    //             if (validator.isDefine(req.body.level)) objForUpdate.level = helper.sanitize(req.body.level)
    //             objForUpdate = { $set: objForUpdate }

    //             const object = await ObjectModel.updateOne(query, objForUpdate)
    //             res.json(object)
    //         } catch (error) {
    //             helper.throwError(error)
    //             res.status(500).json(error)
    //         }
    //     })
    //     //#endregion

    //#region post
    app.post(prefixApi, async(req, res) => {
            try {
                const object = new ObjectModel({
                    name: helper.sanitize(req.body.name),
                    phone: helper.sanitize(req.body.phone),
                    birth_of_day: helper.sanitize(req.body.birth_of_day),
                    identity: helper.sanitize(req.body.identity),
                    city: helper.sanitize(req.body.city),
                    district: helper.sanitize(req.body.district),
                    sub_district: helper.sanitize(req.body.sub_district),
                    details: helper.sanitize(req.body.details),
                    mores: helper.sanitize(req.body.mores),
                })

                const savedObject = await object.save()
                res.json(savedObject)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

}