import { useSelector } from "react-redux";
import { allCurrency, allInterestType, allInterestRateType, allCountry } from "../../../redux/action";
import images from "../../../assets/images";
import { Select } from "antd";
import { InterestDeduction, InterestPaidByData } from "../../../utils/validators/dropdown";
import Reducer from "../../../redux/reducer";
import userReducer from "../../../redux/reducer";
export const DropdownField = ({ id, disabled, defaultVal, flag, onchange }: any) => {

  const { DropdownIcon } = images;
  const { Option } = Select;

  const Currency_Data = useSelector(allCurrency);
  // const datas = Reducer(allCurrency)
  const InterestType_Data = useSelector(allInterestType);
  const InterestRatetype_Data = useSelector(allInterestRateType);
  const Country_Datas = useSelector(allCountry)
  const Country_Data = Country_Datas?.payload?.countryData?.allCountry

  let mappingData;

  switch (flag) {
    case "currency":
      mappingData = Currency_Data.payload.currencyData.allCurrency;
      break;
    case "interestType":
      mappingData = InterestType_Data.payload.interestType.allInterestType;
      break;
    case "interestRateType":
      mappingData = InterestRatetype_Data.payload.interestRateType.allInterestRateType;
      break;
    case "interestPaidBy":
      mappingData = InterestPaidByData;
      break;
    case "interestDeduction":
      mappingData = InterestDeduction;
      break;
    case "country":
      mappingData = Country_Data
      break;
    default:
      mappingData = [];
      break;
  }

  return (
    <Select
      id={id}
      showSearch={flag === "currency" || flag === "country" ? true : false}
      placeholder="Select"
      optionFilterProp="children"
      defaultValue={defaultVal}
      onChange={(e: any) => onchange(e)}
      style={{ width: "" }}
      disabled={disabled}
      suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
      onBlur={(e: any) => onchange(e)}
    >
      {/* {console.log("data mappingData",mappingData)} */}
      {mappingData?.map((item: any, index: number) => {
        return (
          <Option value={item.id} key={item.description}>
            {flag === "country" ? item.country : item.description}
          </Option>
        );
      })}
    </Select>
  )
}