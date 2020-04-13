const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
    fullname: {type: String, trim: true, required: true},
    email: {type: String, unique: true, required: true, trim: true},
    username: {type: String, required: true, trim: true, minlength: 2},
    password: {type: String, required: true, trim: true, minlength: 6},
    password_confirm: {type: String, required: true, trim: true, minlength: 6},
    phone: {type: String, required: true, minlength: 10, maxlength: 11},
    birthday: {type: Date, required: true},
    gender: {type: String, enum: ["Male", "Female"]},
    role: {type: String, enum: ["student", "tutor"]},
    avartar: {type: String, required: true}
});

exports.findById = (id) => {
    return UserTutor.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        return result;
    });
};



module.exports = mongoose.model('UserTutor', userSchema, 'user_tutor')