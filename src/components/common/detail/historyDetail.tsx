import { Row, Col, Button, Input } from "antd";
import React from "react";
// import BasicDetails from "../detail/Program/basicDetails";
// import CounterPartyDetail from "../detail/Program/counterPartyDetail";
import { useSelector } from "react-redux";
import {
  inbox_programDetails
} from "../../../redux/action";

interface IProps {
  flag: any;
  fromMenu: string;
}
const ProgramDetail = (props: React.PropsWithChildren<IProps>) => {
  const program_details = useSelector(inbox_programDetails);
  const program_detail = program_details?.payload?.inboxProgramDetail;
  const { TextArea } = Input;
  const onClickExit = () => {
    props.flag("historyPage");
  };

  return (
    <div>
      <div className="programHeading">
        <Row gutter={24}>
          <Col span={20}>HistoryDetail</Col>
        </Row>
      </div>
      <div className="SummaryContainer">
        {/* <BasicDetails flag={"historyDetail"} fromMenu={"historyDetail"} />
        <CounterPartyDetail flag={"historyDetail"} fromMenu={"historyDetail"} /> */}
      </div>
      <div className="SummaryContainer">
        <div className="SummaryLabel">Comments</div>
        <TextArea style={{ width: "50%", margin: "0px 10px" }} readOnly value={program_detail ? program_detail.comments : ""} />
      </div>
      <Row style={{ marginTop: "3%" }}>
        <Col span={10}></Col>
        <Col span={3}>
          <Button className="SaveButton" onClick={onClickExit}>
            Exit
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default ProgramDetail;