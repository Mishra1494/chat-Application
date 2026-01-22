const MessageList = ({ messages, user, bottomRef }) => (
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
              {msg.seen ? "Seen ✔✔" : "Delivered ✔"}
            </small>
          )}
        </div>
      );
    })}
    <div ref={bottomRef} />
  </div>
);

export default MessageList;
