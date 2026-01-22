import {useEffect} from 'react';


const useChatSocket = ({socket,currentChatUser,setMessages})=>{
    useEffect(()=>{
        if(!socket)return;
        socket.on("newMessage",(msg)=>{
            if (
                msg.senderId === currentChatUser?._id ||
                msg.receiverId === currentChatUser?._id
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        });
         socket.on("messageSeen", ({ messageId }) => {
  setMessages((prev) =>
    prev.map((m) =>
      m._id.toString() === messageId.toString()
        ? { ...m, status: "seen" }
        : m
    )
  );
});


        return () =>{
            socket.off("newMessage");
            socket.off("messageSeen");
        }
    },[socket,currentChatUsers]);
};

export default useChatSocket;