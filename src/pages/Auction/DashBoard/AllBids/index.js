import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader, Input, FormGroup } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../../Components/Common/Loader";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";

// Import custom components
import BidCard from "./BidCard/BideCard";
import BidViewModal from "./BidViewModal/BidViewModal";
import BidHistoryModal from "./BidHistoryModal/BidHistoryModal";

const ViewAllBids = () => {
    const [bids, setBids] = useState([]);
    const [viewModal, setViewModal] = useState(false);
    const [historyModal, setHistoryModal] = useState(false);
    const [viewData, setViewData] = useState({});
    const [selectedBidNo, setSelectedBidNo] = useState('');
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [Plant_Code, setPlantCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    const toggleView = useCallback(() => {
        if (viewModal) {
            setViewModal(false);
        } else {
            setViewModal(true);
        }
    }, [viewModal]);

    const toggleHistory = useCallback(() => {
        if (historyModal) {
            setHistoryModal(false);
        } else {
            setHistoryModal(true);
        }
    }, [historyModal]);

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
    }, []);

    // Get status based on date comparison
    const getStatus = (bidFrom, bidTo) => {
        const now = new Date();
        const start = new Date(bidFrom);
        const end = new Date(bidTo);

        if (now < start) return "To Be Started";
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
            
            // Basic authentication setup
            const username = process.env.REACT_APP_API_USER_NAME;
            const password = process.env.REACT_APP_API_PASSWORD;
            const basicAuth = 'Basic ' + btoa(username + ':' + password);
            
            // Get transporter code - you might need to adjust this based on your auth implementation
            const authUser = JSON.parse(sessionStorage.getItem("authUser") || '{}');
            const transporterCode = authUser?.data?.transporterCode || 'T-000008';
            
            const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getAllBidsByTransporterCode?transporterCode=${transporterCode}`, {
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
                // Add status to each bid based on date comparison
                const bidsWithStatus = responseData.data.map(bid => ({
                    ...bid,
                    status: getStatus(bid.bidFrom, bid.bidTo)
                }));
                setBids(bidsWithStatus);
            } else {
                console.log('Unexpected API response structure:', responseData);
                setBids([]);
            }
        } catch (err) {
            console.error('API Error:', err);
            setError("Failed to fetch bid data. Please try again.");
            setBids([]);
            toast.error("Failed to fetch bid data. Please try again.", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle status filter change
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Filter bids based on search term and status
    const filteredBids = bids.filter(bid => {
        const matchesSearch = Object.values(bid).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const matchesStatus = !statusFilter || statusFilter === 'All' || bid.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // View Data
    const handleViewClick = useCallback((bidNo) => {
        // Find the bid in the fetched data
        const selectedBid = bids.find(bid => bid.biddingOrderNo === bidNo);
        if (selectedBid) {
            setViewData(selectedBid);
            setViewModal(true);
        } else {
            toast.error("Bid details not found", { autoClose: 3000 });
        }
    }, [bids]);

    // History Data
    const handleHistoryClick = useCallback((bidNo) => {
        // Find the bid in the fetched data
        const selectedBid = bids.find(bid => bid.biddingOrderNo === bidNo);
        if (selectedBid) {
            setSelectedBidNo(selectedBid.biddingOrderNo);
            setHistoryModal(true);
        } else {
            toast.error("Bid details not found", { autoClose: 3000 });
        }
    }, [bids]);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();

        try {
            // For now, just update the local state
            // In production, you would make an API call here
            const updatedBids = bids.filter(bid => bid.id !== CurrentID);
            setBids(updatedBids);
            toast.success("Bid Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
            
            // Uncomment and adjust when you have a delete API endpoint
            // const username = process.env.REACT_APP_API_USER_NAME;
            // const password = process.env.REACT_APP_API_PASSWORD;
            // const basicAuth = 'Basic ' + btoa(username + ':' + password);
            
            // const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8085}/biddingMaster/delete/${CurrentID}`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Authorization': basicAuth
            //     }
            // });
            
            // if (response.ok) {
            //     toast.success("Bid Deleted Successfully", { autoClose: 3000 });
            //     fetchBidData(); // Refresh the data
            // } else {
            //     throw new Error('Delete failed');
            // }
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };

    document.title = "Bids Management | EPLMS";
    
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={bids}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={"Auction"} pageTitle="Bids" />
                    <Row>
                        <Col lg={12}>
                            <Card id="bidsList">
                                <CardHeader className="border-0">
                                    <Row className="align-items-center">
                                        <Col>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div style={{ width: "600px" }}>
                                                    <h5 className="card-title mb-0 p-2 bg-light">Bids Management</h5>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="search-box me-2">
                                                        <Input
                                                            type="text"
                                                            className="form-control search"
                                                            placeholder="Search..."
                                                            value={searchTerm}
                                                            onChange={handleSearchChange}
                                                        />
                                                    </div>
                                                    <FormGroup className="mb-0">
                                                        <Input
                                                            type="select"
                                                            className="form-select"
                                                            value={statusFilter}
                                                            onChange={handleStatusChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="All">All</option>
                                                            <option value="Running">Running</option>
                                                            <option value="Completed">Completed</option>
                                                            <option value="To Be Started">To Be Started</option>
                                                        </Input>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {/* Card view for bids */}
                                        <div className="bid-cards-container">
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
                                                    <button className="btn btn-primary btn-sm" onClick={fetchBidData}>
                                                        Retry
                                                    </button>
                                                </div>
                                            ) : filteredBids && filteredBids.length ? (
                                                filteredBids.map(bid => (
                                                    <BidCard 
                                                        key={bid.id} 
                                                        bid={bid} 
                                                        handleViewClick={() => handleViewClick(bid.biddingOrderNo)}
                                                        handleHistoryClick={() => handleHistoryClick(bid.biddingOrderNo)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="text-center my-4">
                                                    <p>No bids found matching your search criteria.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* View Modal */}
                                    <BidViewModal 
                                        isOpen={viewModal}
                                        toggle={toggleView}
                                        viewData={viewData}
                                    />
                                    
                                    {/* History Modal */}
                                    <BidHistoryModal 
                                        isOpen={historyModal}
                                        toggle={toggleHistory}
                                        bidNo={selectedBidNo}
                                        bidData={viewData}
                                    />
                                    
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ViewAllBids;