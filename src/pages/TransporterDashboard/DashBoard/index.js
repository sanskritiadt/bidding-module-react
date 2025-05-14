// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Card, CardBody, CardHeader, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
// import { Link } from "react-router-dom";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import TableContainer from "../../../Components/Common/TableContainer";
// import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
// import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
// import BidCard from "./BidCard/BidCard";
// import { GaugeChart, DoughnutChart, PieChart } from "../../Charts/ECharts/ECharts";
// import "./DashBoard.css";


// const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
//   const [remark, setRemark] = useState("");

//   const handleCancelBid = () => {
//     onCancelBid(bidNo, remark);
//     setRemark("");
//     toggle();
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered>
//       <ModalHeader toggle={toggle}>
//         Cancel Bid
//       </ModalHeader>
//       <ModalBody>
//         <Form>
//           <FormGroup>
//             <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
//             <Input
//               type="textarea"
//               id="remark"
//               placeholder="Remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               rows={5}
//             />
//           </FormGroup>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleCancelBid}>
//           Cancel Bid
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// // New Bid Confirmation Modal Component
// const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered size="sm" className="minimal-bid-modal">
//       <ModalHeader toggle={toggle} className="border-0 pb-0">
//         <div className="d-flex justify-content-between align-items-center w-100">
//           <h5 className="m-0">Bid : {bidNo}</h5>
//         </div>
//       </ModalHeader>
//       <ModalBody className="pt-0 pb-3">
//         {/* Timer display */}
//         <div className="d-flex align-items-center mb-3 mt-1">
//           <div className="d-flex align-items-center">
//             <i className="ri-timer-line me-2"></i>
//             <span className="d-flex align-items-center">
//               <Badge color="dark" pill className="me-1">0</Badge>
//               <Badge color="dark" pill className="me-1">5</Badge>
//               <span className="mx-1">:</span>
//               <Badge color="dark" pill className="me-1">1</Badge>
//               <Badge color="dark" pill>2</Badge>
//             </span>
//           </div>
//           <span className="ms-2 text-muted small">Time Remaining</span>
//         </div>

//         {/* Bid amount input */}
//         <div className="input-group mb-3">
//           <span className="input-group-text">₹</span>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter Bid Amount"
//             aria-label="Bid amount"
//           />
//         </div>

//         {/* Start bid button */}
//         <div className="d-flex justify-content-end">
//           <Button color="primary">
//             Start Bid
//           </Button>
//         </div>
//       </ModalBody>
//     </Modal>
//   );
// };
// const TransporterDashboard = () => {
//   document.title = "Dashboard | EPLMS";

//   // Existing state variables
//   const [selectedDate, setSelectedDate] = useState("");
//   const [bidData, setBidData] = useState([]);
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
//   const [selectedBidNo, setSelectedBidNo] = useState("");
//   const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
//   const [bidToCancel, setBidToCancel] = useState("");
//   const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
//   const [bidToConfirm, setBidToConfirm] = useState("");
//   useEffect(() => {
//     const data = [
//       {
//         id: 1,
//         bidNo: "B872",
//         startDateTime: "18/02/2025 01:00",
//         endDateTime: "18/02/2025 02:00",
//         material: "Jindal",
//         city: "Gurugram",
//         qty: "10Ton",
//         route: "1004",
//         bulkerOrder: "Yes",
//         status: "Running"
//       },
//       {
//         id: 2,
//         bidNo: "B458",
//         startDateTime: "15/02/2025 02:00",
//         endDateTime: "15/02/2025 04:00",
//         material: "Adani",
//         city: "Delhi",
//         qty: "15Ton",
//         route: "1010",
//         bulkerOrder: "No",
//         status: "To Be Start"
//       },
//       {
//         id: 3,
//         bidNo: "B842",
//         startDateTime: "01/03/2025 03:00",
//         endDateTime: "01/03/2025 03:15",
//         material: "Acc",
//         city: "Rajasthan",
//         qty: "12Ton",
//         route: "1054",
//         bulkerOrder: "Yes",
//         status: "Cancel Bid"
//       },
//       {
//         id: 4,
//         bidNo: "B645",
//         startDateTime: "10/04/2025 02:30",
//         endDateTime: "10/04/2025 03:30",
//         material: "Birla",
//         city: "Lucknow",
//         qty: "20Ton",
//         route: "1097",
//         bulkerOrder: "No",
//         status: "To Be Start"
//       },
//       {
//         id: 5,
//         bidNo: "B093",
//         startDateTime: "10/03/2025 01:30",
//         endDateTime: "10/04/2025 03:30",
//         material: "Jindal",
//         city: "Satna",
//         qty: "14Ton",
//         route: "1034",
//         bulkerOrder: "No",
//         status: "Completed"
//       }
//     ];
//     setBidData(data);
//   }, []);

