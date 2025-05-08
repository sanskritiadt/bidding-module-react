



// ViewPlantsModal.js
// import React, { useState, useEffect } from "react";
// import { Modal, ModalHeader, ModalBody } from "reactstrap";
// import Loader from "../../../../Components/Common/Loader";

// const ViewPlantsModal = ({ 
//   isOpen, 
//   toggle, 
//   currentTransporterCode, 
//   viewPlantData,
//   isLoading
// }) => {
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(5);
//   const [pageInputValue, setPageInputValue] = useState("1");
  
//   // Reset to first page when modal opens or data changes
//   useEffect(() => {
//     setCurrentPage(1);
//     setPageInputValue("1");
//   }, [isOpen, viewPlantData]);
  
//   // Calculate pagination values
//   const totalPages = Math.ceil((viewPlantData?.length || 0) / pageSize);
//   const indexOfLastRecord = currentPage * pageSize;
//   const indexOfFirstRecord = indexOfLastRecord - pageSize;
  
//   // Get current page data
//   const currentRecords = viewPlantData ? viewPlantData.slice(indexOfFirstRecord, indexOfLastRecord) : [];
  
//   // Navigate to previous page
//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//       setPageInputValue((currentPage - 1).toString());
//     }
//   };
  
//   // Navigate to next page
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//       setPageInputValue((currentPage + 1).toString());
//     }
//   };
  
//   // Handle manual page input
//   const handlePageInputChange = (e) => {
//     setPageInputValue(e.target.value);
//   };
  
//   // Handle page input submission (on Enter key press)
//   const handlePageInputKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       const pageNumber = parseInt(pageInputValue);
//       if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
//         setCurrentPage(pageNumber);
//       } else {
//         // Reset to current page if invalid
//         setPageInputValue(currentPage.toString());
//       }
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       toggle={toggle}
//       size="lg"
//       centered={true}
//       className="custom-modal"
//       style={{ 
//         maxWidth: '800px', 
//         width: '100%' 
//       }}
//     >
//       <ModalHeader
//         toggle={toggle}
//         style={{
//           backgroundColor: 'white',
//           borderBottom: '1px solid #dee2e6',
//           padding: '15px 20px',
//           color: '#000',
//           position: 'relative',
//           fontWeight: 'bold'
//         }}
//         close={
//           <button 
//             className="close" 
//             onClick={toggle} 
//             style={{ 
//               position: 'absolute',
//               top: '10px',
//               right: '10px',
//               background: 'none',
//               border: 'none',
//               fontSize: '24px',
//               color: '#000',
//               opacity: 1
//             }}
//           >
//             ×
//           </button>
//         }
//       >
//         Assign Plants - {currentTransporterCode}
//       </ModalHeader>
//       <ModalBody 
//         className="p-0"
//         style={{ 
//           overflow: 'hidden',
//           backgroundColor: 'white'
//         }}
//       >
//         {isLoading ? (
//           <div className="text-center my-4">
//             <Loader />
//           </div>
//         ) : (
//           <>
//             <div style={{ overflow: 'auto' }}>
//               <table 
//                 className="table mb-0" 
//                 style={{ 
//                   width: '100%', 
//                   borderCollapse: 'collapse',
//                   backgroundColor: 'white'
//                 }}
//               >
//                 <thead style={{ 
//                   backgroundColor: '#405189', 
//                   color: 'black'
//                 }}>
//                   <tr>
//                     <th style={{ padding: '10px 15px' }}>Company Code</th>
//                     <th style={{ padding: '10px 15px' }}>Plant Code</th>
//                     <th style={{ padding: '10px 15px' }}>Plant name</th>
//                     <th style={{ padding: '10px 15px' }}>Address</th>
//                     <th style={{ padding: '10px 15px' }}>Contact Person</th>
//                     <th style={{ padding: '10px 15px' }}>Contact number</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentRecords && currentRecords.length > 0 ? (
//                     currentRecords.map((plant, index) => (
//                       <tr key={index} style={{ 
//                         backgroundColor: 'white' 
//                       }}>
//                         <td style={{ padding: '10px 15px' }}>{plant.companyCode || "-"}</td>
//                         <td style={{ padding: '10px 15px' }}>{plant.plantCode || "-"}</td>
//                         <td style={{ padding: '10px 15px' }}>{plant.plantName || "-"}</td>
//                         <td style={{ padding: '10px 15px' }}>{plant.address || "-"}</td>
//                         <td style={{ padding: '10px 15px' }}>{plant.contactPerson || "-"}</td>
//                         <td style={{ padding: '10px 15px' }}>{plant.contactNumber || "-"}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center" style={{ padding: '15px' }}>No plants found for this transporter</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
            
//             <div 
//               className="d-flex justify-content-end align-items-center px-3 py-2"
//               style={{ 
//                 borderTop: '1px solid #dee2e6' 
//               }}
//             >
//               <span style={{ marginRight: '10px', color: '#6c757d' }}>
//                 Total Results: {viewPlantData ? viewPlantData.length : 0}
//               </span>
              
//               <button 
//                 className="btn btn-link px-2 py-1 mx-1"
//                 style={{ 
//                   color: '#fff', 
//                   border: 'none', 
//                   backgroundColor: '#405189',
//                   borderRadius: '4px',
//                   width: '30px',
//                   height: '30px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   padding: 0,
//                   cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
//                   opacity: currentPage > 1 ? 1 : 0.6
//                 }}
//                 onClick={handlePreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <i className="ri-arrow-left-line"></i>
//               </button>
              
