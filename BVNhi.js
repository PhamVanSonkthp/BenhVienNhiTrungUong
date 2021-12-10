require('dotenv/config')
const express = require('express')
const app = express()
const logger = require('morgan')
require('./database')
const server = require('http').createServer(app)
const cors = require('cors')

app.set('views', './view')
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))
app.use(express.static(__dirname))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: false }))

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))



//#region Controller

const controllerAdmin = require('./controller/ControllerAdmin')
controllerAdmin.createControllerAdmin(app)

const controllerCity = require('./controller/ControllerCity')
controllerCity.createControllerCity(app)

//#endregion

//#region router

const routerAdmin = require('./route/admin')
app.use(routerAdmin)

//#endregion













































const validator = require('./helper/validator')
    //#region 

const multer = require('multer')
const path = require('path')
const xlsx = require('xlsx')
const CityModel = require('./model/City/City')

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

app.post('/update-zone', async(req, res) => {
    return updateZone(req, res)
})

app.get('/home', async(req, res) => {
    try {
        res.render('home')
    } catch (e) {

    }
})

function counterChacterInString(child, parent) {
    let counter = 0

    if (!child || !parent) return 0
        // child = Array.from(new Set(child)).join('')
        // for (let i = 0; i < child.length; i++) {
        //     if(parent.includes(child[i])) counter++
        // }

    const childs = child.split(',')

    for (let i = 0; i < childs.length; i++) {

        if (parent.includes(childs[i])) counter += 10

        //counter += (parent.match(new RegExp(childs[i].trim(), "g")) || []).length

        // if ((parent.match(new RegExp(',' + childs[i].trim(), "g")) || []).length) {
        //     counter += (parent.match(new RegExp(childs[i].trim() + ',', "g")) || []).length * 10
        // }
    }

    return counter
}


app.get('/', async(req, res) => {
        try {

            const limit = Math.min(100, parseInt(req.query.limit)) || 10
            const page = Math.max(parseInt(req.query.page), 1) || 1

            if (!validator.isDefine(req.query.search) || !req.query.search.trim().length) {
                let objects = await CityModel.find().limit(limit).skip(limit * (page - 1))

                return res.json({
                    key_word: req.query.search || '',
                    //total: total,
                    page: page,
                    limit: limit,
                    data: objects
                }).end()
            }

            let querySearch = {
                slug_all: { $regex: ".*" + validator.viToEn(req.query.search.replaceAll('  ', ' ').replaceAll(',', '').trim()) + ".*", $options: "$i" }
            }

            let objects = await CityModel.find(querySearch).limit(limit).skip(limit * (page - 1))

            if (objects.length) {
                return res.json({
                    key_word: req.query.search || '',
                    //total: total,
                    page: page,
                    limit: limit,
                    data: objects
                }).end()
            }

            // querySearch = {
            //     $or : [
            //         {slug_sub_district: {$regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" }},
            //         {slug_district: {$regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" } },
            //         {slug_city: {$regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" } },
            // ]}

            // objects = await CityModel.find(querySearch).limit(limit).skip(limit * (page - 1))

            // if(objects.length) {
            //     return res.json({
            //         key_word: req.query.search || '',
            //         //total: total,
            //         page: page,
            //         limit: limit,
            //         data: objects
            //     }).end()
            // }


            // querySearch = {
            //     $or : [
            //         { slug_sub_district: new RegExp( validator.viToEn(req.query.search).split(' ')[validator.viToEn(req.query.search).split(' ').length-1] +'$') },
            //         { slug_district: new RegExp( validator.viToEn(req.query.search).split(' ')[validator.viToEn(req.query.search).split(' ').length-1] +'$') },
            //         { slug_city: new RegExp( validator.viToEn(req.query.search).split(' ')[validator.viToEn(req.query.search).split(' ').length-1] +'$') }
            // ]}

            // objects = await CityModel.find(querySearch).limit(limit).skip(limit * (page - 1))

            // if(objects.length) {
            //     return res.json({
            //         key_word: req.query.search || '',
            //         //total: total,
            //         page: page,
            //         limit: limit,
            //         data: objects
            //     }).end()
            // }


            const searches = req.query.search.replaceAll(',', ' ').replaceAll('  ', ' ').split(' ')
            querySearch = []

            for (let i = 0; i < searches.length; i++) {
                querySearch.push({ $or: [{ slug_sub_district: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_sub_district: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, { $or: [{ slug_district: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_district: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, { $or: [{ slug_city: new RegExp('^' + validator.viToEn(searches[i])) }, { slug_city: new RegExp(validator.viToEn(searches[i]) + '$') }, ] }, )
            }

            objects = await CityModel.find({ $or: querySearch }).limit(1000)

            //let objects = await CityModel.find({$or : querySearch}).limit(limit).skip(limit * (page - 1))
            //let total = await CityModel.countDocuments(query)

            // if (total < limit) {
            //     const searches = req.query.search.split(' ')
            //     let querySearch = []

            //     for (let i = 0; i < searches.length; i++) {
            //         querySearch.push({ city: { $regex: ".*" + (searches[i]) + ".*", $options: "$i" } }, { district: { $regex: ".*" + (searches[i]) + ".*", $options: "$i" } }, { sub_district: { $regex: ".*" + (searches[i]) + ".*", $options: "$i" } }, { slug_city: { $regex: ".*" + validator.viToEn(searches[i]) + ".*", $options: "$i" } }, { slug_district: { $regex: ".*" + validator.viToEn(searches[i]) + ".*", $options: "$i" } }, { slug_sub_district: { $regex: ".*" + validator.viToEn(searches[i]) + ".*", $options: "$i" } })
            //     }

            //     let objectsMore = await CityModel.find({ $or: querySearch }).sort(sort).limit(limit).skip(limit * (page - 1))
            //     let totalMore = objectsMore.length

            //     objects.push(...objectsMore)
            //     total += totalMore
            // }

            for (let i = 0; i < objects.length; i++) {
                objects[i] = {
                    ...objects[i]._doc,
                    stt: counterChacterInString(validator.viToEn(req.query.search).replaceAll('  ', ' ').replaceAll(' ', ','), objects[i]._doc.slug_all)
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
                key_word: req.query.search || '',
                //total: total,
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

//#endregion


server.listen(process.env.PORT || 5000)
console.log('server listening port : ' + (process.env.PORT || 5000))