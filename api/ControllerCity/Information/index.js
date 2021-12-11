const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/City/City')
const multer = require('multer')
const path = require('path')
const xlsx = require('xlsx')
const prefixApi = '/api/city/information'
module.exports = function(app) {


    //#region get infor user
    app.get(prefixApi, async(req, res) => {
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

                objects = await ObjectModel.find(querySearch).limit(10000)
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


    //#region update level city
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

    //#region update zone
    app.post(prefixApi + '/update-zone', helper.authenToken, async(req, res) => {
            try {
                return updateZone(req, res)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    async function updateZone(req, res) {
        try {

            let counter = 0
            const pathStorage = 'public/files/'

            let arrayFiles = []

            const storage = multer.diskStorage({
                destination: function(req, file, cb) {
                    cb(null, pathStorage);
                },
                filename: function(req, file, cb) {
                    const date = Date.now().toString() + counter++
                        arrayFiles.push(file.fieldname + '-' + date + path.extname(file.originalname))
                    cb(null, file.fieldname + '-' + date + path.extname(file.originalname))

                }
            })



            let upload = multer({ storage: storage }).array('avatar', 100);
            upload(req, res, function(err) {
                (async() => {
                    console.log(arrayFiles)
                    await updateData(arrayFiles)
                    res.sendStatus(200)
                })()
            })
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    }

    async function updateData(arrayFiles) {
        for (let q = 0; q < arrayFiles.length; q++) {
            const inputFilePath = './public/files/' + arrayFiles[q]
            let File = await xlsx.readFile(inputFilePath);
            let contents = await xlsx.utils.sheet_to_json(File.Sheets[File.SheetNames[0]])

            let city = contents[2][0]
            let district

            let key
            for (key in contents[2]) {
                city = contents[2][key]
                break
            }

            for (let i = 3; i < contents.length; i++) {
                contents[i] = {
                    ...contents[i],
                    city: city,
                    slug_city: validator.viToEn(city),
                }

                let key

                let sub_district
                let level
                let j = 0
                for (key in contents[i]) {
                    if (j == 0) {
                        district = contents[i][key] || district
                    }
                    if (j == 2) sub_district = contents[i][key]
                    if (j == 3) level = validator.getOnlyNumber(contents[i][key])
                    j++
                }

                contents[i] = {
                    ...contents[i],
                    district: district,
                    slug_district: validator.viToEn(district),
                    sub_district: sub_district,
                    slug_sub_district: validator.viToEn(sub_district),
                    level: level
                }
            }

            for (let i = 3; i < contents.length; i++) {
                try {
                    await CityModel.findOneAndUpdate({
                        city: contents[i].city,
                        district: contents[i].district,
                        sub_district: contents[i].sub_district,
                    }, {
                        city: contents[i].city,
                        slug_city: contents[i].slug_city,
                        district: contents[i].district,
                        slug_district: contents[i].slug_district,
                        sub_district: contents[i].sub_district,
                        slug_sub_district: contents[i].slug_sub_district,
                        slug_all: contents[i].slug_sub_district + ' ' + contents[i].slug_district + ' ' + contents[i].slug_city,
                        level: contents[i].level,
                    }, { upsert: true, new: true, setDefaultsOnInsert: true })
                } catch (err) {
                    // console.log(contents[i])
                }
            }
        }

    }
}