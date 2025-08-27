import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({
videoFile:{
  type:String, // cLoudinary url again 
  required: true,

},

thumbnail:{
  type:String, // cLoudinary url again 
  required: true,
},

title:{
  type:String, 
  required: true,
},
description:{
  type:String, 
  required: true,
},
duration:{
  type: Number, //cloudinary se milega --> after uploading it automatically provides these data
  required: true,
},
views:{

  type:Number,
  default: 0
}, 

isPublishe:{
  type: Boolean,
  default: true,

}, 

owner:{
  type:Schema.Types.ObjectId,
  ref:"User"
}




}, {timestamps:true})

vedioSchema.plugin(mongooseAggregatePaginate)

export  const Vedio = mongoose.model( "Vedio" , vedioSchema)