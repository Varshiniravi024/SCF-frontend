import {Row,Col} from 'antd';
interface Iprops {
    flag:string,
    text:any,
    subText:any
}
const Heading = ({flag,text,subText}:Iprops) => {
{console.log("text",text)}


    return(
       <div>
            {console.log("text",text)}
             <div className="HeadingTxt">{text}
             {subText ? <span> {subText}</span>:null}
             </div>

        {/* <Row>
          <Col span={22}>
          <div className="HeadingTxt"> Dashboard</div>

          </Col>
          <Col span={2}>
          <div
          className="filterContainer"
        //   style={{ 
        //   zIndex: 2, 
        //  }}
          onClick={onClickFilter}
        >
          <Dropdown.Button
            trigger={['click']}
            icon={<img src={FilterIcon} alt="filter" />}
            overlay={ menu }
          >

          </Dropdown.Button>
        </div>
            </Col>
        </Row> */}
        </div>
    )
}
export default Heading;