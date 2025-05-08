import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, CardHeader, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import { GaugeChart, DoughnutChart, PieChart } from "../../Charts/ECharts/ECharts";
import "./DashBoard.css";


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
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm" className="minimal-bid-modal">
      <ModalHeader toggle={toggle} className="border-0 pb-0">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h5 className="m-0">Bid : {bidNo}</h5>
        </div>
      </ModalHeader>
      <ModalBody className="pt-0 pb-3">
        {/* Timer display */}
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

        {/* Bid amount input */}
        <div className="input-group mb-3">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Bid Amount"
            aria-label="Bid amount"
          />
        </div>

        {/* Start bid button */}
        <div className="d-flex justify-content-end">
          <Button color="primary">
            Start Bid
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
const TransporterDashboard = () => {
  document.title = "Dashboard | EPLMS";

  // Existing state variables
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

  // Data for dashboard charts
  const fleetData = {
    total: 63,
    onMove: 60,
    efficiency: 60 // Value for gauge as percentage
  };

  const deliveryData = {
    withinTimeLimit: 550,
    outOfLimit: 75,
    percentage: 95 // For circular progress
  };

  const bidStatusData = {
    running: 60,
    completed: 30,
    notStarted: 10
  };

  // Existing useEffect to load data
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

  // Existing helper functions
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

  const handleCancelBid = (bidNo, remark) => {
    const updatedBidData = bidData.map(bid => {
      if (bid.bidNo === bidNo) {
        return { ...bid, status: "Cancel Bid" };
      }
      return bid;
    });

    setBidData(updatedBidData);
    console.log(`Bid ${bidNo} cancelled with remark: ${remark}`);
  };

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
                  Bid Now
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
          <BreadCrumb title="Dashboard" pageTitle="Transporter" />

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
                  <Link to="/view-all-transporter-bids" className="view-all-link fw-bold">
                    <i className="ri-link me-1"></i> View All My Bids
                  </Link>
                </div>
              </div>
            </div>

            {/* Dashboard Charts Row */}
            <Row className="mb-4">
              {/* Fleet Efficiency Card */}
              {/* <Col md={4}>
                <Card>
                  <CardHeader className="bg-primary text-white">
                    <h4 className="card-title mb-0">Fleet Efficiency</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="position-relative" style={{ height: "200px" }}>
                      <GaugeChart
                        dataColors='["--vz-primary", "--vz-danger"]'
                        option={{
                          tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                          },
                          series: [{
                            name: 'Fleet Efficiency',
                            type: 'gauge',
                            startAngle: 180,
                            endAngle: 0,
                            radius: '90%',
                            progress: {
                              show: true
                            },
                            axisLine: {
                              lineStyle: {
                                width: 20,
                                color: [
                                  [0.3, '#4169E1'],  // Blue
                                  [0.7, '#FFD700'],  // Yellow
                                  [1, '#FF0000']     // Red
                                ]
                              }
                            },
                            pointer: {
                              show: true,
                              width: 6
                            },
                            axisTick: {
                              show: false
                            },
                            splitLine: {
                              show: false
                            },
                            axisLabel: {
                              show: false
                            },
                            detail: {
                              valueAnimation: true,
                              offsetCenter: [0, '0%'],
                              fontSize: 30,
                              formatter: '{value}%',
                              color: 'inherit'
                            },
                            data: [{
                              value: fleetData.efficiency,
                              name: ''
                            }]
                          }]
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Total Fleet</div>
                        <div className="fw-bold fs-4 text-primary">{fleetData.total}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">On the move</div>
                        <div className="fw-bold fs-4 text-primary">{fleetData.onMove}</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col> */}
              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <CardBody className="pt-0">
                    {/* Custom header styled as tab/button */}
                    <div className="text-white mb-4">
                      <div
                        className="rounded-pill py-2 px-4 d-inline-block"
                        style={{
                          background: '#3F51B5',
                          position: 'relative',
                          top: '-12px',
                          fontWeight: '500'
                        }}
                      >
                        Fleet Efficiency
                      </div>
                    </div>

                    <div className="position-relative">
                      <GaugeChart
                        dataColors='["--vz-primary", "--vz-danger"]'
                        option={{
                          tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                          },
                          series: [{
                            name: 'Fleet Efficiency',
                            type: 'gauge',
                            startAngle: 180,
                            endAngle: 0,
                            radius: '90%',
                            progress: {
                              show: true
                            },
                            axisLine: {
                              lineStyle: {
                                width: 20,
                                color: [
                                  [0.3, '#4169E1'],  // Blue
                                  [0.7, '#FF0000'],  // Red
                                  [1, '#FF0000']     // Red
                                ]
                              }
                            },
                            pointer: {
                              show: true,
                              width: 6,
                              itemStyle: {
                                color: '#FF0000'
                              }
                            },
                            axisTick: {
                              show: false
                            },
                            splitLine: {
                              show: false
                            },
                            axisLabel: {
                              show: false
                            },
                            detail: {
                              valueAnimation: true,
                              offsetCenter: [0, '0%'],
                              fontSize: 30,
                              formatter: '{value}%',
                              color: 'inherit'
                            },
                            data: [{
                              value: 60,
                              name: ''
                            }]
                          }]
                        }}
                      />
                    </div>

                    {/* <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Total Fleet</div>
                        <div className="fw-bold fs-4 text-primary">63</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">On the move</div>
                        <div className="fw-bold fs-4 text-primary">60</div>
                      </div>
                    </div> */}
                  </CardBody>
                </Card>
              </Col>
              {/* Delivery Status Card */}
              {/* <Col md={4}>
                <Card>
                  <CardHeader className="bg-primary text-white">
                    <h4 className="card-title mb-0">Delivery Status</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="position-relative" style={{ height: "200px" }}>
                      <DoughnutChart
                        dataColors='["--vz-success", "#f0f0f0"]'
                        option={{
                          tooltip: {
                            trigger: 'item'
                          },
                          legend: {
                            show: false
                          },
                          series: [{
                            name: 'Delivery Status',
                            type: 'pie',
                            radius: ['60%', '80%'],
                            avoidLabelOverlap: false,
                            label: {
                              show: false
                            },
                            labelLine: {
                              show: false
                            },
                            data: [
                              { value: deliveryData.percentage, name: 'Within Time Limit', itemStyle: { color: '#4CAF50' } },
                              { value: 100 - deliveryData.percentage, name: 'Out Of Limit', itemStyle: { color: '#f0f0f0' } }
                            ]
                          }]
                        }}
                      />
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h2 className="mb-0">{deliveryData.percentage}%</h2>
                        <p className="text-muted small mb-0">With In<br />Time Limit</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Within Time Limit</div>
                        <div className="fw-bold fs-4 text-primary">{deliveryData.withinTimeLimit}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Out Of Limit</div>
                        <div className="fw-bold fs-4 text-primary">{deliveryData.outOfLimit}</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col> */}
              {/* Delivery Status Card */}
              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <CardBody className="pt-0">
                    {/* Custom header styled as tab/button */}
                    <div className="text-white mb-4">
                      <div
                        className="rounded-pill py-2 px-4 d-inline-block"
                        style={{
                          background: '#3F51B5',
                          position: 'relative',
                          top: '-12px',
                          fontWeight: '500'
                        }}
                      >
                        Delivery Status
                      </div>
                    </div>

                    <div className="position-relative" >
                      <DoughnutChart
                        dataColors='["--vz-success", "#f0f0f0"]'
                        option={{
                          /* Chart options */
                        }}
                      />
                      {/* <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h2 className="mb-0">95%</h2>
                        <p className="text-muted small mb-0">With In<br />Time Limit</p>
                      </div> */}
                    </div>

                    {/* <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Within Time Limit</div>
                        <div className="fw-bold fs-4 text-primary">550</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Out Of Limit</div>
                        <div className="fw-bold fs-4 text-primary">75</div>
                      </div>
                    </div> */}
                  </CardBody>
                </Card>
              </Col>

              {/* Bid Status Card */}
              <Col md={4}>
                <Card className="border-0 shadow-sm">
                  <CardBody className="pt-0">
                    {/* Custom header styled as tab/button */}
                    <div className="text-white mb-4">
                      <div
                        className="rounded-pill py-2 px-4 d-inline-block"
                        style={{
                          background: '#3F51B5',
                          position: 'relative',
                          top: '-12px',
                          fontWeight: '500'
                        }}
                      >
                        Bid Status
                      </div>
                    </div>

                    <div className="position-relative" >
                      <PieChart
                        dataColors='["--vz-warning", "--vz-success", "--vz-info"]'
                        option={{
                          /* Chart options */
                        }}
                      />
                    </div>

                    {/* <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Running</div>
                        <div className="fw-bold fs-4 text-warning">60%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Completed</div>
                        <div className="fw-bold fs-4 text-success">30%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Not Started</div>
                        <div className="fw-bold fs-4 text-info">10%</div>
                      </div>
                    </div> */}
                  </CardBody>
                </Card>
              </Col>
              {/* Bid Status Card */}
              {/* <Col md={4}>
                <Card>
                  <CardHeader className="bg-primary text-white">
                    <h4 className="card-title mb-0">Bid Status</h4>
                  </CardHeader>
                  <CardBody>
                    <div className="position-relative" style={{ height: "200px" }}>
                      <PieChart
                        dataColors='["--vz-warning", "--vz-success", "--vz-info"]'
                        option={{
                          tooltip: {
                            trigger: 'item'
                          },
                          legend: {
                            show: false
                          },
                          series: [{
                            name: 'Bid Status',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                              show: false
                            },
                            labelLine: {
                              show: false
                            },
                            data: [
                              { value: bidStatusData.running, name: 'Running', itemStyle: { color: '#FFC107' } },
                              { value: bidStatusData.completed, name: 'Completed', itemStyle: { color: '#8BC34A' } },
                              { value: bidStatusData.notStarted, name: 'Not Started', itemStyle: { color: '#9C27B0' } }
                            ]
                          }]
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-around mt-3">
                      <div className="text-center">
                        <div className="text-muted">Running</div>
                        <div className="fw-bold fs-4 text-warning">{bidStatusData.running}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Completed</div>
                        <div className="fw-bold fs-4 text-success">{bidStatusData.completed}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted">Not Started</div>
                        <div className="fw-bold fs-4 text-info">{bidStatusData.notStarted}%</div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col> */}
            </Row>

            {/* Bid Cards */}
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
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Your existing modals */}
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
            bidNo={bidToConfirm || "B098"}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransporterDashboard;