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
    //   console.log("Current user data:", res.data.users);
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 get messages
  const getMessages = async (receiverId) => {
    try {
    const res = await API.get(
      `/conversations/${receiverId}`,
      { withCredentials: true }
    );
    console.log("Messages:", res.data);
    setMessages(res.data.messages);
  } catch (err) {
    console.log(err);
  }
  };

  // ✉️ send message
  const sendMessage = async () => {
    if (!newMessage || !currentChatUser) return;
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
            style={{
              padding: 6,
              cursor: "pointer",
              backgroundColor:
                currentChatUser?._id === u._id ? "#eee" : "transparent",
            }}
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

            <div
              style={{
                height: "75vh",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
              }}
            >
              {messages.map((msg) => {
                const isMe =
                  msg.senderId?.toString() === user?._id?.toString();
                  console.log("Message senderId:", msg.senderId, "Current userId:", user, "isMe:", isMe);

                return (
                  <div
                    key={msg._id}
                    style={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        background: isMe ? "#DCF8C6" : "#EAEAEA",
                        padding: "8px 12px",
                        borderRadius: 12,
                        maxWidth: "60%",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 5 }}>
              <input
                style={{ flex: 1 }}
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <h3>Select a user to chat</h3>
        )}
      </div>
    </div>
  );
};


export default Chat;
