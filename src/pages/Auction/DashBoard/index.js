
// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
// import { Link } from "react-router-dom";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import TableContainer from "../../../Components/Common/TableContainer";
// import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
// import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
// import BidCard from "./BidCard/BidCard"; 
// import "./DashBoard.css";
// import CancelBidModal from "./CancelBidModal/CancelBidModal";
// import BidConfirmationModal from "./BidConfirmationModal/BidConfirmationModal";
// import {getLoginCode} from '../../../helpers/api_helper';

// const AuctionDashboard = () => {
//   document.title = "Dashboard | EPLMS";

//   const [bidData, setBidData] = useState([]);
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
//   const [selectedBidNo, setSelectedBidNo] = useState("");
//   const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
//   const [bidToCancel, setBidToCancel] = useState("");
//   const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
//   const [bidToConfirm, setBidToConfirm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [loginCode, setLoginCode] = useState('');
//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get status based on date comparison
//   const getStatus = (bidFrom, bidTo) => {
//     const now = new Date();
//     const start = new Date(bidFrom);
//     const end = new Date(bidTo);

//     if (now < start) return "To Be Start";
//     if (now >= start && now <= end) return "Running";
//     return "Completed";
//   };

//   // Fetch bid data from API using fetch
//   useEffect(() => {

//     fetchBidData();
//     const loginCode = getLoginCode();
//     if (loginCode) {
//         setLoginCode(loginCode);
//         console.log("Login code found: in Auction Dashboard", loginCode);
//     } else {
//         // Handle missing login code (redirect to login, show error, etc.)
//     }
//   }, []);

//   const fetchBidData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Basic authentication setup
//       const username = process.env.REACT_APP_API_USER_NAME;
//       const password = process.env.REACT_APP_API_PASSWORD;
//       const basicAuth = 'Basic ' + btoa(username + ':' + password);

//       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/all`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': basicAuth
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const responseData = await response.json();

//       // Access the data correctly from the API response
//       if (responseData && responseData.data && Array.isArray(responseData.data)) {
//         setBidData(responseData.data);
//       } else {
//         console.log('Unexpected API response structure:', responseData);
//         setBidData([]);
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       setError("Failed to fetch bid data. Please try again.");
//       setBidData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Modal handlers
//   const handleViewClick = (bidNo) => {
//     setSelectedBidNo(bidNo);
//     setIsSalesOrderModalOpen(true);
//   };

//   const handleCancelClick = (bidNo) => {
//     setBidToCancel(bidNo);
//     setIsCancelBidModalOpen(true);
//   };

//   const handleConfirmOrderClick = (bidNo) => {
//     setBidToConfirm(bidNo);
//     setIsBidConfirmationModalOpen(true);
//   };

//   const handleCancelBid = async (bidNo, remark) => {
//     try {
//       const username = process.env.REACT_APP_API_USER_NAME;
//       const password = process.env.REACT_APP_API_PASSWORD;
//       const basicAuth = 'Basic ' + btoa(username + ':' + password);

//       const response = await fetch(
//         `${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/cancelBidByBidNumber?bidNumber=${bidNo}&remarks=${encodeURIComponent(remark)}`,
//         {
//           method: 'POST',
//           headers: {
//             'Accept': 'application/json',
//             'Authorization': basicAuth
//           }
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log(`Bid ${bidNo} cancelled successfully`, result);

//       // Refresh the bid data after successful cancellation
//       fetchBidData();

//       // Return the response to the modal for toast notification
//       return {
//         success: true,
//         message: `Bid ${bidNo} cancelled successfully`
//       };
//     } catch (error) {
//       console.error('Error cancelling bid:', error);
//       // Return error information to the modal
//       return {
//         success: false,
//         message: error.message || 'Failed to cancel bid. Please try again.'
//       };
//     }
//   };

//   // Status badge helper function
//   const getStatusBadge = (item) => {
//     const status = getStatus(item.bidFrom, item.bidTo);
//     const getStatusClass = (status) => {
//       switch (status) {
//         case "Running": return "status-running";
//         case "To Be Start": return "status-to-be-start";
//         case "Cancel Bid": return "status-cancel-bid";
//         case "Completed": return "status-completed";
//         default: return "";
//       }
//     };

//     return (
//       <div className="status-badge-container">
//         <span className={`status-badge ${getStatusClass(status)}`}>
//           {status}
//         </span>
//       </div>
//     );
//   };

