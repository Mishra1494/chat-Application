import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

export const getReciverSocketId = (receiverId)=>{
    return userSocketmap[receiverId];
}


const userSocketmap = {};
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketmap[userId] = socket.id;
    }
    io.emit('getOnlineUsers',Object.keys(userSocketmap));





    socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        senderId: userId,
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping");
    }
  });




  socket.on("messageSeen", async ({ messageId, senderId }) => {
  await Message.findByIdAndUpdate(messageId.toString(), {
    status: "seen",
  });

  const senderSocketId = userSocketmap[senderId];
  if (senderSocketId) {
    io.to(senderSocketId).emit("messageSeen", { messageId });
  }
});


    socket.on('disconnect',()=>{
        delete userSocketmap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketmap));
    });
});

export {app, httpServer, io};