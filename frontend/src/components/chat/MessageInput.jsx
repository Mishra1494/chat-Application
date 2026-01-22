const MessageInput = ({ value, setValue, onSend, socket, receiverId }) => {
  const handleChange = (e) => {
    setValue(e.target.value);

    socket.emit("typing", { to: receiverId });

    setTimeout(() => {
      socket.emit("stopTyping", { to: receiverId });
    }, 1000);
  };

  return (
    <div style={{ display: "flex", gap: 5 }}>
      <input
        style={{ flex: 1 }}
        value={value}
        onChange={handleChange}
        placeholder="Type message..."
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default MessageInput;
