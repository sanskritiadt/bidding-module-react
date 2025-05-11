//latest code 
import React, { useState, useEffect } from "react";
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
import Loader from "../../../Components/Common/Loader";

const RouteDetails = () => {
    const [routes, setRoutes] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    // Export Modal state
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginCode, setLoginCode] = useState('');
 
const [isViewModalOpen, setIsViewModalOpen] = useState(false);

 
    useEffect(() => {
        try {
            const storedData = sessionStorage.getItem("main_menu_login");
            
            if (storedData) {
                const obj = JSON.parse(storedData);
                
                // Access login directly from the object as shown in your session storage
                if (obj && obj.login) {
                    let Code = obj.login;
                    setLoginCode(Code);
                    console.log("here is the Login code found in route details -------->", Code);
                } else {
                    console.warn("Login data structure is not as expected");
                }
            } else {
                console.warn("No login data found in session storage");
            }
        } catch (error) {
            console.error("Error accessing login data:", error);
        }
    }, []);

    // Fetch data from API when loginCode is available
    useEffect(() => {
        if (loginCode) {
            fetchRoutes();
        }
    }, [loginCode]); // <- Now depends on loginCode

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            // Check if loginCode is available
            if (!loginCode) {
                console.error("Login code not available");
                toast.error("Login code not available. Please log in again.");
                setLoading(false);
                return;
            }
            
            // Use the login code in the API URL
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${loginCode}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw==',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Transporter API Response:", data);
            
            // Handle the different response structure
            if (data && data.data) {
                // Since this API returns a single transporter object instead of an array,
                // we need to convert it to an array format for the table
                const transporterData = data.data;
                
                // Create a routes array with the transporter data with proper fallbacks
                const routesData = [{
                    id: transporterData.id,
                    routeCode: transporterData.code || "N/A",
                    routeName: transporterData.name || "N/A",
                    plantCode: transporterData.plantCode || "N/A",
                    routeDestination: transporterData.regionLocation || transporterData.address || "N/A",
                    
                    // Contact information
                    contactPerson: transporterData.contactPerson || "N/A",
                    contactNumber: transporterData.contactNumber || "N/A",
                    contactEmail: transporterData.contactEmail || "N/A",
                    
                    // Owner information
                    ownerPerson: transporterData.ownerPerson || "N/A",
                    ownerNumber: transporterData.ownerNumber || "N/A",
                    ownerEmail: transporterData.ownerEmail || "N/A",
                    
                    // Business information
                    gstnNo: transporterData.gstnNo || "N/A",
                    panNo: transporterData.panNo || "N/A",
                    
                    // Additional fields
                    status: transporterData.status || "N/A",
                    priceKm: transporterData.priceKm || "N/A",
                    companyCode: transporterData.companyCode || "N/A",
                    city: transporterData.city || "N/A",
                    movementCode: transporterData.movementCode || "N/A",
                    modeTransport: transporterData.modeTransport || "N/A",
                    termPayment: transporterData.termPayment || "N/A",
                    transporterRating: transporterData.transporterRating || "N/A",
                    taxInfo: transporterData.taxInfo || "N/A",
                    serviceLevelAgreement: transporterData.serviceLevelAgreement || "N/A",
                    allowedBidding: transporterData.allowedBidding || "N/A",
                    address: transporterData.address || "N/A"
                }];
                
                console.log("Processed route data:", routesData);
                setRoutes(routesData);
                
                if (data.meta && data.meta.message) {
                    console.log("API Success Message:", data.meta.message);
                    toast.success(data.meta.message);
                }
            } else {
                console.error("Invalid data structure:", data);
                toast.error("Invalid data format received from API");
            }
        } catch (error) {
            console.error("Error fetching transporter data:", error);
            toast.error("Failed to fetch transporter data. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    const handleView = async (routeId) => {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/id/${routeId}`, {
            method: "GET",
            headers: {
              Authorization: "Basic YW1hemluOlRFQE0tV0BSSw==",
               'Content-Type': 'application/json'
            },
       
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch route details");
          }
      
          const result = await response.json();
          setSelectedRoute(result?.data); // Set response to state
          setIsViewModalOpen(true);       // Open the modal
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error("Failed to fetch route data");
        } finally {
          setLoading(false);
        }
      };
      



