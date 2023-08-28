import { useState, useEffect } from "react";
import Images from "../../assets/images";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { menuStatus_data, inboxCount_data, draftCount_data,socketInfoDetails } from "../../redux/action";
import { MenuStatus } from "../api/base";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { PartyType, Status, OnboardingStatus } from "../../utils/enum/choices";

const SideNavbar = ({ LayoutStyle }: any) => {
  const { Sider } = Layout;
  const dispatch = useDispatch();
  const MenuStatusDatas = useSelector(menuStatus_data);
  // const MenuStatusData = MenuStatusDatas?.payload?.menuStatus
  const socketInfoDetailsData = useSelector(socketInfoDetails);
  const MenuStatusData = socketInfoDetailsData?.payload?.socketInfo
  const draftcounts = useSelector(draftCount_data)
  const draftcount = draftcounts?.payload?.draftCount
  const inboxcounts = useSelector(inboxCount_data)
  const inboxcount = inboxcounts?.payload?.inboxCount
  const [selectedKey, setSelectedKey] = useState("");
  const [meustatusData, setMenuStatusData] = useState('');
  const [Profiledata, setProfiledata] = useState(false);
  const [repaymentData, setRepaymentData] = useState([]);
  const [pendingInvoiceData, setPendingInvoiceData] = useState([]);
  const [enableNewmenu, setEnableNewMenu] = useState(true)
  const { managescfIcon, manageUserIcon, newIcon, InboxIcon, draftIcon, sentIcon,
    enquiryIcon, settingIcon, krediq, SelectedManageUsers, SelectedManageScf, SelectedDraft, SelectedInbox,
    SelectedEnquiry, SelectedNew, SelectedSent, SelectedSetting, SelectedSentforSign, SentforSign, DashboardIcon, SelectedDashboard,
    krediqLogo, SelectedRepayment, Repayment, SelectedInvoice, Invoice
  } = Images;

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleMenuOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const [collapsed, setCollapsed] = useState(false);
  const [adjustWidth, setAdjustWidth] = useState(false);
  const [disableMenu, setDisabledMenu] = useState(localStorage.getItem("enableMenu") !== null ? localStorage.getItem("enableMenu") === "true" ? true : false : false)
  const loginData = localStorage.getItem("login_detail") || "";
  const logindata = JSON.parse(loginData)
  const { SubMenu } = Menu;
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setAdjustWidth(!adjustWidth)
    LayoutStyle(!adjustWidth)
    if (adjustWidth === true) {
      setEnableNewMenu(false)
    } else {
      setEnableNewMenu(true)
    }
  };
  const pathname = window.location.pathname
  const SideMenuBar =
    // (Profiledata !== true) && (meustatusData !== "DISABLED") && (pendingInvoiceData.length >0)?
    [
      {
        key: "0",
        image: pathname === "/Dashboard" || pathname === "/ProgramDetailView" ? SelectedDashboard : DashboardIcon,
        menuItemText: "Dashboard",
        route: "/Dashboard",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/Dashboard" || pathname === "/ProgramDetailView" ? "activeMenu" : "",
        id: "Dashboard"
      },
      {
        key: "1",
        menuItemText: "Manage SCF",
        route: "/ManageScf",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || localStorage.getItem("user") === "NonCustomer" ? true : JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/ManageScf" || pathname === "/ApprovedPayableFinancing" || pathname === "/ReceivableFinancing" || pathname === "/Inbox/ProgramModify" ? "activeMenu" : "",
        image: pathname === "/ManageScf" || pathname === "/ApprovedPayableFinancing" || pathname === "/ReceivableFinancing" || pathname === "/Inbox/ProgramModify" ? SelectedManageScf : managescfIcon,
        id: "Manage SCF"
      },
      {
        key: "2",
        menuItemText: "Manage Users",
        route: "/ManageUsers",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/ManageUsers" ? "activeMenu" : "",
        image: pathname === "/ManageUsers" ? SelectedManageUsers : manageUserIcon,
        id: "Manage Users"
      },

      {
        key: "3",
        menuItemText: "New",
        route: "/New",
        disabledMenu: disableMenu === true ? true :
          (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
            ? true : (MenuStatusData && MenuStatusData?.status_data?.[0]?.menu_status === "DISABLED") || localStorage.getItem("user") === "Bank" ? true : false,
        // className: pathname === "/New" || pathname === "/Repayment" || pathname === "/RepaymentDetail" || pathname === "/RepaymentCustomer" || pathname === "/Manual" || pathname === "/Repayment" || pathname === "/Invoice" || pathname === "/NewAccount" || pathname === "/Upload" || pathname === "/UploadDetail" ? "activeMenu" : "",
        image: pathname === "/New" || pathname === "/Repayment" || pathname === "/RepaymentDetail" || pathname === "/RepaymentCustomer" || pathname === "/Manual" || pathname === "/Repayment" || pathname === "/Invoice" || pathname === "/NewAccount" || pathname === "/Upload" || pathname === "/UploadDetail" ? SelectedNew : newIcon,
        id: "New",
        subMenu: [
          ...(localStorage.getItem("user") !== "Bank") ?

            [{
              key: "3.1",
              menuItemText: "Invoice",
              route: "/New",
              disabledMenu: (MenuStatusData && MenuStatusData?.status_data?.[0]?.menu_status === "DISABLED") ? true :
                (logindata.party_type === PartyType.NONE && logindata.status === Status.NEW && logindata.onboarding_status === OnboardingStatus.DRAFT) || (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STC) ? true :
                  (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
                    ? true : false,
              className: pathname === "/New" ? "activeMenu" : "",
              image: pathname === "/New" ? SelectedInvoice : Invoice,
              id: "Invoice"

            }] : [],
          {
            key: "3.2",
            menuItemText: "Repayment",
            route: "/Repayment",
            disabledMenu:
              (logindata.party_type === PartyType.NONE && logindata.status === Status.NEW && logindata.onboarding_status === OnboardingStatus.DRAFT) || (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STC) ? true :
                (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
                  ? true : false,
            className: pathname === "/Repayment" ? "activeMenu" : "",
            image: pathname === "/Repayment" ? SelectedRepayment : Repayment,
            id: "Repayment"
          },

        ]
      },
      ...(Profiledata === false) && (pendingInvoiceData.length !== 0) && (meustatusData !== "DISABLED") ? [
        {
          key: "4",
          menuItemText: "Pending Invoice",
          route: "/PendingInvoices",
          disabledMenu: disableMenu === true ? true : JSON.parse(loginData).onboarding_status === OnboardingStatus.STC && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : JSON.parse(loginData).status === Status.NEW
            ? true : false,
          className: pathname === "/PendingInvoices" || pathname === "PendingInvoiceDetail" ? "activeMenu" : "",
          image: pathname === "/PendingInvoices" || pathname === "PendingInvoiceDetail" ? SelectedInvoice : Invoice,
          id: "Pending Invoice",
          submenu: []
        }
      ] : [],
      {
        key: "5",
        menuItemText: <> Inbox   <span style={{ float: "right" }}>{MenuStatusData?.message_data?.inbox?.unread_message > 0 ? MenuStatusData?.message_data?.inbox?.unread_message : ""}</span></>,
        route: "/Inbox",
        disabledMenu: JSON.parse(loginData).onboarding_status === OnboardingStatus.DRAFT && JSON.parse(loginData).status === Status.NEW && JSON.parse(loginData).party_type === PartyType.NONE ? false : disableMenu === true ? true : JSON.parse(loginData).onboarding_status === OnboardingStatus.STC && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/Inbox" || pathname === "/inbox" || pathname === "/Inbox/ProgramDetail" || pathname === "/inbox/ProgramDetail" || pathname === "/inbox/InvoiceDetail" || pathname === "/Inbox/UploadDetail" || pathname === "/Inbox/FinanceRequestDetail" || pathname === "/Inbox/InvoiceDetail" || pathname === "/inbox/CounterpartyDetail" || pathname === "/Inbox/History" || pathname === "/Inbox/HistoryDetail" ? "activeMenu" : "",
        image: pathname === "/Inbox" || pathname === "/inbox" || pathname === "/Inbox/ProgramDetail" || pathname === "/inbox/ProgramDetail" || pathname === "/inbox/InvoiceDetail" || pathname === "/Inbox/UploadDetail" || pathname === "/Inbox/FinanceRequestDetail" || pathname === "/Inbox/InvoiceDetail" || pathname === "/inbox/CounterpartyDetail" || pathname === "/Inbox/History" || pathname === "/Inbox/HistoryDetail" ? SelectedInbox : InboxIcon,
        id: "Inbox"
      },
      {
        key: "6",
        menuItemText: <> Draft   <span style={{ float: "right" }}>{MenuStatusData?.message_data?.draft?.unread_message > 0 ? MenuStatusData?.message_data?.draft?.unread_message : ""}</span></>,
        route: "/Draft",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/Draft" || pathname === "/draft" || pathname === "/Draft/UploadDetail" || pathname === "/Draft/InvoiceDetail" || pathname === "/draft/FinanceRequestDetail" ? "activeMenu" : "",
        image: pathname === "/Draft" || pathname === "/draft" || pathname === "/Draft/UploadDetail" || pathname === "/Draft/InvoiceDetail" || pathname === "/draft/FinanceRequestDetail" ? SelectedDraft : draftIcon,
        id: "Draft"
      },
      {
        key: "7",
        menuItemText: "Sent",
        route: "/Sent",
        disabledMenu: JSON.parse(loginData).onboarding_status === OnboardingStatus.DRAFT && JSON.parse(loginData).status === Status.NEW && JSON.parse(loginData).party_type === PartyType.NONE ? false : disableMenu === true ? true : JSON.parse(loginData).onboarding_status === OnboardingStatus.STC && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW ? true :
          (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STB)
            ? false : false,
        className: pathname === "/Sent" || pathname === "/sent" || pathname === "/Sent/InvoiceDetail" || pathname === "/sent/ProgramDetail" || pathname === "/sent/CounterpartyDetail" || pathname === "/sent/FinanceRepaymentDetail" || pathname === "/Sent/FinanceRequestDetail" ? "activeMenu" : "",
        image: pathname === "/Sent" || pathname === "/sent" || pathname === "/Sent/InvoiceDetail" || pathname === "/sent/ProgramDetail" || pathname === "/sent/CounterpartyDetail" || pathname === "/sent/FinanceRepaymentDetail" || pathname === "/Sent/FinanceRequestDetail" ? SelectedSent : sentIcon,
        id: "Sent"
      },
      {
        key: "8",
        menuItemText: "Sent for Sign",
        route: "/SubmittedForSign",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/SubmittedForSign" || pathname === "/sent_awap/InvoiceDetail" || pathname === "/sent_awap" || pathname === "/sent_awap/ProgramDetail" || pathname === "/sent_awap/FinanceRequestDetail" ? "activeMenu" : "",
        image: pathname === "/SubmittedForSign" || pathname === "/sent_awap/InvoiceDetail" || pathname === "/sent_awap" || pathname === "/sent_awap/ProgramDetail" || pathname === "/sent_awap/FinanceRequestDetail" ? SelectedSentforSign : SentforSign,
        id: "Sent for Sign"
      },
      {
        key: "9",
        menuItemText: "Enquiry",
        route: "/Enquiry",
        disabledMenu: disableMenu === true ? true : (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
          ? true : false,
        className: pathname === "/Enquiry" ? "activeMenu" : "",
        image: pathname === "/Enquiry" ? SelectedEnquiry : enquiryIcon,
        id: "Enquiry"
      },
      {
        key: "10",
        menuItemText: "Settings",
        route: "/Settings",
        disabledMenu:
          (logindata.party_type === PartyType.NONE && logindata.status === Status.NEW && logindata.onboarding_status === OnboardingStatus.DRAFT) || (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STC) ? true :
            (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
              ? true : false,
        className: pathname === "/Settings" ? "activeMenu" : "",
        image: pathname === "/Settings" || pathname === "/UserAuthorization" ? SelectedSetting : settingIcon,
        id: "Settings",
        subMenu:
          [{
            key: "10.1",
            menuItemText: "User Auth",
            route: "/UserAuthorization",
            disabledMenu:
              (logindata.party_type === PartyType.NONE && logindata.status === Status.NEW && logindata.onboarding_status === OnboardingStatus.DRAFT) || (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STC) ? true :
                (JSON.parse(loginData).party_type === PartyType.NONE && JSON.parse(loginData).onboarding_status === OnboardingStatus.REJECTED) || JSON.parse(loginData).status === Status.NEW
                  ? true : false,
            className: pathname === "/UserAuthorization" ? "activeMenu" : "",
            image: pathname === "/UserAuthorization" ? SelectedManageUsers : manageUserIcon,
            id: "UserAuth"
          }],

      },


    ]

  const getMenuStatus = async () => {
    const data = await MenuStatus()
    setMenuStatusData(data?.menu_status?.status);
    dispatch(
      menuStatus_data(data?.menu_status?.status)
    )
  }
  useEffect(() => {
    // getMenuStatus();
    GetMenuData();
    getInboxData();
    getActionStatus();
    // getRepaymentData();
    getPendingInvoiceData()
  }, [])
  const getActionStatus = () => {
    if (logindata.is_administrator === true) {
      httpClient
        .getInstance()
        .get(`${baseurl}finflo/action/?party_id=${logindata.party_id}`)
        .then((response: any) => {
          if (response.data.data.length === 0) {
            setDisabledMenu(true)
          } else {
            setDisabledMenu(false)
          }
        })
    } else {
      setDisabledMenu(false)
    }

  }
  const GetMenuData = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/profile/`)
      .then((resp: any) => {
        // setMenuStatusData(resp.data.data?.[0]?.menu_status?.status);
        // setProfiledata(resp.data.data?.[0]?.party_status?.[0]?.APF_seller);
      });
  }
  const getInboxData = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/inbox/?record_type=ALL`)
      .then((resp: any) => {
        dispatch(
          inboxCount_data(resp.data.unread_messages)
        )
      })
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/draft/`)
      .then((resp: any) => {
        dispatch(
          draftCount_data(resp.data.unread_messages)
        )
      })
  }
  // const getRepaymentData = () => {
  //   httpClient
  //     .getInstance()
  //     .get(`${baseurl}api/finance-request/`)
  //     .then((resp: any) => {
  //       setRepaymentData(resp.data?.data)
  //     })
  // }
  const getPendingInvoiceData = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api/invoice/pending/`)
      .then((resp: any) => {
        setPendingInvoiceData(resp.data?.data)
      })
  }
  const handleMenuClick = (key: string) => {
    const isSubMenu = SideMenuBar.some((menu: any) => {
      console.log("menu", menu)
      // menu.key === key && menu.subMenu
    }
    );
    if (isSubMenu) {
      setOpenKeys([]);
    }

    setSelectedKey(key);
  };
  return (
    <Sider
      width={collapsed ? "7%" : "13%"}
      className="site-layout-background"
    >
      {collapsed ?
        <img
          src={krediq}
          alt="finfloLogo"
          className={"finfloLogo"}
          onClick={toggleCollapsed}
        />
        :
        <img
          src={krediqLogo}
          alt="finfloLogo"
          className={"finfloLogoText"}
          onClick={toggleCollapsed}
        />}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        className={adjustWidth !== false ? "adjustwidth" : "layoutContainer"}
        id="menuList"
        openKeys={openKeys}
        onOpenChange={handleMenuOpenChange}
        // onClick={({ key }) => handleMenuClick(key.toString())}
      >
        {SideMenuBar &&
          SideMenuBar.map((data: any) => {
            return (
              data?.subMenu ?
                <SubMenu key={data?.key} title={collapsed ? "" : data?.menuItemText}
                  icon={<img src={data?.image} alt="menuIcon" />}
                  disabled={data.disabledMenu}
                  className={(meustatusData === "DISABLED" && data.menuItemText === "New") ? "disabledMenuStatus "
                    : data.className ? data.className
                      : ""}
                      data-id={data.id}
                      // domProps={{ id: data.id }} 
                >
                  {
                    data.subMenu?.map((sub: any, index: number) => {
                      return (
                        <Menu.Item key={sub?.key} id={sub?.id} disabled={data.disabledMenu}
                          className={(localStorage.getItem("user") === "NonCustomer" && data.menuItemText === "Manage SCF") || (meustatusData === "DISABLED" && data.menuItemText === "New") ? "disabledMenuStatus"
                            : data.className ? data.className
                              : ""}
                          icon={<img src={sub.image} alt="menuIcon" />}
                        >
                          <Link to={sub?.route} className={"sideBarText"}>
                            {collapsed ? "" : sub?.menuItemText}
                          </Link>
                        </Menu.Item>
                      )
                    })
                  }


                </SubMenu>
                :

                <Menu.Item
                  id={data.id}
                  className={(localStorage.getItem("user") === "NonCustomer" && data.menuItemText === "Manage SCF") || (meustatusData === "DISABLED" && data.menuItemText === "New") ? "disabledMenuStatus"
                    : data.className ? data.className
                      : ""}
                  key={data.key}
                  icon={<img src={data.image} alt="menuIcon" />}
                  disabled={data.disabledMenu}>
                  {meustatusData === "DISABLED" && data.menuItemText === "New" ? "" :
                    <Link to={data.route} className={"sideBarText"}>
                      {collapsed ? "" : data.menuItemText}
                    </Link>
                  }
                </Menu.Item>
            );
          })}
      </Menu>
    </Sider>
  );
};
export default SideNavbar;
