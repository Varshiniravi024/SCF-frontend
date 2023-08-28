import { Tabs, Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import AllContainer from "../list/all";
import { TabPaneFunc } from "./tabPane";
import "./tabPane.scss";
import Heading from "../heading/heading";

interface IProps {
    fromMenu: string;
    recordType?: string;
}
const ApprovedPayable = (props: React.PropsWithChildren<IProps>) => {

    const { TabPane } = Tabs;
    const [tabList, setTabList] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false)

    const callback = (key: string) => {
        console.log(key)
    };

    useEffect(() => {
        setIsLoading(true)
        const data = TabPaneFunc(props)
        setTabList(data);
        setTimeout(() => {
            setIsLoading(false)
        }, 5)
    }, [props])

    return isLoading ? <Spin /> : (
        <React.Fragment>
            <div className="fixedContainer">
                <Heading flag={props.fromMenu === "sent_awap" ? "Sent for Sign" : props.fromMenu} text={props.fromMenu === "sent_awap" ? "Sent for Sign" : props.fromMenu} subText="" />
            </div>
            <div className="TabContainer mainContentContainer"
            // style={{paddingTop:"45px"}}
            >
                {/* <div className="HeadingTxt">{props.fromMenu === "sent_awap" ? "Sent for Sign" :props.fromMenu}</div> */}
                {/* <h1 className="HeadingTxt">{props.fromMenu === "sent_awap" ? "Sent for Sign" :props.fromMenu}</h1> */}
                <Card className="tableContainer" >
                    {props.fromMenu === "Inbox"}
                    <Tabs defaultActiveKey="1" onChange={callback} id={`${props.fromMenu}_tabs`}
                     items={tabList.map((value: any, index: number) =>  (
                        props.fromMenu !== "inbox" && value.Name === "Awaiting Sign" ? "" :
                         {
                        key: value.Name,
                        label: value.Name,
                        id: value.Name,
                        children: <AllContainer
                        fromMenu={props.fromMenu}
                        fromMenuValue={props.fromMenu}
                        recordType={value.recordType}
                    />
                    }))}
                    />
                </Card>
            </div>
        </React.Fragment>
    );
};

export default ApprovedPayable;
