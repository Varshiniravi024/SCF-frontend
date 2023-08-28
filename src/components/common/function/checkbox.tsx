
import {Input} from "antd"

export const CheckboxField = ({onchange,defaultChecked,value}:any) => {
    return(
        <Input type="checkbox" onChange={(e:any)=>onchange(e.target.checked)}
        defaultChecked={defaultChecked}
        defaultValue={defaultChecked} value={defaultChecked} className="checkboxContainer"/>
    )

}