import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
            required : true,
        }
    ],
    message : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Message',
            default : []
        }
    ]
},{
    timeStamps : true
})

const conversationModel = mongoose.model('conversation',conversationSchema);
export default conversationModel;