//   // Columns for table - updated to match API response with proper IDs
//   const columns = useMemo(
//     () => [
//       {
//         Header: "Bid Number",
//         accessor: "biddingOrderNo",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Start Date/Time",
//         accessor: "bidFrom",
//         Cell: ({ value }) => formatDate(value),
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "End Date/Time",
//         accessor: "bidTo",
//         Cell: ({ value }) => formatDate(value),
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Material",
//         accessor: "material",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "City",
//         accessor: "city",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Qty",
//         accessor: "quantity",
//         id: "qty",
//         Cell: ({ row }) => `${row.original.quantity || ''} ${row.original.uom || ''}`,
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Route",
//         accessor: "fromLocation",
//         id: "route",
//         Cell: ({ row }) => `${row.original.fromLocation || ''} to ${row.original.toLocation || ''}`,
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
//         accessor: "multiMaterial",
//         id: "bulkerOrder",
//         Cell: ({ value }) => value === 1 ? "Yes" : "No",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Status",
//         id: "status",
//         Cell: ({ row }) => getStatusBadge(row.original),
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Action",
//         id: "action",
//         Cell: ({ row }) => {
//           const status = getStatus(row.original.bidFrom, row.original.bidTo);
//           return (
//             <div className="action-buttons-container">
//               <Link to="#" className="action-icon me-2" onClick={() => handleViewClick(row.original.biddingOrderNo)}>
//                 <i className="ri-eye-line fs-16"></i>
//               </Link>
//               {status === "To Be Start" && (
//                 <Link to="#" className="action-icon action-icon-close" onClick={() => handleCancelClick(row.original.biddingOrderNo)}>
//                   <i className="ri-close-line fs-16"></i>
//                 </Link>
//               )}
//               {status === "Completed" && (
//                 <Button color="primary" className="confirm-order-btn" onClick={() => handleConfirmOrderClick(row.original.biddingOrderNo)}>
//                   Confirm Order
//                 </Button>
//               )}
//             </div>
//           );
//         },
//         disableSortBy: true,
//         style: { whiteSpace: 'nowrap' }
//       }
//     ],
//     []
//   );

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <BreadCrumb title="Dashboard" pageTitle="Auction" />

//           <div className="dashboard-container">
//             <div className="d-flex justify-content-between dashboard-header">
//               <div>
//                 <h4 className="dashboard-title">Dashboard</h4>
//               </div>
//               <div>
//                 <div className="text-end">
//                   <Link to="/view-all-bids" className="view-all-link fw-bold">
//                     <i className="ri-link me-1"></i> View All Bids
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             <BidCard />

//             <Card className="table-card">
//               <CardBody>
//                 <div className="table-responsive">
//                   {loading ? (
//                     <div className="text-center py-5">
//                       <div className="spinner-border" role="status">
//                         <span className="sr-only">Loading...</span>
//                       </div>
//                       <p className="mt-2">Loading bid data...</p>
//                     </div>
//                   ) : error ? (
//                     <div className="text-center text-danger py-5">
//                       <i className="ri-error-warning-line fs-1 mb-3"></i>
//                       <p>{error}</p>
//                       <Button color="primary" size="sm" onClick={fetchBidData}>
//                         Retry
//                       </Button>
//                     </div>
//                   ) : bidData.length === 0 ? (
//                     <div className="text-center py-5">
//                       <i className="ri-information-line fs-1 mb-3"></i>
//                       <p>No bid data available</p>
//                       <Button color="primary" size="sm" onClick={fetchBidData}>
//                         Refresh
//                       </Button>
//                     </div>
//                   ) : (
//                     <>
//                       <style>
//                         {`
//                           th {
//                             white-space: nowrap !important;
//                           }
//                           .table thead th {
//                             white-space: nowrap !important;
//                           }
//                           th:first-child div, th:nth-child(8) div {
//                             white-space: nowrap !important;
//                             display: inline !important;
//                           }
//                           th:first-child div::after {
//                             content: '';
//                             display: inline;
//                           }
//                         `}
//                       </style>
//                       <TableContainer
//                         columns={columns}
//                         data={bidData}
//                         isGlobalFilter={true}
//                         isAddUserList={false}
//                         customPageSize={5}
//                         isGlobalSearch={true}
//                         className="custom-header-css single-line-headers"
//                         SearchPlaceholder="Search for Bids..."
//                         theadClasses="th-no-wrap"
//                         headerWrapperClasses="table-header-override"
//                       />
//                     </>
//                   )}
//                 </div>
//               </CardBody>
//             </Card>
//           </div>

//           {isExportCSV && (
//             <ExportCSVModal
//               isOpen={isExportCSV}
//               toggle={() => setIsExportCSV(!isExportCSV)}
//               data={bidData}
//               fileName="auction_dashboard_export"
//             />
//           )}

