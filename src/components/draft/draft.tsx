import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Spin, Card } from "antd";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import "./draft.scss";
import TableComponent from "../common/table/Table";
import Heading from "../common/heading/heading";
import { socketInfoDetails } from "../../redux/action";

const Draft = () => {
  const [isLoading, SetIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const socketInfoDetailsData = useSelector(socketInfoDetails);
  const draftData = socketInfoDetailsData?.payload?.socketInfo

  // useEffect(() => {
  //   // httpClient
  //   //   .getInstance()
  //   //   .get(`${baseurl}api/message/draft/`)
  //   //   .then((resp: any) => {
  //   //     setDataSource(resp.data.data);
  //       SetIsLoading(false);
  //     // });

  // }, []);

  return isLoading ? (
    <Spin />
  ) : (
    <div className="tableContainer">
      <div className="fixedContainer">
        <Heading flag="draft" text="Draft" subText="" />
      </div>
      <div className="allContainer mainContentContainer">
        <Card className="CardContainer">
          <TableComponent
            datas={draftData?.message_data?.draft?.data}
            // datas={dataSource}
            fromMenu={"draft"}
            fromPage={"draft"}
            recordType={""}
          />
        </Card>
      </div>
    </div>
  );
};

export default Draft;
