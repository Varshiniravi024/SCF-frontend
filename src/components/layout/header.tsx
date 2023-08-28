import { useEffect, useState } from "react";
import { Avatar, Button, Modal, message, Badge, Drawer, Card } from "antd";
import httpClient from "../../utils/config/core/httpClient";
import { useNavigate } from "react-router-dom";
import Images from "../../assets/images";
import "./layout.scss";
import baseurl from "../../utils/config/url/base";
import { io } from 'socket.io-client';
import Chat from "./chat";
// import useWebSocket, { ReadyState } from "react-use-websocket";

const HeaderContainer = (props: any) => {
  console.log("mainLayoutWidth", props)
  // let socket = io('http://192.168.1.179:8000/`);
  // console.log("socket",socket)
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // console.log("isConnected",isConnected)
  // console.log(socket,"socket")
  const navigate = useNavigate();
  const { VenzoLogo, NotificationIcon, CloseIcon } = Images;
  const [loginDetail] = useState(localStorage.getItem("login_detail") as any);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileData, setProfiledata] = useState({} as any);
  const [notificationCount, setNotificationCount] = useState(0 as any);
  const [openDrawer, setOpenDrawer] = useState(false as any);
  const [notificationInfo, setNotificationInfo] = useState([])
  const showModal = () => {
    setIsModalVisible(true);
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/logout/`)
      .then((resp: any) => {
        message.success(resp.data.status)
        localStorage.clear();
        props.loading("true")
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000)
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);

  };

  useEffect(() => {
   httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/profile/`)
      .then((resp: any) => {
        setProfiledata(resp.data.data[0]);
      });
    // notificationData()
  }, []);


  const notificationData = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/notification/`)
      .then((resp: any) => {
        setNotificationInfo(resp.data?.data)
        setNotificationCount(resp.data.message_count)
      })
    // socket.emit('my_event');
    // socket.emit("get_notification");

  }
  const closeOneNotification = (data: any) => {
    //   const body = {
    //     is_read : false,
    //     model_type:props.fromMenu === "inbox"|| props.fromMenu === "draft" ? "WF" :"WE",
    //     id:data.id
    //   }
    // httpClient
    // .getInstance()
    // .put(`${baseurl}api/message/update/${data.id}/`,body)
    // .then((resp: any) => {   
    // })
  }
  // useEffect(() => {
  //   const handleOutsideClick = (event:any) => {
  //     // if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       setIsModalVisible(false);
  //     // }
  //   };

  //   if (isModalVisible) {
  //     document.addEventListener('mousedown', handleOutsideClick);
  //   } else {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, [isModalVisible]);
  return (
    <div className="profileContainer" style={{ width: props.width }}>
      {/* <Chat/> */}
      {/* <Input
        className="inputSearchField"
        placeholder="Search"
        suffix={<img src={Search} alt="search" />}
      /> */}
      <>
        <Badge count={notificationCount} showZero className="notificationImg">
          <img
            src={NotificationIcon}
            alt="Notification"
            // className="notificationImg"
            onClick={showDrawer}
          />
        </Badge>
        <Drawer title="" placement="right" onClose={onCloseDrawer} open={openDrawer} >
          <>
            <a className="clearAllNotification">Clear all</a>
            {notificationInfo?.map((item: any) => {
              const type = item?.model_type.split(".")
              return (
                <Card className="notificationCard">
                  <img src={CloseIcon} alt="CloseIcon" className="notificationCloseIcon" onClick={() => closeOneNotification(item)} />
                  <div className="noticationText"><p >Type:</p><span>{type?.[1]} </span></div>
                  <div className="noticationText"><p >Status:</p><span>{item?.interim_state} </span></div>
                </Card>
              )
            })}
          </>
        </Drawer>
      </>
      <div className="profileDetail">
        <h3>{JSON.parse(loginDetail).party}</h3>
        <p>{JSON.parse(loginDetail).display_name}</p>
      </div>
      <p></p>
      <Button className="ProfileImg" onClick={showModal} id="profile_modal">
        <Avatar
          icon={
            <img src={VenzoLogo} alt="VenzoLogo" className="profileAvatar" />
          }
        />
      </Button>
      <Modal
      // maskClosable={true}
        title={
          <div className="profileCard">
            <Button className="ProfileImg">
              <Avatar
                icon={
                  <img
                    src={VenzoLogo}
                    alt="VenzoLogo"
                    className="profileAvatar"
                  />
                }
              />
            </Button>
            <div className="profileDetail">
              <h3>{JSON.parse(loginDetail).party}</h3>
              <p>{JSON.parse(loginDetail).display_name}</p>
            </div>
          </div>
        }
        open={isModalVisible}
        okButtonProps={{
          type: "primary",
          size: "large",
          style: {
            fontSize: "14px",
            fontWeight: 500,
            color: "#006666",
            border: "1px solid #006666",
          },
          ghost: true,
          id: "SignOut"
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={handleOk}
        okText={"Sign Out"}
        onCancel={handleCancel}
      >
        <h3>Manage Account</h3>

        <div>{profileData.email}</div>
        <div>{profileData.phone}</div>
      </Modal>
    </div>
  );
};
export default HeaderContainer;