//           <SalesOrderModal
//             isOpen={isSalesOrderModalOpen}
//             toggle={() => setIsSalesOrderModalOpen(!isSalesOrderModalOpen)}
//             bidNo={selectedBidNo}
//           />

//           <CancelBidModal
//             isOpen={isCancelBidModalOpen}
//             toggle={() => setIsCancelBidModalOpen(!isCancelBidModalOpen)}
//             bidNo={bidToCancel}
//             onCancelBid={handleCancelBid}
//           />

//           <BidConfirmationModal
//             isOpen={isBidConfirmationModalOpen}
//             toggle={() => setIsBidConfirmationModalOpen(!isBidConfirmationModalOpen)}
//             bidNo={bidToConfirm || "BID-NE205-002"}
//             loginCode={loginCode}
//           />

//           {/* Global Toast Container for app-wide notifications */}
//           <ToastContainer
//             position="top-right"
//             autoClose={5000}
//             hideProgressBar={false}
//             newestOnTop
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="light"
//           />
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default AuctionDashboard;
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import "./DashBoard.css";
import CancelBidModal from "./CancelBidModal/CancelBidModal";
import BidConfirmationModal from "./BidConfirmationModal/BidConfirmationModal";
import { getLoginCode } from '../../../helpers/api_helper';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

