const helper = require('./../../../helper/helper')
const validator = require('./../../../helper/validator')
const ObjectModel = require('./../../../model/Profile/Profile')
const multer = require('multer')
const path = require('path')
const xlsx = require('xlsx')
const prefixApi = '/api/profile/information'
module.exports = function(app) {


    //#region get
    app.get(prefixApi, async(req, res) => {
            try {

                const limit = Math.min(100, parseInt(req.query.limit)) || 10
                const page = Math.max(parseInt(req.query.page), 1) || 1
                const q = helper.sanitize(req.query.q)

                let query = {}

                if (validator.isDefine(q)) {
                    query = {
                        $or: [
                            { name: { $regex: ".*" + q.trim() + ".*", $options: "$i" } },
                            { identity: { $regex: ".*" + q.trim() + ".*", $options: "$i" } },
                            { barcode: { $regex: ".*" + q.trim() + ".*", $options: "$i" } },
                            { phone: { $regex: ".*" + q.trim() + ".*", $options: "$i" } },
                        ]
                    }
                }

                const objects = await ObjectModel.find(query).limit(limit).skip(limit * (page - 1))
                const total = await ObjectModel.countDocuments(query)

                res.json({
                    key_word: req.query.q || '',
                    total: total,
                    page: page,
                    limit: limit,
                    data: objects
                }).end()

            } catch (error) {
                console.error(error)
                    //helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion


    // //#region update level city
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

    //#region update zone
    app.post(prefixApi + '/files', helper.authenToken, async(req, res) => {
            try {
                return uploadFiles(req, res)
            } catch (error) {
                helper.throwError(error)
                res.status(500).json(error)
            }
        })
        //#endregion

    async function uploadFiles(req, res) {
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



            let upload = multer({ storage: storage }).array('avatar', 1000);
            upload(req, res, function(err) {
                (async() => {
                    const results = await updateData(arrayFiles)

                    for (let i = 0; i < results.length; i++) {
                        try {
                            const object = await ObjectModel.findOneAndUpdate({
                                barcode: helper.sanitize(results[i]['Barcode']),
                                phone: helper.sanitize(results[i]['Số điện thoại']),
                            }, {
                                barcode: helper.sanitize(results[i]['Barcode']),
                                identity: helper.sanitize(results[i]['CMT/CCCD']),
                                note: helper.sanitize(results[i]['Ghi Chú']),
                                gender: helper.sanitize(results[i]['Giới tính']),
                                name: helper.sanitize(results[i]['Họ và tên']),
                                result: helper.sanitize(results[i]['Kết quả']),
                                type: helper.sanitize(results[i]['Loại mẫu']),
                                type_object: helper.sanitize(results[i]['Loại đối tượng']),
                                number_testing: helper.sanitize(results[i]['Lần xét nghiệm']),
                                code_form: helper.sanitize(results[i]['Mã PXN']),
                                date_collection: helper.sanitize(results[i]['Ngày lấy mẫu']),
                                date_testing: helper.sanitize(results[i]['Ngày xét nghiệm']),
                                date_of_birth: helper.sanitize(results[i]['Năm sinh']),
                                method_testing: helper.sanitize(results[i]['Phương Pháp Xét Nghiệm']),
                                district: helper.sanitize(results[i]['Quận/Huyện']),
                                no: helper.sanitize(results[i]['STT']),
                                phone: helper.sanitize(results[i]['Số điện thoại']),
                                city: helper.sanitize(results[i]['Tỉnh/Thành Phố']),
                                sub_district: helper.sanitize(results[i]['Xã/Phường']),
                                address: helper.sanitize(results[i]['Địa chỉ']),
                                id: helper.sanitize(results[i]['Barcode']) + '_' + helper.sanitize(results[i]['Số điện thoại']),
                            }, { upsert: true, new: true, setDefaultsOnInsert: true })

                            results[i]._id = object._id
                            results[i].number_form = object.number_form
                        } catch (err) {
                            validator.throwError(err)
                            return res.status(400).json(err)
                                // console.log(contents[i])
                        }
                    }

                    res.json(results)
                })()
            })
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    }

    async function updateData(arrayFiles) {

        let results = []
        for (let q = 0; q < arrayFiles.length; q++) {
            const inputFilePath = './public/files/' + arrayFiles[q]
            let File = await xlsx.readFile(inputFilePath)

            let excelRows = await xlsx.utils.sheet_to_json(File.Sheets[File.SheetNames[1]], { range: 5 })

            let stt_prime, bar_code_prime, ma_pxn_prime = '',
                loai_mau_prime = '',
                hova_ten_prime, nam_sinh_prime, gioi_tinh_prime, so_dien_thoai_prime, cccd_prime, dia_chi_prime, xa_phuong_prime, quan_huyen_prime, tinh_thanh_pho_prime, loai_doi_tuong_prime, ngay_lay_mau_prime, lan_xet_nghiem_prime, ngay_xet_nghiem_prime, phuong_phap_xet_nghiem_prime, ket_qua_prime, ct_value_prime, ghi_chu_prime

            for (let i = 0; i < excelRows.length; i++) {

                ma_pxn_prime = excelRows[i]['Mã PXN'] || ma_pxn_prime
                loai_mau_prime = excelRows[i]['Loại mẫu'] || loai_mau_prime

                excelRows[i]['Mã PXN'] = ma_pxn_prime
                excelRows[i]['Loại mẫu'] = loai_mau_prime
            }

            results.push(...excelRows)


            // let city = contents[2][0]
            // let district

            // let key
            // for (key in contents[2]) {
            //     city = contents[2][key]
            //     break
            // }

            // for (let i = 3; i < contents.length; i++) {
            //     contents[i] = {
            //         ...contents[i],
            //         city: city,
            //         slug_city: validator.viToEn(city),
            //     }

            //     let key

            //     let sub_district
            //     let level
            //     let j = 0
            //     for (key in contents[i]) {
            //         if (j == 0) {
            //             district = contents[i][key] || district
            //         }
            //         if (j == 2) sub_district = contents[i][key]
            //         if (j == 3) level = validator.getOnlyNumber(contents[i][key])
            //         j++
            //     }

            //     contents[i] = {
            //         ...contents[i],
            //         district: district,
            //         slug_district: validator.viToEn(district),
            //         sub_district: sub_district,
            //         slug_sub_district: validator.viToEn(sub_district),
            //         level: level
            //     }
            // }

            // for (let i = 3; i < contents.length; i++) {
            //     try {
            //         await CityModel.findOneAndUpdate({
            //             city: contents[i].city,
            //             district: contents[i].district,
            //             sub_district: contents[i].sub_district,
            //         }, {
            //             city: contents[i].city,
            //             slug_city: contents[i].slug_city,
            //             district: contents[i].district,
            //             slug_district: contents[i].slug_district,
            //             sub_district: contents[i].sub_district,
            //             slug_sub_district: contents[i].slug_sub_district,
            //             slug_all: contents[i].slug_sub_district + ' ' + contents[i].slug_district + ' ' + contents[i].slug_city,
            //             level: contents[i].level,
            //         }, { upsert: true, new: true, setDefaultsOnInsert: true })
            //     } catch (err) {
            //         // console.log(contents[i])
            //     }
            // }
        }

        return results
    }
}