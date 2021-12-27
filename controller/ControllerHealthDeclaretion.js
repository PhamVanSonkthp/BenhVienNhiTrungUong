const information = require('../api/ControllerHealthDeclaretion/Information')

//const AdminModel = require('../model/Admin/Admin')
const validator = require('../helper/validator')
const helper = require('../helper/helper')


exports.createControllerHealthDeclaretion = function createControllerHealthDeclaretion(app) {
    information(app)
}

// exports.home = async function(req, res) {
//     try {
//         const query = {
//             is_public: true
//         }
//         const objects = await TopicModel.find(query).sort({ _id: -1 }).limit(6)

//         res.render('user/home', {
//             header: await getHeader(),
//             object: {
//                 data: objects
//             },
//             validator: validator
//         })
//     } catch (e) {
//         validator.throwError(e)
//     }
// }