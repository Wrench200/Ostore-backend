const ImageKit = require("imagekit");
const fs = require("fs");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadFile =  (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err)
        return reject(err);
      }
      imagekit.upload(
        {
          file: data.toString("base64"), // Convert file to base64 string
          fileName: fileName, // required
          folder: "/product_images/", // Optional: specify a folder in ImageKit
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result.url);
        }
      );
    });
  });
};

module.exports = { uploadFile };
