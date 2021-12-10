const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/City/City')

const prefixApi = '/api/city/information'
module.exports = function(app) {


    //#region get infor user
    app.get(prefixApi, helper.authenToken, async(req, res) => {
            try {

                const limit = Math.min(100, parseInt(req.query.limit)) || 10
                const page = Math.max(parseInt(req.query.page), 1) || 1
                const level = validator.tryParseInt(req.query.level)

                if (!validator.isDefine(req.query.q) || !req.query.q.trim().length) {

                    let query = {}
                    if (validator.isDefine(level) && level) {
                        query = {
                            ...query,
                            level: level
                        }
                    }

                    let objects = await ObjectModel.find(query).limit(limit).skip(limit * (page - 1))
                    const total = await ObjectModel.countDocuments(query)

                    return res.json({
                        key_word: req.query.q || '',
                        total: total,
                        page: page,
                        limit: limit,
                        data: objects
                    }).end()
                }

                let querySearch = {
                    slug_all: { $regex: ".*" + validator.viToEn(req.query.q.replaceAll('  ', ' ').replaceAll(',', '').trim()) + ".*", $options: "$i" }
                }

                if (validator.isDefine(level) && level) {
                    querySearch = {
                        ...querySearch,
                        level: level
                    }
                }

                let objects = await ObjectModel.find(querySearch).limit(limit).skip(limit * (page - 1))
                let total = await ObjectModel.countDocuments(querySearch)

                if (objects.length) {
                    return res.json({
                        key_word: req.query.q || '',
                        total: total,
                        page: page,
                        limit: limit,
                        data: objects
                    }).end()
                }

                const searches = req.query.q.replaceAll(',', ' ').replaceAll('  ', ' ').split(' ')
                querySearch = []

                for (let i = 0; i < searches.length; i++) {
                    querySearch.push({ $or: [{ slug_sub_district: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_sub_district: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, { $or: [{ slug_district: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_district: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, { $or: [{ slug_city: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_city: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, )
                }

                querySearch = {
                    $or: querySearch
                }

                if (validator.isDefine(level) && level) {
                    querySearch = {
                        ...querySearch,
                        level: level
                    }
                }

                objects = await ObjectModel.find(querySearch).limit(1000)
                total = await ObjectModel.countDocuments(querySearch)

                for (let i = 0; i < objects.length; i++) {
                    objects[i] = {
                        ...objects[i]._doc,
                        stt: validator.counterChacterInString(validator.viToEn(req.query.q).replaceAll('  ', ' ').replaceAll(' ', ','), objects[i]._doc.slug_all)
                    }
                }

                objects.sort(function(a, b) {
                    return b.stt - a.stt
                })

                let objectsFinal = []

                for (let i = 0; i < objects.length && i < limit; i++) {
                    objectsFinal.push(objects[i])
                }


                res.json({
                    key_word: req.query.q || '',
                    total: total,
                    page: page,
                    limit: limit,
                    data: objectsFinal
                })
            } catch (error) {
                console.error(error)
                    //helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion


    //#region update password
    app.put(prefixApi + '/:objectId', helper.authenToken, async(req, res) => {
            try {
                const query = {
                    _id: req.params.objectId,
                }

                let objForUpdate = {}

                if (validator.isDefine(req.body.level)) objForUpdate.level = helper.sanitize(req.body.level)
                objForUpdate = { $set: objForUpdate }

                const object = await ObjectModel.updateOne(query, objForUpdate)
                res.json(object)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion
}