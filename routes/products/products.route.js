const productsController = require("../../src/controllers/products.controller");
const { router } = require("../../configs/app.config");
const indexController = require("../../src/controllers/index.controller");
const {upload}= require("../../configs/multer.config")
const authValidation = require("../../utils/validations/auth.validation");
const { loginUser } = require("../../utils/middlewares/auth/auth.middleware");

router.post("/create", upload.array('images', 10), productsController.create);
router.get("/all/:category/:sort", productsController.getAll)
router.get("/getone/:id", productsController.getOne);
router.get("/search/:query", productsController.search);
router.delete("/delete/:id", loginUser, productsController.deleteOne)
router.delete("/deleteall", productsController.deleteAll)
router.get("/addtofav/:id", loginUser, productsController.addfav)
router.get("/removefav/:id", loginUser, productsController.removefav)
router.get("/getfav", loginUser, productsController.getFav)
// router.put("/update/:id", upload.array('images', 10), productsController.)
module.exports = router; 
