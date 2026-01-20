import { useEffect, useState } from "react";
import API from "../api/axious";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 🔍 search users
  const searchUsers = async () => {
    if (!search) return;
    try {
      const res = await API.get(`/user/SearchUser?search=${search}`, {
        withCredentials: true,
      });
      setUsers(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  // 🧑‍🤝‍🧑 get existing chats
  const getChatUsers = async () => {
    try {
      const res = await API.get("/user/getCurrentUser", {
        withCredentials: true,
      });
      console.log("Current user data:", res.data.users);
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 get messages
  const getMessages = async (receiverId) => {
    try {
      const res = await API.get(`/messages/get/${receiverId}`, {
        withCredentials: true,
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  // ✉️ send message
  const sendMessage = async () => {
    if (!newMessage) return;
    try {
        
      const res = await API.post(
        `/messages/send/${currentChatUser._id}`,
        { message: newMessage },
        { withCredentials: true }
      );
      
      setMessages((prev) => [...prev, res.data.newMessage]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChatUsers();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT SIDEBAR */}
      <div style={{ width: "30%", borderRight: "1px solid gray", padding: 10 }}>
        <h3>Users</h3>

        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={searchUsers}
        />

        {users.map((u) => (
          <div
            key={u._id}
            style={{ padding: 5, cursor: "pointer" }}
            onClick={() => {
              setCurrentChatUser(u);
              getMessages(u._id);
            }}
          >
            {u.fullname}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={{ width: "70%", padding: 10 }}>
        {currentChatUser ? (
          <>
            <h3>Chat with {currentChatUser.fullname}</h3>

            <div style={{ height: "80%", overflowY: "auto" }}>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    textAlign:
                      msg.senderId?.toString() === user?._id?.toString() ? "right" : "left",
                  }}
                >
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>

            <input
              placeholder="Type message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        ) : (
          <h3>Select a user to chat</h3>
        )}
      </div>
    </div>
  );
};

export default Chat;
