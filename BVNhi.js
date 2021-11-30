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

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))




//#region 

const xlsx = require('xlsx')
const CityModel = require('./model/City')

async function updateData() {
    const inputFilePath = './helper/abc.xlsx'
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
            city: city
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
            if (j == 3) level = contents[i][key]
            j++
        }

        contents[i] = {
            ...contents[i],
            district: district,
            sub_district: sub_district,
            level: level
        }
    }

    for (let i = 3; i < contents.length; i++) {
        const object = new CityModel({
            city: contents[i].city,
            district: contents[i].district,
            sub_district: contents[i].sub_district,
            level: contents[i].level,
        })

        
        try {
            await CityModel.findOneAndUpdate({
                city: contents[i].city,
                district: contents[i].district,
                sub_district: contents[i].sub_district,
                level: contents[i].level,
            },{
                city: contents[i].city,
                district: contents[i].district,
                sub_district: contents[i].sub_district,
                level: contents[i].level,
            },{ upsert: true, new: true, setDefaultsOnInsert: true })
        } catch (err) {
            console.log(contents[i])
        }
    }
}



app.get('/', async(req, res) => {

   // await updateData()

        try {
            let query = {}

            if (req.query.search) {
                query = {
                    ...query,
                    $or: [{ city: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } }, { district: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } }, { sub_distric: { $regex: ".*" + (req.query.search) + ".*", $options: "$i" } }]
                }
            }


            const limit = Math.min(100, parseInt(req.query.limit)) || 10
            const page = Math.max(parseInt(req.query.page), 1) || 1


            const objects = await CityModel.find(query).limit(limit).skip(limit * (page - 1))
            const total = await CityModel.countDocuments(query)


            res.json({
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