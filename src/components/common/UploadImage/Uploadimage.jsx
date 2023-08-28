import { useState } from "react";
import pdfImage from "../../../assets/images/pdfImage.png";
import closeUploadedDoc from "../../../assets/images/closeUploadedDoc.png";
import imageBaseurl from "../../../utils/config/url/image";
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

  const removeImage = (e) => {
    setSelectedFile(selectedFile.filter((item, index) => index !== e));
    props.selectedFiles(selectedFile.filter((item, index) => index !== e));
  };
  

  return (
    <div>
      <div
        style={{
          border: "1px dashed #000000",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        <label
          htmlFor="filePicker"
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            margin: "auto",
            cursor:"pointer"
          }}
        >
          {/* <img src={uploadDocs} alt="uploadDocument" style={{width:"40px",margin:"auto"}}/> */}
          Upload Document
        </label>
      </div>
      <input
        id="filePicker"
        type="file"
        style={{ border: "1px solid #000000", visibility: "hidden" }}
        name="file"
        onChange={changeHandler}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gridRowGap: "11%",
          gridColumnGap: "3%",
          borderRadius: "5px",
          gap: "10px",
          width: "100%",
        }}
      >
        {selectedFile
          ? selectedFile.length > 0
            ? selectedFile.map((file, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      border: "1px dashed #006666",
                      borderRadius: "5px",
                      alignItems: "center",
                      width: "100px",
                      height: "130px",
                      position: "relative",
                      padding: 10,
                      paddingRight: 5,
                    }}
                  >
                    <img
                      src={closeUploadedDoc}
                      alt="closeUploadedImage"
                      onClick={() => removeImage(index)}
                      style={{
                        objectFit: "cover",
                        width: "10px",
                        height: "10px",
                        position: "absolute",
                        right: 6,
                      }}
                    />
                    {file[0].name.substr(file[0].name.length - 3) === "pdf" ? (
                      <img
                        src={pdfImage}
                        alt="pdfImage"
                        style={{
                          objectFit: "cover",
                          width: "45px",
                          height: "60px",
                          position: "absolute",
                          top: 20,
                        }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(file[0])}
                        alt="selectedImage"
                        style={{
                          objectFit: "cover",
                          width: "70px",
                          height: "70px",
                          top: 20,
                          position: "absolute",
                        }}
                      />
                    )}
                    <p
                      style={{
                        position: "absolute",
                        bottom: 0,
                        fontSize: 12,
                        color: "#006666",
                      }}
                    >
                      {file[0].name}
                    </p>
                  </div>
                );
              })
            : null
          : []}
        {props
          ? props.attachmentFiles.length > 0
            ? props.attachmentFiles.map((files, index) => {
              let imageValue = files.file_path.split("/")
                  let lastValue = imageValue.pop()
                return (
                  <div
                    key={index}
                    style={{
                      border: "1px dashed #006666",
                      borderRadius: "5px",
                      alignItems: "center",
                      width: "100px",
                      height: "130px",
                      position: "relative",
                      padding: 10,
                      paddingRight: 5,
                    }}
                  >
                    <img
                      src={closeUploadedDoc}
                      alt="closeUploadedImage"
                      onClick={() => removeImage(index)}
                      style={{
                        objectFit: "cover",
                        width: "10px",
                        height: "10px",
                        position: "absolute",
                        right: 6,
                      }}
                    />
                     <img
                      src={imageBaseurl + files.file_path}
                      alt="selectedImage"
                      style={{
                        objectFit: "cover",
                        width: "70px",
                        height: "70px",
                        top: 20,
                        position: "absolute",
                      }}
                    />
                    

                    <p
                      style={{
                        position: "absolute",
                        bottom: 0,
                        fontSize: 12,
                        color: "#006666",
                      }}
                    >
                      {lastValue.length > 10 ? lastValue.substring(0, 7) + "..." : lastValue}
                    </p>
                  </div>
                );
              })
            : null
          : []}
      </div>
    </div>
  );
};
