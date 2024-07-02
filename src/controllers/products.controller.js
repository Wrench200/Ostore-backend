const Controller = require('./controller');
const productService = require('../services/product.service')
class ProductsController extends Controller {
  static instance;
  constructor() {
    if (ProductsController.instance) return ProductsController.instance;
    super();
    ProductsController.instance = this;
  }

  /**
   * @returns { ProductsController }
   */
  static getInstance() {
    if (!ProductsController.instance)
      ProductsController.instance = new ProductsController();
    return ProductsController.instance;
  }

  async create(req, res, next) {
    console.log("images", req.files);
    const body = req.body;
    const files = req.files;
    const data = await productService.addproducts(body, files);
    if (data.error) return super.failed(res, data.message);

    return super.success(res, "Product created successfully", data.data, 201);
  }
  async getAll(req, res, next) {
    console.log(req.params.category);
    const products = await productService.getAll(
      req.params?.category,
      req.params?.sort
    );
    if (products.error) return super.failed(res, products.message);

    return super.success(res, "products returned successfully", products.data, 201);
  }

  async search(req, res, next) {
    const title = req.params.query;
    if (title) {
      const products = await productService.findByTitle(title);
      if (products.error) return super.failed(res, products.message);
      return super.success(res, "products returned successfully", products.data, 201);
    }
  }

  async getOne(req, res, next) {
    const id = req.params?.id;
    if (id) {
      const products = await productService.findById(id);
      if (products.error) return super.failed(res, products.message);
      return super.success(res, "products returned successfully", products.data, 201);
    }
  }
  async deleteOne(req, res, next) {
    const id = req.params?.id;
    if (id) {
      const products = await productService.delete(id);
      if (products.error) return super.failed(res, products.message);
    return super.success(res, "Product Deleted Successfully", products.data, 201);
    }
  }
  async deleteAll(req, res, next) {
    const products = await productService.deleteAll();
    if (products.error) return super.failed(res, products.message);

    return super.success(res, "Products Deleted Successfully", products.data, 201);
  }
  async addfav(req, res, next) {
    const add = await productService.addfavourites(req.auth._id, req.params?.id)
    if (add.error) return super.failed(res, add.message);
    return super.success(res, "added to favourites successfully", add.data, 201);
  }
  async removefav(req, res, next) {
    const remove = await productService.removefavourites(req.auth._id, req.params?.id)
    if (remove.error) return super.failed(res, remove.message);
    return super.success(res, "removed from favourites successfully", remove.data, 201);
  }
  async getFav(req, res, next) { 
    console.log('authenticated')
    const fav = await productService.getfav(req.auth)
    if (fav.error) return super.failed(res, fav.message);
    return super.success(res, "favourites returned successfully", fav.data, 201);
  }
}

module.exports = ProductsController.getInstance();
