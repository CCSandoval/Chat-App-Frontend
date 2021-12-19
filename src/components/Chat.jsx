import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { nanoid } from "nanoid";

const Chat = ({ socket, username, room, messages }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState(messages);
  const [flag, setFlag] = useState(true);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        user: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      //Sends the message, time, user and room as the data so the backend can display it
      await socket.emit("sendMessage", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    //The backend sends the message, time, user and room as the data to display to the user
    socket.on("receiveMessage", (data) => {
      setMessageList([...messageList, data]);
    });
  }, [socket, flag, messageList]);

  return (
    <div className="flex flex-col shadow-lg border-2 border-black bg-yellow-700 rounded-lg p-1 my-6 sm:w-96 lg:w-3/12 h-4/6">
      <div className="border-r-2 border-l-2 border-t-2 border-b-2 bg-white rounded-t-md border-black p-2">
        <p className="font-extrabold text-2xl">
          Live Chat, Room: {room}
          <i className="fas fa-signal float-right text-green-600"></i>
        </p>
      </div>
      <div className="h-full overflow-y-hidden bg-white border-r-2 border-l-2 border-black p-2">
        <ScrollToBottom className="h-full overflow-hidden">
          {messageList.map((m) => {
            return (
              <div
                key={nanoid()}
                className={
                  !(m.user === username)
                    ? "transform duration-100 w-48 h-auto my-1 float-left clear-both bg-blue-600 px-3 rounded-t-lg rounded-br-lg"
                    : "transform duration-100 w-48 h-auto my-1 float-right clear-both bg-green-600 px-3 rounded-t-lg rounded-bl-lg"
                }
              >
                <div>
                  <div>
                    <p className="text-white break-words h-auto font-bold text-lg">
                      {m.message}
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <p className="mr-1 text-gray-300 font-medium">{m.time}</p>
                    <p className="ml-1 text-gray-300 font-medium">{m.user}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="w-full rounded-b-md border-2 border-black p-1 bg-white ">
        <input
          className="w-full p-2 rounded-md focus:outline-none"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
            setFlag(!flag);
          }}
          type="text"
          placeholder="Write your message!"
        />
        <button className="w-full" onClick={sendMessage}>
          <i className="fas fa-paper-plane text-green-700"></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