//               <span style={{ margin: '0 10px', color: '#333' }}>
//                 Page {currentPage} of {totalPages || 1}
//               </span>
              
//               <div className="input-group" style={{ width: '60px', marginRight: '10px' }}>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   value={pageInputValue}
//                   onChange={handlePageInputChange}
//                   onKeyDown={handlePageInputKeyDown}
//                   aria-label="Page number" 
//                   style={{
//                     height: '30px',
//                     textAlign: 'center'
//                   }}
//                 />
//               </div>
              
//               <button 
//                 className="btn btn-link px-2 py-1 mx-1"
//                 style={{ 
//                   color: '#fff', 
//                   border: 'none', 
//                   backgroundColor: '#405189',
//                   borderRadius: '4px',
//                   width: '30px',
//                   height: '30px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   padding: 0,
//                   cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
//                   opacity: currentPage < totalPages ? 1 : 0.6
//                 }}
//                 onClick={handleNextPage}
//                 disabled={currentPage >= totalPages}
//               >
//                 <i className="ri-arrow-right-line"></i>
//               </button>
//             </div>
//           </>
//         )}
//       </ModalBody>
//     </Modal>
//   );
// };

// export default ViewPlantsModal;







// ViewPlantsModal.js
import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Loader from "../../../../Components/Common/Loader";

const ViewPlantsModal = ({ 
  isOpen, 
  toggle, 
  currentTransporterCode, 
  viewPlantData,
  isLoading
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [pageInputValue, setPageInputValue] = useState("1");
  
  // Reset to first page when modal opens or data changes
  useEffect(() => {
    setCurrentPage(1);
    setPageInputValue("1");
  }, [isOpen, viewPlantData]);
  
  // Calculate pagination values
  const totalPages = Math.ceil((viewPlantData?.length || 0) / pageSize);
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  
  // Get current page data
  const currentRecords = viewPlantData ? viewPlantData.slice(indexOfFirstRecord, indexOfLastRecord) : [];
  
  // Navigate to previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInputValue((currentPage - 1).toString());
    }
  };
  
  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInputValue((currentPage + 1).toString());
    }
  };
  
  // Handle manual page input
  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };
  
  // Handle page input submission (on Enter key press)
  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(pageInputValue);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      } else {
        // Reset to current page if invalid
        setPageInputValue(currentPage.toString());
      }
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
    >
      <ModalHeader
        toggle={toggle}
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #dee2e6',
          padding: '15px 20px',
          color: '#000',
          position: 'relative',
          fontWeight: 'bold'
        }}
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
        Assign Plants - {currentTransporterCode}
      </ModalHeader>
      <ModalBody 
        className="p-0"
        style={{ 
          overflow: 'hidden',
          backgroundColor: 'white'
        }}
      >
        {isLoading ? (
          <div className="text-center my-4">
            <Loader />
          </div>
        ) : (
          <>
            <div style={{ overflow: 'auto' }}>
              <table 
                className="table mb-0" 
                style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: 'white'
                }}
              >
                <thead style={{ 
                  backgroundColor: '#405189', 
                  color: 'black'
                }}>
                  <tr>
                    <th style={{ padding: '10px 15px' }}>Company Code</th>
                    <th style={{ padding: '10px 15px' }}>Plant Code</th>
                    <th style={{ padding: '10px 15px' }}>Plant name</th>
                    <th style={{ padding: '10px 15px' }}>Address</th>
                    <th style={{ padding: '10px 15px' }}>Contact Person</th>
                    <th style={{ padding: '10px 15px' }}>Contact number</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords && currentRecords.length > 0 ? (
                    currentRecords.map((plant, index) => (
                      <tr key={index} style={{ 
                        backgroundColor: 'white' 
                      }}>
                        <td style={{ padding: '10px 15px' }}>{plant.companyCode || "-"}</td>
                        <td style={{ padding: '10px 15px' }}>{plant.plantCode || "-"}</td>
                        <td style={{ padding: '10px 15px' }}>{plant.plantName || "-"}</td>
                        <td style={{ padding: '10px 15px' }}>{plant.address || "-"}</td>
                        <td style={{ padding: '10px 15px' }}>{plant.contactPerson || "-"}</td>
                        <td style={{ padding: '10px 15px' }}>{plant.contactNumber || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center" style={{ padding: '15px' }}>No plants found for this transporter</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div 
              className="d-flex justify-content-end align-items-center px-3 py-2"
              style={{ 
                borderTop: '1px solid #dee2e6' 
              }}
            >
              <span style={{ marginRight: '10px', color: '#6c757d' }}>
                Total Results: {viewPlantData ? viewPlantData.length : 0}
              </span>
              
              <button 
                className="btn btn-link px-2 py-1 mx-1"
                style={{ 
                  color: '#fff', 
                  border: 'none', 
                  backgroundColor: '#405189',
                  borderRadius: '4px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                  opacity: currentPage > 1 ? 1 : 0.6
                }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              
              <span style={{ margin: '0 10px', color: '#333' }}>
                Page {currentPage} of {totalPages || 1}
              </span>
              
              <div className="input-group" style={{ width: '60px', marginRight: '10px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageInputKeyDown}
                  aria-label="Page number" 
                  style={{
                    height: '30px',
                    textAlign: 'center'
                  }}
                />
              </div>
              
              <button 
                className="btn btn-link px-2 py-1 mx-1"
                style={{ 
                  color: '#fff', 
                  border: 'none', 
                  backgroundColor: '#405189',
                  borderRadius: '4px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                  opacity: currentPage < totalPages ? 1 : 0.6
                }}
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ViewPlantsModal;