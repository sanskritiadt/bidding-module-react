  // import React, { useState, useEffect, useMemo } from "react";
  // import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
  // import TableContainer from "../../../../Components/Common/TableContainer";

  // const SalesOrderModal = ({ isOpen, toggle, bidNo }) => {
  //   const [salesOrderData, setSalesOrderData] = useState([]);
  //   const [filteredData, setFilteredData] = useState([]);
  //   const [searchText, setSearchText] = useState("");

  //   // Comprehensive columns for table
  //   const columns = useMemo(
  //     () => [
  //       {
  //         Header: "Sales Order No.",
  //         accessor: "salesOrderNo",
  //         width: 150 // Added width to help with horizontal scrolling
  //       },
  //       {
  //         Header: "Validity Start Date",
  //         accessor: "validityStartDate",
  //         width: 180
  //       },
  //       {
  //         Header: "Validity End Date",
  //         accessor: "validityEndDate",
  //         width: 180
  //       },
  //       {
  //         Header: "Order Qty.",
  //         accessor: "orderQty",
  //         width: 120
  //       },
  //       {
  //         Header: "Remaining Qty.",
  //         accessor: "remainingQty",
  //         width: 150
  //       },
  //       {
  //         Header: "Order Type",
  //         accessor: "orderType",
  //         width: 120
  //       },
  //       {
  //         Header: "BlockedSold",
  //         accessor: "blockedSold",
  //         width: 150
  //       },
  //       {
  //         Header: "City Desc.",
  //         accessor: "cityDesc",
  //         width: 150
  //       },
  //       {
  //         Header: "Country Desc.",
  //         accessor: "countryDesc",
  //         width: 150
  //       },
  //       {
  //         Header: "Distribution Channel",
  //         accessor: "distributionChannel",
  //         width: 200
  //       },
  //       {
  //         Header: "Route Code",
  //         accessor: "routeCode",
  //         width: 120
  //       },
  //       {
  //         Header: "Route Desc.",
  //         accessor: "routeDesc",
  //         width: 150
  //       },
  //       {
  //         Header: "Ship to Party",
  //         accessor: "shipToParty",
  //         width: 150
  //       },
  //       {
  //         Header: "Ship to Party Name",
  //         accessor: "shipToPartyName",
  //         width: 200
  //       },
  //       {
  //         Header: "Ship to Region",
  //         accessor: "shipToRegion",
  //         width: 150
  //       },
  //       {
  //         Header: "Division",
  //         accessor: "division",
  //         width: 120
  //       }
  //     ],
  //     []
  //   );

  //   // Load sales order data based on bid number
  //   useEffect(() => {
  //     if (bidNo) {
  //       // Sample data with all specified columns
  //       const data = [
  //         {
  //           id: 1,
  //           salesOrderNo: "SO23456",
  //           validityStartDate: "18/02/2025 01:00",
  //           validityEndDate: "10/02/2025 05:00",
  //           orderQty: "100 Tan",
  //           remainingQty: "80 Tan",
  //           orderType: "Ship",
  //           blockedSold: "No",
  //           cityDesc: "Mumbai",
  //           countryDesc: "India",
  //           distributionChannel: "Road",
  //           routeCode: "RN102",
  //           routeDesc: "Mumbai Route",
  //           shipToParty: "SHIP1",
  //           shipToPartyName: "Ship Party Name 1",
  //           shipToRegion: "West",
  //           division: "Transport"
  //         },
  //         {
  //           id: 2,
  //           salesOrderNo: "SO45734",
  //           validityStartDate: "18/02/2025 01:00",
  //           validityEndDate: "10/02/2025 05:00",
  //           orderQty: "200 Tan",
  //           remainingQty: "134 Tan",
  //           orderType: "Ship",
  //           blockedSold: "Yes",
  //           cityDesc: "Delhi",
  //           countryDesc: "India",
  //           distributionChannel: "Air",
  //           routeCode: "RN103",
  //           routeDesc: "Delhi Route",
  //           shipToParty: "SHIP2",
  //           shipToPartyName: "Ship Party Name 2",
  //           shipToRegion: "North",
  //           division: "Logistics"
  //         },
  //         {
  //           id: 3,
  //           salesOrderNo: "SO89342",
  //           validityStartDate: "18/02/2025 01:00",
  //           validityEndDate: "10/02/2025 05:00",
  //           orderQty: "250 Tan",
  //           remainingQty: "125 Tan",
  //           orderType: "Ship",
  //           blockedSold: "No",
  //           cityDesc: "Chennai",
  //           countryDesc: "India",
  //           distributionChannel: "Sea",
  //           routeCode: "RN108",
  //           routeDesc: "Chennai Route",
  //           shipToParty: "SHIP3",
  //           shipToPartyName: "Ship Party Name 3",
  //           shipToRegion: "South",
  //           division: "Distribution"
  //         }
  //       ];
  //       setSalesOrderData(data);
  //       setFilteredData(data);
  //     }
  //   }, [bidNo]);

  //   // Search functionality
  //   useEffect(() => {
  //     if (searchText) {
  //       const filtered = salesOrderData.filter(item => 
  //         Object.values(item).some(val => 
  //           String(val).toLowerCase().includes(searchText.toLowerCase())
  //         )
  //       );
  //       setFilteredData(filtered);
  //     } else {
  //       setFilteredData(salesOrderData);
  //     }
  //   }, [searchText, salesOrderData]);

  //   return (
  //     <Modal isOpen={isOpen} toggle={toggle} className="sales-order-modal" size="xl">
  //       <ModalHeader toggle={toggle} className="border-0">
  //         <div className="modal-title">SO Details: {bidNo}</div>
  //       </ModalHeader>
  //       <ModalBody>
  //         <style>{`
  //           .table-responsive {
  //             overflow-x: auto;
  //             max-width: 100%;
  //           }
  //           .table-container {
  //             min-width: 2000px; /* Ensure table is wider than container */
  //           }
  //           .sticky-header th {
  //             position: sticky;
  //             top: 0;
  //             background: white;
  //             z-index: 10;
  //           }
  //         `}</style>
          
  //         {/* Table */}
  //         <div className="table-responsive">
  //           <TableContainer
  //             columns={columns}
  //             data={filteredData}
  //             isGlobalFilter={true}
  //             isAddUserList={false}
  //             customPageSize={5}
  //             isGlobalSearch={true}
  //             className="sales-order-table custom-header-css table-container"
  //             SearchPlaceholder="Search SO Details..."
  //             tableClassName="table-nowrap sticky-header"
  //           />
  //         </div>
  //       </ModalBody>
  //     </Modal>
  //   );
  // };

  // export default SalesOrderModal;


