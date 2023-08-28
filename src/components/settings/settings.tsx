import { Tabs, Card } from "antd";
import Transaction from "./transactions/tab";
import Users from "./users/users";
import "./settings.scss"
import Heading from "../common/heading/heading";
const Settings = () => {
    const { TabPane } = Tabs;
    const callback = (key: string) => {
        console.log(key)
    };
    const items = [
        {
            label: "Transaction",
            key: "1",
            children: <Transaction />
        },
        {
            label: "Users",
            key: "2",
            children: <Users />
        }
    ]
    return (
        <div className="settingsMainContainer">
            <div className="fixedContainer">
                <Heading flag="Settings" text="Settings" subText="" />
            </div>
            <div className="mainContentContainer">
                <Card className="CardContainer">
                    <Tabs defaultActiveKey="1" onChange={callback} type="card" className="settingsTabContainer" items={items} />

                </Card>
            </div>
        </div>
    )
}
export default Settings