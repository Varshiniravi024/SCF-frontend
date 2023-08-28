import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/login";
import React from "react";
import "./App.scss";
import LayoutContainer from "./components/layout/layout";
import Internet from "./utils/page/internet";
import Oops from "./utils/page/oops";

class App extends React.Component {
  public state = {
    error: "",
    errorInfo: "" as any,
    isDisconnected: false,
  };
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }
  componentDidMount() {
    this.handleConnectionChange();
    window.addEventListener("online", this.handleConnectionChange);
    window.addEventListener("offline", this.handleConnectionChange);
  }


  componentWillUnmount() {
    window.removeEventListener("online", this.handleConnectionChange);
    window.removeEventListener("offline", this.handleConnectionChange);
  }
  handleConnectionChange = () => {
    const condition = navigator.onLine ? "online" : "offline";
    if (condition === "online") {
      const webPing = setInterval(() => {
        fetch("//google.com", {
          mode: "no-cors",
        })
          .then(() => {
            this.setState({ isDisconnected: false }, () => {
              return clearInterval(webPing);
            });
          })
          .catch(() => this.setState({ isDisconnected: true }));
      }, 2000);
      return;
    }

    return this.setState({ isDisconnected: true });
  };

  render() {
    // console.log("Current Automation Version: 1.0.x")
    // console.log("Current Dev Version: 1.0.x")
    // console.log("Current Beta Version: 1.0.x")
    // console.log("Current test Version: 1.0.x")
    const { isDisconnected } = this.state;
    if (this.state.errorInfo) {
      return (
       <Oops/>
      );
    }

    return (
      <React.Fragment>
        {isDisconnected ? (
          <Internet />
        ) : (
          localStorage.getItem("token") !== null ?
            <LayoutContainer />
            :
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
        )}
      </React.Fragment>
    );
  }
}
export default App;
