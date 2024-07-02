
const { router } = require("../../configs/app.config");
const cartController = require("../../src/controllers/cart.controller");
const indexController = require("../../src/controllers/index.controller");
const { loginUser } = require("../../utils/middlewares/auth/auth.middleware");



router.post("/addtocart", loginUser, cartController.addToCart);
router.post("/deletefromcart/:id", loginUser, cartController.removeFromCart)
router.post("/clear", loginUser, cartController.clearCart)
router.get('/getcart/:id', cartController.getCart)

module.exports = router