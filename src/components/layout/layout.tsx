import React, { useState, useEffect, useRef } from "react";
import { Layout, message, Spin } from "antd";
import HeaderComponent from "./header";
import SideNavbarRoutes from "./sideNavbarRoutes";
import SideNavbar from "./sideNavbar";
import { useNavigate } from "react-router";
import ChatApp from "../chat/base";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { useDispatch } from "react-redux";
import { allInterestType, allInterestRateType, allCurrency, allCountry, socketInfoDetails,pageSizeDetails } from "../../redux/action"
import { InterestType } from '../api/base';
import { InterestRateType } from '../api/base';
import { Currency } from "../api/base";
import { Country } from "../api/base";
import { PartyType } from "../../utils/enum/choices";
import { Route, Routes } from "react-router-dom";
import NotFound from "../../utils/page/500"
import Heading from "../common/heading/heading";
import chatBaseurl from "../../utils/config/url/chat";
import socketurl from "../../utils/config/url/socket";
// import ChatApp from "../chat/chat";
const { Content } = Layout;
let mainLayoutStyle = true as any
const LayoutContainer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [layoutStyles, setLayoutStyles] = useState(false)
    const [sideBarWidth, setSideBarWidth] = useState("13%");
    const [mainLayoutWidth, setMainLayoutWidth] = useState("87%");
    const [socketMessages, setSocketMessages] = useState([] as any);
    const [lastReceivedMessageTimestamp, setLastReceivedMessageTimestamp] = useState(0);
    const [isPaused, setPause] = useState(false);
    const ws = useRef(null) as any;
    const pathname = window.location.pathname
    const loginData = localStorage.getItem("login_detail") || "";
    const logindata = JSON.parse(loginData);
    useEffect(()=>{
        const innerwidth = window.innerWidth
        console.log("innerwidth wodth 1",innerwidth)

        if(innerwidth < 1400){
            console.log("innerwidth wodth 2",innerwidth)
            dispatch(
                pageSizeDetails(4)
            )
        }else if(innerwidth > 1400 && innerwidth < 1600){
            console.log("innerwidth wodth 3",innerwidth)
            dispatch(
                pageSizeDetails(5)
            )
        }else if(innerwidth > 1600 && innerwidth < 1800) {
            console.log("innerwidth wodth 4",innerwidth)
            dispatch(
                pageSizeDetails(6)
            )
        }else if(innerwidth > 1800 && innerwidth < 2000) {
            console.log("innerwidth wodth 4",innerwidth)
            dispatch(
                pageSizeDetails(8)
            )
        }else if(innerwidth > 2000){
            console.log("innerwidth wodth 5",innerwidth)
            dispatch(
                pageSizeDetails(9)
            )
        }
        // }else{
        //     console.log("innerwidth wodth 6",innerwidth)

        // }

    },[])

    const layoutStyle = (data: any) => {
        mainLayoutStyle = data
        setLayoutStyles(data)
        if (data !== true) {
            setSideBarWidth("13%")
            setMainLayoutWidth("87%")
        } else {
            setSideBarWidth("7%")
            setMainLayoutWidth("93%")

        }
    }
    const socketInfo = () => {
        const loginData = localStorage.getItem("login_detail") || "";
        const logindata = JSON.parse(loginData);
        const ws = new WebSocket(socketurl);
        let data = {} as any
        ws.onopen = (event: any) => {
            console.log('socket opening connection')
            if (pathname === "/Dashboard") {
                data = {
                    // "record_type": 'ALL',
                    // "party_id": logindata.party_id

                    "party_id": logindata.party_id,
                    "record_type": [
                        {
                            "inbox": "ALL",
                            "sent": "ALL",
                            "sent_aw": "ALL"
                        }
                    ],
                    "data_type": "DASHBOARD",
                    "page_size": 1,
                    "page_number": 1

                }

            }

            //  setInterval(()=>{
            // ws.send(JSON.stringify(data));

            ws.onmessage = (e: any) => {
                console.log("MenuStatusData message layout", e)
                const message = JSON.parse(e.data);
                const receivedMessageData = message;
                const latestMessageTimestamp = receivedMessageData?.[0]?.time || 0;
                console.log("time", receivedMessageData)
                console.log("time", receivedMessageData?.[0])
                if (message !== socketMessages) {
                    setLastReceivedMessageTimestamp(latestMessageTimestamp);
                    console.log("message layout 1", message)

                }
                dispatch(
                    socketInfoDetails(message)
                )
                setSocketMessages(message)
                //   setConvoChatList(message)
                console.log("message layout", message)


            };
            // },20000)
        };

    }
    useEffect(() => {
        ws.current = new WebSocket(socketurl);
        const data = {
            // "record_type": 'ALL',
            // "party_id": logindata.party_id

            "party_id": logindata.party_id,
            "record_type": [
                {
                    "inbox": "ALL",
                    "sent": "ALL",
                    "sent_aw": "ALL"
                }
            ],
            "data_type": "DASHBOARD",
            "page_size": 1,
            "page_number": 1

        }

        // ws.current.onopen = () => console.log("ws opened");
        ws.current.onopen = () => {
            console.log("ws opened");
            ws.current.send(JSON.stringify(data));
            ws.current.onmessage = (e: any) => {
                console.log("MenuStatusData message layout", e)
                const message = JSON.parse(e.data);
            console.log("e msg usseeffect 2", message);

                dispatch(
                    socketInfoDetails(message)
                )
            }
        }
        // ws.current.send(JSON.stringify(data));
        // ws.current.onclose = () => console.log("ws closed");

        const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    }, []);

    useEffect(() => {
        if (!ws.current) return;

        ws.current.onmessage = (e: any) => {
            if (isPaused) return;
            const message = JSON.parse(e.data);
            console.log("e msg usseeffect", message,"isPaused",isPaused);
            dispatch(
                socketInfoDetails(message)
            )
        };
    }, [isPaused]);

    // useEffect(() => {
    //     // setInterval(()=>{
    //     socketInfo()
    //     // },5000)

    // }, [])
    useEffect(() => {
        getInterestType();
        getInterestRateType();
        getCurrency();
        getCountry();
        // mainLayoutStyle=false
        const loginData = localStorage.getItem("login_detail") || "";
        const logindata = JSON.parse(loginData)
        if (logindata.is_administrator === true) {
            httpClient
                .getInstance()
                .get(`${baseurl}finflo/action/?party_id=${logindata.party_id}`)
                .then((response: any) => {
                    if ((logindata.party_type === PartyType.NONE && logindata.status === "NEW" && logindata.onboarding_status === "NONE")) {
                        message.error("")
                        navigate("/")
                        // window.location.reload()
                    } else if ((logindata.party_type === PartyType.NONE && logindata.status === "NEW" && logindata.onboarding_status === "DRAFT") || (logindata.party_type === PartyType.NONE && logindata.status === "IN_PROGRESS" && logindata.onboarding_status === "SENT_TO_COUNTERPARTY")) {
                        navigate("/CounterPartyOnboarding")
                    } else if ((logindata.party_type === PartyType.NONE && logindata.status === "DEACTIVATED" && logindata.onboarding_status === "REJECTED")) {
                        navigate("/Inbox")
                    } else if ((logindata.party_type === PartyType.NONE && logindata.status === "IN_PROGRESS" && logindata.onboarding_status === "SENT_TO_BANK")) {
                        navigate("/Sent")
                    } else if ((response.data.data.length === 0 && logindata.party_type === PartyType.CUSTOMER && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (response.data.data.length === 0 && logindata.party_type === PartyType.NON_CUSTOMER && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (response.data.data.length === 0 && logindata.party_type === PartyType.BANK)) {
                        navigate("/UserAuthorization")
                        // }else{
                        // // }else if ((logindata.party_type === "CUSTOMER" && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (logindata.party_type === "NON-CUSTOMER" && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (logindata.party_type === "BANK")) {
                        //     navigate("/Dashboard")
                    }
                })
        } else {

            if ((logindata.party_type === PartyType.NONE && logindata.status === "NEW" && logindata.onboarding_status === "NONE")) {
                message.error("")
                navigate("/")
                // window.location.reload()
            } else if ((logindata.party_type === PartyType.NONE && logindata.status === "NEW" && logindata.onboarding_status === "DRAFT") || (logindata.party_type === PartyType.NONE && logindata.status === "IN_PROGRESS" && logindata.onboarding_status === "SENT_TO_COUNTERPARTY")) {
                navigate("/CounterPartyOnboarding")
            } else if ((logindata.party_type === PartyType.NONE && logindata.status === "DEACTIVATED" && logindata.onboarding_status === "REJECTED")) {
                navigate("/Inbox")
            } else if ((logindata.party_type === PartyType.NONE && logindata.status === "IN_PROGRESS" && logindata.onboarding_status === "SENT_TO_BANK")) {
                navigate("/Sent")
                //     }else{
                // //    }else if ((logindata.party_type === "CUSTOMER" && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (logindata.party_type === "NON-CUSTOMER" && logindata.status === "ONBOARDED" && logindata.onboarding_status === "COMPLETED") || (logindata.party_type === "BANK")) {
                //         navigate("/Dashboard")
            }
        }


    }, [])
    const getInterestType = async () => {
        const data = await
            InterestType()
        dispatch(
            allInterestType({
                allInterestType: data,
            })
        );
    }

    const getInterestRateType = async () => {
        const data = await InterestRateType()
        dispatch(
            allInterestRateType({
                allInterestRateType: data,
            })
        );
    }

    const getCurrency = async () => {
        const data = await Currency()
        dispatch(
            allCurrency({
                allCurrency: data,
            })
        );
    }

    const getCountry = async () => {
        const data = await Country()
        dispatch(
            allCountry({ allCountry: data })
        );
    }

    const getLoading = (data: string) => {
        setIsLoading(true)
    }

    return isLoading ? <Spin /> : (
        <React.Fragment>
            <div className="App" style={{ position: "relative" }}>

                <Layout >
                    <Layout>
                        <div style={{ width: sideBarWidth }}>
                            <SideNavbar LayoutStyle={layoutStyle} />
                        </div>
                        <div style={{ width: mainLayoutWidth }}>
                            <Layout className={"mainLayoutContainer"} >
                                <HeaderComponent loading={getLoading} width={mainLayoutWidth}></HeaderComponent>
                                {/* <Heading flag="" text="dashboard" subText="" /> */}
                                <Content className="contentLayout">
                                    <SideNavbarRoutes width={mainLayoutWidth} />
                                </Content>
                                <ChatApp />
                            </Layout>
                        </div>
                    </Layout>

                </Layout>

            </div>

        </React.Fragment>
    );
    //   }
}
export default LayoutContainer;
