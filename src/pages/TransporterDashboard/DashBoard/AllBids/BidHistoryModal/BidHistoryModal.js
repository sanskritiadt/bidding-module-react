import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Input, Row, Col, Spinner } from "reactstrap";
import "./BidHistoryModal.css";

const BidHistoryModal = ({ isOpen, toggle, bidNo }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bidHistory, setBidHistory] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    
    const itemsPerPage = 5;

    // Fetch bid history data when modal opens or bidNo changes
    useEffect(() => {
        if (isOpen && bidNo) {
            fetchBidHistory();
        }
    }, [isOpen, bidNo]);

    // Simulated API call to fetch bid history
    const fetchBidHistory = () => {
        setLoading(true);
        
        // Simulate API delay
        setTimeout(() => {
            // Sample data based on the image
            const historyData = [
                {
                    serialNo: 1,
                    time: "12 Jan, 2025 10:30 AM",
                    amount: "10,000",
                    material: "Iron",
                    quantity: "50 Tan"
                },
                {
                    serialNo: 2,
                    time: "12 Jan, 2025 10:24 AM",
                    amount: "8,000",
                    material: "Cement",
                    quantity: "45 Tan"
                },
                {
                    serialNo: 3,
                    time: "12 Jan, 2025 10:26 AM",
                    amount: "4,000",
                    material: "Steel",
                    quantity: "20 Tan"
                },
                {
                    serialNo: 4,
                    time: "12 Jan, 2025 10:45 AM",
                    amount: "6,000",
                    material: "Coal",
                    quantity: "22 Tan"
                },
                {
                    serialNo: 5,
                    time: "12 Jan, 2025 10:15 AM",
                    amount: "7,500",
                    material: "Copper",
                    quantity: "16 Tan"
                }
            ];
            
            setBidHistory(historyData);
            setTotalResults(20); // Simulate total of 20 results
            setTotalPages(4); // Simulate 4 pages
            setLoading(false);
        }, 500);
    };

    // Filter bid history based on search term
    const filteredBidHistory = bidHistory.filter(bid =>
        Object.values(bid).some(value => 
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle input change for page number
    const handlePageInputChange = (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page) && page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg" className="bid-history-modal">
            <ModalHeader toggle={toggle} className="border-bottom modal-title-header">
                Bid No. - {bidNo}
            </ModalHeader>
            <ModalBody className="p-0">
                {/* Search bar */}
                <div className="p-3 d-flex justify-content-end">
                    <div className="search-box">
                        <Input
                            type="search"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="form-control"
                        />
                    </div>
                </div>

                {/* Data table */}
                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner color="primary" />
                            <p className="mt-2">Loading bid history...</p>
                        </div>
                    ) : (
                        <table className="table bid-history-table mb-0">
                            <thead>
                                <tr>
                                    <th>Serial No</th>
                                    <th>Time</th>
                                    <th>Amount</th>
                                    <th>Material</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBidHistory.map((bid, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                        <td>{bid.serialNo}</td>
                                        <td>{bid.time}</td>
                                        <td>{bid.amount}</td>
                                        <td>{bid.material}</td>
                                        <td>{bid.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
                    <div>Total Results: {totalResults}</div>
                    <div className="d-flex align-items-center">
                        <button 
                            className="pagination-btn prev-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="mdi mdi-chevron-left"></i>
                        </button>
                        <span className="page-info">Page {currentPage} of {totalPages}</span>
                        <button 
                            className="pagination-btn next-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="mdi mdi-chevron-right"></i>
                        </button>
                        <input
                            type="text"
                            className="page-input"
                            value={currentPage}
                            onChange={handlePageInputChange}
                        />
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default BidHistoryModal;