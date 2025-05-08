//previous working code with api calling 
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard"; 
import    "./DashBoard.css";


//  Modal Component
const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");

  const handleCancelBid = () => {
    onCancelBid(bidNo, remark);
    setRemark("");
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Cancel Bid
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
            <Input
              type="textarea"
              id="remark"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={5}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCancelBid}>
          Cancel Bid
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// New Bid Confirmation Modal Component
const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
  // Sample transporters data for the bid
  const transporters = [
    {
      rank: "1st",
      name: "RAJ ENTERPRISE",
      auctionType: "Reversal Bid",
      ceilingPrice: "10,00,000",
      givenPrice: "7,00,000",
      deliveredBefore: "1 Day",
      multipleOrders: "Yes",
      rating: 4.5,
    },
    {
      rank: "2nd",
      name: "R AND B TRANSPORT",
      auctionType: "Reversal Bid",
      ceilingPrice: "9,00,000",
      givenPrice: "5,00,000",
      deliveredBefore: "5 Day",
      multipleOrders: "No",
      rating: 5,
    },
    {
      rank: "3rd",
      name: "NEHA ROADLINE",
      auctionType: "Reversal Bid",
      ceilingPrice: "3,00,000",
      givenPrice: "1,45,000",
      deliveredBefore: "2 Day",
      multipleOrders: "No",
      rating: 1,
    },
    {
      rank: "4Th",
      name: "M2 VENTURES",
      auctionType: "Reversal Bid",
      ceilingPrice: "15,00,000",
      givenPrice: "9,00,000",
      deliveredBefore: "3 Day",
      multipleOrders: "Yes",
      rating: 3,
    },
    {
      rank: "5Th",
      name: "BHARAT ROADWAYS",
      auctionType: "Reversal Bid",
      ceilingPrice: "5,00,000",
      givenPrice: "3,00,000",
      deliveredBefore: "2 Day",
      multipleOrders: "Yes",
      rating: 2,
    }
  ];

  // Function to render star ratings
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    // Determine star color based on rating
    let starColor = "text-warning"; // Default yellow
    if (rating <= 2) {
      starColor = "text-danger"; // Red for low ratings
    } else if (rating >= 4) {
      starColor = "text-success"; // Green for high ratings
    }

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className={`ri-star-fill ${starColor}`}></i>);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className={`ri-star-half-fill ${starColor}`}></i>);
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className={`ri-star-line ${starColor}`}></i>);
    }

    return stars;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl" className="bid-confirmation-modal">
      <ModalHeader toggle={toggle} className="border-0">
        <div className="bid-confirmation-title">Bid Confirmation - {bidNo}</div>
      </ModalHeader>
      <ModalBody>
        <div className="bid-table-container">
          <table className="table table-striped table-bordered mb-0">
            <thead className="bg-primary sticky-header" style={{ color: "black" }}>
              <tr>
                <th>Rank</th>
                <th>
                  Transporter name
                  <i className="ri-arrow-up-down-line ms-1"></i>
                </th>
                <th>Auction Type</th>
                <th>Ceiling Price</th>
                <th>Given Price</th>
                <th>Delivered Before</th>
                <th>Multiple Orders</th>
                <th>Transporter Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transporters.map((transporter, index) => (
                <tr key={index}>
                  <td>{transporter.rank}</td>
                  <td>
                    {transporter.name}
                    <i className="ri-add-line ms-2 text-primary"></i>
                  </td>
                  <td>{transporter.auctionType}</td>
                  <td>{transporter.ceilingPrice}</td>
                  <td>{transporter.givenPrice}</td>
                  <td>{transporter.deliveredBefore}</td>
                  <td>{transporter.multipleOrders}</td>
                  <td className="text-center">
                    {renderRating(transporter.rating)}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button color="success" size="sm" className="action-btn">
                        Assign
                      </Button>
                      <Button color="danger" size="sm" className="action-btn">
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="light" onClick={toggle} className="bid-cancel-btn">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const AuctionDashboard = () => {
  document.title = "Dashboard | EPLMS";

  const [selectedDate, setSelectedDate] = useState("");
  const [bidData, setBidData] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [searchText, setSearchText] = useState("");
  // State variables for the modals
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  // Add new state variables for cancel bid modal
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  // Add new state variables for bid confirmation modal
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState("");

  // Sample bid cards data
  const bidCards = [
    { bidNo: "B023", time: "00:00" },
    { bidNo: "B450", time: "00:00" },
    { bidNo: "B984", time: "00:00" },
    { bidNo: "B034", time: "00:00" },
    { bidNo: "B254", time: "00:00" },
    { bidNo: "B023", time: "00:00" },
  ];

  // Load bid data
  useEffect(() => {
    const data = [
      {
        id: 1,
        bidNo: "B872",
        startDateTime: "18/02/2025 01:00",
        endDateTime: "18/02/2025 02:00",
        material: "Jindal",
        city: "Gurugram",
        qty: "10Ton",
        route: "1004",
        bulkerOrder: "Yes",
        status: "Running"
      },
      {
        id: 2,
        bidNo: "B458",
        startDateTime: "15/02/2025 02:00",
        endDateTime: "15/02/2025 04:00",
        material: "Adani",
        city: "Delhi",
        qty: "15Ton",
        route: "1010",
        bulkerOrder: "No",
        status: "To Be Start"
      },
      {
        id: 3,
        bidNo: "B842",
        startDateTime: "01/03/2025 03:00",
        endDateTime: "01/03/2025 03:15",
        material: "Acc",
        city: "Rajasthan",
        qty: "12Ton",
        route: "1054",
        bulkerOrder: "Yes",
        status: "Cancel Bid"
      },
      {
        id: 4,
        bidNo: "B645",
        startDateTime: "10/04/2025 02:30",
        endDateTime: "10/04/2025 03:30",
        material: "Birla",
        city: "Lucknow",
        qty: "20Ton",
        route: "1097",
        bulkerOrder: "No",
        status: "To Be Start"
      },
      {
        id: 5,
        bidNo: "B093",
        startDateTime: "10/03/2025 01:30",
        endDateTime: "10/04/2025 03:30",
        material: "Jindal",
        city: "Satna",
        qty: "14Ton",
        route: "1034",
        bulkerOrder: "No",
        status: "Completed"
      }
    ];
    setBidData(data);
  }, []);

  // Function to handle the eye icon click
  const handleViewClick = (bidNo) => {
    setSelectedBidNo(bidNo);
    setIsSalesOrderModalOpen(true);
  };

  // Add function to handle the cancel icon click
  const handleCancelClick = (bidNo) => {
    setBidToCancel(bidNo);
    setIsCancelBidModalOpen(true);
  };

  // Add function to handle the confirm order button click
  const handleConfirmOrderClick = (bidNo) => {
    setBidToConfirm(bidNo);
    setIsBidConfirmationModalOpen(true);
  };

  // Add function to handle the actual cancellation of the bid
  const handleCancelBid = (bidNo, remark) => {
    // Update the status of the bid to "Cancel Bid"
    const updatedBidData = bidData.map(bid => {
      if (bid.bidNo === bidNo) {
        return { ...bid, status: "Cancel Bid" };
      }
      return bid;
    });

    setBidData(updatedBidData);
    // In a real application, you would also make an API call here
    console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
  };

  // Status badge helper function
  const getStatusBadge = (status) => {
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

  // Columns for table
  const columns = useMemo(
    () => [
      {
        Header: "Bid Number", // Use a full string instead of a function
        accessor: "bidNo",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Start Date/Time",
        accessor: "startDateTime",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "End Date/Time",
        accessor: "endDateTime",
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
        accessor: "qty",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Route",
        accessor: "route",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
        accessor: "bulkerOrder",
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => getStatusBadge(value),
        style: { whiteSpace: 'nowrap' }
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div className="action-buttons-container">
            <Link to="#" className="action-icon me-2" onClick={() => handleViewClick(row.original.bidNo)}>
              <i className="ri-eye-line fs-16"></i>
            </Link>
            {row.original.status === "To Be Start" && (
              <Link to="#" className="action-icon action-icon-close" onClick={() => handleCancelClick(row.original.bidNo)}>
                <i className="ri-close-line fs-16"></i>
              </Link>
            )}
            {row.original.status === "Completed" && (
              <>
              
                <Button color="primary" className="confirm-order-btn" onClick={() => handleConfirmOrderClick(row.original.bidNo)}>
                  Confirm Order
                </Button>
              </>
            )}
          </div>
        ),
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
            {/* Header section with title and controls */}
            <div className="d-flex justify-content-between dashboard-header">
              <div>
                <h4 className="dashboard-title">Dashboard</h4>
              </div>
              <div>
                {/* Calendar input */}
                <div className="text-end mb-4">
                  <Input
                    type="date"
                    className="form-control d-inline-block calendar-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Select Date"
                  />
                </div>

                {/* View All Bids link */}
                <div className="text-end">
                  <Link to="/view-all-bids" className="view-all-link fw-bold">
                    <i className="ri-link me-1"></i> View All Bids
                  </Link>
                </div>
              </div>
            </div>

       {/* Bid Cards - Now using the BidCard component that handles API calls */}
       <BidCard />

            {/* Table Card */}
            <Card className="table-card">
              <CardBody>
                <div className="table-responsive">
                  <style>
                    {`
                      th {
                        white-space: nowrap !important;
                      }
                      .table thead th {
                        white-space: nowrap !important;
                      }
                      /* Force Bid No. to stay on one line */
                      th:first-child div, th:nth-child(8) div {
                        white-space: nowrap !important;
                        display: inline !important;
                      }
                      /* Add non-breaking space character in text */
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
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Export CSV Modal */}
          {isExportCSV && (
            <ExportCSVModal
              isOpen={isExportCSV}
              toggle={() => setIsExportCSV(!isExportCSV)}
              data={bidData}
              fileName="auction_dashboard_export"
            />
          )}

          {/* Sales Order Modal */}
          <SalesOrderModal
            isOpen={isSalesOrderModalOpen}
            toggle={() => setIsSalesOrderModalOpen(!isSalesOrderModalOpen)}
            bidNo={selectedBidNo}
          />

          {/* Cancel Bid Modal */}
          <CancelBidModal
            isOpen={isCancelBidModalOpen}
            toggle={() => setIsCancelBidModalOpen(!isCancelBidModalOpen)}
            bidNo={bidToCancel}
            onCancelBid={handleCancelBid}
          />

          {/* Bid Confirmation Modal */}
          <BidConfirmationModal
            isOpen={isBidConfirmationModalOpen}
            toggle={() => setIsBidConfirmationModalOpen(!isBidConfirmationModalOpen)}
            bidNo={bidToConfirm || "B098"}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AuctionDashboard;

