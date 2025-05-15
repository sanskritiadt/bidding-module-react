import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

const BidConfirmationModal = ({ isOpen, toggle, bidNo }) => {
  const transporters = [
    {
      rank: "1st",
      name: "RAJ ENTERPRISE",
      auctionType: "Reversal Bid",
      ceilingPrice: "10,00,000",
      givenPrice: "7,00,000",
      deliveredBefore: "1 Day",
      multipleOrders: "Yes",
      rating: 4.5,
    },
    {
      rank: "2nd",
      name: "R AND B TRANSPORT",
      auctionType: "Reversal Bid",
      ceilingPrice: "9,00,000",
      givenPrice: "5,00,000",
      deliveredBefore: "5 Day",
      multipleOrders: "No",
      rating: 5,
    },
    {
      rank: "3rd",
      name: "NEHA ROADLINE",
      auctionType: "Reversal Bid",
      ceilingPrice: "3,00,000",
      givenPrice: "1,45,000",
      deliveredBefore: "2 Day",
      multipleOrders: "No",
      rating: 1,
    },
    {
      rank: "4Th",
      name: "M2 VENTURES",
      auctionType: "Reversal Bid",
      ceilingPrice: "15,00,000",
      givenPrice: "9,00,000",
      deliveredBefore: "3 Day",
      multipleOrders: "Yes",
      rating: 3,
    },
    {
      rank: "5Th",
      name: "BHARAT ROADWAYS",
      auctionType: "Reversal Bid",
      ceilingPrice: "5,00,000",
      givenPrice: "3,00,000",
      deliveredBefore: "2 Day",
      multipleOrders: "Yes",
      rating: 2,
    }
  ];

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
                      <Button color="success" size="sm" className="action-btn">
                        Assign
                      </Button>
                      <Button color="danger" size="sm" className="action-btn">
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="light" onClick={toggle} className="bid-cancel-btn">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BidConfirmationModal;