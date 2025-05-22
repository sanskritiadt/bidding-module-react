import React, { useState } from 'react';

const TransporterViewer = ({ selectedTransporters = [], onRemove = null }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Toggle the popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
    // Reset to first page when opening modal
    if (!showPopup) {
      setCurrentPage(1);
    }
  };

  // Handle remove transporter from the list
  const handleRemoveTransporter = (transporterId) => {
    if (onRemove) {
      onRemove(transporterId);
    }
  };

  // Group transporters by name to handle duplicates
  const groupedTransporters = {};
  selectedTransporters.forEach(transporter => {
    if (!groupedTransporters[transporter.name]) {
      groupedTransporters[transporter.name] = [];
    }
    groupedTransporters[transporter.name].push(transporter);
  });

  // Create a deduplicated display list - just take the first occurrence of each name
  const uniqueDisplayTransporters = Object.keys(groupedTransporters).map(name => {
    return groupedTransporters[name][0];
  });

  // Pagination calculations
  const totalItems = uniqueDisplayTransporters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Get current page items
  const currentPageTransporters = uniqueDisplayTransporters.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {/* View Icon Button */}
      <div 
        onClick={togglePopup}
        style={{ 
          marginLeft: "10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "38px",
          height: "38px",
          border: "1px solid #ced4da",
          borderRadius: "4px",
          backgroundColor: "#f8f9fa"
        }}
      >
        <i className="ri-eye-line" style={{ fontSize: "20px", color: "#4361ee" }}></i>
      </div>

      {/* Popup Modal to show all selected transporters */}
      {showPopup && (
        <div className="modal-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1050
        }}>
          <div className="modal-content" style={{
            width: "750px",
            maxWidth: "95%",
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh"
          }}>
            <div className="modal-header" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #e0e0e0"
            }}>
              <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "black" }}>
                Transporter Details
              </h4>
              <button onClick={togglePopup} style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "50%"
              }}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            
            <div className="modal-body" style={{
              padding: "20px",
              overflow: "auto",
              flex: 1
            }}>
              {uniqueDisplayTransporters.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No transporters selected
                </div>
              ) : (
                <div>
                  {/* Table display of transporters */}
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "20px",
                    tableLayout: "fixed"
                  }}>
                    <thead style={{ backgroundColor: "#405189" }}>
                      <tr>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "12px 8px", 
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px",
                          color: "white",
                          fontWeight: "normal",
                          width: "20%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>Transporter Code</th>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "12px 8px", 
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px",
                          color: "white",
                          fontWeight: "normal",
                          width: "30%"
                        }}>Transporter Name</th>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "12px 8px", 
                          color: "white",
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px",
                          fontWeight: "normal",
                          width: "25%"
                        }}>Contact Person</th>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "12px 8px", 
                          color: "white",
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px",
                          fontWeight: "normal",
                          width: "25%"
                        }}>Phone No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageTransporters.map((transporter) => (
                        <tr key={transporter.id || transporter.code}>
                          <td style={{ 
                            padding: "10px 8px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                            textOverflow: "ellipsis",
                            fontWeight: "500"
                          }}>{transporter.code || transporter.id}</td>
                          <td style={{ 
                            padding: "10px 8px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                            textOverflow: "ellipsis"
                          }}>{transporter.name ? transporter.name.trim() : ''}</td>
                          <td style={{ 
                            padding: "10px 8px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                            textOverflow: "ellipsis"
                          }}>{transporter.contactPerson || transporter.contact_person || transporter.fullData?.contactPerson || 'N/A'}</td>
                          <td style={{ 
                            padding: "10px 8px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            color: "black",
                            textOverflow: "ellipsis"
                          }}>{transporter.contactNumber || transporter.contact_number || transporter.fullData?.contactNumber || transporter.phoneNo || transporter.phone || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    padding: "10px 0",
                    borderTop: "1px solid #f0f0f0"
                  }}>
                    {/* Total Results */}
                    <div style={{ 
                      fontSize: "14px", 
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Total Results : {totalItems}
                    </div>

                    {/* Pagination buttons */}
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px" 
                    }}>
                      {/* Previous button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          padding: "8px 12px",
                          border: "none",
                          backgroundColor: "#405189",
                          color: "white",
                          borderRadius: "4px",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          fontSize: "14px",
                          opacity: currentPage === 1 ? 0.5 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "36px",
                          height: "36px"
                        }}
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>

                      {/* Page info */}
                      <span style={{
                        fontSize: "14px",
                        color: "#333",
                        margin: "0 12px",
                        fontWeight: "500"
                      }}>
                        Page {currentPage} of {Math.max(totalPages, 1)}
                      </span>

                      {/* Page input */}
                      <input
                        type="number"
                        min="1"
                        max={Math.max(totalPages, 1)}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page && page >= 1 && page <= Math.max(totalPages, 1)) {
                            handlePageChange(page);
                          }
                        }}
                        style={{
                          width: "50px",
                          height: "36px",
                          textAlign: "center",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "14px",
                          color: "#333"
                        }}
                      />

                      {/* Next button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages <= 1}
                        style={{
                          padding: "8px 12px",
                          border: "none",
                          backgroundColor: "#405189",
                          color: "white",
                          borderRadius: "4px",
                          cursor: (currentPage === totalPages || totalPages <= 1) ? "not-allowed" : "pointer",
                          fontSize: "14px",
                          opacity: (currentPage === totalPages || totalPages <= 1) ? 0.5 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "36px",
                          height: "36px"
                        }}
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer" style={{
              padding: "12px 20px",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "flex-end"
            }}>
              <button onClick={togglePopup} style={{
                padding: "8px 16px",
                backgroundColor: "lightgrey",
                color: "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransporterViewer;