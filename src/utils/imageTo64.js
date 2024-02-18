import { resolve } from 'path';
import imageToBase64 from 'image-to-base64';

const imageToBase64 = (imagePath) => {
    return new Promise((resolve, reject) => {
      imageToBase64(imagePath)
        .then((base64) => {
          resolve(base64);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  export default imageToBase64;