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

// Import constants
import { sampleData } from "./BidConstants/bidConstants";

const ViewTransporterBids = () => {
    const [bids, setBids] = useState(sampleData); // Using sample data for UI testing
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

    useEffect(() => {
        // In a real application, you would get the plant code from session storage
        // For UI testing, we'll use a dummy value
        try {
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            let plantcode = obj?.data?.plantCode || "PLANT001";
            setPlantCode(plantcode);
            // Using sample data directly
            setBids(sampleData);
        } catch (error) {
            // Fallback for testing
            setPlantCode("PLANT001");
            setBids(sampleData);
        }
    }, []);

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
    const handleViewClick = useCallback((id) => {
        // Find the bid in the sample data
        const selectedBid = bids.find(bid => bid.id === id);
        if (selectedBid) {
            setViewData(selectedBid);
            setViewModal(true);
        } else {
            toast.error("Bid details not found", { autoClose: 3000 });
        }
    }, [bids]);

    // History Data
    const handleHistoryClick = useCallback((id) => {
        // Find the bid in the sample data
        const selectedBid = bids.find(bid => bid.id === id);
        if (selectedBid) {
            setSelectedBidNo(selectedBid.bidNo);
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
            // For UI testing - update the bids state directly
            const updatedBids = bids.filter(bid => bid.id !== CurrentID);
            setBids(updatedBids);
            toast.success("Bid Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
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
                    <BreadCrumb title={"Bids"} pageTitle="Transport" />
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
                                            {filteredBids && filteredBids.length ? (
                                                filteredBids.map(bid => (
                                                    <BidCard 
                                                        key={bid.id} 
                                                        bid={bid} 
                                                        handleViewClick={() => handleViewClick(bid.id)}
                                                        handleHistoryClick={() => handleHistoryClick(bid.id)}
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

export default ViewTransporterBids;