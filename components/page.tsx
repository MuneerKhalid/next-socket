// Update the import statement to include the 'io' module from Socket.io-client
import { useEffect, useState } from "react";
import io from "socket.io-client";
import style from "./chat.module.css";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ username, roomId }: any) => {
  const [socket, setSocket] = useState<any>(null); // State to hold the socket instance
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  useEffect(() => {
    // Establish a WebSocket connection to the locally running server
    const socket = io("http://192.168.0.113:3001"); // Assuming your backend server runs on port 3000 locally
    setSocket(socket);

    // Clean up function to close the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    // Listen for incoming messages from the server
    if (socket) {
      socket.on("receive_msg", (data: IMsgDataTypes) => {
        setChat((prevChat) => [...prevChat, data]);
      });
    }
  }, [socket]);

  return (
    <div className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: "1rem" }}>
          <p>
            Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
          </p>
        </div>
        <div>
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={
                user === username ? style.chatProfileRight : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user === username ? "right" : "left" }}
              >
                {user.charAt(0)}
              </span>
              <h3 style={{ textAlign: user === username ? "right" : "left" }}>
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={(e) => sendData(e)}>
            <input
              className={style.chat_input}
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className={style.chat_button} type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
