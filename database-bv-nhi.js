const mongoose = require('mongoose')

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true, //this is the code I added that solved it all
    keepAlive: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    useFindAndModify: false,
    useUnifiedTopology: true
}

exports.optsValidator = {
    runValidators: true,
    new: true,
}


mongoose.connect('mongodb://127.0.0.1:27017/' + 'benh_vien_nhi', options).then(() => {
    console.log('benh_vien_nhi' + ' is connected')
}).catch(err => console.log(err))