const isDebug = true

exports.throwError = function(error) {
    if (error && isDebug) {
        console.error(error);
    }
}

exports.sanitize = require('mongo-sanitize')
const TokenModel = require('../model/Token/Token')
exports.jwt = require('jsonwebtoken')
exports.dotenv = require('dotenv')
exports.dotenv.config()

exports.authenToken = async(req, res, next) => {
    try {
        const token = req.headers.token
        if (!token) {
            res.sendStatus(401)
        } else {
            TokenModel.findOne({ token: token }, (err, result) => {
                if (err || !result) {
                    res.sendStatus(403)
                } else {
                    exports.jwt.verify(result._doc.token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                        if (!err) {
                            req.body = {
                                ...req.body,
                                _caller: data
                            }
                            next()
                        } else {
                            res.sendStatus(403)
                        }
                    })
                }
            })
        }
    } catch (err) {
        exports.throwError(err)
        res.sendStatus(500)
    }
}

exports.getInforByToken = async(req) => {
    try {

        const token = req.headers.token


        if (!token) {
            return null
        } else {
            const result = await TokenModel.findOne({ token: token })

            if (!result) {
                return null
            } else {
                return exports.jwt.verify(result._doc.token, process.env.ACCESS_TOKEN_SECRET)
            }

        }
    } catch (err) {
        exports.throwError(err)
        res.sendStatus(500)
    }
}

exports.signToken = async(token) => {
    try {
        const object = new TokenModel({
            token: token,
        })
        await object.save()
    } catch (err) {
        exports.throwError(err)
    }
}

exports.unSignToken = async(token) => {
    try {
        await TokenModel.deleteOne({ token: token })
    } catch (err) {
        exports.throwError(err)
    }
}