//current working code 
  import React, { useState, useEffect, useMemo, useRef } from "react";
  import { Modal, ModalHeader, ModalBody, Row, Col, Input, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
  
  const SalesOrderModal = ({ isOpen, toggle, bidNo }) => {
    const [salesOrderData, setSalesOrderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState([]);
    
    // Comprehensive columns for table
    const columns = useMemo(
      () => [
        {
          Header: "Sales Order No.",
          accessor: "salesOrderNo",
        },
        {
          Header: "Validity Start Date",
          accessor: "validityStartDate",
        },
        {
          Header: "Validity End Date",
          accessor: "validityEndDate",
        },
        {
          Header: "Order Qty.",
          accessor: "orderQty",
        },
        {
          Header: "Remaining Qty.",
          accessor: "remainingQty",
        },
        {
          Header: "Order Type",
          accessor: "orderType",
        },
        {
          Header: "BlockedSold",
          accessor: "blockedSold",
        },
        {
          Header: "City Desc.",
          accessor: "cityDesc",
        },
        {
          Header: "Country Desc.",
          accessor: "countryDesc",
        },
        {
          Header: "Distribution Channel",
          accessor: "distributionChannel",
        },
        {
          Header: "Route Code",
          accessor: "routeCode",
        },
        {
          Header: "Route Desc.",
          accessor: "routeDesc",
        },
        {
          Header: "Ship to Party",
          accessor: "shipToParty",
        },
        {
          Header: "Ship to Party Name",
          accessor: "shipToPartyName",
        },
        {
          Header: "Ship to Region",
          accessor: "shipToRegion",
        },
        {
          Header: "Division",
          accessor: "division",
        }
      ],
      []
    );
  
    // Initialize visible columns when columns are ready
    useEffect(() => {
      setVisibleColumns(columns.map(col => col.accessor));
    }, [columns]);
  
    // Load sales order data based on bid number
    useEffect(() => {
      if (bidNo) {
        // Sample data with all specified columns
        const data = [
        
        ];
        setSalesOrderData(data);
        setFilteredData(data);
      }
    }, [bidNo]);
  
    // Search functionality
    useEffect(() => {
      if (searchText) {
        const filtered = salesOrderData.filter(item => 
          Object.values(item).some(val => 
            String(val).toLowerCase().includes(searchText.toLowerCase())
          )
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(salesOrderData);
      }
    }, [searchText, salesOrderData]);
  
    // Toggle dropdown for column visibility
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
    // Toggle column visibility
    const toggleColumnVisibility = (accessor) => {
      if (visibleColumns.includes(accessor)) {
        // Don't hide the last visible column
        if (visibleColumns.length > 1) {
          setVisibleColumns(visibleColumns.filter(col => col !== accessor));
        }
      } else {
        setVisibleColumns([...visibleColumns, accessor]);
      }
    };
  
    // Get visible columns
    const getVisibleColumns = () => {
      return columns.filter(col => visibleColumns.includes(col.accessor));
    };
  
    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / pageSize);
    
    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const goToPrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    // Get current page data
    const getCurrentItems = () => {
      const startIndex = (currentPage - 1) * pageSize;
      return filteredData.slice(startIndex, startIndex + pageSize);
    };
  
    return (
      <Modal isOpen={isOpen} toggle={toggle} className="sales-order-modal" size="xl">
        <ModalHeader toggle={toggle} className="border-0">
          <div className="modal-title">SO Details: {bidNo}</div>
        </ModalHeader>
        <ModalBody>
          <style jsx>{`
            /* Fixed top controls */
            .controls-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              width: 100%;
            }
            
            /* Scrollable table container */
            .table-container {
              width: 100%;
              overflow-x: auto;
              margin-bottom: 15px;
              border: 1px solid #e9e9ef;
            }
            
            /* Table styles */
            .data-table {
              min-width: 2000px;
              width: 100%;
              border-collapse: collapse;
            }
            
            .data-table th {
              background-color: #f8f9fa;
              font-weight: 600;
              text-align: left;
              padding: 10px;
              border-bottom: 2px solid #e9e9ef;
            }
            
            .data-table td {
              padding: 10px;
              border-top: 1px solid #e9e9ef;
              vertical-align: middle;
            }
            
            /* Fixed pagination row */
            .pagination-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
            }
            
            /* Dropdown for column visibility */
            .column-dropdown {
              max-height: 300px;
              overflow-y: auto;
            }
            
            /* Pagination buttons container */
            .pagination-controls {
              display: flex;
              align-items: center;
            }
            
            .page-info {
              margin: 0 10px;
            }
          `}</style>
          
          {/* Fixed Search and Column Controls */}
          <div className="controls-row">
            <div className="search-container">
              <Input
                type="text"
                placeholder="Search SO Details..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ minWidth: "250px" }}
              />
            </div>
            <div className="column-control">
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle color="light" caret>
                  Hide Columns
                </DropdownToggle>
                <DropdownMenu right className="column-dropdown">
                  {columns.map(column => (
                    <DropdownItem key={column.accessor} toggle={false}>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`col-${column.accessor}`}
                          checked={visibleColumns.includes(column.accessor)}
                          onChange={() => toggleColumnVisibility(column.accessor)}
                        />
                        <label className="form-check-label" htmlFor={`col-${column.accessor}`}>
                          {column.Header}
                        </label>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          
          {/* Scrollable Table Container - ONLY THIS PART SCROLLS */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {getVisibleColumns().map(column => (
                    <th key={column.accessor}>
                      {column.Header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((row, i) => (
                  <tr key={i}>
                    {getVisibleColumns().map(column => (
                      <td key={`${i}-${column.accessor}`}>
                        {row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Fixed Pagination Controls */}
          <div className="pagination-row">
            <div>
              Total Results: {filteredData.length}
            </div>
            <div className="pagination-controls">
              <Button 
                color="secondary" 
                size="sm" 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
              >
                &lt;
              </Button>
              <span className="page-info">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button 
                color="secondary" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage >= totalPages}
              >
                &gt;
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  };
  
  export default SalesOrderModal;



