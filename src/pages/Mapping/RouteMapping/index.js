import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardHeader, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import AssignRouteModal from "./AssignRouteModal/AssignRouteModal"; 
import ViewRoutesModal from "./ViewRoutesModal/ViewRoutesModal";
import Loader from "../../../Components/Common/Loader";

const RouteMapping = () => {
    const [transporters, setTransporters] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [isAssignRouteModalOpen, setIsAssignRouteModalOpen] = useState(false);
    const [isViewRouteModalOpen, setIsViewRouteModalOpen] = useState(false);
    const [currentTransporterCode, setCurrentTransporterCode] = useState("");
    const [viewRouteData, setViewRouteData] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    
    // Loading states
    const [isTransportersLoading, setIsTransportersLoading] = useState(false);
    const [isRoutesLoading, setIsRoutesLoading] = useState(false);
    const [isViewRoutesLoading, setIsViewRoutesLoading] = useState(false);
    const [isAssigningRoutes, setIsAssigningRoutes] = useState(false);

    // Modal toggle function - NEW FUNCTION
    const handleModalToggle = () => {
        // If we're closing the modal
        if (isAssignRouteModalOpen) {
            setSelectedRoutes([]);
            // Only reset selectedRows when bulk assigning (no currentTransporterCode)
            if (!currentTransporterCode) {
                setSelectedRows([]);
            }
        }
        setIsAssignRouteModalOpen(!isAssignRouteModalOpen);
    };

    // Show success toast notification - NEW FUNCTION
    const showSuccessAlert = () => {
        // Show success toast notification with green background
        toast.success("Routes assigned successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        
        // Reset UI state
        setSelectedRows([]);
        setSelectedRoutes([]);
        setIsAssignRouteModalOpen(false);
    };

    // Configuration for API requests with Basic Authentication
    const getAuthHeaders = () => {
        const username = process.env.REACT_APP_API_USER_NAME || 'your_default_username';
        const password = process.env.REACT_APP_API_PASSWORD || 'your_default_password';
        const base64Auth = btoa(`${username}:${password}`);
        
        return {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Auth}`
        };
    };

    // Function to fetch transporters data
    const fetchTransporters = async () => {
        setIsTransportersLoading(true);
        try {
            // Use the getAuthHeaders function for consistent auth headers
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransporters`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("API Response:", result);
            
            // Check if the response has the expected structure with data property
            if (result && result.data && Array.isArray(result.data)) {
                // Map API response data to match table columns
                const mappedData = result.data.map(item => ({
                    id: item.id,
                    transporterCode: item.code,
                    transporterName: item.name,
                    contactPerson: item.contactPerson || "",
                    phoneNo: item.contactNumber || "",
                    emailId: item.contactEmail || "",
                    rType: item.modeTransport || ""  // Using modeTransport as the route type
                }));
                
                console.log("Mapped Data:", mappedData);
                setTransporters(mappedData);
            } else {
                console.warn("Response structure is not as expected:", result);
                setTransporters([]);
            }
        } catch (error) {
            console.error("Error fetching transporters:", error);
            setTransporters([]);
            // Show error toast
            toast.error("Failed to fetch transporters. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsTransportersLoading(false);
        }
    };

    useEffect(() => {
        fetchTransporters();
    }, []);
    
    // Updated function to fetch all routes for assignment modal using the new endpoint
    const fetchAllRoutes = async () => {
        setIsRoutesLoading(true);
        try {
            // Use the new API endpoint as specified
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/getAllRoutes`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.data && Array.isArray(result.data)) {
                    // Map the API response to match the expected format for the table
                    const mappedRoutes = result.data.map(route => ({
                        id: route.id,
                        routeCode: route.routeCode || "",
                        departureLocation: "", // This field is not in the API response, showing blank
                        destinationLocation: "", // This field is not in the API response, showing blank
                        routeType: route.routeType || "",
                        distance: route.routeDistance || "",
                    }));
                    setRoutes(mappedRoutes);
                } else {
                    console.error("Invalid data structure received from routes API");
                    setRoutes([]);
                }
            } else {
                console.error("Failed to fetch routes. Status:", response.status);
                setRoutes([]);
                toast.error("Failed to fetch routes. Please try again later.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error fetching all routes:", error);
            setRoutes([]);
            toast.error("Error fetching routes. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsRoutesLoading(false);
        }
    };

    // Handle view routes for a transporter
    // const handleViewRoutes = async (transporterCode) => {
    //     setIsViewRoutesLoading(true);
    //     try {
    //         // Use the transporter code directly in the API URL
    //       //  const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transportersRouteMap/transporterCode?transporterCode=${transporterCode}`, 
    //       const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/transportercode/${transporterCode}`, 
    //             {
    //             method: 'GET',
    //             headers: getAuthHeaders()
    //         });
            
    //         // If API call is successful, use the returned data
    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log("View routes API response:", result);
                
    //             if (result.data && Array.isArray(result.data)) {
    //                 // Transform the data to match the expected structure for the view modal
    //                 const transformedData = result.data.map(item => ({
    //                     routeCode: item.routeCode || "",
    //                     departureLocation: item.departureLocation || "",
    //                     destinationLocation: item.destinationLocation || "",
    //                     routeType: item.routeType || "",
    //                     distance: item.distance || ""
    //                 }));
    //                 setViewRouteData(transformedData);
    //             } else {
    //                 console.warn("Invalid data structure in route response");
    //                 setViewRouteData([]);
    //             }
    //         } else {
    //             console.error(`Failed to fetch routes for transporter. Status: ${response.status}`);
    //             setViewRouteData([]);
    //             toast.warning("No routes found for this transporter.", {
    //                 position: "top-right",
    //                 autoClose: 3000,
    //             });
    //         }
            
    //         setCurrentTransporterCode(transporterCode);
    //         setIsViewRouteModalOpen(true);
    //     } catch (error) {
    //         console.error("Error fetching routes for transporter:", error);
    //         setViewRouteData([]);
    //         setCurrentTransporterCode(transporterCode);
    //         setIsViewRouteModalOpen(true);
    //         toast.error("Error fetching routes for this transporter.", {
    //             position: "top-right",
    //             autoClose: 5000,
    //         });
    //     } finally {
    //         setIsViewRoutesLoading(false);
    //     }
    // };

    const handleViewRoutes = async (transporterCode) => {
        setIsViewRoutesLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/routes/transportercode/${transporterCode}`, 
                {
                    method: 'GET',
                    headers: getAuthHeaders()
                });
    
            if (response.ok) {
                const result = await response.json();
                console.log("View routes API response:", result);
    
                if (result.datalist && Array.isArray(result.datalist)) {
                    // Transform the data to match the expected structure for the view modal
                    const transformedData = result.datalist.map(item => ({
                        routeCode: item.routeCode || "",
                        departureLocation: item.routeName || "", // assuming this is your desired label
                        destinationLocation: item.routeDestination || "",
                        routeType: item.routeType || "",
                        distance: item.routeDistance || ""
                    }));
                    setViewRouteData(transformedData);
                } else {
                    console.warn("Invalid data structure in route response");
                    setViewRouteData([]);
                }
            } else {
                console.error(`Failed to fetch routes for transporter. Status: ${response.status}`);
                setViewRouteData([]);
                toast.warning("No routes found for this transporter.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
    
            setCurrentTransporterCode(transporterCode);
            setIsViewRouteModalOpen(true);
        } catch (error) {
            console.error("Error fetching routes for transporter:", error);
            setViewRouteData([]);
            setCurrentTransporterCode(transporterCode);
            setIsViewRouteModalOpen(true);
            toast.error("Error fetching routes for this transporter.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsViewRoutesLoading(false);
        }
    };
    
    // Columns for transporters table
    const columns = useMemo(
        () => [
            {
                Header: () => (
                    <Input
                        type="checkbox"
                        checked={transporters.length > 0 && selectedRows.length === transporters.length}
                        onChange={() => {
                            setSelectedRows(
                                selectedRows.length === transporters.length
                                    ? []
                                    : transporters.map(t => t.id)
                            );
                        }}
                    />
                ),
                accessor: "checkbox",
                disableHiding: true,
                Cell: ({ row }) => (
                    <Input
                        type="checkbox"
                        checked={selectedRows.includes(row.original.id)}
                        onChange={() => {
                            setSelectedRows(prevSelected =>
                                prevSelected.includes(row.original.id)
                                    ? prevSelected.filter(id => id !== row.original.id)
                                    : [...prevSelected, row.original.id]
                            );
                        }}
                    />
                ),
                disableSortBy: true,
            },
            { Header: "Transporter Code", accessor: "transporterCode" },
            { Header: "Transporter name", accessor: "transporterName" },
            { Header: "Contact Person", accessor: "contactPerson" },
            { Header: "Phone No.", accessor: "phoneNo" },
            { Header: "Email Id", accessor: "emailId" },
            { Header: "R-Type", accessor: "rType" },
            {
                Header: "Assign Route",
                Cell: ({ row }) => (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Link 
                            to="#" 
                            className="text-info"
                            onClick={() => handleViewRoutes(row.original.transporterCode)}
                        >
                            <i className="ri-eye-line fs-16"></i>
                        </Link>
                        <Link
                            to="#"
                            className="text-success"
                            onClick={() => {
                                setCurrentTransporterCode(row.original.transporterCode);
                                fetchAllRoutes();
                                handleModalToggle(); // UPDATED: using handleModalToggle instead
                            }}
                        >
                            <i className="ri-map-pin-line fs-16"></i>
                        </Link>
                    </div>
                ),
                disableSortBy: true,
            }
        ],
        [selectedRows, transporters]
    );

    // UPDATED: Handle route assignment
    const handleAssignRoutes = async () => {
        setIsAssigningRoutes(true);
        try {
            let mappingData = [];
            const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

            // If a single transporter is selected
            if (currentTransporterCode) {
                // Get selected route details for current transporter
                mappingData = selectedRoutes.map(routeId => {
                    const route = routes.find(r => r.id === routeId);
                    return {
                        transporterCode: currentTransporterCode,
                        routeCode: route.routeCode,
                        createdDate: currentDate,
                        status: "A"
                    };
                });
            }
            // If multiple transporters are selected (bulk assign)
            else if (selectedRows.length > 0) {
                // For each selected transporter, create entries for each selected route
                selectedRows.forEach(transporterId => {
                    const transporter = transporters.find(t => t.id === transporterId);
                    selectedRoutes.forEach(routeId => {
                        const route = routes.find(r => r.id === routeId);
                        mappingData.push({
                            transporterCode: transporter.transporterCode,
                            routeCode: route.routeCode,
                            createdDate: currentDate,
                            status: "A"
                        });
                    });
                });
            }
            
            console.log("Attempting to assign routes:", mappingData);
            
            // Make the API call with proper authentication using the new endpoint
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transportersRouteMap`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(mappingData)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log("Routes assigned successfully:", result);
                showSuccessAlert(); // UPDATED: using toast instead of alert
                
                // Refresh the data
                fetchTransporters();
                
                // Refresh the routes data if needed
                if (currentTransporterCode) {
                    handleViewRoutes(currentTransporterCode);
                }
            } else {
                console.error("Failed to assign routes. Status:", response.status);
                toast.error("Failed to assign routes. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
            
        } catch (error) {
            console.error("Error assigning routes:", error);
            toast.error("An error occurred while assigning routes.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsAssigningRoutes(false);
        }
    };

    // Handle Assign Multiple Route button click - UPDATED
    const handleAssignMultipleRouteClick = () => {
        if (selectedRows.length > 0) {
            setCurrentTransporterCode(""); // Clear the transporter code for multiple assignment
            fetchAllRoutes();
            handleModalToggle(); // UPDATED: using handleModalToggle instead
        }
    };

    // NEW: Handle the download functionality
    const handleDownload = (e) => {
        e.preventDefault();
        downloadCSV();
        setIsExportCSV(false);
    };

    // NEW: Download CSV function
    const downloadCSV = () => {
        if (transporters.length === 0) {
            toast.warning("No data available to export", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Create column headers
        const headers = [
            "Transporter Code",
            "Transporter Name",
            "Contact Person",
            "Phone No.",
            "Email Id",
            "R-Type"
        ].join(',') + '\n';

        // Create CSV rows
        const rows = transporters.map(transporter => 
            [
                transporter.transporterCode,
                transporter.transporterName,
                transporter.contactPerson,
                transporter.phoneNo,
                transporter.emailId,
                transporter.rType
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
        a.download = 'TransporterRouteMapping.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // toast.success("CSV file exported successfully!", {
        //     position: "top-right",
        //     autoClose: 3000,
        // });
    };

    document.title = "Route Mapping | EPLMS";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Transporter Route Mapping" pageTitle="Transporter Route Mapping" />
                    <div className="bg-white rounded p-4" style={{ width: "100%" }}>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div style={{ width: "68%" }}>
                                <h5 className="card-title mb-0 bg-light px-3 py-2">
                                    Transporter Route Mapping
                                </h5>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    style={{
                                        backgroundColor: '#4FC3A1',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: selectedRows.length > 0 ? 'pointer' : 'not-allowed'
                                    }}
                                    id="assignMultilpeRoute"
                                    onClick={handleAssignMultipleRouteClick}
                                    disabled={selectedRows.length === 0}
                                >
                                    <i className="ri-map-pin-line align-bottom me-1"></i> Assign Multiple Route
                                </Button>

                                <Button color="info" onClick={() => setIsExportCSV(true)}>
                                    <i className="ri-file-download-line align-bottom me-1"></i> Export
                                </Button>
                            </div>
                        </div>
                        
                        <div className="table-container">
                            {isTransportersLoading ? (
                                <div className="text-center my-5">
                                    <Loader />
                                </div>
                            ) : (
                                <TableContainer
                                    columns={columns}
                                    data={transporters}
                                    isGlobalFilter={true}
                                    isAddUserList={false}
                                    customPageSize={10}
                                    isGlobalSearch={true}
                                    className="custom-header-css"
                                    SearchPlaceholder="Search for transporter..."
                                />
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Using the imported ViewRoutesModal component */}
            <ViewRoutesModal
                isOpen={isViewRouteModalOpen}
                toggle={() => setIsViewRouteModalOpen(!isViewRouteModalOpen)}
                currentTransporterCode={currentTransporterCode}
                viewRouteData={viewRouteData}
                isLoading={isViewRoutesLoading}
            />

            {/* Using the new AssignRouteModal component - UPDATED: using handleModalToggle */}
            <AssignRouteModal
                isOpen={isAssignRouteModalOpen}
                toggle={handleModalToggle}
                currentTransporterCode={currentTransporterCode}
                routes={routes}
                selectedRoutes={selectedRoutes}
                setSelectedRoutes={setSelectedRoutes}
                handleAssignRoutes={handleAssignRoutes}
                isLoading={isRoutesLoading || isAssigningRoutes}
            />

            {/* Export CSV Modal */}
            {isExportCSV && (
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    onDownloadClick={handleDownload}
                    data={transporters}
                />
            )}
            
            {/* Toast Container */}
            <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{ backgroundColor: "white" }}
      />
        </React.Fragment>
    );
};

export default RouteMapping;