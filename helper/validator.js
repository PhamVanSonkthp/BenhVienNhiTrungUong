const { FormatMoney } = require('format-money-js')
const sanitize = require('mongo-sanitize')
const isDebug = true;
const helper = require('./helper')

const maxNumber = 10000000000;
const minNumber = -10000000000;
const maxLength = 10000;


exports.throwError = function(error) {
    if (error && isDebug) {
        console.error(error);
    }
}

exports.isDefine = function(val) {
    try {
        if (val == undefined || val == null || val == 'null' || val == null) return false
        return true;
    } catch (err) {
        return false;
    }
}

exports.isNumber = function(val) {
    return !isNaN(val)
}

exports.getTimeNow = function(timezone) {
    if (timezone) {
        return new Date(timezone).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    } else {
        return new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    }
}

exports.empty = function(val) {
    if (!exports.isDefine(val)) return true
    if (val === undefined) return true

    if (typeof(val) == 'function' || typeof(val) == 'number' || typeof(val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
        return false;

    if (val == null || val.length === 0) // null or 0 length array
        return true;

    if (typeof(val) == "object") {
        // empty object

        var r = true;

        for (var f in val)
            r = false;

        return r;
    }

    return false;
}

exports.stringToSlug = function(str) {
    // remove accents
    if (exports.empty(str)) return null;
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
}

exports.viToEn = function(str) {
    // remove accents
    if (exports.empty(str)) return null;
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, ' ')
        .replace(/-+/g, ' ');

    return str;
}

exports.tryParseInt = function(str) {
    try {
        if (!exports.isDefine(str)) return 0
        return parseInt(str.toString().replaceAll(',', '')) || 0;
    } catch (e) {
        return 0;
    }
}

exports.tryParseFloat = function(str) {
    try {
        if (!exports.isDefine(str)) return 0
        return parseFloat(str.toString().replaceAll(',', '')) || 0;
    } catch (e) {
        return 0;
    }
}

exports.tryParseJson = function(str) {
    try {
        if (isJson(str)) {
            try {
                return JSON.parse(str)
            } catch (e) {
                return str
            }
        }
        return JSON.parse(str.toString())
    } catch (e) {
        helper.throwError(e)
        return null;
    }
}

fm = new FormatMoney({
    amount: 2
})

function setNumber(num) {
    return exports.tryParseInt(num);
}

function capitalizeFirstLetter(string) {
    if (exports.isDefine(string)) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    } else {
        return null
    }
}

function isArray(val) {
    try {
        return Array.isArray(val)
    } catch (e) {
        return false;
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false;
    }
    return true;
}

function setJson(json) {
    if (isArray(json)) return json

    if (isJsonString(json)) {
        return exports.tryParseJson(json)
    } else {
        return null
    }
}

function isJson(item) {
    item = typeof item !== "string" ?
        JSON.stringify(item) :
        item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

function getNumber(num) {
    //return fm.from(num, true);
    return num;
}

function escapeHtml(string) {
    if (!exports.isDefine(string)) return ''
        // if(string.includes('<script>') || true){
        // 	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        // 		return entityMap[s];
        // 	})
        // }else{
        // 	return string
        // }

    string = string + ''
    if (string.includes('<script>') && string.includes('</script>')) {
        return ''

    } else {
        return string
    }
    //ENCODED FOR MAXIMUM SAFETY
}


exports.validatorFOAD = {
    runValidators: true,
    new: true,
    // returnNewDocument: true,
    // returnOriginal: false,
}

exports.getOnlyNumber = function(str) {
    var num = str.replace(/[^0-9]/g, '');
    return num
}

exports.schemaNumber = {
    type: Number,
    default: 0,
    trim: true,
    min: minNumber,
    max: maxNumber,
    set: setNumber,
    get: getNumber,
}

exports.schemaString = {
    type: String,
    trim: true,
    default: null,
    maxLength: maxLength,
}

exports.schemaCapitalizeFirstLetter = {
    set: capitalizeFirstLetter,
}

exports.schemaDatetime = {
    type: Date,
    trim: true,
    default: Date.now,
    maxLength: maxLength,
}

exports.schemaUnique = {
    unique: true,
    dropDups: true,
}

exports.schemaPoint = {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
}

exports.schemaRequired = {
    required: true,
}

exports.schemaJson = {
    type: JSON,
    trim: true,
    default: null,
    maxLength: 10000,
    // set: setJson,
}

exports.schemaAutoIndex = {
    // autoIndex: true,
    required: true,
    index: true,
    // unique: true,
    // dropDups: true,
}

exports.sortDES = {
    _id: -1
}