const router = require('express').Router();
const UserController = require('../controllers/user-controller');

router.get('/', UserController.getAllUsers);
router.post('/', UserController.addUser);
router.post('/login', UserController.login);
router.post('/call', UserController.callUser);
router.post('/whatsapp', UserController.sendEmail);
router.post('/email', UserController.sendWhatsAppMessage);

module.exports = router;
