
// import { useState } from "react";
import "./chatapp.scss";
import images from "../../assets/images";
import Chatlist from "./chatList"
const Chats = ({ chatbotOpen }: any) => {
  // const [displayChatCard, setDisplayChatCard] = useState(false);
  const { Close_white } = images;
  // const ws = new WebSocket(`ws${chatBaseurl}conversation/chat_list`) as any;

  // const openDisplayChatCard = (data: any) => {
  //   setDisplayChatCard(data);
  // }

  return (
    <>

      <div className={"main"} >
        <div className={"chatCloseContainer"}

        >
          <span>^</span>
        </div>

        <h2 className="h2">Chat
          <span className={"chatCloseContainer"}
            onClick={() => chatbotOpen(false)}
          >
            <img src={Close_white} alt="Close_white" />
          </span>
        </h2>

        <Chatlist
          // openDisplayChatCard={openDisplayChatCard}
        />
      </div>
    </>
  );
}

export default Chats;
