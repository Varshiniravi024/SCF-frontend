import React, { useState, useEffect } from "react";
import { Spin, Input } from "antd";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { useDispatch } from "react-redux";
import { allInbox } from "../../../redux/action";
import TableComponent from "../table/Table";
import { inboxCount_data, draftCount_data } from "../../../redux/action";
import { useNavigate } from "react-router";
interface IProps {
  fromMenu: any;
  fromMenuValue: any;
  recordType: string;
}
const AllContainer = (props: React.PropsWithChildren<IProps>) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate()
  const [MessagesData, setMessagesData] = useState([]);
  const [isLoading, SetIsLoading] = useState(true);
  const getListApi = () => {
    SetIsLoading(true)
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/${props.fromMenu}/?record_type=${props.recordType}`)
      .then((resp: any) => {
        if (props.fromMenu === "inbox") {
          dispatch(
            inboxCount_data(resp.data.unread_messages)
          )

        } else if (props.fromMenu === "draft") {
          dispatch(
            draftCount_data(resp.data.unread_messages)
          )
        }
        if (props.fromMenu === "sent_awap" || (props.fromMenu === "inbox" && props.recordType === "AW_SIGN") || (props.fromMenu === "inbox" && props.recordType === "PROGRAM")) {
          const AwaitingApproval = [] as any;
          if (resp.data.data.length > 0) {
            resp.data.data.map((item: any, index: any) => {
              if (item.next_available_transitions) {
                if (item.next_available_transitions.length !== 0) {
                  AwaitingApproval.push(item);
                  setTimeout(() => {
                    SetIsLoading(false);
                    setMessagesData(AwaitingApproval);
                  }, 2000);
                } else {
                  SetIsLoading(false);
                }
              } else {
                SetIsLoading(false);
                if ((props.fromMenu === "inbox" && props.recordType === "PROGRAM")) {
                  setMessagesData(resp.data.data)
                }
              }
            });
          } else {
            SetIsLoading(false);
          }
        } else {
          SetIsLoading(false);
          setMessagesData(resp.data.data);
          dispatch(
            allInbox({
              allInbox: resp.data.data,
            })
          );
        }
      })
      .catch(() => {
        Navigate("/Notfound")
      })
  }

  useEffect(() => {
    getListApi();
  }, [props.fromMenu, props.recordType]);

  return isLoading ? (
    <Spin />
  ) : (
    <div className="allContainer">
      <TableComponent
        datas={MessagesData}
        fromPage={""}
        fromMenu={props.fromMenu}
        recordType={props.recordType}
      />
    </div>
  );
};
export default AllContainer;