//   // Existing helper functions
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

//   const handleCancelBid = (bidNo, remark) => {
//     const updatedBidData = bidData.map(bid => {
//       if (bid.bidNo === bidNo) {
//         return { ...bid, status: "Cancel Bid" };
//       }
//       return bid;
//     });

//     setBidData(updatedBidData);
//     console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
//   };

//   const getStatusBadge = (status) => {
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

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Bid Number", // Use a full string instead of a function
//         accessor: "bidNo",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Start Date/Time",
//         accessor: "startDateTime",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "End Date/Time",
//         accessor: "endDateTime",
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
//         accessor: "qty",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Route",
//         accessor: "route",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: () => <span className="nowrap-header">Bulker&nbsp;Order</span>,
//         accessor: "bulkerOrder",
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Status",
//         accessor: "status",
//         Cell: ({ value }) => getStatusBadge(value),
//         style: { whiteSpace: 'nowrap' }
//       },
//       {
//         Header: "Action",
//         Cell: ({ row }) => (
//           <div className="action-buttons-container">
//             <Link to="#" className="action-icon me-2" onClick={() => handleViewClick(row.original.bidNo)}>
//               <i className="ri-eye-line fs-16"></i>
//             </Link>
//             {row.original.status === "To Be Start" && (
//               <Link to="#" className="action-icon action-icon-close" onClick={() => handleCancelClick(row.original.bidNo)}>
//                 <i className="ri-close-line fs-16"></i>
//               </Link>
//             )}
//             {row.original.status === "Completed" && (
//               <>

//                 <Button color="primary" className="confirm-order-btn" onClick={() => handleConfirmOrderClick(row.original.bidNo)}>
//                   Bid Now
//                 </Button>
//               </>
//             )}
//           </div>
//         ),
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
//           <BreadCrumb title="Dashboard" pageTitle="Transporter" />

//           <div className="dashboard-container">
//             {/* Header section with title and controls */}
//             <div className="d-flex justify-content-between dashboard-header">
//               <div>
//                 <h4 className="dashboard-title">Dashboard</h4>
//               </div>
//               <div>
//                 {/* Calendar input */}
//                 <div className="text-end mb-4">
//                   <Input
//                     type="date"
//                     className="form-control d-inline-block calendar-input"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     placeholder="Select Date"
//                   />
//                 </div>

//                 {/* View All Bids link */}
//                 <div className="text-end">
//                   <Link to="/view-all-transporter-bids" className="view-all-link fw-bold">
//                     <i className="ri-link me-1"></i> View All My Bids
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* Dashboard Charts Row */}
//             <Row className="mb-4">
//               <Col md={4}>
//                 <Card className="border-0 shadow-sm">
//                   <CardBody className="pt-0">
//                     {/* Custom header styled as tab/button */}
//                     <div className="text-white mb-4">
//                       <div
//                         className="rounded-pill py-2 px-4 d-inline-block"
//                         style={{
//                           background: '#3F51B5',
//                           position: 'relative',
//                           top: '-12px',
//                           fontWeight: '500'
//                         }}
//                       >
//                         Fleet Efficiency
//                       </div>
//                     </div>

//                     <div className="position-relative">
//                       <GaugeChart
//                         dataColors='["--vz-primary", "--vz-danger"]'
//                         option={{
//                           tooltip: {
//                             formatter: '{a} <br/>{b} : {c}%'
//                           },
//                           series: [{
//                             name: 'Fleet Efficiency',
//                             type: 'gauge',
//                             startAngle: 180,
//                             endAngle: 0,
//                             radius: '90%',
//                             progress: {
//                               show: true
//                             },
//                             axisLine: {
//                               lineStyle: {
//                                 width: 20,
//                                 color: [
//                                   [0.3, '#4169E1'],  // Blue
//                                   [0.7, '#FF0000'],  // Red
//                                   [1, '#FF0000']     // Red
//                                 ]
//                               }
//                             },
//                             pointer: {
//                               show: true,
//                               width: 6,
//                               itemStyle: {
//                                 color: '#FF0000'
//                               }
//                             },
//                             axisTick: {
//                               show: false
//                             },
//                             splitLine: {
//                               show: false
//                             },
//                             axisLabel: {
//                               show: false
//                             },
//                             detail: {
//                               valueAnimation: true,
//                               offsetCenter: [0, '0%'],
//                               fontSize: 30,
//                               formatter: '{value}%',
//                               color: 'inherit'
//                             },
//                             data: [{
//                               value: 60,
//                               name: ''
//                             }]
//                           }]
//                         }}
//                       />
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//               {/* Delivery Status Card */}
//               <Col md={4}>
//                 <Card className="border-0 shadow-sm">
//                   <CardBody className="pt-0">
//                     {/* Custom header styled as tab/button */}
//                     <div className="text-white mb-4">
//                       <div
//                         className="rounded-pill py-2 px-4 d-inline-block"
//                         style={{
//                           background: '#3F51B5',
//                           position: 'relative',
//                           top: '-12px',
//                           fontWeight: '500'
//                         }}
//                       >
//                         Delivery Status
//                       </div>
//                     </div>

