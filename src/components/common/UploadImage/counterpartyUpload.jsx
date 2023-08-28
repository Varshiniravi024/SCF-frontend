import { useState } from "react";
import pdfImage from "../../../assets/images/pdfImage.png";
import closeUploadedDoc from "../../../assets/images/closeUploadedDoc.png";
import imageBaseurl from "../../../utils/config/url/image"

export const CounterpartyUploadImage = (props) => {
  const [selectedFileData, setSelectedFileData] = useState([]);

  const removeImage = (e) => {
    setSelectedFileData(selectedFileData.filter((item, index) => index !== e));
    props.selectedFiles(selectedFileData.filter((item, index) => index !== e));
  };
   
  const changeHandler = (e) => {
    const files = e.target.files;
    if (files.length) {
      const file = Array.prototype.slice.call(files);
      const uploaded = [...selectedFileData];
      const uploadedDetails = [...selectedFileData];
      setSelectedFileData(uploaded, uploaded.push(file));
      props.selectedFiles(uploadedDetails, uploadedDetails.push(file));
    }
  };
  return (
    <div
    style={{height:"126px"}}
    >
       <div
        style={{
          border: "1px dashed #C9C9C9",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          width: "105px",
          height: "125px"
        }}
      >
        <label
          htmlFor="filePickers"
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            margin: "auto",
            padding: "0",
            textAlign:"center",
            cursor:"pointer"
          }}
        >
          
          Upload Document
        </label>
      </div>
      <input
        id="filePickers"
        type="file"
        style={{ border: "1px solid #000000", visibility: "hidden" }}
        name="file"
        onChange={changeHandler}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8,1fr)",
          gridRowGap: "11%",
          gridColumnGap: "1%",
          borderRadius: "5px",
          gap: "10px",
          position:"absolute",
          top:10,
          left:"145px"
        }}
      >
        {selectedFileData
          ? selectedFileData.length > 0
            ? selectedFileData.map((file, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      border: "1px dashed #C9C9C9",
                      borderRadius: "5px",
                      alignItems: "center",
                      width: "105px",
                      height: "125px",
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
        {props?.attachmentFiles.length > 0 ? 
        (props.attachmentFiles.map((files, index)=> {
          let imageValue = files.file_path.split("/")
                  let lastValue = imageValue.pop()
         return(
    <div key={index} style={{border: '1px dashed #006666', borderRadius: '5px', alignItems: 'center', width: '100px', height: '130px',position: 'relative', padding: 10, paddingRight: 5}}>
              <img src={closeUploadedDoc} alt="closeUploadedImage" onClick={() => removeImage(index)} style={{objectFit: 'cover', width: '10px', height: '10px', position: 'absolute', right: 6}} />
              <img src={imageBaseurl+files.file_path} alt="selectedImage" style={{objectFit: 'cover', width: '70px', height: '70px', top: 20, position: 'absolute'}}/>
              <p style={{position: 'absolute', bottom: 0, fontSize: 12, color: '#006666'}}>
              {lastValue.length > 10 ? lastValue.substring(0, 7) + "..." : lastValue}
                </p>
            </div>
          )
        }))
        : null
        }
      </div>
    </div>
  );
};
