import { v2 as cloudinary2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary2.config({
  cloud_name: process.env.CLOUD_NAME2,
  api_key: process.env.API_KEY2,
  api_secret: process.env.API_SECRET2,
});

export default cloudinary2;
// nakul.rana@imsec.ac.in
