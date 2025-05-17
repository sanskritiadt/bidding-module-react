// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./BidCard.css";
// import winnerlogo from '../../../../../assets/images/winner.png';
 
// const BidCard = ({ bid, handleViewClick, handleHistoryClick, handleSoDetailsClick }) => {
//     const [currentTime, setCurrentTime] = useState(new Date());
    
//     // Function to determine status class
//     const getStatusClass = (status) => {
//         switch (status) {
//             case "Completed":
//                 return "completed";
//             case "Running":
//                 return "running";
//             case "To Be Started":
//                 return "to-be-started";
//             default:
//                 return "";
//         }
//     };
    
//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);

//         // Formatter for date part
//         const dateFormatter = new Intl.DateTimeFormat('en-GB', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });

//         // Formatter for time part
//         const timeFormatter = new Intl.DateTimeFormat('en-US', {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true
//         });

//         const formattedDate = dateFormatter.format(date);
//         const formattedTime = timeFormatter.format(date);

//         return `${formattedDate} ${formattedTime}`;
//     };

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrentTime(new Date());
//         }, 1000);

//         return () => clearInterval(timer);
//     }, []);
    
//     const calculateTimeRemaining = (bidTo) => {
//         const endTime = new Date(bidTo);
//         const diffMs = endTime - currentTime;

//         if (diffMs <= 0) {
//             return { time: "00:00", isExpired: true };
//         }

//         const totalSeconds = Math.floor(diffMs / 1000);
//         const minutes = Math.floor(totalSeconds / 60);
//         const seconds = totalSeconds % 60;

//         return {
//             time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
//             isExpired: false
//         };
//     };

//     return (
//         <div className="bid-card mb-3">
//             {/* Header with navy background, status pill, bid info and route info */}
//             <div className="bid-header">
//                 <div className={`status-pill ${getStatusClass(bid.status)}`}>
//                     {bid.status}
//                 </div>
//                 <div className="flex-1 flex items-center justify-between px-4 meta-group">
//                     <span className="bid-number1">Bid No.: {bid.biddingOrderNo}</span>
//                     <span className="divider"></span>
//                     <span className="bid-time">Bid Start Time: {formatDate(bid.bidFrom)}</span>
//                 </div>
//                 <div className="route-label">
//                     Route No.: {bid.routeNo || "RN123"}
//                 </div>
//             </div>
 
//             {/* Content area */}
//             <div className="bid-content">
//                 {/* Transporter section */}
//                 <div className="section transporter-section">
//                     {bid.status === "Completed" ? (
//                         <div className="d-flex flex-column align-items-center p-2 position-relative">
//                             <div className="position-relative text-center">
//                                 <img
//                                     src={winnerlogo}
//                                     alt="Winner"
//                                     className="mb-1"
//                                     style={{ width: '130px', height: 'auto' }}
//                                 />
//                                 <div className="position-absolute top-50 start-50 translate-middle text-white fw-bold fs-6">
//                                     Winner
//                                 </div>
//                             </div>
//                             <div className="text-primary fw-bold fs-5 mt-1">
//                                 {bid.transporterName}
//                             </div>
//                         </div>
//                     ) : bid.status === "Running" ? (
//                         <div className="text-center">
//                             <div className="fw-bold">Rank 1</div>
//                             <div>{bid.transporterCode}</div>
//                         </div>
//                     ) : (
//                         <div className="text-center fst-italic">Not Started</div>
//                     )}
//                 </div>
                
//                 {/* From/To Location section */}
//                 <div className="section location-section">
//                     <div className="info-item">
//                         <div className="info-label">From Location</div>
//                         <div className="info-value">{bid.fromLocation}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">To Location</div>
//                         <div className="info-value">{bid.toLocation}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Distance</div>
//                         <div className="info-value">{bid.distance || "765 KM"}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Time</div>
//                         <div className="info-value">{bid.lastTimeExtension} Hours</div>
//                     </div>
//                 </div>
 
