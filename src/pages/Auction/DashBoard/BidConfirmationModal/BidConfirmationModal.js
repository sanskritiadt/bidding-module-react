// import React, { useState, useEffect } from 'react';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Spinner
// } from 'reactstrap';
// import { toast } from 'react-toastify';
 
// const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
//   const [transporters, setTransporters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
 
//   // Fetch bid data when modal opens
//   useEffect(() => {
//     if (isOpen && bidNo) {
//       fetchBidData();
//     }
//   }, [isOpen, bidNo]);
 
//   const fetchBidData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
     
//       const response = await fetch(
//        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidDataByBidNo?biddingNumber=${bidNo}`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
//           }
//         }
//       );
 
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
 
//       const data = await response.json();
     
//       // Map the API response to the expected format
//       const mappedData = {
//         rank: "1st", // You may need to determine this based on your business logic
//         name: data.body.transporterCode || "Unknown Transporter",
//         auctionType: "Reversal Bid",
//         ceilingPrice: formatCurrency(data.body.logstAmt),
//         givenPrice: formatCurrency(data.body.transAmt),
//         deliveredBefore: "N/A", // This field is not in the API response
//         multipleOrders: "N/A", // This field is not in the API response
//         rating: 4.5, // This field is not in the API response
//       };
     
//       setTransporters([mappedData]);
//     } catch (err) {
//       console.error('Error fetching bid data:', err);
//       setError('Failed to fetch bid data. Please try again.');
//       toast.error("Error fetching bid data", { autoClose: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const formatCurrency = (amount) => {
//     if (!amount) return '0';
//     return new Intl.NumberFormat('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(amount);
//   };
 
//   const renderRating = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const stars = [];
 
//     let starColor = "text-warning";
//     if (rating <= 2) {
//       starColor = "text-danger";
//     } else if (rating >= 4) {
//       starColor = "text-success";
//     }
 
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<i key={`full-${i}`} className={`ri-star-fill ${starColor}`}></i>);
//     }
 
//     if (hasHalfStar) {
//       stars.push(<i key="half" className={`ri-star-half-fill ${starColor}`}></i>);
//     }
 
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<i key={`empty-${i}`} className={`ri-star-line ${starColor}`}></i>);
//     }
 
//     return stars;
//   };
 
//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered size="xl" className="bid-confirmation-modal">
//       <ModalHeader toggle={toggle} className="border-0">
//         <div className="bid-confirmation-title">Bid Confirmation - {bidNo}</div>
//       </ModalHeader>
//       <ModalBody>
//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner color="primary" />
//             <p className="mt-2">Loading bid data...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center text-danger py-5">
//             <i className="ri-error-warning-line fs-1 mb-3"></i>
//             <p>{error}</p>
//             <Button color="primary" size="sm" onClick={fetchBidData}>
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <div className="bid-table-container">
//             <table className="table table-striped table-bordered mb-0">
//               <thead className="bg-primary sticky-header" style={{ color: "black" }}>
//                 <tr>
//                   <th>Rank</th>
//                   <th>
//                     Transporter name
//                     <i className="ri-arrow-up-down-line ms-1"></i>
//                   </th>
//                   <th>Auction Type</th>
//                   <th>Ceiling Price</th>
//                   <th>Given Price</th>
//                   <th>Delivered Before</th>
//                   <th>Multiple Orders</th>
//                   <th>Transporter Rating</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transporters.map((transporter, index) => (
//                   <tr key={index}>
//                     <td>{transporter.rank}</td>
//                     <td>
//                       {transporter.name}
//                       <i className="ri-add-line ms-2 text-primary"></i>
//                     </td>
//                     <td>{transporter.auctionType}</td>
//                     <td>{transporter.ceilingPrice}</td>
//                     <td>{transporter.givenPrice}</td>
//                     <td>{transporter.deliveredBefore}</td>
//                     <td>{transporter.multipleOrders}</td>
//                     <td className="text-center">
//                       {renderRating(transporter.rating)}
//                     </td>
//                     <td>
//                       <div className="d-flex gap-1">
//                         <Button color="success" size="sm" className="action-btn">
//                           Assign
//                         </Button>
//                         <Button color="danger" size="sm" className="action-btn">
//                           Reject
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </ModalBody>
//       <ModalFooter className="justify-content-end">
//         <Button color="light" onClick={toggle} className="bid-cancel-btn">
//           Cancel
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };
 
// export default BidConfirmationModal;




