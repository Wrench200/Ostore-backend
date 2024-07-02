const { router } = require('../../configs/app.config');

const authController = require('../../src/controllers/auth/auth.controller');
const { loginUser } = require('../../utils/middlewares/auth/auth.middleware');
const authValidation = require('../../utils/validations/auth.validation');

router.post('/register', authValidation.register, authController.register);
router.post('/activate-account', authValidation.activate_account, authController.activate_account);
router.post('/login', authValidation.login, authController.login);
router.post('/refresh-token', authController.refresh_token)
router.get('/user', loginUser, authController.getUser)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.updatePassword)
router.post('/verifycode', authController.verifyCode)
module.exports = router;