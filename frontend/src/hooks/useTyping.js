import {useEffect,useState} from 'react';
const useTyping = ({socket,receiverId}) =>{
    const [isTyping,setIsTyping] = useState(false);
    useEffect(()=>{
        if(!socket) return;
        socket.on('typing',({from})=>{
            if(from=== receiverId){
                setIsTyping(true);
            }
        });
        socket.on('stopTyping',()=>setIsTyping(false));
        return ()=>{
            socket.off("typing");
            socket.off("stopTyping");
        };
    },[socket,receiverId]);
    return isTyping;
};
export default useTyping;