import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner
} from 'reactstrap';
import { toast } from 'react-toastify';
 
const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
 
  // Fetch bid data when modal opens
  useEffect(() => {
    if (isOpen && bidNo) {
      fetchBidData();
    }
  }, [isOpen, bidNo]);
 
  const fetchBidData = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidDataByBidNo?biddingNumber=${bidNo}`,
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/getBidDataByBidNo?biddingNumber=${bidNo}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
 
      // Map the API response to the expected format
      const mappedData = {
        rank: "1st", // You may need to determine this based on your business logic
        name: data.body.transporterCode || "Unknown Transporter",
        auctionType: "Reversal Bid",
        ceilingPrice: formatCurrency(data.body.logstAmt),
        givenPrice: formatCurrency(data.body.transAmt),
        deliveredBefore: "N/A", // This field is not in the API response
        multipleOrders: "N/A", // This field is not in the API response
        rating: 4.5, // This field is not in the API response
      };
 
      setTransporters([mappedData]);
    } catch (err) {
      console.error('Error fetching bid data:', err);
      setError('Failed to fetch bid data. Please try again.');
      toast.error("Error fetching bid data", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };
 
  // Handle bid assignment or rejection
  const handleBidAction = async (flag) => {
    try {
      setProcessingAction(true);
 
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_URL_8082}/transporterBidding/assignBid?flag=${flag}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
          },
          // Add any required body parameters here if needed
          // body: JSON.stringify({ bidNo: bidNo })
        }
      );
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      const result = await response.json();
 
      // Show success message based on action
      const actionText = flag === 'A' ? 'assigned' : 'rejected';
      toast.success(`Bid successfully ${actionText}`, { autoClose: 3000 });
 
      // Close the modal after successful action
      toggle();
 
    } catch (err) {
      console.error(`Error ${flag === 'A' ? 'assigning' : 'rejecting'} bid:`, err);
      const actionText = flag === 'A' ? 'assigning' : 'rejecting';
      toast.error(`Error ${actionText} bid. Please try again.`, { autoClose: 3000 });
    } finally {
      setProcessingAction(false);
    }
  };
 
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    let starColor = "text-warning";
    if (rating <= 2) {
      starColor = "text-danger";
    } else if (rating >= 4) {
      starColor = "text-success";
    }

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className={`ri-star-fill ${starColor}`}></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className={`ri-star-half-fill ${starColor}`}></i>);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className={`ri-star-line ${starColor}`}></i>);
    }

    return stars;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl" className="bid-confirmation-modal">
      <ModalHeader toggle={toggle} className="border-0">
        <div className="bid-confirmation-title">Bid Confirmation - {bidNo}</div>
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading bid data...</p>
          </div>
        ) : error ? (
          <div className="text-center text-danger py-5">
            <i className="ri-error-warning-line fs-1 mb-3"></i>
            <p>{error}</p>
            <Button color="primary" size="sm" onClick={fetchBidData}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="bid-table-container">
            <table className="table table-striped table-bordered mb-0">
              <thead className="bg-primary sticky-header" style={{ color: "black" }}>
                <tr>
                  <th>Rank</th>
                  <th>
                    Transporter name
                    <i className="ri-arrow-up-down-line ms-1"></i>
                  </th>
                  <th>Auction Type</th>
                  <th>Ceiling Price</th>
                  <th>Given Price</th>
                  <th>Delivered Before</th>
                  <th>Multiple Orders</th>
                  <th>Transporter Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transporters.map((transporter, index) => (
                  <tr key={index}>
                    <td>{transporter.rank}</td>
                    <td>
                      {transporter.name}
                      <i className="ri-add-line ms-2 text-primary"></i>
                    </td>
                    <td>{transporter.auctionType}</td>
                    <td>{transporter.ceilingPrice}</td>
                    <td>{transporter.givenPrice}</td>
                    <td>{transporter.deliveredBefore}</td>
                    <td>{transporter.multipleOrders}</td>
                    <td className="text-center">
                      {renderRating(transporter.rating)}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          color="success"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleBidAction('A')}
                          disabled={processingAction}
                        >
                          {processingAction ? <Spinner size="sm" /> : 'Assign'}
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          className="action-btn"
                          onClick={() => handleBidAction('R')}
                          disabled={processingAction}
                        >
                          {processingAction ? <Spinner size="sm" /> : 'Reject'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="light" onClick={toggle} className="bid-cancel-btn" disabled={processingAction}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BidConfirmationModal;