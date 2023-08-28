import { useState } from "react";
import { Row, Col } from "antd";
import "../../new.scss";

export const UploadImage = (props) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const changeHandler = (e) => {
    const files = e.target.files;
    if (files.length) {
      const file = Array.prototype.slice.call(files);
      const uploaded = [...selectedFile];
      const uploadedDetails = [...selectedFile];
      setSelectedFile(uploaded, uploaded.push(file));
      props.selectedFiles(uploadedDetails, uploadedDetails.push(file));
    }
  };
  return (
    <div>
      <Row gutter={24} style={{ marginTop: "5%" }}>
        <Col span={2}></Col>
        <Col span={3} className="labelContainer" 
        // style={{ color: "#006666", fontSize: "16px" }}
        >
          File to upload
        </Col>
        <Col span={5}>
          <input
            id="filePicker"
            type="file"
            name="file"
            onChange={changeHandler}
          />
        </Col>
      </Row>
    </div>
  );
};
export default UploadImage;