//                     <div className="position-relative" >
//                       <DoughnutChart
//                         dataColors='["--vz-success", "#f0f0f0"]'
//                         option={{
//                           /* Chart options */
//                         }}
//                       />
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>

//               {/* Bid Status Card */}
//               <Col md={4}>
//                 <Card className="border-0 shadow-sm">
//                   <CardBody className="pt-0">
//                     {/* Custom header styled as tab/button */}
//                     <div className="text-white mb-4">
//                       <div
//                         className="rounded-pill py-2 px-4 d-inline-block"
//                         style={{
//                           background: '#3F51B5',
//                           position: 'relative',
//                           top: '-12px',
//                           fontWeight: '500'
//                         }}
//                       >
//                         Bid Status
//                       </div>
//                     </div>

//                     <div className="position-relative" >
//                       <PieChart
//                         dataColors='["--vz-warning", "--vz-success", "--vz-info"]'
//                         option={{
//                           /* Chart options */
//                         }}
//                       />
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>

//             {/* Bid Cards */}
//             <BidCard />

//             {/* Table Card */}
//             <Card className="table-card">
//               <CardBody>
//                 <div className="table-responsive">
//                   <style>
//                     {`
//                       th {
//                         white-space: nowrap !important;
//                       }
//                       .table thead th {
//                         white-space: nowrap !important;
//                       }
//                       th:first-child div, th:nth-child(8) div {
//                         white-space: nowrap !important;
//                         display: inline !important;
//                       }
//                       th:first-child div::after {
//                         content: '';
//                         display: inline;
//                       }
//                     `}
//                   </style>
//                   <TableContainer
//                     columns={columns}
//                     data={bidData}
//                     isGlobalFilter={true}
//                     isAddUserList={false}
//                     customPageSize={5}
//                     isGlobalSearch={true}
//                     className="custom-header-css single-line-headers"
//                     SearchPlaceholder="Search for Bids..."
//                     theadClasses="th-no-wrap"
//                     headerWrapperClasses="table-header-override"
//                   />
//                 </div>
//               </CardBody>
//             </Card>
//           </div>

//           {/* Your existing modals */}
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
//             bidNo={bidToConfirm || "B098"}
//           />
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default TransporterDashboard;
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import { GaugeChart, DoughnutChart, PieChart } from "../../Charts/ECharts/ECharts";
import "./DashBoard.css";
import axios from "axios";

const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");

  const handleCancelBid = () => {
    onCancelBid(bidNo, remark);
    setRemark("");
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Cancel Bid</ModalHeader>
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
        <Button color="primary" onClick={handleCancelBid}>Cancel Bid</Button>
      </ModalFooter>
    </Modal>
  );
};

const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm" className="minimal-bid-modal">
      <ModalHeader toggle={toggle} className="border-0 pb-0">
        <h5 className="m-0">Bid : {bidNo}</h5>
      </ModalHeader>
      <ModalBody className="pt-0 pb-3">
        <div className="d-flex align-items-center mb-3 mt-1">
          <div className="d-flex align-items-center">
            <i className="ri-timer-line me-2"></i>
            <span className="d-flex align-items-center">
              <Badge color="dark" pill className="me-1">0</Badge>
              <Badge color="dark" pill className="me-1">5</Badge>
              <span className="mx-1">:</span>
              <Badge color="dark" pill className="me-1">1</Badge>
              <Badge color="dark" pill>2</Badge>
            </span>
          </div>
          <span className="ms-2 text-muted small">Time Remaining</span>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Bid Amount"
          />
        </div>

        <div className="d-flex justify-content-end">
          <Button color="primary">Start Bid</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

