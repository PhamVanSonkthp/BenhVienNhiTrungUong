require('dotenv/config')
const express = require('express')
const app = express()
const logger = require('morgan')
require('./database-bv-nhi')
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

const validator = require('./helper/validator')
    //#region 

const multer = require('multer')
const path = require('path')
const xlsx = require('xlsx')
const CityModel = require('./model/City')

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
                    level: contents[i].level,
                }, {
                    city: contents[i].city,
                    slug_city: contents[i].slug_city,
                    district: contents[i].district,
                    slug_district: contents[i].slug_district,
                    sub_district: contents[i].sub_district,
                    slug_sub_district: contents[i].slug_sub_district,
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

app.get('/', async(req, res) => {
        try {
            let query = {}

            if (req.query.search) {
                query = {
                    ...query,
                    // city : '/'+req.query.search+'/'
                    $or: [
                        { city: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } }, { district: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } }, { sub_district: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } },
                        { slug_city: { $regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" } }, { slug_district: { $regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" } }, { slug_sub_district: { $regex: ".*" + validator.viToEn(req.query.search) + ".*", $options: "$i" } }
                    ]
                }
            }

            const limit = Math.min(100, parseInt(req.query.limit)) || 10
            const page = Math.max(parseInt(req.query.page), 1) || 1


            const sort = {
                sub_district: -1,
                district: -1,
                city: -1,
            }
            const objects = await CityModel.find(query).sort(sort).limit(limit).skip(limit * (page - 1))
            const total = await CityModel.countDocuments(query)

            res.json({
                key_word: req.query.search || '',
                total: total,
                page: page,
                limit: limit,
                data: objects
            })
        } catch (error) {
            //helper.throwError(error)
            res.status(500).json(error)
        }
    })
    //#endregion

//#endregion

server.listen(8005)
console.log('server listening port : ' + (8005))