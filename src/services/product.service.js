const BaseService = require("./base.service");
const Product = require("../models/products.model");
const { uploadFile } = require("../../configs/mega.config");
const fs = require("fs");
const path = require("path");
const { User } = require("../models/user.model");
class ProductService extends BaseService {
  static instance;
  constructor() {
    if (ProductService.instance) return ProductService.instance;
    super(Product);
    ProductService.instance = this;
  }

  /**
   * @returns { ProductService }
   */
  static getInstance() {
    if (!ProductService.instance)
      ProductService.instance = new ProductService();
    return ProductService.instance;
  }

  async addproducts(data, files) {
    console.log(data);
    const { pname, price, description, quantity, category, brand } = data;
    const images = files;
    console.log("files", files);
    const product = new Product({
      pname,
      price,
      description,
      quantity,
      category,
      brand,
      images: [],
    });
    console.log("product", product);
    try {
      console.log("ok");
      // const savedProduct = await product.save();
      console.log("ok");
      const imageLinks = await Promise.all(
        images.map(async (file, index) => {
          console.log(product._id);
          const fileName = `${product._id}-${index + 1}-${file.filename}`;
          console.log("ok");
          console.log(fileName);
          console.log(file.path);
          const normalize = path.normalize(file.path);
          const imageUrl = await uploadFile(normalize, fileName);
          console.log("uploaded");
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("failed to delete file ", err);
              return { message: " failed to delete file", error: true };
            }
            console.log("deleted file successfully");
          });
          return imageUrl;
        })
      );
      console.log(imageLinks);
      product.images = imageLinks;
      console.log(product);
      const p = await product.save();

      return { message: "Product saved successfully", error: false };
    } catch (error) {
      return { message: "failed to create product ", error: true };
    }
  }
  async getAll(category, sort) {
    try {
      if (category != "products") {
        if (sort == "price,asc") {
          const products = await Product.find({ category: category }).sort({
            price: 1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "price,desc") {
          const products = await Product.find({ category: category }).sort({
            price: -1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "pname,asc") {
          const products = await Product.find({ category: category }).sort({
            pname: 1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "pname,desc") {
          const products = await Product.find({ category: category }).sort({
            pname: -1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else {
          const products = await Product.find({ category: category });
          return { error: false, data: products };
        }
      } else {
        if (sort == "price,asc") {
          const products = await Product.find().sort({
            price: 1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "price,desc") {
          const products = await Product.find().sort({
            price: -1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "pname,asc") {
          const products = await Product.find().sort({
            pname: 1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else if (sort == "pname,desc") {
          const products = await Product.find().sort({
            pname: -1,
          });
          console.log("cat", category);
          console.log(products);
          return { error: false, data: products };
        } else {
          const products = await Product.find();
          return { error: false, data: products };
        }
      }
    } catch (error) {
      console.log(error);
      return { error: true, data: error.message };
    }
  }
  async findByTitle(search_value) {
    try {
      const products = await Product.find({
        pname: {
          $regex: ".*" + search_value + ".*",
          $options: "i",
        },
      });
      return { error: false, data: products };
    } catch (error) {
      console.log(error);
      return { error: true, data: error.message };
    }
  }

  async findById(id) {
    try {
      const products = await Product.findById(id).populate("ratings");
      return { error: false, data: products };
    } catch (error) {
      console.log(error);
      return { error: true, data: error.message };
    }
  }
  async delete(id) {
    try {
      const products = await Product.findByIdAndDelete(id);
      return { error: false, data: products };
    } catch (error) {
      console.log(error);
      return { error: true, data: error.message };
    }
  }
  async deleteAll() {
    try {
      const products = await Product.deleteMany();
      return { error: false, data: products };
    } catch (error) {
      console.log(error);
      return { error: true, data: error.message };
    }
  }
  async addfavourites(userid, id) {
    const user = await User.findById(userid);
    if (user) {
      let indexFound = user.favourites.findIndex((p) => p == id);
      if (indexFound != -1) {
        return {
          error: true,
          message: "alreadyin favourites",
        };
      } else {
        user.favourites.push(id);
        await user.save();
        return {
          error: false,
          message: "added to favourites",
        };
      }
    }
    return {
      error: true,
      message: "user not found",
    };
  }
  async removefavourites(userid, id) {
    const user = await User.findById(userid);
    const index = user.favourites.indexOf(id);
    if (index > -1) {
      user.favourites.splice(index, 1);
      user.save();
      return {
        error: false,
        message: "removed from favourites",
      };
    } else {
      return {
        error: true,
        message: "not in favourites",
      };
    }
  }
  async getfav(auth) {
    
    const user = await User.findOne({ '_id': auth._id }).populate('favourites')
    
    if (user) {
      return { error: false, data: user.favourites };
    }
    return { error: false, message: 'user not found' };
    
  }
}

module.exports = new ProductService();
