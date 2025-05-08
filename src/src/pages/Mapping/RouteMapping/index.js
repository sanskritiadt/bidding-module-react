import React, { useState, useMemo } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card 
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";

const RouteMapping = () => {
  // Dummy data from previous implementation
  const [transporters, setTransporters] = useState([
    {
      id: 1,
      transporterCode: "0916005637",
      transporterName: "RAJ ENTERPRISE",
      contactPerson: "Jihad",
      phoneNo: "9834567343",
      emailId: "Jihad@amzbizsol.in",
      rType: "Rail"
    },
    {
      id: 2,
      transporterCode: "0916006094",
      transporterName: "VRAJ CEMENT CARRIER",
      contactPerson: "Vinay",
      phoneNo: "9023457853",
      emailId: "Vinay@amzbizsol.in",
      rType: "Ship"
    },
    {
      id: 3,
      transporterCode: "0916003431",
      transporterName: "WESTERN LOGISTICS",
      contactPerson: "Sangram",
      phoneNo: "9847364735",
      emailId: "sangram@amzbizsol.in",
      rType: "Road"
    },
    {
      id: 4,
      transporterCode: "0916005708",
      transporterName: "NEHA ROADLINE",
      contactPerson: "Pakaj",
      phoneNo: "9023457853",
      emailId: "pankaj@amzbizsol.in",
      rType: "Ship"
    },
    {
      id: 5,
      transporterCode: "0916005858",
      transporterName: "R AND B TRANSPORT",
      contactPerson: "Sunil",
      phoneNo: "9724646543",
      emailId: "Sunil@amzbizsol.in",
      rType: "Rail"
    }
  ]);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransporters, setSelectedTransporters] = useState([]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return transporters;
    return transporters.filter(transporter => 
      Object.values(transporter).some(val => 
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [transporters, searchTerm]);

  // Columns definition
  const columns = useMemo(
    () => [
      {
        accessor: 'checkbox',
        Header: () => <input type="checkbox" />,
        Cell: () => <input type="checkbox" />,
        width: 20
      },
      {
        Header: "Transporter Code",
        accessor: "transporterCode",
      },
      {
        Header: "Transporter name",
        accessor: "transporterName",
      },
      {
        Header: "Contact Person",
        accessor: "contactPerson",
      },
      {
        Header: "Phone No.",
        accessor: "phoneNo",
      },
      {
        Header: "Email Id",
        accessor: "emailId",
      },
      {
        Header: "R-Type",
        accessor: "rType",
      },
      {
        Header: "Actions",
        Cell: () => (
          <div className="d-flex gap-2 ">
          
              <i className="ri-eye-line text-info"></i>
          
            <button className="btn btn-sm btn-soft-primary">
              <i className="ri-download-line"></i>
            </button>
          </div>
        )
      }
    ],
    []
  );

  // Action handlers
  const handleAssignMultipleRoute = () => {
    console.log("Assign Multiple Route clicked");
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Card className="border-0">
          <div className="p-3 d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Route Mapping</h4>
            <div className="d-flex align-items-center">
              <div className="position-relative me-2">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="form-control" 
                  style={{
                    width: "250px",
                    borderRadius: "4px",
                    border: "1px solid #ced4da"
                  }}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <button 
                className="btn btn-outline-secondary me-2"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px"
                }}
              >
                <i className="ri-filter-3-line"></i>
              </button>
              
              <button 
                className="btn btn-success me-2"
                onClick={handleAssignMultipleRoute}
                style={{
                  backgroundColor: "#02a767",
                  borderColor: "#02a767",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  borderRadius: "4px"
                }}
              >
                <i className="ri-add-line me-1"></i> Assign Multiple Route
              </button>
              
              <button 
                className="btn btn-outline-success"
                onClick={handleExport}
                style={{
                  color: "#02a767",
                  borderColor: "#02a767",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <i className="ri-file-excel-2-line me-1"></i> Export
              </button>
            </div>
          </div>
        </Card>

        {/* Table Container */}
        <Card className="mt-3">
          <div className="card-body">
            <TableContainer
              columns={columns}
              data={filteredData}
              isGlobalFilter={false}
              customPageSize={5}
              className="custom-header-css"
              pagination={true}
            />
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default RouteMapping;