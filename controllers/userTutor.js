const UserTutor = require('../models/userTutor')
const bcrypt = require('bcrypt')
global.crypto = require('crypto')

    
exports.register = function(req, res, next){    
    UserTutor.findOne({username: req.body.username}, (err, user) => {
        if(user){ //Kiểm tra xem email đã được sử dụng chưa
            return res.json({err: 'Username already in use'})
        } else{
            UserTutor.findOne({email: req.body.email}, (err, user) => {
                if(!user){ //Kiểm tra xem email đã được sử dụng chưa
                    bcrypt.hash(req.body.password, 10, function(err, hash){ //Mã hóa mật khẩu trước khi lưu vào db
                        if (err) {return next(err);}
                        const user = new UserTutor(req.body)
                        user.password = hash;
                        user.password_confirm = hash;
                        user.avartar = req.file.path;
                        user.save((err, result) => {
                            if(err) {return res.json({err})}
                            res.json({user: result})
                        })
                    })
                }else{
                    res.json({err: 'Email has been used'})
                }
            })
        }
    })
}

exports.getById = (req, res) => {
    UserTutor.findById(req.params.userId).then((result) => {
        res.status(200).send(result);
    });
 };


 exports.login = function(req, res){
    UserTutor.findOne({username: req.body.username}).exec(function(err, user){
        if(err) {
            return res.json({err})
        }else if (!user){
            return res.json({err: 'Username and Password are incorrect'})
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result === true){
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            }else{
                return res.json({err: 'Username and Password are incorrect'})
            }
        })
    })
}


exports.logout = function(req, res){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return res.json({err});
            } else {
                return res.json({'logout': "Success"});
            }
        });
    }
}


exports.update =  function (req, res) {
    UserTutor.findById(req.params.userId, function (err, user) {
        if (err) res.send(err)

        user.name = req.body.name

        user.save(function (err) {
            if (err) res.json(err);

            res.json({
                message: 'User Info updated',
                data: user
            })
        })
    })
}

exports.updateAvartar = function (req, res) {
    UserTutor.findById(req.params.userId, function (err, user) {
        if (err) res.send(err)

        user.avartar = req.file

        user.save(function (err) {
            if (err) res.json(err);

            res.json({
                message: 'User avartar updated',
                data: user
            })
        })
    })
}


