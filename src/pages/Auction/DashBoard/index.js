

import React, { useState, useEffect, useMemo } from "react";
import { Container, Card, CardBody, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import "./DashBoard.css";
import CancelBidModal from "./CancelBidModal/CancelBidModal";
import BidConfirmationModal from "./BidConfirmationModal/BidConfirmationModal";
import { toast } from 'react-toastify';

const AuctionDashboard = () => {
  document.title = "Dashboard | EPLMS";

  const [selectedDate, setSelectedDate] = useState("");
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
  //const[biddingOrderNo,setBiddingOrderNo]=useState("");

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
        // setBiddingOrderNo(responseData.data.biddingOrderNo);
        //console.log("biddingOrderNo=========>>>>>>>>",biddingOrderNo);

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
      toast.success(`Bid #${bidNo} has been cancelled successfully`, { autoClose: 3000 });

      // Refresh the bid data after successful cancellation
      fetchBidData();
    } catch (error) {
      toast.error(`Error cancelling bid #${bidNo}: ${error.message}`, { autoClose: 3000 });
    }
  };
  // const handleCancelBid = async (bidNo, remark) => {
  //   try {
  //     const username = process.env.REACT_APP_API_USER_NAME;
  //     const password = process.env.REACT_APP_API_PASSWORD;
  //     const basicAuth = 'Basic ' + btoa(username + ':' + password);

  //     const response = await fetch(
  //       `${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/cancelBidByBidNumber?bidNumber=${bidNo}&remarks=${encodeURIComponent(remark)}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Authorization': basicAuth
  //         }
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     toast.success(`Bid ${bidNo} cancelled successfully`, { autoClose: 3000 });

  //     // Refresh the bid data after successful cancellation
  //     fetchBidData();
  //   } catch (error) {
  //      toast.error(`Error cancelling bid`, { autoClose: 3000 });
  //   }
  // };
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

  // Columns for table - updated to match API response with proper IDs
  const columns = useMemo(
    () => [
      {
        Header: "Bid Number",
        accessor: "biddingOrderNo",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Start Date/Time",
        accessor: "bidFrom",
        Cell: ({ value }) => formatDate(value),
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "End Date/Time",
        accessor: "bidTo",
        Cell: ({ value }) => formatDate(value),
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Material",
        accessor: "material",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "City",
        accessor: "city",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Qty",
        accessor: "quantity",
        id: "qty",
        Cell: ({ row }) => `${row.original.quantity || ''} ${row.original.uom || ''}`,
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Route",
        accessor: "fromLocation",
        id: "route",
        Cell: ({ row }) => `${row.original.fromLocation || ''} to ${row.original.toLocation || ''}`,
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
        accessor: "multiMaterial",
        id: "bulkerOrder",
        Cell: ({ value }) => value === 1 ? "Yes" : "No",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Status",
        id: "status",
        Cell: ({ row }) => getStatusBadge(row.original),
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ row }) => {
          const status = getStatus(row.original.bidFrom, row.original.bidTo);
          return (
            <div className="action-buttons-container">
              <Link to="#" className="action-icon me-2" onClick={() => handleViewClick(row.original.biddingOrderNo)}>
                <i className="ri-eye-line fs-16"></i>
              </Link>
              {status === "To Be Start" && (
                <Link to="#" className="action-icon action-icon-close" onClick={() => handleCancelClick(row.original.biddingOrderNo)}>
                  <i className="ri-close-line fs-16"></i>
                </Link>
              )}
              {status === "Completed" && (
                <Button color="primary" className="confirm-order-btn" onClick={() => handleConfirmOrderClick(row.original.biddingOrderNo)}>
                  Confirm Order
                </Button>
              )}
            </div>
          );
        },
        disableSortBy: true,
        style: { whiteSpace: 'nowrap' }
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
            <div className="d-flex justify-content-between dashboard-header">
              <div>
                <h4 className="dashboard-title">Dashboard</h4>
              </div>
              <div>
                <div className="text-end mb-4">
                  <Input
                    type="date"
                    className="form-control d-inline-block calendar-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Select Date"
                  />
                </div>
                <div className="text-end">
                  <Link to="/view-all-bids" className="view-all-link fw-bold">
                    <i className="ri-link me-1"></i> View All Bids
                  </Link>
                </div>
              </div>
            </div>

            <BidCard />

            <Card className="table-card">
              <CardBody>
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
                          th {
                            white-space: nowrap !important;
                          }
                          .table thead th {
                            white-space: nowrap !important;
                          }
                          th:first-child div, th:nth-child(8) div {
                            white-space: nowrap !important;
                            display: inline !important;
                          }
                          th:first-child div::after {
                            content: '';
                            display: inline;
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
                        className="custom-header-css single-line-headers"
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
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AuctionDashboard;