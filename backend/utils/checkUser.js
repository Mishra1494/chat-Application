import userModel from "../models/userModels.js";

const checkUserExists = async (email, userName) =>{
    const user = await userModel.findOne({email, userName});
    if(user){
    if(user.email === email){
        return {exists: true, field: 'email'};
    }
    if(user.userName === userName){
        return {exists:true , field : "userName"};
    }
}
    return {exists : false};

}

export default checkUserExists;