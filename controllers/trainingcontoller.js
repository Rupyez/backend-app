const Training = require('../models/Training.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const Category = require('../models/Category.js');
const multer = require('multer')
// const ApiFeatures = require('../utils/apiFeatures.js')


// const FILE_TYPE_MAP ={
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'

// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         const isValid = FILE_TYPE_MAP[file.mimetype]
//         let uploadError = new ErrorHandler("Invalid image type")

//         if(isValid){
//             uploadError = null
//         }
//         cb(uploadError, 'public/uploads')
//     },
//     filename: function (req, file, cb){
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype]
//         cb(null, `4{fileName}-${Date.now()}.${extension}`)
//     }
// })

// const uploadOptions = multer({storage: storage})



// create training -- admin
const createTraining = catchAsyncErrors(
  

    // uploadOptions.single('image'),

    async(req, res, next)=>{
        // for user
        req.body.user = req.user.id;

        // for category
        const category = await Category.findById(req.body.category);
        if(!category)
        return res.status(400).json({success:false, category})
        

        // for file
        // const file = req.file;
        // if(!file)
        // return res.status(400).json({success:false, file})


        // const fileName = req.file.fileName
        // const basePath = `${req.protocol}://${req.get('host')}/public/upload`;

        // const training = await Training.create(req.body);

        console.log('hello')

        let training = new Training({
            title: req.body.title,
            description: req.body.description,
            career: req.body.career,
            syllabus: req.body.syllabus,
            duration: req.body.duration,
            priority: req.body.priority,
            // image: `${basePath}${fileName}`,// "http://localhost:8080/public/uploads/image-1212"
            category: req.body.category,
            ratings: req.body.ratings,
            numOfReviews: req.body.numOfReviews,
            reviews: req.body.reviews,
            user: req.body.user,
        })

      await training.save()

        res.status(201).json({training})
        
    }
)



// get all training
const getAllTraining = catchAsyncErrors(

 async(req, res)=>{

    const training = await Training.find().populate({ path: 'category' })

    res.status(201).json({sucess:true, training})
  }
)

// get training by id
const getTrainingByid = catchAsyncErrors(

    async(req,res, next)=>{
        const trainings = await Training.findById(req.params.id).populate({path:'category'});

        if(!trainings)
    
        return next(new ErrorHandler("training not found", 404 ))
    
        res.status(201).json({trainings})
    
    }
)



// update training -- admin
const updateTraining = catchAsyncErrors(

    async(req, res, next)=>{
        let training = Training.findById(req.params.id);
    
        if(!training){
            return next(new ErrorHandler("training cannot be updated", 404 ))
        }
        training = await Training.findByIdAndUpdate(req.params.id, req.body, {new:true, useFindAndModify:false})
        
        res.status(201).json({training})
    }
    
)


// delete training - admin

const deleteTraining = catchAsyncErrors(

    async(req, res, next)=>{
        let training = Training.findById(req.params.id);
    
        if(!training){
            return next(new ErrorHandler("training not found", 404 ))
        }
        training = await Training.findByIdAndRemove(req.params.id, req.body)
        
        res.status(201).json({message:"training deleted successfully"})
    }
    
)


//create New review or update the review
const createTrainingReview = catchAsyncErrors(async(req,res,next)=>{


    const{rating, comment, trainingId} = req.body
    
    const review = {
      user:req.user._id,
      name:req.user.name,
      rating:Number(rating),
      comment,
    }
    
    // finding the product
    const training = await Training.findById(trainingId)
    
    
    // is review done already
    
    const isReviewed = training.reviews.find(rev=> rev.user.toString()=== req.user._id.toString())
    
    if(isReviewed){
      training.reviews.forEach(rev=>{
        rev.rating=rating,
        rev.comment=comment
      })
    
    }else{
      training.reviews.push(review);
      training.numOfReviews = training.reviews.length
    }
    // updating rating of products
    let avg = 0
     training.reviews.forEach(rev=>{
      avg+= rev.rating
    })
    
    training.ratings =avg/training.reviews.length;
    
    await training.save({validateBeforeSave:false});
    
    res.status(200).json({success:true, })
    
    })



module.exports ={
    createTraining,
    getAllTraining,
    updateTraining,
    deleteTraining,
    getTrainingByid,
    createTrainingReview
}