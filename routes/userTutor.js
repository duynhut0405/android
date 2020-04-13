const express = require('express')
const router = express.Router()
const {register, getById, login, logout, update} = require('../controllers/userTutor')

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-'));
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

////////////////////////////////////////////////////////////REGISTER
router.post('/register', upload.single('avartar'), register)


////////////////////////////////////////////////////////////GETID-UPDATE
router.route('/users/:userId')
    .get(getById)
    .patch(update)
    .put(update)


////////////////////////////////////////////////////////////LOGIN
function requiresLogout(req, res, next){
    if (req.session && req.session.user) {
        return res.json({err: 'You must be Logout in to Login continue'});        
    } else {
        return next();
    }
}
router.post('/login',requiresLogout, login)


////////////////////////////////////////////////////////////LOGOUT
function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({err: 'You must be logged in to view this page.'});
    }
}
router.get('/logout', requiresLogin, logout)
////////////////////////////////////////////////////////////Avartar






module.exports = router;