const handleViewClick = (routeId) => {
    console.log("Clicked route ID:", routeId);
    
    // Find the route directly
    const route = routes.find(r => String(r.id) === String(routeId));
    
    if (route) {
        // Set selected route and open modal
        setSelectedRoute(route);
        setViewModal(true);
    } else {
        console.error("Route not found for ID:", routeId);
        toast.error("Route details not found");
    }
};
    const toggleViewModal = () => {
        // Simply toggle the modal visibility
        setViewModal(!viewModal);
    };

    // Handle the download functionality
    const handleDownload = (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false);
    };

    // Download CSV function
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
            "Plant Code",
            "Route Destination",
            "Contact Person",
            "Contact Number"
        ].join(',') + '\n';

        // Create CSV rows
        const rows = routes.map(route => 
            [
                route.routeCode,
                route.routeName,
                route.plantCode,
                route.routeDestination,
                route.contactPerson,
                route.contactNumber
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

    const ModalStyles = `
    /* Reduced vertical spacing between input fields */
    .compact-modal .form-label {
      margin-bottom: 2px;
    }
    
    .compact-modal .mb-2 {
      margin-bottom: 0.5rem !important;
    }
    
    /* Further reduce spacing for view modal */
    .compact-modal .mb-1 {
      margin-bottom: 0.25rem !important;
    }
    
    /* Gap between modal header and input fields */
    .compact-modal .modal-body {
      padding-top: 1rem;
    }
    
    /* Make form fields more compact in height */
    .compact-modal .form-control,
    .compact-modal .form-select {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      min-height: 32px;
    }
    
    /* For View Modal */
    .compact-modal .form-control-sm {
      padding-top: 0.15rem;
      padding-bottom: 0.15rem;
      min-height: 24px;
    }
    
    /* Reduce spacing between rows */
    .compact-modal .g-2 {
      --bs-gutter-y: 0.3rem;
    }
    
    /* Optimize spacing for the Edit Modal */
    .compact-modal .g-3 {
      --bs-gutter-y: 0.75rem;
    }
    
    /* Even more compact label in view modal */
    .compact-modal .fw-semibold.mb-1 {
      margin-bottom: 0 !important;
      font-size: 0.85rem;
    }
    
    /* Reduce padding in the form-control-sm elements */
    .compact-modal .form-control-sm.py-1 {
      padding-top: 0.1rem !important;
      padding-bottom: 0.1rem !important;
    }
  `;

    // Routes Column based on API response structure
    const columns = React.useMemo(
        () => [
            {
                Header: "Route Code",
                accessor: "routeCode",
                filterable: false,
            },
            {
                Header: "Route Name",
                accessor: "routeName",
                filterable: false,
            },
            {
                Header: "Plant Code",
                accessor: "plantCode",
                filterable: false,
            },
            {
                Header: "Route Destination",
                accessor: "routeDestination",
                filterable: false,
            },
            {
                Header: "Contact Person",
                accessor: "contactPerson",
                filterable: false,
            },
            {
                Header: "Contact Number",
                accessor: "contactNumber",
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
                                onClick={() => handleView(cellProps.row.original.id)}
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
            <style>{ModalStyles}</style>
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
                                    {loading ? (
                                        <Loader />
                                    ) : (
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
                                    )}
                                <ToastContainer closeButton={false} limit={1}
                                         position="top-right"
                                         autoClose={3000}
                                         hideProgressBar={false}
                                         closeOnClick
                                         rtl={false}
                                         pauseOnFocusLoss
                                         draggable
                                         pauseOnHover
                                         theme="light"
                                         toastStyle={{ backgroundColor: "white" }} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

  {/* Route Details Modal */}
{/* Route Details Modal */}
<Modal isOpen={isViewModalOpen} toggle={() => setIsViewModalOpen(false)}>
<ModalHeader toggle={() => setIsViewModalOpen(false)}>View Route</ModalHeader>
    
    <ModalBody className="p-3">
        {selectedRoute ? (
            <div>
                {/* Row 1: Basic Route Information */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Code</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeCode || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Name</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeName || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Plant Code</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.plantCode || ""}</p>
                    </Col>
                </Row>

                {/* Row 2: Route Details */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Destination</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeDestination || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Type</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeType || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Transportation Type</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.modeTransport || ""}</p>
                    </Col>
                </Row>

                {/* Row 3: Delivery Information */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Delivery Date</Label>
                        <p className="form-control form-control-sm bg-light mb-0">
                            {selectedRoute.deliveryDate ? new Date(selectedRoute.deliveryDate).toLocaleString() : ""}
                        </p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Shipping Type</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.shippingType || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Determination</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeDetermination || ""}</p>
                    </Col>
                </Row>

                {/* Row 4: Route Details */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Intermediate Stops</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.intermediateStops || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Distance</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeDistance || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Transportation Cost</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.transportationCost || ""}</p>
                    </Col>
                </Row>

                {/* Row 5: Additional Information */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Carrier</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.carrier || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Route Selection</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.routeSelection || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Transportation Zone</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.transportationZone || ""}</p>
                    </Col>
                </Row>

                {/* Row 6: Final Details */}
                <Row className="g-2 mb-2">
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Shipping Point</Label>
                        <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.shippingPoint || ""}</p>
                    </Col>
                    <Col md={4}>
                        <Label className="form-label mb-0 fw-semibold">Status</Label>
                        <p className="form-control form-control-sm bg-light mb-0">
                            {selectedRoute.status === 'A' ? 'Active' : 
                             selectedRoute.status === 'D' ? 'Deactive' : 
                             selectedRoute.status || ""}
                        </p>
                    </Col>
                    {/* You can add another field here if needed */}
                </Row>

                {/* Contact Information if available */}
                {selectedRoute.contactPerson && (
                    <Row className="g-2 mb-2">
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Contact Person</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.contactPerson || ""}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Contact Number</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.contactNumber || ""}</p>
                        </Col>
                        <Col md={4}>
                            <Label className="form-label mb-0 fw-semibold">Contact Email</Label>
                            <p className="form-control form-control-sm bg-light mb-0">{selectedRoute.contactEmail || ""}</p>
                        </Col>
                    </Row>
                )}
            </div>
        ) : (
            <div className="text-center">
                <p>No route data available</p>
            </div>
        )}
    </ModalBody>
    <ModalFooter>
        <button type="button" className="btn btn-light btn-sm" onClick={toggleViewModal}>Close</button>
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