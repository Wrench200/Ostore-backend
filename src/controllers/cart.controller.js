const cartService = require('../services/cart.service');
const Controller = require('./controller');
  
class CartController extends Controller {
  static instance;
  constructor() {
    if (CartController.instance) return CartController.instance;
    super();
    CartController.instance = this;
  }

  /**
   * @returns { CartController }
   */
  static getInstance() {
    if (!CartController.instance)
      CartController.instance = new CartController();
    return CartController.instance;
  }

  async addToCart(req, res, next) {
      
        const addCart =await cartService.addToCart(req.body, req.auth)
        if (addCart.error) return super.failed(res, addCart.message);

        return super.success(
          res,
          "added to cart successfully",
          addCart.data,
         
        );
    }
  async removeFromCart(req, res, next) {
    
    const deleteFromCart =await cartService.removeFromCart(req.params.id, req.auth)
     if (deleteFromCart.error) return super.failed(res, deleteFromCart.message);

     return super.success(res, "deleted sucessfully", deleteFromCart.data);
  }

  async clearCart(req, res,next) {
    const clearCart = await cartService.clearCart(req.auth);
    if (clearCart.error) return super.failed(res, clearCart.message);

    return super.success(res, "cart cleared successfully", clearCart.data);
  }
  async getCart(req, res, next) {
    
    const cart = await cartService.getCart(req.params?.id)
    
    if (cart.error) return super.failed(res, cart.message);
    return super.success(res, "cart returned successfully", cart.data, 201)
  }
}

module.exports = CartController.getInstance();
