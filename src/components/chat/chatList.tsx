import { useState, useEffect, useRef } from "react";
import { Select, Input, Card, Tooltip, message } from "antd";
import sendIcon from "../../assets/images/send.png";
import chatBaseurl from "../../utils/config/url/chat";
import baseurl from "../../utils/config/url/base";
import httpClient from "../../utils/config/core/httpClient";
import Conversation from "./conversation"
const Chat = () => {
  const { Option } = Select;
  const [bankUserChat, setBankUserChat] = useState([])
  const [buyerUserChat, setBuyerUserChat] = useState([])
  const [partyUserChat, setPartyUserChat] = useState([]);
  const [selectedMainUsers, setSelectedMainUsers] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [xpathData, setXpathData] = useState([]);
  const [DomainData, setDomainData] = useState({} as any);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectMembers, setSelectedMembers] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [displayMsgCard, setDisplayMsgCard] = useState(false);
  const [ConvoChatList, setConvoChatList] = useState({} as any);
  const [showConversation, setShowConversation] = useState(false)
  // const [cardMembers, setCardMembers] = useState([] as any);
  const [configId, setConfigId] = useState("" as string);
  const loginData = localStorage.getItem("login_detail") || "";
  const logindata = JSON.parse(loginData);
  const loginUser = localStorage.getItem("login_email") || ""
  const updatedMsg = useRef([])
  // const ref = useRef() as any;

  useEffect(() => {

    getDomainConfig()
    //   const listener = (event:any) => {
    //     console.log("listener 11",event)
    //     console.log("listener",ref,"ref",ref.current)

    //       // Do nothing if clicking ref's element or descendent elements
    //       if (!ref.current || ref.current.contains(event.target)) {
    //     console.log("listener 1",event)
    //     console.log("listener 1",event.target)
    //     // setopenchat(false)
    //     const ws = new WebSocket(`ws${chatBaseurl}`) as any;

    //   // setopenchat(false);
    //   console.log("listen close")
    //   // ws.onClose = () =>{
    //   //   console.log("close")
    //   // }
    //   return () => {
    //     // Close the WebSocket connection when the component unmounts
    //     ws.close();
    //   };

    // // return close
    // // return () => {

    // //   //     // Close the WebSocket connection when the component unmounts

    // //   console.log("close2")

    // //     };
    //         // return setopenchat(false);
    //       }
    //       // if(openchat === false){

    //       //   close();
    //       // }
    //       // handler(event);
    //     };
    //     document.addEventListener("mousedown", listener);
    //     document.addEventListener("touchstart", listener);
    //     return () => {
    //       document.removeEventListener("mousedown", listener);
    //       document.removeEventListener("touchstart", listener);
    //     };


    // getsocketChatlist()

    // ws.onopen = (event:any) => {
    //   const data = { 

    //     "type":"RECEIVE",
    //  "config_id":DomainData.id,
    //  "members":json,
    //  "subject":"",
    //  "party" : logindata,
    //  "message":[
    //     {
    //        "text":updatedMsg.current,
    //        "sender":loginUser,
    //        "is_read":false
    //     }
    //  ]
    //   } 
    //   console.log("body",data)
    //   ws.send(JSON.stringify(data));
    // };
  }, [])

  const getsocketChatlist = () => {
    console.log("enetred")
    // const url = `ws${chatBaseurl}conversation/chat_list`;
    const ws = new WebSocket(`ws${chatBaseurl}conversation/chat_list`) as any;

    ws.onopen = (event: any) => {
      console.log('socket opening connection')
      const data = { "email": [logindata.email] }
      ws.send(JSON.stringify(data));
      ws.onmessage = (e: any) => {
        const message = JSON.parse(e.data);
        setConvoChatList(message)

      };
      // ws.onClose = () =>{
      //       console.log("close")
      //     }
      // console.log("enetredddd")

    };
  }
  const getDomainConfig = () => {
    let currentDomain = "" as string;
    if (window.location.href === "http://localhost:3000/ReceivableFinancing" || window.location.href === "http://localhost:3000/ApprovedPayableFinancing" || window.location.href === "http://localhost:3000/Manual") {
      currentDomain = window.location.href
    } else {
      currentDomain = "http://localhost:3000/Misc"
    }


    httpClient
      .getInstance()
      .get(`http${chatBaseurl}configuration/get?domain_url=${currentDomain}`)
      .then((response: any) => {
        setDomainData(response.data.data?.[0])
        // getConfig(response?.data?.data?.[0])

        getChatlist();
        getsocketChatlist()

        const xpathDatas = [] as any
        response.data.data?.[0].xpath?.map((item: any) => {
          console.log("xpath label", item)
          const xpathValue = getElementByXpath(item.xpath)
          const input = xpathValue as HTMLInputElement | null;
          if (input != null) {
            console.log("input", input)
            xpathDatas.push({ label: item.label, xpath: input.value })
          }
          console.log("xpathDatas", xpathDatas)
          setXpathData(xpathDatas)
        })
      })
      .catch((err: any) => {
        message.error("Invalid domain link")
      })
  }
  function getElementByXpath(path: any) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  const getChatlist = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/chat/`)
      .then((resp: any) => {
        // let bankUser = resp.data.data ? resp.data.data[0].chat_users ? resp.data.data[0].chat_users.bank_user : [] : [];
        // let counterpartyUser = resp.data.data ? resp.data.data[0].chat_users ? resp.data.data[0].chat_users.counterparty_user : [] : [];
        // let buyerUser = resp.data.data ? resp.data.data[0].chat_users ? resp.data.data[0].chat_users.buyer_user : [] : [];
        // setChatUsers(resp.data.data ? resp.data.data[0].chat_users ?resp.data.data[0].chat_users :[]:[]);
        // let concatusers = bankUser.concat(counterpartyUser, buyerUser)
        // setChatUsers(concatusers);
        setBankUserChat(resp.data.data?.[0]?.chat_users?.bank_user);
        setBuyerUserChat(resp.data.data?.[0]?.chat_users?.buyer_user);
        setPartyUserChat(resp.data.data?.[0]?.chat_users?.counterparty_user);

      })
  }
  const onSelectUsersList = (e: any) => {
    setSelectedUsers(e)
    setDisplayMsgCard(true);
  }

  const onSelectMainUser = (e: any) => {
    setSelectedMainUsers(e)
    bankUserChat && bankUserChat?.map((item: any) => {
      // if (e === item.bank_name) {
      //   setUsersList(item.users)
      // }
      return e === item.bank_name ? setUsersList(item.users) : null
    })
    buyerUserChat && buyerUserChat?.map((item: any) => {
      if (e === item.party_name) {
        setUsersList(item.users)
      }
    })
    partyUserChat && partyUserChat?.map((item: any) => {
      if (e === item.party_name) {
        setUsersList(item.users)
      }
    })
  }
  const onClickCardList = (e: any) => {
    console.log("e card", e)
    // openDisplayChatCard(true)
    setShowConversation(true)
    // setDisplayChatCard(true);
    // setSelectedDatasMsgs(e.message);
    // setCardMembers()
    setSelectedMembers(e.members);
    setSelectedMainUsers(e.party);
    setConfigId(e.config_id)
    // MessageApi(e);
    // readUpdateApi(e)
    // memberslist = e.members
  }
  const messageSending = () => {
    console.log("DomainData send from conv", DomainData)
    const url = `ws${chatBaseurl}conversation/message`;
    const ws = new WebSocket(url) as any;
    const user = [loginUser] as any
    const arrayData = selectedUsers
    const concatData = arrayData.concat(user)
    let json = [] as any
    if (selectMembers.length > 0) {
      json = selectMembers;
    } else {
      json = concatData;
    }
    //   const data = { 

    //     "type":"SEND",
    //  "config_id":DomainData.id,
    //  "members":json,
    //  "subject":"",
    //  "party" : logindata.email,
    //  "message":[
    //     {
    //        "text":updatedMsg.current,
    //        "sender":loginUser,
    //        "is_read":false
    //     }
    //  ]
    //   } 
    //   console.log("body",data)
    ws.onopen = (event: any) => {
      const data = {

        "type": "SEND",
        "config_id": DomainData.id,
        "members": json,
        "subject": "",
        "party": logindata.party_id,
        "message": [
          {
            "text": updatedMsg.current,
            "sender": loginUser,
            "is_read": false
          }
        ]
      }
      console.log("body", data)
      ws.send(JSON.stringify(data));
    };
    // getsocketChatlist()

  }
  const onchangeMessage = (e: any) => {
    setMessageValue(e.target.value)
    updatedMsg.current = e.target.value
  }
  const closeConversation = (value: any) => {
    console.log("value enetered clo")
    setShowConversation(value)
  }
  return (
    <>
      {showConversation ?

        <Conversation
          configId={configId}
          subjectsData={xpathData}
          selectedUsers={selectedUsers}
          // selectedDatasMsgs={selectedDatasMsgs}  
          selectedMainUsers={selectedMainUsers}
          selectDataMembers={selectMembers}
          // messageSending={messageSending}
          closeConversation={closeConversation}
        // messageValue={messageValue}
        // onchangeMessage={onchangeMessage}
        />
        :
        <>
          <h3 style={{ padding: "10px" }}>chat list</h3>
          <div style={{ display: "", marginBottom: "10px", padding: "10px" }}>
            <Select placeholder="Select party" style={{ width: "95%" }} onChange={onSelectMainUser} >
              {bankUserChat && bankUserChat?.map((item: any) => {
                return (
                  <Option value={item.bank_name} key={item.bank_name}>
                    {item.bank_name}
                  </Option>
                )
              }
              )}
              {buyerUserChat?.map((item: any) => {
                return (
                  <Option value={item ? item.party_name : ""} key={item ? item.party_name : ""}>
                    {item ? item.party_name : ""}
                  </Option>
                )
              }
              )}
              {partyUserChat?.map((item: any) =>
                <Option value={item.party_name} key={item.party_name}>
                  {item.party_name}
                </Option>

                // }
              )}
            </Select>
            <Select placeholder="Select members" style={{ width: "95%" }} onChange={onSelectUsersList} mode="multiple">
              {usersList?.map((item: any) => {
                return (
                  <Option value={item} key={item}>
                    {item}
                  </Option>
                )
              })}
            </Select>
          </div>
          {xpathData?.map((item: any) => {
            return (
              <div style={{ margin: "0 25px" }}>
                {item.label} {" "} {item.xpath}
              </div>
            )
          })}
          {ConvoChatList?.data?.map((item: any) => {
            return (
              <Card onClick={() => onClickCardList(item)} style={{ position: "relative", margin: "15px 20px" }}>
                <div className="TotalunreadMsgs">{item.unread_msgs}</div>
                <div>
                  {item.party} <span>{item.members.length > 2 ? "- Group" : ""}</span>
                </div>
                {item.members[0]}, <span>...+{item.members.length - 1}</span>
                <Tooltip title={item.members} >
                  <span style={{ position: "absolute", bottom: 10, right: 10, border: "1px solid grey", borderRadius: "50px", width: "25px", height: "25px", padding: "2px 10px", textAlign: "center" }}>i</span>
                </Tooltip>
              </Card>
            )
          })}
          {displayMsgCard ?
            <div className={"input"}>
              <Input type="text" className={"msg_send"}
                id="msg_send"
                placeholder="Start a Message" onChange={onchangeMessage} value={messageValue} />
              <div className={"send"}
                id="reply"
                onClick={messageSending} >
                <img src={sendIcon} alt="sendIcon" />
              </div>
            </div>
            : ""}
        </>
      }
    </>
  )
}
export default Chat;