const TransporterDashboard = () => {
  document.title = "Dashboard | EPLMS";

  const [selectedDate, setSelectedDate] = useState("");
  const [bidData, setBidData] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isSalesOrderModalOpen, setIsSalesOrderModalOpen] = useState(false);
  const [selectedBidNo, setSelectedBidNo] = useState("");
  const [isCancelBidModalOpen, setIsCancelBidModalOpen] = useState(false);
  const [bidToCancel, setBidToCancel] = useState("");
  const [isBidConfirmationModalOpen, setIsBidConfirmationModalOpen] = useState(false);
  const [bidToConfirm, setBidToConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME,
      password: process.env.REACT_APP_API_PASSWORD,
    },
  };

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

  // Fetch bid data from API
  useEffect(() => {
    fetchBidData();
  }, []);

  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://10.6.0.5:8085/biddingMaster/all', config);
      setBidData(response);
    } catch (err) {
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

  const handleBidClick = (bidNo) => {
    setBidToConfirm(bidNo);
    setIsBidConfirmationModalOpen(true);
  };

  const handleCancelBid = (bidNo, remark) => {
    // In real implementation, this would update via API
    console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
  };

  // Status badge component
  const getStatusBadge = (item) => {
    const status = getStatus(item.bidFrom, item.bidTo);
    const statusColors = {
      "Running": "primary",
      "To Be Start": "warning",
      "Completed": "success"
    };

    return (
      <Badge color={statusColors[status] || "secondary"}>
        {status}
      </Badge>
    );
  };

  // Table columns definition - using API field names directly
  const columns = useMemo(
    () => [
      {
        Header: "Bid Number",
        accessor: "biddingOrderNo",
      },
      {
        Header: "Start Date/Time",
        accessor: row => formatDate(row.bidFrom),
      },
      {
        Header: "End Date/Time",
        accessor: row => formatDate(row.bidTo),
      },
      {
        Header: "Material",
        accessor: "material",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Qty",
        accessor: row => `${row.quantity} ${row.uom}`,
      },
      {
        Header: "Route",
        accessor: row => `${row.fromLocation} to ${row.toLocation}`,
      },
      {
        Header: "Bulker Order",
        accessor: row => row.multiMaterial === 1 ? "Yes" : "No",
      },
      {
        Header: "Status",
        accessor: row => row,
        Cell: ({ value }) => getStatusBadge(value),
      },
      {
        Header: "Action",
        Cell: ({ row }) => {
          const status = getStatus(row.original.bidFrom, row.original.bidTo);
          return (
            <div className="d-flex gap-2">
              <Link to="#" onClick={() => handleViewClick(row.original.biddingOrderNo)}>
                <i className="ri-eye-line fs-16"></i>
              </Link>
              {status === "To Be Start" && (
                <Link to="#" onClick={() => handleCancelClick(row.original.biddingOrderNo)}>
                  <i className="ri-close-line fs-16 text-danger"></i>
                </Link>
              )}
              {status === "Running" && (
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => handleBidClick(row.original.biddingOrderNo)}
                >
                  Bid Now
                </Button>
              )}
            </div>
          );
        },
        disableSortBy: true,
      }
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Transporter" />

          <div className="dashboard-container">
            {/* Header section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Dashboard</h4>
              <div>
                <Input
                  type="date"
                  className="form-control d-inline-block me-3"
                  style={{ width: 'auto' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <Link to="/view-all-transporter-bids" className="fw-bold">
                  <i className="ri-link me-1"></i> View All My Bids
                </Link>
              </div>
            </div>

            {/* Charts Row */}
            <Row className="mb-4">
              <Col md={4}>
                <Card>
                  <CardBody>
                    <h5>Fleet Efficiency</h5>
                    <GaugeChart
                      dataColors='["--vz-primary", "--vz-danger"]'
                      option={{
                        series: [{
                          type: 'gauge',
                          data: [{ value: 60 }]
                        }]
                      }}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <CardBody>
                    <h5>Delivery Status</h5>
                    <DoughnutChart
                      dataColors='["--vz-success", "#f0f0f0"]'
                      option={{}}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <CardBody>
                    <h5>Bid Status</h5>
                    <PieChart
                      dataColors='["--vz-warning", "--vz-success", "--vz-info"]'
                      option={{}}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Bid Cards */}
            <BidCard />

            {/* Table */}
            <Card>
              <CardBody>
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
                  <TableContainer
                    columns={columns}
                    data={bidData}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={5}
                    isGlobalSearch={true}
                    SearchPlaceholder="Search for Bids..."
                  />
                )}
              </CardBody>
            </Card>
          </div>

          {/* Modals */}
          {isExportCSV && (
            <ExportCSVModal
              isOpen={isExportCSV}
              toggle={() => setIsExportCSV(false)}
              data={bidData}
              fileName="auction_dashboard_export"
            />
          )}

          <SalesOrderModal
            isOpen={isSalesOrderModalOpen}
            toggle={() => setIsSalesOrderModalOpen(false)}
            bidNo={selectedBidNo}
          />

          <CancelBidModal
            isOpen={isCancelBidModalOpen}
            toggle={() => setIsCancelBidModalOpen(false)}
            bidNo={bidToCancel}
            onCancelBid={handleCancelBid}
          />

          <BidConfirmationModal
            isOpen={isBidConfirmationModalOpen}
            toggle={() => setIsBidConfirmationModalOpen(false)}
            bidNo={bidToConfirm}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransporterDashboard;