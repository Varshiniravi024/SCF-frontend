import { allCurrency } from "../../../redux/action";
import { useSelector } from "react-redux";

const CurrencyField = ({ currencyvalue, amount }: any) => {

    const currency_data = useSelector(allCurrency);

    return (
        <div>
            {
                currency_data?.payload?.currencyData?.allCurrency?.map((value: any,index:any) => {
                    if (currencyvalue === value.id) {
                        return <div key={index}>{value.description} <span> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}</span></div>
                    } else if (currencyvalue === value.description) {
                        return  <div key={index}>{value.description} <span> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}</span></div>
                    }
                })
            }
        </div>
    )

}

export default CurrencyField;