import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)// a good option would be to give it a unique name to avoid errors 
  }
})

export const upload = multer({ 
   storage,
   })