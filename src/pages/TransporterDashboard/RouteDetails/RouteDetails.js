import React, { useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardHeader, 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Label 
} from "reactstrap";
import { Link } from "react-router-dom";

// Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const RouteDetails = () => {
    // Dummy data based on Figma image
    const dummyRoutes = [
        {
            id: 1,
            routeCode: "1001",
            routeName: "Berlin",
            departureLocation: "Gurugram",
            destinationLocation: "Ludiyana",
            disMTce: "984 Km",
            rType: "Rail",
            routeType: "Road",
            transportationGroup: "Truck",
            deliveryTime: "4",
            shippingCondition: "SMTdard",
            routeDeterminateCriteria: "Automatic",
            intermediateStops: "Mumbai, Delhi",
            dismtce: "1734",
            transportationCost: "50,000",
            carrier: "Berlin Carrier",
            routeSelection: "Fastest",
            transportationZone: "Region 1"
        },
        {
            id: 2,
            routeCode: "1002",
            routeName: "Hawra",
            departureLocation: "Noida",
            destinationLocation: "Hyderabad",
            disMTce: "234 Km",
            rType: "Ship"
        },
        {
            id: 3,
            routeCode: "1003",
            routeName: "Chennai",
            departureLocation: "Chennai",
            destinationLocation: "Tirupati",
            disMTce: "345Km",
            rType: "Road"
        },
        {
            id: 4,
            routeCode: "1004",
            routeName: "Hyderabad",
            departureLocation: "Panudherry",
            destinationLocation: "Ludhiyana",
            disMTce: "294Km",
            rType: "Ship"
        },
        {
            id: 5,
            routeCode: "1005",
            routeName: "Delhi",
            departureLocation: "Hyderabad",
            destinationLocation: "Chennai",
            disMTce: "93Km",
            rType: "Rail"
        }
    ];

    const [routes] = useState(dummyRoutes);
    const [viewModal, setViewModal] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    // Export Modal state
    const [isExportCSV, setIsExportCSV] = useState(false);

    const handleViewClick = (routeId) => {
        const route = routes.find(r => r.id === routeId);
        setSelectedRoute(route);
        toggleViewModal();
    };

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    };

    // NEW: Handle the download functionality
    const handleDownload = (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false);
    };

    // NEW: Download CSV function
    const downloadCSV = () => {
        if (routes.length === 0) {
            toast.warning("No data available to export", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Create column headers
        const headers = [
            "Route Code",
            "Route Name",
            "Departure Location",
            "Destination Location",
            "DisMTce",
            "R-Type"
        ].join(',') + '\n';

        // Create CSV rows
        const rows = routes.map(route => 
            [
                route.routeCode,
                route.routeName,
                route.departureLocation,
                route.destinationLocation,
                route.disMTce,
                route.rType
            ].join(',')
        ).join('\n');

        // Combine headers and rows
        const csvData = headers + rows;
        
        // Create and download the file
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'RouteDetails.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // Routes Column based on Figma image
    const columns = React.useMemo(
        () => [
            {
                Header: "Route Code",
                accessor: "routeCode",
                filterable: false,
            },
            {
                Header: "Route name",
                accessor: "routeName",
                filterable: false,
            },
            {
                Header: "Departure Location",
                accessor: "departureLocation",
                filterable: false,
            },
            {
                Header: "Destination Location",
                accessor: "destinationLocation",
                filterable: false,
            },
            {
                Header: "DisMTce",
                accessor: "disMTce",
                filterable: false,
            },
            {
                Header: "R-Type",
                accessor: "rType",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <div className="d-flex justify-content-center">
                            <Link
                                to="#"
                                className="text-info d-inline-block"
                                onClick={() => handleViewClick(cellProps.row.original.id)}
                            >
                                <i className="ri-eye-line fs-16"></i>
                            </Link>
                        </div>
                    );
                },
            },
        ],
        []
    );

    document.title = "Route Details | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Transporter Route Details" pageTitle="Transporter Route Details" />
                    <Row>
                        <Col lg={12}>
                            <Card id="routeList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0">Route Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div className="d-flex gap-2">
                                                <Button color="success" className="add-btn" onClick={() => setIsExportCSV(true)}>
                                                    <i className="ri-file-excel-line align-bottom me-1"></i> Export
                                                </Button>
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        <TableContainer
                                            columns={columns}
                                            data={routes}
                                            isGlobalFilter={true}
                                            isAddUserList={false}
                                            customPageSize={5}
                                            className="custom-header-css"
                                            theadClass="text-muted"
                                            SearchPlaceholder='Search...'
                                        />
                                    </div>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Route Details Modal */}
            <Modal isOpen={viewModal} toggle={toggleViewModal} centered size="lg">
                <ModalHeader toggle={toggleViewModal}>
                    Route Details
                </ModalHeader>
                <ModalBody>
                    {selectedRoute && (
                        <div>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Route Code</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.routeCode}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Route Name</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.routeName}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Departure Location</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.departureLocation}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Destination Location</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.destinationLocation}</div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Route Type</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.routeType || "Road"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Transportation Group</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.transportationGroup || "Truck"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Delivery Time (Hours)</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.deliveryTime || "4"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Shipping Condition</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.shippingCondition || "SMTdard"}</div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Route Determinate Criteria</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.routeDeterminateCriteria || "Automatic"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Intermediate Stops</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.intermediateStops || "Mumbai, Delhi"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">DISMTCE (KM)</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.dismtce || "1734"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Transportation Cost</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.transportationCost || "50,000"}</div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Carrier</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.carrier || "Berlin Carrier"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Route Selection</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.routeSelection || "Fastest"}</div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="form-group">
                                        <Label className="form-label">Transportation Zone</Label>
                                        <div className="border-bottom pb-2">{selectedRoute.transportationZone || "Region 1"}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleViewModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Export CSV Modal */}
            {isExportCSV && (
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={routes}
                />
            )}
        </React.Fragment>
    );
};

export default RouteDetails;