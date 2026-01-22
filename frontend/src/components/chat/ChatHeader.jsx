const ChatHeader = ({ user, onlineUsers, isTyping }) => {
  const isOnline = onlineUsers.includes(user._id);

  return (
    <div>
      <h3>
        {user.fullname}
        <span style={{
          marginLeft: 8,
          color: isOnline ? "green" : "gray"
        }}>
          ●
        </span>
      </h3>

      {isTyping && <small>typing...</small>}
    </div>
  );
};

export default ChatHeader;
