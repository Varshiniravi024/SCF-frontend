import { useState } from "react";
import Main from "./main"
import images from "../../assets/images";
import chatBaseurl from "../../utils/config/url/chat";

import "./chatapp.scss";

const Base = () => {
  const { ChatIcon } = images;
  const [openchat, setopenchat] = useState(false)

  // console.log("totalCount",totalcount)
  const onclickOpenChat = () => {
    setopenchat(!openchat)
  }
  const chatbotClose = (data: any) => {
    setopenchat(data)
    const ws = new WebSocket(`ws${chatBaseurl}conversation/disconnect`);
    //  console.log('socket closing connection 1')
    setTimeout(() => {
      ws.close()
      console.log('socket closing connection 222')

    }, 1000)
    //  ws.close()
    //  console.log('socket closing connection 2')

    //  ws.onclose = () => {
    //     console.log('socket closing connection')
    //     // ws.close()
    //   }

    //   return () => {
    //     ws.close()
    //     console.log('socket closing connection 3')

    //   }
  }
  // useEffect(()=>{
  //   const listener = (event:any) => {
  //     const ws = new WebSocket(`ws${chatBaseurl}conversation/disconnect`);

  //     setopenchat(false)

  //       //  console.log('socket closing connection 1')
  //       // setTimeout(()=>{
  //         ws.close()
  //        console.log('socket closing connection 222 layout')

  //       // },1000)

  //   }
  //   document.addEventListener("mousedown", listener);
  //           document.addEventListener("touchstart", listener);
  //           return () => {
  //             document.removeEventListener("mousedown", listener);
  //             document.removeEventListener("touchstart", listener);
  //           };
  // },[])
  // useEffect(
  //   () => {
  //     const listener = (event:any) => {
  //     console.log("listener",event)

  //       // Do nothing if clicking ref's element or descendent elements
  //       if (!ref.current || ref.current.contains(event.target)) {
  //     console.log("listener 1",event)
  //     setopenchat(false)
  //     const ws = new WebSocket(`ws${chatBaseurl}`) as any;

  //   // setopenchat(false);
  //   console.log()
  //   ws.onClose = () =>{
  //     console.log("close")
  //   }
  //   ws.close();
  // return ws.close();

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
  //   },
  //   [ref]
  //   );

  return (
    <>
      {openchat ?
        <Main chatbotOpen={chatbotClose} />
        :
        <div
          className={"chatContainer"}
          onClick={onclickOpenChat}>
          <span>
            <img src={ChatIcon} alt="chat" />
          </span>
          <div className="TotalCount">{0}</div>
          {/* <div className="TotalCount">{"totalcount"}</div> */}
        </div>
      }
    </>
  )
}
export default Base;
