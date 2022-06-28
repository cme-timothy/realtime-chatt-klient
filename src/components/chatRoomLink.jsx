import { useContext } from "react";
import { Link } from "react-router-dom";
import SocketContext from "../context/socket";
import { useRecoilValue } from "recoil";
import { user } from "../Recoil/user/atom";

function ChatRoomLink(props) {
  const socket = useContext(SocketContext);
  const username = useRecoilValue(user);

  function joinRoomOnClick() {
    const stringifyData = JSON.stringify({
      room: props.room,
      username: username,
    });
    socket.emit("join_room", stringifyData);
  }

  return (
    <div>
      <h3>{props.room}</h3>
      <Link key={props.room} to={`/chatroom/${props.room}`}>
        <button onClick={joinRoomOnClick}>Join room</button>
      </Link>
    </div>
  );
}

export default ChatRoomLink;
