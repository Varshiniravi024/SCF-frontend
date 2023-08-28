import { Row, Col, Input, Card } from "antd";
import moment from "moment";
import images from "../../assets/images"
import sendIcon from "../../assets/images/send.png";
import { useEffect, useState, useRef } from "react";
import chatBaseurl from "../../utils/config/url/chat";
import { setInterval } from "timers";
const Conversation = ({ configId, subjectsData, selectedUsers, selectedMainUsers, selectDataMembers, closeConversation }: any) => {
  // const maxRef = useRef([] as any);
  // const PingInterval = 20000; // 60 seconds

  // const [max, setMax] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const updatedMsg = useRef([])

  const loginData = localStorage.getItem("login_detail") || "";
  const logindata = JSON.parse(loginData);

  const loginUser = localStorage.getItem("login_email") || ""
  const { BackArrow_White } = images;
  const [selectedDatasMsgs, setSelectedDatasMsgs] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [ws, setWs] = useState(null as any);
  const [lastReceivedMessageTimestamp, setLastReceivedMessageTimestamp] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("effect")
    // })
    //   ws.onopen = (event: any) => {
    // ReceiveMsg()

    // };
    const url = `ws${chatBaseurl}conversation/message`;
    const ws = new WebSocket(url) as any;
    ws.onopen = (event: any) => {
      // ws.addEventListener("open", (event:any) => {
      const data = {
        "type": "RECEIVE",
        "config_id": configId,
        "members": selectDataMembers,
        "page": page ? page : 1
      }
      console.log("max max body", data)
      // const pingInterval = setInterval(() => {
      //   if (ws && ws.readyState === WebSocket.OPEN) {
      //     ws.send("ping");
      //   }
      // }, PingInterval);
      ws.send(JSON.stringify(data));
      ws.onmessage = (e: any) => {
        console.log("return max max enetred onmessage", e.data)
        const message = JSON.parse(e.data);
        console.log("enetred onmessage e msg message", message, message?.data?.[0])
        setSelectedDatasMsgs(message?.data?.[0]?.message)
        // maxRef.current=message?.data?.[0]?.message

      };
      return () => {
        // clearInterval(pingInterval);
        // console.log("pingInterval",pingInterval)
        ws.close();
      };
    };

  }, [])
  // useEffect(()=>{
  //   const url = `ws${chatBaseurl}conversation/message`;
  //   const websocket = new WebSocket(url);
  //   setWs(websocket);

  //   websocket.onopen = (event) => {
  //     const data = {
  //       type: "RECEIVE",
  //       config_id: configId,
  //       members: selectDataMembers,
  //     };
  //     console.log("data",JSON.stringify(data))
  //     setInterval(()=>{
  //       websocket.onmessage = (event:any) => {
  //         websocket.send(JSON.stringify(data));
  //         console.log("data",JSON.stringify(data))
  //               const message = JSON.parse(event.data);
  //         console.log("data",message)

  //               setSelectedDatasMsgs(message?.data?.[0]?.message);
  //               setMessageData(message?.data?.[0]?.message)
  //             };
  //           },1)   
  //     }




  //   // websocket.onmessage = (event) => {
  //   //   const message = JSON.parse(event.data);
  //   //   setSelectedDatasMsgs(message?.data?.[0]?.message);
  //   // };

  //   return () => {
  //     // Close the WebSocket connection when the component unmounts
  //     websocket.close();
  //   };
  // },[])
  console.log("data configId", configId)
  // wrking code starts
  // useEffect(() => {
  //   console.log("data 2use",configId)
  //   const url = `ws${chatBaseurl}conversation/message`;
  //   const websocket = new WebSocket(url);
  //   setWs(websocket);

  // websocket.onopen = (event) => {
  //   const data = {
  //     type: "RECEIVE",
  //     config_id: configId,
  //     members: selectDataMembers,
  //   };
  //   // setInterval(()=>{
  //     websocket.onmessage = (event:any) => {
  //       websocket.send(JSON.stringify(data));
  //             const message = JSON.parse(event.data);
  //             setSelectedDatasMsgs(message?.data?.[0]?.message);
  //             setMessageData(message?.data?.[0]?.message)
  //           };
  //   // },3000)


  // };



  //   // websocket.onmessage = (event) => {
  //   //   const message = JSON.parse(event.data);
  //   //   setSelectedDatasMsgs(message?.data?.[0]?.message);
  //   // };

  //   return () => {
  //     // Close the WebSocket connection when the component unmounts
  //     websocket.close();
  //   };
  // }, [configId, selectDataMembers]);
  // wrking code ends

  useEffect(() => {
    const url = `ws${chatBaseurl}conversation/message`;
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      const data = {
        type: "RECEIVE",
        config_id: configId,
        members: selectDataMembers,
      };

      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "RECEIVE") {
        const receivedMessageData = message.data?.[0]?.message;
        const latestMessageTimestamp = receivedMessageData?.[0]?.time || 0;

        if (latestMessageTimestamp !== lastReceivedMessageTimestamp) {
          // New message received, update the state
          setSelectedDatasMsgs(receivedMessageData);
          setMessageData(receivedMessageData);

          // Update the last received message timestamp
          setLastReceivedMessageTimestamp(latestMessageTimestamp);
        }
      }
    };

    // return () => {
    //   // Close the WebSocket connection when the component unmounts
    //   ws.close();
    // };
  }, [configId, selectDataMembers, lastReceivedMessageTimestamp]);





  // useEffect(() => {
  //   console.log("ws",ws)
  //   if (ws) {
  //     console.log("ws",ws)
  //     ws.onmessage = (event:any) => {
  //       const message = JSON.parse(event.data);
  //       setSelectedDatasMsgs(message?.data?.[0]?.message);
  //       setMessageData(message?.data?.[0]?.message)
  //     };
  //   }
  // }, [ws]);



  const ReceiveMsg = () => {
    console.log("max received")
    const url = `ws${chatBaseurl}conversation/message`;
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = (event) => {
      const data = {
        type: "RECEIVE",
        config_id: configId,
        members: selectDataMembers,
      };
      setInterval(() => {
        websocket.send(JSON.stringify(data));
        websocket.onmessage = (event: any) => {

          const message = JSON.parse(event.data);
          setSelectedDatasMsgs(message?.data?.[0]?.message);
          setMessageData(message?.data?.[0]?.message)
        };
      }, 5000)
      // return () => {
      //   // Close the WebSocket connection when the component unmounts
      //   websocket.close();
      // };

    };
  }
  // useEffect(() => {
  //   // maxRef.current = max;
  //   const data = {
  //     "type": "RECEIVE",
  //     "config_id": configId,
  //     "members": selectDataMembers,
  //   }
  //   console.log("max max body", data)
  //   ws.send(JSON.stringify(data));
  //   ws.onmessage = (e: any) => {
  //     console.log("max max enetred onmessage", e.data)
  //     const message = JSON.parse(e.data);
  //     console.log("enetred onmessage e msg message", message,message?.data?.[0])
  //     setSelectedDatasMsgs(message?.data?.[0]?.message)
  //     maxRef.current=message?.data?.[0]?.message

  //   };
  // });
  // console.log("max",max)
  // useEffect(() => {
  //   console.log("enetred onmessage useeffect 2")


  // },[])


  const messageSending = () => {

    // console.log("DomainData send from conv", DomainData)
    console.log("selectedUsers", selectedUsers, "selectDataMembers", selectDataMembers)
    const url = `ws${chatBaseurl}conversation/message`;
    const ws = new WebSocket(url) as any;
    // let user = [loginUser] as any
    // let arrayData = selectedUsers
    // let concatData = arrayData.concat(user)
    // let json = [] as any
    // if (selectDataMembers.length > 0) {
    //   json = selectDataMembers;
    // } else {
    //   json = concatData;
    // }

    ws.onopen = (event: any) => {
      const data = {

        "type": "SEND",
        "config_id": configId,
        "members": selectDataMembers,
        "subject": "",
        "party": logindata.party_id,
        "message": [
          {
            "text": updatedMsg.current,
            "sender": loginUser,
            "is_read": true
          }
        ]
      }
      console.log("max xx body", data)
      ws.send(JSON.stringify(data));
      setMessageValue("")
      // updatedMsg.current=""
      // ReceiveMsg()
    };
    // getsocketChatlist()

  }
  const onchangeMessage = (e: any) => {
    setMessageValue(e.target.value)
    updatedMsg.current = e.target.value
  }
  { console.log("return 123") }
  const onclickMore = () => {
    setPage(page + 1)
    const url = `ws${chatBaseurl}conversation/message`;
    const websocket = new WebSocket(url);
    setWs(websocket);

    websocket.onopen = (event) => {
      const data = {
        type: "RECEIVE",
        config_id: configId,
        members: selectDataMembers,
        page: page + 1
      };
      // setInterval(()=>{
      websocket.send(JSON.stringify(data));
      websocket.onmessage = (event: any) => {

        const message = JSON.parse(event.data);
        setSelectedDatasMsgs(message?.data?.[0]?.message);
        setMessageData(message?.data?.[0]?.message)
      };
      // },5000)
      // return () => {
      //   // Close the WebSocket connection when the component unmounts
      //   websocket.close();
      // };

    };
  }

  return (
    <>
      {console.log("return")}
      {/* {console.log("max maxRef",maxRef.current)} */}
      <div className="chat-window-wrapper msg" >
        <div onClick={() => closeConversation(false)} className="BackBtn"><img src={BackArrow_White} alt="Back" />Back</div>
        <Row gutter={24}>
          <Col span={12}>
            {/* <label>party</label> */}
            <div>party</div>
            <Input readOnly defaultValue={selectedMainUsers} />
          </Col>
          <Col span={12}>
            {/* <label>Members</label> */}
            <div>Members</div>
            <Input readOnly defaultValue={selectDataMembers} />
          </Col>
        </Row>
        {subjectsData !== undefined ? subjectsData.length > 0 ?
          <Card style={{ padding: "4px", marginTop: "15px", marginBottom: "15px" }}>
            {subjectsData?.map((item: any) => {
              return (
                <div>
                  {item.label} <span> - </span> <span>{item.xpath}</span>

                </div>
              )
            })}
          </Card>
          : null : null
        }
        {console.log("max selectedDatasMsgs", selectedDatasMsgs)}
        <div style={{ float: "right", fontWeight: 700 }} onClick={onclickMore}>More</div>

        {selectedDatasMsgs !== undefined ? selectedDatasMsgs?.length > 0 && selectedDatasMsgs?.map((playerChat: any, index: any) => {
          console.log("player", playerChat)
          return (
            <div className={"chatwrapperplayer"} key={index}>
              <div className={loginUser === playerChat.sender ? "chatselfplayer" : "chatoppplayer"}  >

                <div
                  className={loginUser === playerChat.sender ? "chat-player-selfword" : "chat-player-oppword"}
                >
                  <p style={{ fontSize: "12px" }}>
                    {playerChat.sender}
                    <p style={{ fontSize: "16px" }}
                    // className={loginUser === playerChat.sender ? "chat-player-selfword" : "chat-player-oppword"}
                    >

                      {playerChat.text}
                    </p>
                  </p>
                </div>

                <p style={{ fontSize: "10px" }}>{moment(playerChat.time).format("lll")}
                  {/* {moment(playerChat.time).format("LT")} */}
                </p>
              </div>
            </div>
          )
        }) : null}
      </div>
      <div className={"input"}>
        <Input type="text" className={"msg_send"} id="msg_send" placeholder="New Message" onChange={onchangeMessage} value={messageValue} />
        <div className={"send"} id="reply" onClick={messageSending} >
          <img src={sendIcon} alt="sendIcon" />
        </div>
      </div>
    </>
  )
}
export default Conversation;