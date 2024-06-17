const mongoose = require("mongoose");

const ContestSchema =new mongoose.Schema({
    brandName: { type: String, required: true },
    contestName: { type: String, required: true },
    contestDescription: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    candidates : [{
        user: {type : mongoose.Schema.Types.ObjectId , ref:"User", required:true},
        userName:{type:String , required:True}
    }],
    winners: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true } ,
        score : {type:Number , required:true},
        rank : {type: [Number] , enum: [1,2,3], required: true }
    }],
    posts:[{
        postContent: { type: String, required: true },
        postImageURL: { type: String },
        postVideoURL: { type: String },
        sharedOn: [{ type: String }],
        votes: [{
            voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            timestamp: { type: Date, default: Date.now }
        }],
        comments: [{
            commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }]
    }]
})

const Contest = mongoose.model("Contest" , ContestSchema );
module.exports = Contest;