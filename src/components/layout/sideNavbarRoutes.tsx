import ManageScf from "../manageScf/manageScf";
import ApprovedPayable from "../manageScf/program/programTab";
import ManageUsers from "../manageUsers/manageUser";
import NewAccount from "../new/createNewAccount";
import Invoice from "../new/invoice/invoice";
import Manual from "../new/invoice/manual/manual";
import UploadFile from "../new/invoice/bulk/uploadInvoice";
import TabContainer from "../common/tab/tab";
import Dashboard from "../dashboard/dashboard";
import Draft from "../draft/draft";
import Settings from "../settings/settings";
import ModifyPage from "../enquiry/enquiry";
import EnquiryDetail from "../enquiry/enquiryDetail";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "../../utils/page/404";
import OnboardingTabs from "../onboarding/onboardingTabs";
import ProgramDetail from "../common/detail/program/programDetail";
import BulkUploadDetail from "../new/invoice/bulk/uploadTab";
import UploadCsv from "../new/invoice/bulk/uploadInvoice";
import UploadDetail from "../common/detail/invoice/invoiceDetail";
import FinanceRequestDetail from "../common/detail/financeRequestDetail";
import OnboardingDetail from "../common/detail/onboardingDetail";
import HistoryList from "../common/list/history";
import HistoryDetail from "../common/detail/program/programDetail";
import RepaymentList from "../new/repayment/repayment";
import RepaymentDetail from "../common/detail/repaymentDetail";
import FinanceRepaymentDetail from "../common/detail/financeRepaymentDetail";
import ProgramDetailView from "../dashboard/graphs/programDetail";
import UserAuthorization from "../settings/settings";
import RepaymentCustomer from "../new/repayment/repaymentCustomer";
import PendingInvoicesList from "../pendingInvoices/pendingInvoices";
import PendingInvoiceDetail from "../common/detail/pendingInvoiceDetail";
import { OnboardingStatus, PartyType, Status } from "../../utils/enum/choices";
import NotFound from "../../utils/page/500";
const Sidebar = (width: any) => {
  const loginData = localStorage.getItem("login_detail") || "";
  const logindata = JSON.parse(loginData)
  return (
    <div style={{ width: width }}>
      {
        (logindata.party_type === PartyType.NONE && logindata.status === Status.NEW && logindata.onboarding_status === OnboardingStatus.DRAFT) || (logindata.party_type === PartyType.NONE && logindata.status === Status.IN_PROGRESS && logindata.onboarding_status === OnboardingStatus.STC)
          ?
          <Routes>
            <Route
              path="/CounterPartyOnboarding"
              element={<OnboardingTabs />}
            />
            <Route path="/Inbox" element={<TabContainer fromMenu="inbox" recordType="ALL" />} />
            <Route path="/Sent" element={<TabContainer fromMenu="sent" recordType="ALL" />} />
            <Route path="/sent/CounterpartyDetail" element={<OnboardingDetail />} />
            <Route path="/inbox/CounterpartyDetail" element={<OnboardingDetail />} />

          </Routes>
          :
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/Notfound" element={<NotFound />} />

            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Inbox" element={<TabContainer fromMenu="inbox" recordType="ALL" />} />
            <Route path="/Sent" element={<TabContainer fromMenu="sent" recordType="ALL" />} />
            <Route path="/Manual" element={<Manual />} />
            <Route path="/UploadFile" element={<UploadFile />} />
            {localStorage.getItem("user") === "Customer" || localStorage.getItem("user") === "NonCustomer" ? (
              <Route path="/New" element={<Invoice />} />
            ) : (
              ""
            )}
            <Route path="/Invoice" element={<Invoice />} />
            <Route path="/NewAccount" element={<NewAccount />} />
            {localStorage.getItem("user") === "Bank" ?
              <Route path="/ManageScf" element={<NewAccount />} />
              : <Route path="/ManageScf" element={<ManageScf />} />
            }
            <Route path="/ManageUsers" element={<ManageUsers />} />
            <Route path="/ApprovedPayableFinancing" element={<ApprovedPayable />} />
            <Route path="/ReceivableFinancing" element={<ApprovedPayable />} />
            <Route path="/Inbox/ProgramModify" element={<ApprovedPayable />} />
            <Route path="/Draft" element={<Draft />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Enquiry" element={<ModifyPage />} />
            <Route path="/SubmittedForSign" element={<TabContainer fromMenu="sent_awap" recordType="ALL" />} />
            <Route path="/sent_awap" element={<TabContainer fromMenu="sent_awap" />} />
            <Route path="/EnquiryDetail" element={<EnquiryDetail />} />
            <Route path="/Inbox/ProgramDetail" element={<ProgramDetail />} />
            <Route path="/sent_awap/ProgramDetail" element={<ProgramDetail />} />
            <Route path="/sent/ProgramDetail" element={<ProgramDetail />} />

            <Route path="/Inbox/UploadDetail" element={<UploadDetail />} />
            <Route path="/draft/ProgramDetail" element={<ProgramDetail />} />
            <Route path="/Draft/UploadDetail" element={<UploadDetail />} />
            <Route path="/Draft/InvoiceDetail" element={<UploadDetail />} />
            <Route path="/Sent/InvoiceDetail" element={<UploadDetail />} />
            <Route path="/Inbox/InvoiceDetail" element={<UploadDetail />} />
            <Route path="/Inbox/FinanceRepaymentDetail" element={<FinanceRepaymentDetail />} />
            <Route path="/sent/FinanceRepaymentDetail" element={<FinanceRepaymentDetail />} />
            <Route path="/sent_awap/InvoiceDetail" element={<UploadDetail />} />
            <Route path="/sent_awap/FinanceRequestDetail" element={<FinanceRequestDetail />} />
            <Route path="/draft/FinanceRequestDetail" element={<FinanceRequestDetail />} />
            <Route path="/Inbox/FinanceRequestDetail" element={<FinanceRequestDetail />} />
            <Route path="/Sent/FinanceRequestDetail" element={<FinanceRequestDetail />} />

            <Route path="/Upload" element={<UploadCsv />} />
            <Route path="/UploadDetail" element={<BulkUploadDetail />} />
            <Route path="/inbox/CounterpartyDetail" element={<OnboardingDetail />} />
            <Route path="/sent/CounterpartyDetail" element={<OnboardingDetail />} />
            <Route path="/sent_awap/CounterpartyDetail" element={<OnboardingDetail />} />
            <Route path="/Inbox/History" element={<HistoryList />} />
            <Route path="/Inbox/HistoryDetail" element={<HistoryDetail />} />
            <Route path="/Repayment" element={<RepaymentList />} />
            <Route path="/RepaymentDetail" element={<RepaymentDetail />} />
            <Route path="/ProgramDetailView" element={<ProgramDetailView />} />
            <Route path="/UserAuthorization" element={<UserAuthorization />} />
            <Route path="/RepaymentCustomer" element={<RepaymentCustomer />} />
            <Route path="/PendingInvoices" element={<PendingInvoicesList />} />
            <Route path="/PendingInvoiceDetail" element={<PendingInvoiceDetail />} />

          </Routes>
      }

    </div>
  );
};
export default Sidebar;

// import React from "react";
// import { Route, Routes, NavLink } from "react-router-dom";
// // import { PartyType, Status, OnboardingStatus } from "../../utils/enum/choices";
// // import TabContainer from "../common/tab/tab";
// // import Dashboard from "../dashboard/dashboard";
// import ManageScf from "../manageScf/manageScf";
// import ApprovedPayable from "../manageScf/program/programTab";
// import ManageUsers from "../manageUsers/manageUser";
// import NewAccount from "../new/createNewAccount";
// import Invoice from "../new/invoice/invoice";
// import Manual from "../new/invoice/manual/manual";
// import UploadFile from "../new/invoice/bulk/uploadInvoice";
// import TabContainer from "../common/tab/tab";
// import Dashboard from "../dashboard/dashboard";
// import Draft from "../draft/draft";
// import Settings from "../settings/settings";
// import ModifyPage from "../enquiry/enquiry";
// import EnquiryDetail from "../enquiry/enquiryDetail";
// // import { Route, Routes } from "react-router-dom";
// import PageNotFound from "../../utils/page/404";
// import OnboardingTabs from "../onboarding/onboardingTabs";
// import ProgramDetail from "../common/detail/program/programDetail";
// import BulkUploadDetail from "../new/invoice/bulk/uploadTab";
// import UploadCsv from "../new/invoice/bulk/uploadInvoice";
// import UploadDetail from "../common/detail/invoice/invoiceDetail";
// import FinanceRequestDetail from "../common/detail/financeRequestDetail";
// import OnboardingDetail from "../common/detail/onboardingDetail";
// import HistoryList from "../common/list/history";
// import HistoryDetail from "../common/detail/program/programDetail";
// import RepaymentList from "../new/repayment/repayment";
// import RepaymentDetail from "../common/detail/repaymentDetail";
// import FinanceRepaymentDetail from "../common/detail/financeRepaymentDetail";
// import ProgramDetailView from "../dashboard/graphs/programDetail";
// import UserAuthorization from "../settings/settings";
// import RepaymentCustomer from "../new/repayment/repaymentCustomer";
// import PendingInvoicesList from "../pendingInvoices/pendingInvoices";
// import PendingInvoiceDetail from "../common/detail/pendingInvoiceDetail";
// import { OnboardingStatus, PartyType, Status } from "../../utils/enum/choices";
// import NotFound from "../../utils/page/500";
// // Import your components here

// const routeConfig = [
//   {
//     path: "/Dashboard",
//     label: "Dashboard",
//     component: <Dashboard />
//   },
//   {
//     path: ["/Inbox","/inbox/ProgramDetail"],
//     label: "Inbox",
//     component: <TabContainer fromMenu="inbox" recordType="ALL" />
//   },
//   // ... other routes
// ];

// const Sidebar = ({ width }:any) => {
//   const loginData = JSON.parse(localStorage.getItem("login_detail") || "");
//   const { party_type, status, onboarding_status } = loginData;

//   const shouldRenderOnboarding = 
//     (party_type === PartyType.NONE && status === Status.NEW && onboarding_status === OnboardingStatus.DRAFT) ||
//     (party_type === PartyType.NONE && status === Status.IN_PROGRESS && onboarding_status === OnboardingStatus.STC);

//   const routesToRender = shouldRenderOnboarding
//     ? routeConfig.map(route => ({ ...route, path: `/Onboarding${route.path}` }))
//     : routeConfig;

//   return (
//     <div style={{ width }}>
//       <Routes>
//         {routesToRender.map((route:any, index) => (
//           <Route key={index} path={route.path} element={route.component} />
//         ))}
//       </Routes>
//       {/* <nav>
//         <ul>
//           {routesToRender.map((route, index) => (
//             <li key={index}>
//               <NavLink to={route.path}className="active">
//                 {route.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav> */}
//     </div>
//   );
// };

// export default Sidebar;
