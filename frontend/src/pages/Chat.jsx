import { useEffect, useRef, useState } from "react";
import API from "../api/axious";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/socketContext";

const Chat = () => {
  const { user } = useAuth();
  const { socket, onlineUser } = useSocketContext();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);

  // ---------------- USERS ----------------
  const searchUsers = async () => {
    if (!search.trim()) return;
    const res = await API.get(`/user/SearchUser?search=${search}`, {
      withCredentials: true,
    });
    setUsers(res.data.user || []);
  };

  const getChatUsers = async () => {
    const res = await API.get("/user/getCurrentUser", {
      withCredentials: true,
    });
    setUsers(res.data.users || []);
  };

  // ---------------- MESSAGES ----------------
  const getMessages = async (receiverId) => {
    const res = await API.get(`/conversations/${receiverId}`, {
      withCredentials: true,
    });
    setMessages(res.data.messages || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChatUser) return;

    const res = await API.post(
      `/messages/send/${currentChatUser._id}`,
      { message: newMessage },
      { withCredentials: true }
    );

    setMessages((prev) => [...prev, res.data.newMessage]);
    setNewMessage("");

    socket.emit("stopTyping", {
      receiverId: currentChatUser._id,
    });
  };

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        currentChatUser &&
        (msg.senderId === currentChatUser._id ||
          msg.receiverId === currentChatUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTyping = ({ senderId }) => {
      if (senderId === currentChatUser?._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === currentChatUser?._id) {
        setIsTyping(false);
      }
    };

    const handleMessageSeen = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status: "seen" } : m
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("messageSeen", handleMessageSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("messageSeen", handleMessageSeen);
    };
  }, [socket, currentChatUser]);

  // ---------------- SEEN EMIT (IMPORTANT FIX) ----------------
  useEffect(() => {
  if (!socket || !currentChatUser || !user?._id) return;

  messages.forEach((msg) => {
    if (
      msg.receiverId === user._id &&
      msg.senderId === currentChatUser._id &&
      msg.status !== "seen"
    ) {
      socket.emit("messageSeen", {
        messageId: msg._id,
        senderId: msg.senderId,
      });
    }
  });
}, [messages, socket, currentChatUser, user]);


  // ---------------- TYPING EMIT ----------------
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !currentChatUser) return;

    socket.emit("typing", {
      receiverId: currentChatUser._id,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: currentChatUser._id,
      });
    }, 700);
  };

  // ---------------- SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    getChatUsers();
  }, []);

  const isOnline = (id) => onlineUser?.includes(id);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT */}
      <div style={{ width: "30%", borderRight: "1px solid gray", padding: 10 }}>
        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={searchUsers}
        />

        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => {
              setCurrentChatUser(u);
              getMessages(u._id);
            }}
          >
            {u.fullname}
            <span
              style={{
                marginLeft: 6,
                color: isOnline(u._id) ? "green" : "gray",
              }}
            >
              ●
            </span>
          </div>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ width: "70%", padding: 10 }}>
        {currentChatUser && (
          <>
            <h3>
              {currentChatUser.fullname}{" "}
              {isOnline(currentChatUser._id) && "🟢"}
            </h3>

            {isTyping && <p>typing...</p>}

            <div style={{ height: "75vh", overflowY: "auto" }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === user._id;
                return (
                  <div
                    key={msg._id}
                    style={{ textAlign: isMe ? "right" : "left" }}
                  >
                    <div>{msg.message}</div>
                    {isMe && (
                      <small>
                        {msg.status === "seen" ? "Seen" : "Delivered"}
                      </small>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <input
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
