export const register =async (req,res)=>{
    try{
        const user = req.body;
        res.status(200).json({message : "user registered successfully", user});
    }catch(error){
        console.log(error);
    }
}