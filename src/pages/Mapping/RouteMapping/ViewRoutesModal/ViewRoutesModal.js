// ViewRoutesModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Loader from "../../../../Components/Common/Loader";

const ViewRoutesModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  viewRouteData,
  isLoading
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  
  // Reset to first page when modal opens or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [isOpen, viewRouteData]);
  
  // Calculate pagination values
  const totalPages = Math.ceil((viewRouteData?.length || 0) / pageSize);
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  
  // Get current page data
  const currentRecords = viewRouteData ? viewRouteData.slice(indexOfFirstRecord, indexOfLastRecord) : [];
  
  // Navigate to previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered={true}
      className="custom-modal"
      style={{ 
        maxWidth: '800px', 
        width: '100%' 
      }}
      contentClassName="rounded-4"
    >
      <ModalHeader
        toggle={toggle}
        style={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          padding: '15px 20px',
          color: '#495057',
          position: 'relative'
        }}
        className="border-0"
        close={
          <button 
            className="close" 
            onClick={toggle} 
            style={{ 
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#000',
              opacity: 1
            }}
          >
            ×
          </button>
        }
      >
        View Routes - {currentTransporterCode}
      </ModalHeader>
      <ModalBody 
        className="p-0"
        style={{ 
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden'
        }}
      >
        {isLoading ? (
          <div className="text-center my-4">
            <Loader />
          </div>
        ) : (
          <>
            <table 
              className="table mb-0" 
              style={{ 
                width: '100%', 
                borderCollapse: 'collapse' 
              }}
            >
              <thead style={{ 
                backgroundColor: 'white', 
                color: 'black',
                borderBottom: '1px solid #dee2e6'
              }}>
                <tr>
                  <th>Route Code</th>
                  <th>Departure Location</th>
                  <th>Destination Location</th>
                  <th>Route Type</th>
                  <th>Distance</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords && currentRecords.length > 0 ? (
                  currentRecords.map((route, index) => (
                    <tr key={index} style={{ backgroundColor: 'white' }}>
                      <td>{route.routeCode || "-"}</td>
                      <td>{route.departureLocation || "-"}</td>
                      <td>{route.destinationLocation || "-"}</td>
                      <td>{route.routeType || "-"}</td>
                      <td>{route.distance || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ padding: '15px' }}>No routes found for this transporter</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div 
              className="d-flex justify-content-end align-items-center p-2"
              style={{ 
                backgroundColor: '#f8f9fa', 
                borderTop: '1px solid #e9ecef' 
              }}
            >
              <div 
                className="d-flex align-items-center" 
                style={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <span 
                  className="mr-2"
                  style={{ 
                    color: '#6c757d',
                    marginRight: '10px'
                  }}
                >
                  Total Results: {viewRouteData ? viewRouteData.length : 0}
                </span>
                <button 
                  className="btn btn-link px-2 py-1"
                  style={{ 
                    color: '#6c757d', 
                    border: 'none', 
                    backgroundColor: 'transparent',
                    cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                    opacity: currentPage > 1 ? 1 : 0.6
                  }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <span 
                  style={{ 
                    padding: '0 10px', 
                    borderLeft: '1px solid #e9ecef', 
                    borderRight: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button 
                  className="btn btn-link px-2 py-1"
                  style={{ 
                    color: '#6c757d', 
                    border: 'none', 
                    backgroundColor: 'transparent',
                    cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                    opacity: currentPage < totalPages ? 1 : 0.6
                  }}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ViewRoutesModal;