//                 {/* Material section */}
//                 <div className="section material-section">
//                     <div className="info-item">
//                         <div className="info-label">Material</div>
//                         <div className="info-value">{bid.material}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Quantity</div>
//                         <div className="info-value">{bid.quantity}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Multiple Order</div>
//                         <div className="info-value">{bid.multiMaterial == 1 ? "YES" : "NO"}</div>
//                     </div>
//                 </div>
 
//                 {/* Price section */}
//                 <div className="section price-section">
//                     <div className="info-item">
//                         <div className="info-label">Ceiling Price</div>
//                         <div className="info-value">{bid.ceilingPrice}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Interval Price</div>
//                         <div className="info-value">{bid.intervalPrice}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Last Bid</div>
//                         <div className="info-value">{bid.lastBidAmount || bid.ceilingPrice}</div>
//                     </div>
//                 </div>
 
//                 {/* City/Line section */}
//                 <div className="section city-section">
//                     <div className="info-item">
//                         <div className="info-label">City Name</div>
//                         <div className="info-value">{bid.city}</div>
//                     </div>
//                     <div className="info-item">
//                         <div className="info-label">Line No.</div>
//                         <div className="info-value">{bid.lineNo || "205"}</div>
//                     </div>
//                 </div>
 
//                 {/* Time Remaining section */}
//                 <div className="section time-section">
//                     <div className="bidding-time-circle">
//                         {(() => {
//                             const { time, isExpired } = calculateTimeRemaining(bid.bidTo);
//                             return isExpired ? (
//                                 <>
//                                     <span className="time-label">Bid</span>
//                                     <span className="time-label">Expired</span>
//                                     <span className="time-value">00:00</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <span className="time-label">Time</span>
//                                     <span className="time-label">Remaining</span>
//                                     <span className="time-value">{time}</span>
//                                 </>
//                             );
//                         })()}
//                     </div>
//                 </div>
 
//                 {/* Action Buttons */}
//                 <div className="section actions-section">
//                     <Link
//                         to="#"
//                         className={`view-detail-btn ${bid.status === 'Running' ? 'disabled' : ''}`}
//                         onClick={(e) => {
//                             if (bid.status === 'Running') {
//                                 e.preventDefault();
//                                 return;
//                             }
//                             handleViewClick(bid.biddingOrderNo);
//                         }}
//                         style={{
//                             pointerEvents: bid.status === 'Running' ? 'none' : 'auto',
//                             opacity: bid.status === 'Running' ? 0.6 : 1,
//                             cursor: bid.status === 'Running' ? 'not-allowed' : 'pointer',
//                             backgroundColor: bid.status === 'Running' ? '#cccccc' : '',
//                             color: bid.status === 'Running' ? '#666666' : ''
//                         }}
//                     >
//                         BID NOW
//                     </Link>
//                     <Link
//                         to="#"
//                         className="view-detail-btn"
//                         onClick={() => handleSoDetailsClick(bid.biddingOrderNo)}
//                     >
//                         SO DETAILS
//                     </Link>
//                     <Link
//                         to="#"
//                         className="bid-history-btn"
//                         onClick={() => handleHistoryClick(bid.biddingOrderNo)}
//                     >
                      
//                         BID HISTORY
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };
 
// export default BidCard;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Badge } from "reactstrap"; // Added imports for Modal components
import "./BidCard.css";
import winnerlogo from '../../../../../assets/images/winner.png';

const BidConfirmationModal = ({ isOpen, toggle, bidData }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Calculate remaining time based on the bidTo date
  useEffect(() => {
    if (!bidData?.bidTo) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(bidData.bidTo);
      
      if (now >= endTime) {
        // Bid has ended
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return false;
      }
      
      const totalSeconds = Math.floor((endTime - now) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setTimeRemaining({ hours, minutes, seconds });
      return true;
    };
    
    // Initial calculation
    const hasTimeLeft = calculateTimeRemaining();
    
    // Set up interval only if there's time left
    if (hasTimeLeft) {
      const timerId = setInterval(() => {
        const stillHasTime = calculateTimeRemaining();
        if (!stillHasTime) {
          clearInterval(timerId);
        }
      }, 1000);
      
      return () => clearInterval(timerId);
    }
  }, [bidData?.bidTo]);

  // Reset error state when modal opens/closes
  useEffect(() => {
    setError(null);
    setBidAmount("");
    setIsValid(true);
  }, [isOpen]);

  // Validate input as user types
  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    
    // Allow empty field or numeric input with up to 2 decimal places
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setBidAmount(value);
      
      // Check if the value is valid (positive number)
      if (value === "" || parseFloat(value) <= 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
        setError(null); // Clear any previous error
      }
    }
    // Don't update state if input is invalid
  };

  const handleSubmitBid = async () => {
    // Validate bid amount
    if (!bidAmount || isNaN(parseFloat(bidAmount)) || parseFloat(bidAmount) <= 0) {
      setError("Please enter a valid bid amount");
      setIsValid(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Basic auth credentials (should be stored securely in a real app)
      const credentials = btoa(`${process.env.REACT_APP_API_USER_NAME}:${process.env.REACT_APP_API_PASSWORD}`);
      
      const payload = {
        id: 0,
        transBiddingOrdNo: "string", // This should be generated or fetched
        transAmt: parseFloat(bidAmount),
        logstAmt: 500, // This should be dynamically determined based on business logic
        createdDateTime: new Date().toISOString(),
        biddingOrderNo: bidData.biddingOrderNo,
        transporterId: 0, // This should come from user context
        transporterCode: "T-000004", // This should come from user context
        plantCode: "PLA-000001", // This should come from bidData or user context
        status: "A"
      };
      
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/createBidding`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Bid successfully created:", data);
      setSuccess(true);
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        toggle();
        // Reset state 
        setBidAmount("");
        setSuccess(false);
        setError(null);
        setIsValid(true);
      }, 2000);
      
    } catch (err) {
      console.error("Error creating bid:", err);
      setError(`Failed to create bid: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format timeRemaining for display - single digit only
  const formatTimeDigit = (digit) => {
    return digit.toString();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
      <div className="p-3">
        {/* Header with close button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Bid : {bidData?.biddingOrderNo || "BID0006"}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={toggle}
            aria-label="Close"
          ></button>
        </div>
        
        {/* Horizontal divider */}
        <hr className="my-2" />
        
        {/* Timer display - Improved layout */}
        <div className="d-flex align-items-center mb-4">
          <div className="d-flex align-items-center me-2">
            <i className="ri-timer-line me-1"></i>
          </div>
          
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.hours / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.hours % 10)}
              </Badge>
              <span className="mx-1">:</span>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.minutes / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.minutes % 10)}
              </Badge>
              <span className="mx-1">:</span>
              <Badge color="dark" className="rounded-circle me-1" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(Math.floor(timeRemaining.seconds / 10))}
              </Badge>
              <Badge color="dark" className="rounded-circle" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333' }}>
                {formatTimeDigit(timeRemaining.seconds % 10)}
              </Badge>
            </div>
            <div className="text-muted small mt-1">Time Remaining</div>
          </div>
        </div>
        
        {/* Bid amount input */}
        <div className="input-group mb-4">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Bid Amount"
            value={bidAmount}
            onChange={handleBidAmountChange}
            disabled={loading || success}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="alert alert-danger py-2 mb-3">
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="alert alert-success py-2 mb-3">
            Bid successfully submitted!
          </div>
        )}
        
        {/* Submit button */}
        <div className="d-flex justify-content-end">
          <Button 
            color="primary"
            onClick={handleSubmitBid}
            disabled={loading || success || !isValid || bidAmount === "" || (timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0)}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : success ? "Bid Placed!" : "Start Bid"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


 
const BidCard = ({ bid, handleViewClick, handleHistoryClick, handleSoDetailsClick }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false); // Added state for modal visibility
    
    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    
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

    // Handle bid now button click
    const handleBidNowClick = (e) => {
        e.preventDefault();
        if (bid.status === 'Running') {
            return;
        }
        // Open the modal
        toggleModal();
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
                        onClick={handleBidNowClick} // Use the new handler to open the modal
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

            {/* Render the BidConfirmationModal */}
            <BidConfirmationModal 
                isOpen={isModalOpen}
                toggle={toggleModal}
                bidData={bid}
            />
        </div>
    );
};
 
export default BidCard;