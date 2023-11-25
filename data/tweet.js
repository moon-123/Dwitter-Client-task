import Mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";
import  * as UserRepository from './auth.js'
// socket io 추가
import { getSocketIO } from '../connection/socket.js';

const tweetSchema = new Mongoose.Schema({
    text: {type: String, required: true},
    userId: {type: String, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true},
    url: String
}, { timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

export async function getAll(){
    return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username){
    return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id){
    return Tweet.findById(id);
}

export async function create(text, userId){
    return UserRepository.findById(userId).then((user) => 
        new Tweet({
            text,
            userId,
            name: user.name,
            username: user.username,
            url: user.url
        }).save()
    );
}

export async function update(id, text){
    const updatedTweet = await Tweet.findByIdAndUpdate(id, {text}, {
        returnDocument: "after"
    });

    if(updatedTweet){
        const io = getSocketIO();
        // 모든 클라이언트에게 삭제 이번트 방송
        io.emit('tweetUpdated', updatedTweet)
    }
    return updatedTweet
}

export async function remove(id) {
    const deletedTweet = await Tweet.findByIdAndDelete(id);
    if (deletedTweet) {
      const io = getSocketIO();
      io.emit('tweetDeleted', id); 
      // 모든 클라이언트에게 삭제 이벤트 방송
    }
    return deletedTweet;
  }