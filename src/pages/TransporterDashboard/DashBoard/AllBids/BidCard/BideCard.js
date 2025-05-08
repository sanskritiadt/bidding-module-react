
import React from "react";
import { Link } from "react-router-dom";
import "./BidCard.css";
import winnerlogo from '../../../../../assets/images/winner.png';

const BidCard = ({ bid, handleViewClick, handleHistoryClick }) => {
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

    return (
        <div className="bid-card mb-3">
            {/* Header with navy background, status pill, bid info and route info */}
            <div className="bid-header">
                <div className={`status-pill ${getStatusClass(bid.status)}`}>
                    {bid.status}
                </div>
                <div className="flex-1 flex items-center justify-between px-4 meta-group">
                    <span className="bid-number1">Bid No.: {bid.bidNo}</span>
                    <span className="divider"></span>
                    <span className="bid-time">Bid Start Time: {bid.bidStartTime}</span>
                </div>
                <div className="route-label">
                    Route No.: {bid.routeNo}
                </div>
            </div>

            {/* Content area */}
            <div className="bid-content">
                {/* Transporter section */}
                {/* <div className="section transporter-section">
                    {bid.status === "Completed" && bid.rank === "Winner" ? (
                        <div className="winner-container">
                            <div className="winner-badge-wrapper">
                                <div className="confetti"></div>
                                <div className="winner-badge">Winner</div>
                            </div>
                            <div className="transporter-name">{bid.transporterName}</div>
                        </div>
                    ) : bid.status === "Running" && bid.rank ? (
                        <div className="rank-container">
                            <div className="rank-text">Rank {bid.rank}</div>
                            <div className="transporter-name">{bid.transporterName}</div>
                        </div>
                    ) : (
                        <div className="not-started">
                            Not Started
                        </div>
                    )}
                </div> */}

                {/* <div className="section transporter-section">
                    {bid.status === "Completed" && bid.rank === "Winner" ? (
                        <div className="winner-container" style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '10px'
                        }}>
                            <div style={{
                                position: 'relative',
                                textAlign: 'center'
                            }}>
                                <img
                                    src={winnerlogo}
                                    alt="Winner"
                                    style={{
                                        width: '100px',
                                        height: 'auto',
                                        marginBottom: '5px'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}>
                                    Winner
                                </div>
                            </div>
                            <div style={{
                                color: '#4a5786',
                                fontWeight: 'bold',
                                fontSize: '18px',
                                marginTop: '5px'
                            }}>
                                {bid.transporterName}
                            </div>
                        </div>
                    ) : bid.status === "Running" && bid.rank ? (
                        <div className="rank-container">
                            <div className="rank-text">Rank {bid.rank}</div>
                            <div className="transporter-name">{bid.transporterName}</div>
                        </div>
                    ) : (
                        <div className="not-started">
                            Not Started
                        </div>
                    )}
                </div> */}


                <div className="section transporter-section">
                    {bid.status === "Completed" && bid.rank === "Winner" ? (
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
                    ) : bid.status === "Running" && bid.rank ? (
                        <div className="text-center">
                            <div className="fw-bold">Rank {bid.rank}</div>
                            <div>{bid.transporterName}</div>
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
                        <div className="info-value">{bid.distance}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Time</div>
                        <div className="info-value">{bid.time}</div>
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
                        <div className="info-value">{bid.multipleOrder}</div>
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
                        <div className="info-value">{bid.lastBid}</div>
                    </div>
                </div>

                {/* City/Line section */}
                <div className="section city-section">
                    <div className="info-item">
                        <div className="info-label">City Name</div>
                        <div className="info-value">{bid.cityName}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Line No.</div>
                        <div className="info-value">{bid.lineNo}</div>
                    </div>
                </div>

                {/* Time Remaining section */}
                <div className="section time-section">
                    <div className="bidding-time-circle">
                        <span className="time-label">Time</span>
                        <span className="time-label">Remaining</span>
                        <span className="time-value">00:00</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="section actions-section">
                    <Link
                        to="#"
                        className="view-detail-btn"
                        onClick={() => handleViewClick(bid.id)}
                    >
                        VIEW DETAIL
                    </Link>
                    <Link
                        to="#"
                        className="bid-history-btn"
                        onClick={() => handleHistoryClick(bid.id)}
                    >
                        BID HISTORY
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BidCard;