const AuctionDashboard = () => {
  document.title = "Dashboard | EPLMS";

  const [bidData, setBidData] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginCode, setLoginCode] = useState('');

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status based on date comparison
  const getStatus = (bidFrom, bidTo) => {
    const now = new Date();
    const start = new Date(bidFrom);
    const end = new Date(bidTo);

    if (now < start) return "To Be Start";
    if (now >= start && now <= end) return "Running";
    return "Completed";
  };

  // Fetch bid data from API using fetch
  useEffect(() => {
    fetchBidData();
    const loginCode = getLoginCode();
    if (loginCode) {
      setLoginCode(loginCode);
      console.log("Login code found: in Auction Dashboard", loginCode);
    } else {
      // Handle missing login code (redirect to login, show error, etc.)
    }
  }, []);

  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic authentication setup
      const username = process.env.REACT_APP_API_USER_NAME;
      const password = process.env.REACT_APP_API_PASSWORD;
      const basicAuth = 'Basic ' + btoa(username + ':' + password);

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Access the data correctly from the API response
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        setBidData(responseData.data);
      } else {
        console.log('Unexpected API response structure:', responseData);
        setBidData([]);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to fetch bid data. Please try again.");
      setBidData([]);
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleViewClick = (bidNo) => {
    setSelectedBidNo(bidNo);
    setIsSalesOrderModalOpen(true);
  };

  const handleCancelClick = (bidNo) => {
    setBidToCancel(bidNo);
    setIsCancelBidModalOpen(true);
  };

  const handleConfirmOrderClick = (bidNo) => {
    setBidToConfirm(bidNo);
    setIsBidConfirmationModalOpen(true);
  };

  const handleCancelBid = async (bidNo, remark) => {
    try {
      const username = process.env.REACT_APP_API_USER_NAME;
      const password = process.env.REACT_APP_API_PASSWORD;
      const basicAuth = 'Basic ' + btoa(username + ':' + password);

      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/cancelBidByBidNumber?bidNumber=${bidNo}&remarks=${encodeURIComponent(remark)}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': basicAuth
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Bid ${bidNo} cancelled successfully`, result);

      // Refresh the bid data after successful cancellation
      fetchBidData();

      // Return the response to the modal for toast notification
      return {
        success: true,
        message: `Bid ${bidNo} cancelled successfully`
      };
    } catch (error) {
      console.error('Error cancelling bid:', error);
      // Return error information to the modal
      return {
        success: false,
        message: error.message || 'Failed to cancel bid. Please try again.'
      };
    }
  };

  // Status badge helper function
  const getStatusBadge = (item) => {
    const status = getStatus(item.bidFrom, item.bidTo);
    const getStatusClass = (status) => {
      switch (status) {
        case "Running": return "status-running";
        case "To Be Start": return "status-to-be-start";
        case "Cancel Bid": return "status-cancel-bid";
        case "Completed": return "status-completed";
        default: return "";
      }
    };

    return (
      <div className="status-badge-container">
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
    );
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 15) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Columns for table - updated to match API response with proper IDs and text wrapping fixes
  const columns = useMemo(
    () => [
      {
        Header: "Bid Number",
        accessor: "biddingOrderNo",
        Cell: ({ value }) => (
          <div className="text-nowrap" title={value}>
            {truncateText(value, 12)}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '120px' }
      },
      {
        Header: "Start Date/Time",
        accessor: "bidFrom",
        Cell: ({ value }) => (
          <div className="text-nowrap" title={formatDate(value)}>
            {formatDate(value)}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '140px' }
      },
      {
        Header: "End Date/Time",
        accessor: "bidTo",
        Cell: ({ value }) => (
          <div className="text-nowrap" title={formatDate(value)}>
            {formatDate(value)}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '140px' }
      },
      {
        Header: "Material",
        accessor: "material",
        Cell: ({ value }) => (
          <div className="text-nowrap" title={value}>
            {truncateText(value, 10)}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '100px' }
      },
      {
        Header: "City",
        accessor: "city",
        Cell: ({ value }) => (
          <div className="text-nowrap" title={value}>
            {truncateText(value, 10)}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '100px' }
      },
      {
        Header: "Qty",
        accessor: "quantity",
        id: "qty",
        Cell: ({ row }) => {
          const qty = `${row.original.quantity || ''} ${row.original.uom || ''}`;
          return (
            <div className="text-nowrap" title={qty}>
              {truncateText(qty, 8)}
            </div>
          );
        },
        style: { whiteSpace: 'nowrap', minWidth: '80px' }
      },
      {
        Header: "Route",
        accessor: "fromLocation",
        id: "route",
        Cell: ({ row }) => {
          const route = `${row.original.fromLocation || ''} to ${row.original.toLocation || ''}`;
          return (
            <div className="text-nowrap" title={route}>
              {truncateText(route, 12)}
            </div>
          );
        },
        style: { whiteSpace: 'nowrap', minWidth: '120px' }
      },
      {
        Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
        accessor: "multiMaterial",
        id: "bulkerOrder",
        Cell: ({ value }) => (
          <div className="text-nowrap">
            {value === 1 ? "Yes" : "No"}
          </div>
        ),
        style: { whiteSpace: 'nowrap', minWidth: '90px' }
      },
      {
        Header: "Status",
        id: "status",
        Cell: ({ row }) => getStatusBadge(row.original),
        style: { whiteSpace: 'nowrap', minWidth: '100px' }
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => {
          const status = getStatus(row.original.bidFrom, row.original.bidTo);
          return (
            <div className="action-buttons-container d-flex align-items-center gap-2">
              <Link
                to="#"
                className="action-icon"
                onClick={() => handleViewClick(row.original.biddingOrderNo)}
                title="View Details"
              >
                <i className="ri-eye-line fs-16"></i>
              </Link>
              {status === "To Be Start" && (
                <Link
                  to="#"
                  className="action-icon action-icon-close text-danger"
                  onClick={() => handleCancelClick(row.original.biddingOrderNo)}
                  title="Cancel Bid"
                >
                  <Icon path={mdiClose} size={0.8} color="#FF7072" />
                </Link>
              )}
              {status === "Completed" && (
                <Button
                  color="primary"
                  size="sm"
                  className="confirm-order-btn"
                  onClick={() => handleConfirmOrderClick(row.original.biddingOrderNo)}
                >
                  Confirm Order
                </Button>
              )}
            </div>
          );
        },
        disableSortBy: true,
        style: { whiteSpace: 'nowrap', minWidth: '120px' }
      }
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Auction" />

          <div className="dashboard-container">
            {/* Header section with improved spacing */}
            <div className="d-flex justify-content-between align-items-center dashboard-header mb-2">
              <div>
                <h4 className="dashboard-title mb-0">Dashboard</h4>
              </div>
              <div>
                <Link to="/view-all-bids" className="view-all-link fw-bold">
                  <i className="ri-link me-1"></i> View All Bids
                </Link>
              </div>
            </div>

            {/* Bid Cards Container with proper alignment */}
            <div className="bid-cards-container mb-3">
              <BidCard />
            </div>

            {/* Table Card with reduced spacing */}
            <Card className="table-card">
              <CardBody className="pb-0">
                {/* Reduced spacing between search and table */}
                <div className="table-responsive">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-2">Loading bid data...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center text-danger py-5">
                      <i className="ri-error-warning-line fs-1 mb-3"></i>
                      <p>{error}</p>
                      <Button color="primary" size="sm" onClick={fetchBidData}>
                        Retry
                      </Button>
                    </div>
                  ) : bidData.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="ri-information-line fs-1 mb-3"></i>
                      <p>No bid data available</p>
                      <Button color="primary" size="sm" onClick={fetchBidData}>
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <>
                      <style>
                        {`
                          /* Table header fixes */
                          .table thead th {
                            white-space: nowrap !important;
                            padding: 12px 8px !important;
                            font-size: 13px !important;
                            font-weight: 600 !important;
                            border-bottom: 2px solid #dee2e6 !important;
                          }
                          
                          /* Table cell fixes */
                          .table tbody td {
                            padding: 10px 8px !important;
                            font-size: 13px !important;
                            vertical-align: middle !important;
                            white-space: nowrap !important;
                          }
                          
                          /* Text truncation and tooltip */
                          .text-nowrap {
                            white-space: nowrap !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                            max-width: 100% !important;
                          }
                          
                          /* Action buttons styling */
                          .action-buttons-container {
                            display: flex !important;
                            align-items: center !important;
                            gap: 8px !important;
                            justify-content: flex-start !important;
                          }
                          
                          .action-icon {
                            display: inline-flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            width: 30px !important;
                            height: 30px !important;
                            border-radius: 4px !important;
                            color: #495057 !important;
                            text-decoration: none !important;
                            transition: all 0.2s ease !important;
                          }
                          
                          .action-icon:hover {
                            background-color: #f8f9fa !important;
                            color: #007bff !important;
                          }
                          
                          .action-icon-close:hover {
                            background-color: #f8d7da !important;
                            color: #dc3545 !important;
                          }
                          
                          .confirm-order-btn {
                            font-size: 11px !important;
                            padding: 4px 8px !important;
                            line-height: 1.2 !important;
                          }
                          
                          /* Status badges */
                          .status-badge {
                            padding: 4px 8px !important;
                            border-radius: 12px !important;
                            font-size: 11px !important;
                            font-weight: 500 !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.5px !important;
                          }
                          
                          .status-running {
                            background-color: #0F8704 !important;
                            color: #FFFFFF !important;
                          }
                          
                          .status-to-be-start {
                            background-color: #FFD56A !important;
                            color: #000000 !important;
                          }
                          
                          .status-completed {
                            background-color: #FF7072  !important;
                            color: #FFFFFF !important;
                          }
                          
                          .status-cancel-bid {
                            background-color: #f8d7da !important;
                            color: #721c24 !important;
                          }
                          
                          /* Dashboard spacing fixes */
                          .dashboard-header {
                            margin-bottom: 8px !important;
                          }
                          
                          .bid-cards-container {
                            margin-bottom: 16px !important;
                          }
                          
                          .table-card .card-body {
                            padding-bottom: 0 !important;
                          }
                          
                          /* Search bar spacing */
                          .dataTables_filter {
                            margin-bottom: 12px !important;
                          }
                          
                          /* View all bids link spacing */
                          .view-all-link {
                            margin-bottom: 16px !important;
                          }
                          
                          /* Alignment fixes for bid cards and table */
                          .dashboard-container {
                            display: flex !important;
                            flex-direction: column !important;
                            gap: 0 !important;
                          }
                          
                          /* Table container alignment */
                          .table-responsive {
                            margin-top: 0 !important;
                          }
                          
                          /* Ensure consistent spacing */
                          .card {
                            margin-bottom: 0 !important;
                          }
                        `}
                      </style>
                      <TableContainer
                        columns={columns}
                        data={bidData}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={5}
                        isGlobalSearch={true}
                        className="custom-header-css single-line-headers table-fixed-layout"
                        SearchPlaceholder="Search for Bids..."
                        theadClasses="th-no-wrap"
                        headerWrapperClasses="table-header-override"
                      />
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>



          {/* Global Toast Container for app-wide notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Container>
      </div>
      {isExportCSV && (
        <ExportCSVModal
          isOpen={isExportCSV}
          toggle={() => setIsExportCSV(!isExportCSV)}
          data={bidData}
          fileName="auction_dashboard_export"
        />
      )}

      <SalesOrderModal
        isOpen={isSalesOrderModalOpen}
        toggle={() => setIsSalesOrderModalOpen(!isSalesOrderModalOpen)}
        bidNo={selectedBidNo}
      />

      <CancelBidModal
        isOpen={isCancelBidModalOpen}
        toggle={() => setIsCancelBidModalOpen(!isCancelBidModalOpen)}
        bidNo={bidToCancel}
        onCancelBid={handleCancelBid}
      />

      <BidConfirmationModal
        isOpen={isBidConfirmationModalOpen}
        toggle={() => setIsBidConfirmationModalOpen(!isBidConfirmationModalOpen)}
        bidNo={bidToConfirm || "BID-NE205-002"}
        loginCode={loginCode}
      />
    </React.Fragment>
  );
};

export default AuctionDashboard;