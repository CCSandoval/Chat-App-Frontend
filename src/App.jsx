import React, { useState } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";
import chat from "./img/chat.png";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const socket = io.connect("http://localhost:8000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      //socket.emit() sendas as a string the event to call and the second parameter is the room id the user wants to join
      socket.emit("joinRoom", { room, username });
      setShowChat(true);
    } else {
      toast.error("You didn't input a room id or a username");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <ToastContainer position="top-right" autoClose={2000} />
      {!showChat ? (
        <>
          <div className="h-screen flex flex-col justify-center items-center">
            <h3 className="m-3 font-extrabold text-2xl bg-gray-50 p-3 rounded-xl border-2 border-black text-indigo-600">
              Join chat
            </h3>
            <input
              type="text"
              className="my-1 border-2 border-black rounded-lg p-3 font-bold"
              placeholder="Your username goes here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="my-1 border-2 border-black rounded-lg p-3 font-bold"
              placeholder="Your Room ID goes here"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              className="bg-indigo-600 p-3 text-white font-extrabold rounded-md"
              type="button"
              onClick={joinRoom}
            >
              Join a room
            </button>
            <img src={chat} alt="Logo" className="mt-10" />
          </div>
          <div className="mt-3 w-full flex flex-row">
            <span>
              Logos made by
              {"  "}
              <a
                className="hover:text-green-600"
                href="https://www.freepik.com"
                target="_blank"
                rel="noreferrer"
                title="Freepik"
              >
                Freepik
              </a>{" "}
              from{" "}
              <a
                className="hover:text-green-600"
                href="https://www.flaticon.com/"
                target="_blank"
                rel="noreferrer"
                title="Flaticon"
              >
                www.flaticon.com
              </a>
            </span>
          </div>
        </>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
