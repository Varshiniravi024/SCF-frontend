import { useState, useEffect } from "react";
import { Currency } from "../../api/base";
import { allInterestType, allInterestRateType } from "../../../redux/action";
import { useSelector } from "react-redux";


// export const CurrencyField = ({ currency }: any) => {
//     const [currencyData, setCurrencyData] = useState([])
//     const getCurrency = async () => {
//         const data = await Currency()
//         setCurrencyData(data)
//     }
//     useEffect(() => {
//         getCurrency()
//     }, [])
//     return (
//         <>
//             {currencyData.map((item: any) => {
//                 if (item.id === currency) {
//                     return `${item.description}`
//                 }
//             })}

//         </>
//     )

// }


export const InterestTypeField = ({ interestType }: any) => {

    const interest_Type_data = useSelector(allInterestType) as any;
    return (
        interest_Type_data?.payload?.interestType?.allInterestType.map((item: any) => {
            if (item.id === interestType) {
                return item.description

            } else if (item.description === interestType) {
                return item.description

            }
        })
    )

}