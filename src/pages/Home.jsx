import { useState, useContext, useEffect } from "react";
import SocketContext from "../context/socket";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRecoilState } from "recoil";
import { user } from "../Recoil/user/atom";
import ChatRoomLink from "../components/chatRoomLink";

function Home() {
  const socket = useContext(SocketContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useRecoilState(user);
  const navigate = useNavigate();

  // get all rooms at start
  useEffect(() => {
    socket.emit("get_rooms");
    socket.on("all_rooms", (data) => {
      setChatRooms(data);
    });

    return () => socket.off();
  }, []);

  // get all rooms continuously
  useEffect(() => {
    socket.on("all_rooms", (data) => {
      setChatRooms(data);
    });
    console.log(chatRooms);
    return () => socket.off();
  });

  function handleRoomChange(event) {
    const value = event.target.value;
    setRoomName(value);
  }

  function createRoomOnClick() {
    if (roomName !== "") {
      socket.emit("create_room", roomName);
      setRoomName("");
      socket.emit("get_rooms");
      return navigate(`/chatroom/${roomName}`);
    }
  }

  function createRoomOnEnter(event) {
    if (event.key === "Enter" && roomName !== "") {
      socket.emit("create_room", roomName);
      setRoomName("");
      return navigate(`/chatroom/${roomName}`);
    }
  }

  function handleUsernameChange(event) {
    const value = event.target.value;
    setUsername(value);
  }

  function createUsernameOnClick() {
    if (username !== "") {
      socket.emit("create_user", username);
    }
  }

  function createUsernameOnEnter(event) {
    if (event.key === "Enter" && username !== "") {
      socket.emit("create_user", username);
    }
  }

  return (
    <div>
      <Helmet>
        <title>Free and open chat rooms - Chatty Chatty Bang Bang</title>
      </Helmet>
      <h1>Welcome to Chatty Chatty Bang Bang</h1>
      <h2>
        A free and open chat platform. Talk to anyone from anywhere either in
        public rooms or private rooms. Join or create a chat room and be chatty
        &#128540;
      </h2>
      <input
        className="inputBox"
        placeholder="..."
        type="text"
        onChange={handleUsernameChange}
        onKeyDown={createUsernameOnEnter}
        value={username}
      />
      <button onClick={createUsernameOnClick}>Create name</button>
      <input
        className="inputBox"
        placeholder="..."
        type="text"
        onChange={handleRoomChange}
        onKeyDown={createRoomOnEnter}
        value={roomName}
      />
      <button onClick={createRoomOnClick}>Create room</button>

      <h3>All available rooms:</h3>
      {chatRooms.map((data, index) => {
        return (
          <ChatRoomLink key={index} roomName={data.room} socket={socket} />
        );
      })}
    </div>
  );
}

export default Home;
