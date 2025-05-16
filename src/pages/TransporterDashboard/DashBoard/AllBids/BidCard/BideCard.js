import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BidCard.css";
import winnerlogo from '../../../../../assets/images/winner.png';
 
const BidCard = ({ bid, handleViewClick, handleHistoryClick, handleSoDetailsClick }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Function to determine status class
    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "completed";
            case "Running":
                return "running";
            case "To Be Started":
                return "to-be-started";
            default:
                return "";
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        // Formatter for date part
        const dateFormatter = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        // Formatter for time part
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const formattedDate = dateFormatter.format(date);
        const formattedTime = timeFormatter.format(date);

        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    const calculateTimeRemaining = (bidTo) => {
        const endTime = new Date(bidTo);
        const diffMs = endTime - currentTime;

        if (diffMs <= 0) {
            return { time: "00:00", isExpired: true };
        }

        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return {
            time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            isExpired: false
        };
    };

    return (
        <div className="bid-card mb-3">
            {/* Header with navy background, status pill, bid info and route info */}
            <div className="bid-header">
                <div className={`status-pill ${getStatusClass(bid.status)}`}>
                    {bid.status}
                </div>
                <div className="flex-1 flex items-center justify-between px-4 meta-group">
                    <span className="bid-number1">Bid No.: {bid.biddingOrderNo}</span>
                    <span className="divider"></span>
                    <span className="bid-time">Bid Start Time: {formatDate(bid.bidFrom)}</span>
                </div>
                <div className="route-label">
                    Route No.: {bid.routeNo || "RN123"}
                </div>
            </div>
 
            {/* Content area */}
            <div className="bid-content">
                {/* Transporter section */}
                <div className="section transporter-section">
                    {bid.status === "Completed" ? (
                        <div className="d-flex flex-column align-items-center p-2 position-relative">
                            <div className="position-relative text-center">
                                <img
                                    src={winnerlogo}
                                    alt="Winner"
                                    className="mb-1"
                                    style={{ width: '130px', height: 'auto' }}
                                />
                                <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold fs-6">
                                    Winner
                                </div>
                            </div>
                            <div className="text-primary fw-bold fs-5 mt-1">
                                {bid.transporterName}
                            </div>
                        </div>
                    ) : bid.status === "Running" ? (
                        <div className="text-center">
                            <div className="fw-bold">Rank 1</div>
                            <div>{bid.transporterCode}</div>
                        </div>
                    ) : (
                        <div className="text-center fst-italic">Not Started</div>
                    )}
                </div>
                
                {/* From/To Location section */}
                <div className="section location-section">
                    <div className="info-item">
                        <div className="info-label">From Location</div>
                        <div className="info-value">{bid.fromLocation}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">To Location</div>
                        <div className="info-value">{bid.toLocation}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Distance</div>
                        <div className="info-value">{bid.distance || "765 KM"}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Time</div>
                        <div className="info-value">{bid.lastTimeExtension} Hours</div>
                    </div>
                </div>
 
                {/* Material section */}
                <div className="section material-section">
                    <div className="info-item">
                        <div className="info-label">Material</div>
                        <div className="info-value">{bid.material}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Quantity</div>
                        <div className="info-value">{bid.quantity}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Multiple Order</div>
                        <div className="info-value">{bid.multiMaterial == 1 ? "YES" : "NO"}</div>
                    </div>
                </div>
 
                {/* Price section */}
                <div className="section price-section">
                    <div className="info-item">
                        <div className="info-label">Ceiling Price</div>
                        <div className="info-value">{bid.ceilingPrice}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Interval Price</div>
                        <div className="info-value">{bid.intervalPrice}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Last Bid</div>
                        <div className="info-value">{bid.lastBidAmount || bid.ceilingPrice}</div>
                    </div>
                </div>
 
                {/* City/Line section */}
                <div className="section city-section">
                    <div className="info-item">
                        <div className="info-label">City Name</div>
                        <div className="info-value">{bid.city}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Line No.</div>
                        <div className="info-value">{bid.lineNo || "205"}</div>
                    </div>
                </div>
 
                {/* Time Remaining section */}
                <div className="section time-section">
                    <div className="bidding-time-circle">
                        {(() => {
                            const { time, isExpired } = calculateTimeRemaining(bid.bidTo);
                            return isExpired ? (
                                <>
                                    <span className="time-label">Bid</span>
                                    <span className="time-label">Expired</span>
                                    <span className="time-value">00:00</span>
                                </>
                            ) : (
                                <>
                                    <span className="time-label">Time</span>
                                    <span className="time-label">Remaining</span>
                                    <span className="time-value">{time}</span>
                                </>
                            );
                        })()}
                    </div>
                </div>
 
                {/* Action Buttons */}
                <div className="section actions-section">
                    <Link
                        to="#"
                        className={`view-detail-btn ${bid.status === 'Running' ? 'disabled' : ''}`}
                        onClick={(e) => {
                            if (bid.status === 'Running') {
                                e.preventDefault();
                                return;
                            }
                            handleViewClick(bid.biddingOrderNo);
                        }}
                        style={{
                            pointerEvents: bid.status === 'Running' ? 'none' : 'auto',
                            opacity: bid.status === 'Running' ? 0.6 : 1,
                            cursor: bid.status === 'Running' ? 'not-allowed' : 'pointer',
                            backgroundColor: bid.status === 'Running' ? '#cccccc' : '',
                            color: bid.status === 'Running' ? '#666666' : ''
                        }}
                    >
                        BID NOW
                    </Link>
                    <Link
                        to="#"
                        className="view-detail-btn"
                        onClick={() => handleSoDetailsClick(bid.biddingOrderNo)}
                    >
                        SO DETAILS
                    </Link>
                    <Link
                        to="#"
                        className="bid-history-btn"
                        onClick={() => handleHistoryClick(bid.biddingOrderNo)}
                    >
                      
                        BID HISTORY
                    </Link>
                </div>
            </div>
        </div>
    );
};
 
export default BidCard;