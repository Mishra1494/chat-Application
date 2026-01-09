import mongoose from 'mongoose';
const userSchema =  new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    gender : {
        type : String,
        required : true,
        enum : ['male', 'female','other'],
    },
    password : {
        type : String,
        required : true,
        minLength : 6 ,
       
    },
    profilePic : {
            type : String,
            default : '',
    },},
    {
        timestamps : true,
    }
);

const userModel = mongoose.model('user',userSchema);
export default userModel;