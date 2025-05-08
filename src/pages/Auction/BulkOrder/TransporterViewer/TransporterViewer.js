import React, { useState } from 'react';

const TransporterViewer = ({ selectedTransporters = [], onRemove = null }) => {
  const [showPopup, setShowPopup] = useState(false);

  // Toggle the popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
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
            width: "500px",
            maxWidth: "90%",
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
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "500" }}>Selected Transporters</h4>
              <button onClick={togglePopup} style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
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
                    marginBottom: "20px"
                  }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "8px 12px", 
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px"
                        }}>ID</th>
                        <th style={{ 
                          textAlign: "left", 
                          padding: "8px 12px", 
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px"
                        }}>Name</th>
                        <th style={{ 
                          textAlign: "center", 
                          padding: "8px 12px", 
                          borderBottom: "1px solid #e0e0e0",
                          fontSize: "14px",
                          width: "60px"
                        }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueDisplayTransporters.map((transporter) => (
                        <tr key={transporter.id}>
                          <td style={{ 
                            padding: "8px 12px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px"
                          }}>{transporter.id}</td>
                          <td style={{ 
                            padding: "8px 12px", 
                            borderBottom: "1px solid #f0f0f0",
                            fontSize: "13px"
                          }}>{transporter.name}</td>
                          <td style={{ 
                            padding: "8px 12px", 
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "center"
                          }}>
                            {onRemove && (
                              <span 
                                style={{
                                  cursor: "pointer",
                                  color: "#dc3545",
                                  fontSize: "14px"
                                }}
                                onClick={() => {
                                  // Remove all transporters with this name
                                  const transporterIds = groupedTransporters[transporter.name].map(t => t.id);
                                  transporterIds.forEach(id => handleRemoveTransporter(id));
                                }}
                              >
                                <i className="ri-delete-bin-line"></i>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                backgroundColor: "#4361ee",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransporterViewer;