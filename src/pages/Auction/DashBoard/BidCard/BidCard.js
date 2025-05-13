
// BidCard.js
// import React, { useState, useEffect } from "react";
// import './BidCard.css';

// const BidCard = () => {
//   const [minimalBids, setMinimalBids] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch minimal bids data from API
//   useEffect(() => {
//     const fetchMinimalBids = async () => {
//       try {
//         const response = await fetch('http://localhost:8085/biddingMaster/getMinimalBids', {
//           method: 'GET',
//           headers: {
//             'accept': 'application/json',
//             'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data && data.data) {
//           // Take the first 6 entries without filtering
//           const bidsToShow = data.data.slice(0, 6);
//           setMinimalBids(bidsToShow);
//         }
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching minimal bids:", err);
//         setError("Failed to load bids. Please try again later.");
//         setIsLoading(false);
//       }
//     };

//     fetchMinimalBids();
//   }, []);

//   // Calculate time difference between bidFrom and bidTo
//   const calculateTimeDifference = (bidFrom, bidTo) => {
//     if (!bidFrom || !bidTo) return "00:00";
    
//     const startTime = new Date(bidFrom);
//     const endTime = new Date(bidTo);
    
//     // Calculate the difference in milliseconds
//     const diffMs = endTime - startTime;
    
//     // If invalid dates or end date is before start date
//     if (isNaN(diffMs) || diffMs <= 0) {
//       return "00:00";
//     }
    
//     const diffDays = Math.floor(diffMs / 86400000); // days
//     const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
//     const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
//     // Format based on the time difference
//     if (diffDays > 0) {
//       return `${diffDays}d :${diffHrs}h`;
//     } else {
//       return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
//     }
//   };

//   // Render individual bid card
//   const renderBidCard = (bid, index) => {
//     // Use "-----" if no bid number is available or it's empty
//     const displayBidNo = bid.biddingOrderNo && bid.biddingOrderNo.trim() !== "" 
//       ? bid.biddingOrderNo 
//       : "-----";
    
//     // Calculate the time difference
//     const timeValue = calculateTimeDifference(bid.bidFrom, bid.bidTo);
    
//     return (
//       <div key={index} className="bid-card">
//         <div className="bid-number">
//           Bid No. : {displayBidNo}
//         </div>
//         <div className="card-body">
//           <div className="time-circle">
//             <div className="time-label">Time</div>
//             <div className="time-label">Remaining</div>
//             <div className="time-value">{timeValue}</div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="bid-cards-container">
//         <div className="text-center p-3">Loading bid cards...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bid-cards-container">
//         <div className="text-center p-3 text-danger">{error}</div>
//       </div>
//     );
//   }

//   // If no data from API, use default data from the image
//   if (!minimalBids || minimalBids.length === 0) {
//     const defaultBids = [
//       { bidNo: "BID-NE205-001", time: "9d :6h" },
//       { bidNo: "-----", time: "9d :6h" },
//       { bidNo: "-----", time: "9d :6h" },
//       { bidNo: "-----", time: "5d :0h" },
//       { bidNo: "-----", time: "5d :0h" },
//       { bidNo: "-----", time: "5d :0h" }
//     ];
    
//     return (
//       <div className="bid-cards-container">
//         {defaultBids.map((card, index) => (
//           <div key={index} className="bid-card">
//             <div className="bid-number">
//               Bid No. : {card.bidNo}
//             </div>
//             <div className="card-body">
//               <div className="time-circle">
//                 <div className="time-label">Time</div>
//                 <div className="time-label">Remaining</div>
//                 <div className="time-value">{card.time}</div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="bid-cards-container">
//       {minimalBids.map((bid, index) => renderBidCard(bid, index))}
//     </div>
//   );
// }

// export default BidCard;


// BidCard.js
import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import './BidCard.css';

const BidCard = () => {
  const [minimalBids, setMinimalBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch minimal bids data from API
  useEffect(() => {
    const fetchMinimalBids = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/getMinimalBids`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.data) {
          // Take the first 6 entries without filtering
          const bidsToShow = data.data.slice(0, 6);
          setMinimalBids(bidsToShow);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching minimal bids:", err);
        setError("Failed to load bids. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchMinimalBids();
  }, []);

  // Calculate time difference between bidFrom and bidTo
  const calculateTimeDifference = (bidFrom, bidTo) => {
    if (!bidFrom || !bidTo) return "00:00";
    
    const startTime = new Date(bidFrom);
    const endTime = new Date(bidTo);
    
    // Calculate the difference in milliseconds
    const diffMs = endTime - startTime;
    
    // If invalid dates or end date is before start date
    if (isNaN(diffMs) || diffMs <= 0) {
      return "00:00";
    }
    
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
    // Format based on the time difference
    if (diffDays > 0) {
      return `${diffDays}d :${diffHrs}h`;
    } else {
      return `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
    }
  };

  // Render individual bid card
  const renderBidCard = (bid, index) => {
    // Use "-----" if no bid number is available or it's empty
    const displayBidNo = bid.biddingOrderNo && bid.biddingOrderNo.trim() !== "" 
      ? bid.biddingOrderNo 
      : "-----";
    
    // Calculate the time difference
    const timeValue = calculateTimeDifference(bid.bidFrom, bid.bidTo);
    
    return (
      <Col key={index} md={2} sm={4} xs={6} className="mb-3">
        <Card className="bidding-card">
          <div className="bidding-number">
            Bid No. : {displayBidNo}
          </div>
          <CardBody className="bidding-card-body">
            <div className="bidding-time-circle">
              <div className="bidding-time-label">Time</div>
              <div className="bidding-time-label">Remaining</div>
              <div className="bidding-time-value">{timeValue}</div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return (
      <Row className="bidding-cards-container">
        <Col xs={12} className="text-center">
          <div className="p-3">Loading bid cards...</div>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="bidding-cards-container">
        <Col xs={12} className="text-center">
          <div className="p-3 text-danger">{error}</div>
        </Col>
      </Row>
    );
  }

  // If no data from API, use default data from the image
  if (!minimalBids || minimalBids.length === 0) {
    const defaultBids = [
      { bidNo: "BID-NE205-001", time: "9d :6h" },
      { bidNo: "-----", time: "9d :6h" },
      { bidNo: "-----", time: "9d :6h" },
      { bidNo: "-----", time: "5d :0h" },
      { bidNo: "-----", time: "5d :0h" },
      { bidNo: "-----", time: "5d :0h" }
    ];
    
    return (
      <Row className="bidding-cards-container">
        {defaultBids.map((card, index) => (
          <Col key={index} md={2} sm={4} xs={6} className="mb-3">
            <Card className="bidding-card">
              <div className="bidding-number">
                Bid No. : {card.bidNo}
              </div>
              <CardBody className="bidding-card-body">
                <div className="bidding-time-circle">
                  <div className="bidding-time-label">Time</div>
                  <div className="bidding-time-label">Remaining</div>
                  <div className="bidding-time-value">{card.time}</div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row className="bidding-cards-container">
      {minimalBids.map((bid, index) => renderBidCard(bid, index))}
    </Row>
  );
}

export default BidCard;

