import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import{User} from "../models/Users.model.js" 
import jwt from "jsonwebtoken"

// in case the res is empty --> in production grade code we replace it with an underscore .......(req , _ , next )
 export const verifyJWT = asyncHandler(async(req, res , next )=>{
 
   try {
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer " ,"")
 
 
    if (!token) {
     throw new ApiError( 404  , "Unauthorized request")
     
    }
 
      const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
 
 
 
     const user  = await User.findById(decodedToken?._id).select( "-password -refreshToken")
 
 
     if (!user) {
       throw new ApiError(401 , "Invalid Access Token ")
       
     }
 
     req.user = user;
     next()
   } catch (error) {
     throw new ApiError(401 , error?.message || "Inavald access token")
   }
 })