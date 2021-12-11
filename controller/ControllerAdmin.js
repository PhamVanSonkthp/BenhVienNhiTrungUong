const authorization = require('../api/ControllerAdmin/Authorization')

const AdminModel = require('../model/Admin/Admin')
const CityModel = require('../model/City/City')
const validator = require('../helper/validator')

exports.createControllerAdmin = function createControllerAdmin(app) {
    authorization(app)
}

exports.sign_in = async function(req, res) {
    res.render('admin/sign-in')
}

exports.home = async function(req, res) {
    res.render('admin/sign-in')
}

// exports.dashboard = async function(req, res) {

//     let object = [{
//             city: [],
//             district: [],
//             sub_district: [],
//             level: 1
//         },
//         {
//             city: [],
//             district: [],
//             sub_district: [],
//             level: 2
//         },
//         {
//             city: [],
//             district: [],
//             sub_district: [],
//             level: 3
//         },
//         {
//             city: [],
//             district: [],
//             sub_district: [],
//             level: 4
//         }
//     ]

//     try {
//         const objects = await CityModel.find()

//         for (let i = 0; i < objects.length; i++) {
//             if (objects[i].level == 1) {
//                 if (!object[0].city.includes(objects[i].city)) {
//                     object[0].city.push(objects[i].city)
//                 }

//                 if (!object[0].district.includes(objects[i].district)) {
//                     object[0].district.push(objects[i].district)
//                 }


//                 object[0].sub_district.push(objects[i].sub_district)
//             } else if (objects[i].level == 2) {
//                 if (!object[1].city.includes(objects[i].city)) {
//                     object[1].city.push(objects[i].city)
//                 }

//                 if (!object[1].district.includes(objects[i].district)) {
//                     object[1].district.push(objects[i].district)
//                 }

//                 object[1].sub_district.push(objects[i].sub_district)
//             } else if (objects[i].level == 3) {
//                 if (!object[2].city.includes(objects[i].city)) {
//                     object[2].city.push(objects[i].city)
//                 }

//                 if (!object[2].district.includes(objects[i].district)) {
//                     object[2].district.push(objects[i].district)
//                 }

//                 object[2].sub_district.push(objects[i].sub_district)
//             } else if (objects[i].level == 4) {
//                 if (!object[3].city.includes(objects[i].city)) {
//                     object[3].city.push(objects[i].city)
//                 }

//                 if (!object[3].district.includes(objects[i].district)) {
//                     object[3].district.push(objects[i].district)
//                 }

//                 object[3].sub_district.push(objects[i].sub_district)
//             }
//         }


//         object = [{
//                 city: object[0].city.length,
//                 district: object[0].district.length,
//                 sub_district: object[0].sub_district.length,
//                 level: 1
//             },
//             {
//                 city: object[1].city.length,
//                 district: object[1].district.length,
//                 sub_district: object[1].sub_district.length,
//                 level: 2
//             },
//             {
//                 city: object[2].city.length,
//                 district: object[2].district.length,
//                 sub_district: object[2].sub_district.length,
//                 level: 3
//             },
//             {
//                 city: object[3].city.length,
//                 district: object[3].district.length,
//                 sub_district: object[3].sub_district.length,
//                 level: 4
//             }
//         ]


//     } catch (e) {
//         validator.throwError(e)
//     }

//     res.render('admin/dashboard', { object: object })
// }

exports.city_level = async function(req, res) {
    res.render('admin/city-level')
}

exports.update_city_level = async function(req, res) {
    res.render('admin/update-city-level')
}

exports.privacy = async function(req, res) {
    res.render('privacy')
}

exports.term_of_uses = async function(req, res) {
    res.render('term-of-uses')
}