import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js" ;
import {ApiError} from "../utils/ApiError.js";
import {upload} from "../middlewares/multer.middleware.js"
const router = Router()

router.route("/register").post(
  //this field takes an array 
upload.fields  ([
{

name :"avatar",
maxCount: 1


},{
  name:"coverImage",
  maxCount:1
 }
]) ,
registerUser
 ) 
// router.route("/login").post(login)

export default router 

