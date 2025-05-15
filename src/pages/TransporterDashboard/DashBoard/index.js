
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SalesOrderModal from "./SalesOrderModal/SalesOrderModal";
import BidCard from "./BidCard/BidCard";
import "./DashBoard.css";
import axios from "axios";

// Import new chart libraries
import GaugeChart from 'react-gauge-chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

// New Chart Components
const FleetEfficiencyChart = ({ totalFleet = 63, onTheMove = 60 }) => {
  const percentage = onTheMove / totalFleet;
  
  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="pt-0">
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

        <div className="position-relative" style={{ height: '200px' }}>
          <GaugeChart
            id="fleet-gauge"
            nrOfLevels={2}
            colors={["#5B8DDE", "#EE5A52"]}
            arcWidth={0.25}
            percent={percentage}
            arcPadding={0}
            needleColor="#DC2626"
            needleBaseColor="#1F2937"
            hideText={true}
            animate={true}
            animDelay={0}
            marginInPercent={0.03}
            style={{ height: '100%' }}
          />
        </div>
        
        <div className="d-flex justify-around mt-4">
          <div className="text-center">
            <div className="h3 mb-0 font-weight-bold text-dark">{totalFleet}</div>
            <div className="text-muted">Total Fleet</div>
          </div>
          <div className="text-center">
            <div className="h3 mb-0 font-weight-bold text-dark">{onTheMove}</div>
            <div className="text-muted">On the move</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const DeliveryStatusChart = ({ withinTimeLimit = 550, outOfLimit = 75 }) => {
  const total = withinTimeLimit + outOfLimit;
  const percentage = Math.round((withinTimeLimit / total) * 100);
  
  const data = [
    { value: withinTimeLimit, fill: '#4CAF50' },
    { value: outOfLimit, fill: '#E8F5E9' }
  ];
  
  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="pt-0">
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

        <div className="position-relative" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="h1 mb-0 font-weight-bold text-dark">{percentage}%</div>
              <div className="small text-muted">With in<br/>Time Limit</div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-around mt-4">
          <div className="text-center">
            <div className="text-muted mb-1">Within Time Limit</div>
            <div className="h3 mb-0 font-weight-bold text-dark">{withinTimeLimit}</div>
          </div>
          <div className="text-center">
            <div className="text-muted mb-1">Out Of Limit</div>
            <div className="h3 mb-0 font-weight-bold text-dark">{outOfLimit}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const BidStatusChart = ({ running = 60, completed = 30, notStarted = 10 }) => {
  const data = [
    { name: 'Running', value: running, color: '#FFC107' },
    { name: 'Completed', value: completed, color: '#4CAF50' },
    { name: 'Not Started', value: notStarted, color: '#9C27B0' }
  ];
  
  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="pt-0">
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

        <div className="position-relative" style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="d-flex justify-around mt-4">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-1">
                <div 
                  className="rounded-circle me-2" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: item.color 
                  }}
                ></div>
                <span className="small text-muted">{item.name}</span>
              </div>
              <div className="h3 mb-0 font-weight-bold text-dark">{item.value}%</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
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
    // Mock data for testing - replace with actual API call
    const mockData = [
      {
        biddingOrderNo: "B872",
        bidFrom: "2025-02-18T01:00:00",
        bidTo: "2025-02-18T02:00:00",
        material: "Jindal",
        city: "Gurugram",
        quantity: "10",
        uom: "Ton",
        route: "1004",
        multiMaterial: 1
      },
      {
        biddingOrderNo: "B458",
        bidFrom: "2025-02-15T02:00:00",
        bidTo: "2025-02-15T04:00:00",
        material: "Adani",
        city: "Delhi",
        quantity: "15",
        uom: "Ton",
        route: "1010",
        multiMaterial: 0
      }
    ];
    setBidData(mockData);
    setLoading(false);
  }, []);

  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/all`, config);
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

  // Table columns definition
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
        accessor: row => `${row.route}`,
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

            {/* New Charts Row with exact styling */}
            <Row className="mb-4">
              <Col md={4}>
                <FleetEfficiencyChart totalFleet={63} onTheMove={60} />
              </Col>
              <Col md={4}>
                <DeliveryStatusChart withinTimeLimit={550} outOfLimit={75} />
              </Col>
              <Col md={4}>
                <BidStatusChart running={60} completed={30} notStarted={10} />
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