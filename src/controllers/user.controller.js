import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
 import {User} from "../models/Users.model.js"
import sift from "sift";

 const generateAccessAndRefreshTokens =async(userId) => {
  try {
   const user = await User.findById(userId) 
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
   await user.save({validateBeforeSave: false})

   return { accessToken , refreshToken}

  } catch (error) {
    throw new ApiError(500 , "Something went wrong while generating Access and Refresh Token")
  }
 }

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";
const registerUser = asyncHandler(async (req , res) => {
 /// get user details from frontend
 // validation --> not empty
 // check if user already exists  : username or email
 // check for images and avatar 
 //if available upload to cloudinary 
 // create user objects -- create entry in db 
 // remove pasword and refresh token feilds
 //check for user creation 
 // return response




                   const { fullName , email , username , password  } =  req.body 
console.log("email:" , email );


if ([fullName , email, username , password].some((field)=> field?.trim() === "")) {
  throw new ApiError(400 , "All fields are required")
}
 
 const existedUser =  await User.findOne({
  $or:[{username} ,  {email}]
})

if(existedUser){

  throw new ApiError(409 ,"User with email or username alreasy exists")
}

   const avatarLocalPath = req.files?.avatar?.[0]?.path

  //  const coverImageLocalPath = req.files?.coverImage?.[0]?.path
  console.log(req.files);
  let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

if(!avatarLocalPath){
  throw new ApiError(400 , " Avatar is required")
}

 const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  

if(!avatar){
  throw new ApiError(400 , " Avatar is required")
}

  const user = await User.create({

  fullName,
  avatar :avatar.url,
  coverImage : coverImage?.url || " "  ,
  email , 
  password , 
  username: username.toLowerCase()



})
 const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
 )
 if(!createdUser){
  throw new ApiError( 500 , "Something went wrong while registering the user ")
 }

  return res.status(201).json(
    new ApiResponse(200 , createdUser , "User registered sucessfully")
  )

} )



const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    const{email,username , password} = req.body
   if (!username && !email) {
  throw new ApiError(400, "Username or email is required");
}



const user =    await User.findOne({
      $or : [{username} , {email}]
      // and no or these all are the operators of mongo db...
    })

 if (!user) {
  throw new ApiError(404 , "User does not exist")
  
 }
   // whie using capital { U } --> we are accessing the properties of monog db 
   // and while using small { u}  in user we are accessing the properties of our own user model --> think to keep in mind could cause a typo 
 
 
   const isPasswordValid = await user.isPasswordCorrect (password) 
   if (!isPasswordValid) {
  throw new ApiError(401 , "Incorrect Password")
   }
 
 const {accessToken , refreshToken} = 
      await  generateAccessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
   
const options = {

  httpOnly : true ,
    secure:true,

}
return res.status(200).cookie("accessToken" , accessToken , options)
.cookie( "refreshToken" , refreshToken , options)
.json(
  new ApiResponse( 200 , {
    user: loggedInUser , accessToken , refreshToken
  }, 
      "User logged In Successfully")
)

})


 const logoutUser = asyncHandler(async(req, res)=>{
     await User.findByIdAndUpdate(

      req.user._id,
      {
        $set: {
          refreshToken: undefined
        }
      } , {

        new: true
      }
    )

    const options = {

  httpOnly : true ,
    secure:true,
    }
    return res 
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200 , {} , "User logged Out"))
 })
export {
    registerUser,
    loginUser, 
    logoutUser
}

