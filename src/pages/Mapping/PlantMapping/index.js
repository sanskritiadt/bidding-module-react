import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import Loader from "../../../Components/Common/Loader";
import ViewPlantsModal from "./ViewPlantsModal/ViewPlantsModal";
import AssignPlantModal from "./AssignPlantModal/AssignPlantModel";

const PlantMapping = () => {
  const [transporters, setTransporters] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [isAssignPlantModalOpen, setIsAssignPlantModalOpen] = useState(false);
  const [isViewPlantModalOpen, setIsViewPlantModalOpen] = useState(false);
  const [currentTransporterCode, setCurrentTransporterCode] = useState("");
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [viewPlantData, setViewPlantData] = useState([]);

  // Loading states
  const [isTransportersLoading, setIsTransportersLoading] = useState(false);
  const [isPlantsLoading, setIsPlantsLoading] = useState(false);
  const [isViewPlantsLoading, setIsViewPlantsLoading] = useState(false);
  const [isAssigningPlants, setIsAssigningPlants] = useState(false);

  // Plant data state
  const [plants, setPlants] = useState([]);

  // Modal toggle function
  const handleModalToggle = () => {
    // If we're closing the modal
    if (isAssignPlantModalOpen) {
      setSelectedPlants([]);
      // Only reset selectedRows when bulk assigning (no currentTransporterCode)
      if (!currentTransporterCode) {
        setSelectedRows([]);
      }
    }
    setIsAssignPlantModalOpen(!isAssignPlantModalOpen);
  };

  // Show success toast notification
  const showSuccessAlert = () => {
    // Show success toast notification with green background
    toast.success("Plants assigned successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Reset UI state
    setSelectedRows([]);
    setSelectedPlants([]);
    setIsAssignPlantModalOpen(false);
  };

  // Helper function for authentication headers
  const getAuthHeaders = () => {
    const username = process.env.REACT_APP_API_USER_NAME || 'amazin';
    const password = process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK';
    const base64Auth = btoa(`${username}:${password}`);

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64Auth}`
    };
  };

  // Fetch transporters with API integration
  const fetchTransporters = async () => {
    setIsTransportersLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransporters`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Check if the response has the expected structure with data property
      if (result && result.data && Array.isArray(result.data)) {
        // Map API response data to match table columns
        const mappedData = result.data.map(item => ({
          id: item.id,
          transporterCode: item.code,
          transporterName: item.name,
          contactPerson: item.contactPerson || "",
          phoneNo: item.contactNumber || "",
          emailId: item.contactEmail || "",
          rType: item.modeTransport || ""  // Using modeTransport as the route type
        }));

        console.log("Mapped Data:", mappedData);
        setTransporters(mappedData);
      } else {
        console.warn("Response structure is not as expected:", result);
        setTransporters([]);
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      setTransporters([]);
      // Show error toast
      toast.error("Failed to fetch transporters. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsTransportersLoading(false);
    }
  };

  useEffect(() => {
    fetchTransporters();
  }, []);

  // Fetch plants with API integration
  const fetchPlants = async () => {
    setIsPlantsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/plants/getAllPlants`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Plants API Response:", result);

      if (result && result.data && Array.isArray(result.data)) {
        // Map the API response to match the expected structure for the table
        const mappedPlants = result.data.map(plant => ({
          id: plant.id,
          companyCode: plant.companyCode,
          plantCode: plant.plantCode,
          plantName: plant.plantName,
          address: plant.address,
          contactPerson: plant.contactPerson,
          contactNumber: plant.contactNumber
        }));

        setPlants(mappedPlants);
      } else {
        console.warn("Plants data structure is not as expected:", result);
        // If the API fails, we'll set plants to empty array
        setPlants([]);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      // Set plants to empty array if there's an error
      setPlants([]);
      // Show error toast
      toast.error("Failed to fetch plants. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsPlantsLoading(false);
    }
  };

  // Handle view plants for a transporter - UPDATED to remove duplicate handling
  const handleViewPlants = async (transporterCode) => {
    setIsViewPlantsLoading(true);
    try {
      console.log("Fetching plants for transporter code:", transporterCode);

      // Using the correct API endpoint with the transporter code
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterPlantMap/byTransporter?transporterCode=${transporterCode}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        console.log("View Plants API Response:", result);

        if (result && result.data && Array.isArray(result.data)) {
          // Simply use the data as returned from API
          const transformedData = result.data.map(item => ({
            companyCode: item.companyCode || "",
            plantCode: item.plantCode || "",
            plantName: item.plantName || "",
            address: item.address || "",
            contactPerson: item.contactPerson || "",
            contactNumber: item.contactNumber || ""
          }));

          setViewPlantData(transformedData);
        } else {
          console.warn("Plants data structure is not as expected:", result);
          setViewPlantData([]);
        }
      } else {
        console.error("Failed to fetch plants for transporter. Status:", response.status);
        setViewPlantData([]);
        toast.warning("No plants found for this transporter.", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setCurrentTransporterCode(transporterCode);
      setIsViewPlantModalOpen(true);
    } catch (error) {
      console.error("Error fetching plants for transporter:", error);
      setViewPlantData([]);
      setCurrentTransporterCode(transporterCode);
      setIsViewPlantModalOpen(true);
      toast.error("Error fetching plants for this transporter.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsViewPlantsLoading(false);
    }
  };

  // Handle plant assignment - UPDATED to remove duplicate prevention logic
  // const handleAssignPlants = async () => {
  //   setIsAssigningPlants(true);
  //   try {
  //     let mappingData = [];

  //     // If a single transporter is selected
  //     if (currentTransporterCode) {
  //       // Get selected plant details for current transporter
  //       mappingData = selectedPlants.map(plantId => {
  //         const plant = plants.find(p => p.id === plantId);
  //         if (!plant) return null; // Skip if plant not found

  //         return {
  //           transporterCode: currentTransporterCode,
  //           plantCode: plant.plantCode
  //         };
  //       }).filter(item => item !== null); // Remove any null entries
  //     }
  //     // If multiple transporters are selected (bulk assign)
  //     else if (selectedRows.length > 0) {
  //       // For each selected transporter, create entries for each selected plant
  //       selectedRows.forEach(transporterId => {
  //         const transporter = transporters.find(t => t.id === transporterId);
  //         if (!transporter) return; // Skip if transporter not found

  //         const transporterCode = transporter.transporterCode;

  //         selectedPlants.forEach(plantId => {
  //           const plant = plants.find(p => p.id === plantId);
  //           if (!plant) return; // Skip if plant not found

  //           mappingData.push({
  //             transporterCode: transporterCode,
  //             plantCode: plant.plantCode
  //           });
  //         });
  //       });
  //     }

  //     console.log("Attempting to assign plants:", mappingData);

  //     // Check if we have any data to send
  //     if (mappingData.length === 0) {
  //       toast.warning("No plants selected to assign.", {
  //         position: "top-right",
  //         autoClose: 4000,
  //       });
  //       setIsAssigningPlants(false);
  //       return;
  //     }

  //     // Make the API call with proper authentication
  //     const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterPlantMap/bulkTransporterPlant`, {
  //       method: 'POST',
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify(mappingData)
  //     });

  //     if (response.ok) {
  //       console.log("Plants assigned successfully");
  //       showSuccessAlert();

  //       // Refresh the data
  //       fetchTransporters();

  //       // If we're viewing a specific transporter's plants, refresh that view
  //       if (currentTransporterCode) {
  //         handleViewPlants(currentTransporterCode);
  //       }
  //     } else {
  //       console.error("Failed to assign plants. Status:", response.status);
  //       // Error toast with red background
  //       toast.error("Failed to assign plants. Please try again.", {
  //         position: "top-right",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error assigning plants:", error);
  //     // Error toast with red background
  //     toast.error("An error occurred while assigning plants.", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } finally {
  //     setIsAssigningPlants(false);
  //   }
  // };

const handleAssignPlants = async () => {
    setIsAssigningPlants(true);
    try {
      let mappingData = [];

      // If a single transporter is selected
      if (currentTransporterCode) {
        // Get selected plant details for current transporter
        mappingData = selectedPlants.map(plantId => {
          const plant = plants.find(p => p.id === plantId);
          if (!plant) return null; // Skip if plant not found

          return {
            transporterCode: currentTransporterCode,
            plantCode: plant.plantCode
          };
        }).filter(item => item !== null); // Remove any null entries
      }
      // If multiple transporters are selected (bulk assign)
      else if (selectedRows.length > 0) {
        // For each selected transporter, create entries for each selected plant
        selectedRows.forEach(transporterId => {
          const transporter = transporters.find(t => t.id === transporterId);
          if (!transporter) return; // Skip if transporter not found

          const transporterCode = transporter.transporterCode;

          selectedPlants.forEach(plantId => {
            const plant = plants.find(p => p.id === plantId);
            if (!plant) return; // Skip if plant not found

            mappingData.push({
              transporterCode: transporterCode,
              plantCode: plant.plantCode
            });
          });
        });
      }

      console.log("Attempting to assign plants:", mappingData);

      // Check if we have any data to send
      if (mappingData.length === 0) {
        toast.warning("No plants selected to assign.", {
          position: "top-right",
          autoClose: 4000,
        });
        setIsAssigningPlants(false);
        return;
      }

      // Make the API call with proper authentication
      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/transporterPlantMap/bulkTransporterPlant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(mappingData)
      });

      // Parse the response JSON
      const result = await response.json();

      if (response.ok) {
        console.log("Plants assigned successfully:", result);

        // Check if result has meta information with a message
        if (Array.isArray(result) && result.length > 0 && result[0].meta) {
          // Show the API response message in toast
          toast.success(result[0].meta.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Generic success toast if no specific message
          toast.success("Plants assigned successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        // Refresh the data
        fetchTransporters();

        // If we're viewing a specific transporter's plants, refresh that view
        if (currentTransporterCode) {
          handleViewPlants(currentTransporterCode);
        }
      } else {
        console.error("Failed to assign plants. Status:", response.status);

        // Check if result has meta information with an error message
        if (Array.isArray(result) && result.length > 0 && result[0].meta) {
          // Show the API error message in toast
          toast.error(result[0].meta.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          // Generic error toast if no specific message
          toast.error("Failed to assign plants. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (error) {
      console.error("Error assigning plants:", error);
      // Error toast with red background
      toast.error("An error occurred while assigning plants.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsAssigningPlants(false);
    }
  };
  // NEW: Handle the download functionality
  const handleDownload = (e) => {
    e.preventDefault();
    downloadCSV();
    setIsExportCSV(false);
  };

  // NEW: Download CSV function
  const downloadCSV = () => {
    if (transporters.length === 0) {
      toast.warning("No data available to export", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Create column headers
    const headers = [
      "Transporter Code",
      "Transporter Name",
      "Contact Person",
      "Phone No.",
      "Email Id",
      "R-Type"
    ].join(',') + '\n';

    // Create CSV rows
    const rows = transporters.map(transporter =>
      [
        transporter.transporterCode,
        transporter.transporterName,
        transporter.contactPerson,
        transporter.phoneNo,
        transporter.emailId,
        transporter.rType
      ].join(',')
    ).join('\n');

    // Combine headers and rows
    const csvData = headers + rows;

    // Create and download the file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'TransporterPlantMapping.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // toast.success("CSV file exported successfully!", {
    //   position: "top-right",
    //   autoClose: 3000,
    // });
  };

  // Columns for transporters table
  const columns = useMemo(
    () => [
      {
        Header: () => (
          <Input
            type="checkbox"
            checked={transporters.length > 0 && selectedRows.length === transporters.length}
            onChange={() => {
              setSelectedRows(
                selectedRows.length === transporters.length
                  ? []
                  : transporters.map(t => t.id)
              );
            }}
          />
        ),
        accessor: "checkbox",
        disableHiding: true,
        Cell: ({ row }) => (
          <Input
            type="checkbox"
            checked={selectedRows.includes(row.original.id)}
            onChange={() => {
              setSelectedRows(prevSelected =>
                prevSelected.includes(row.original.id)
                  ? prevSelected.filter(id => id !== row.original.id)
                  : [...prevSelected, row.original.id]
              );
            }}
          />
        ),
        disableSortBy: true,
      },
      { Header: "Transporter Code", accessor: "transporterCode" },
      { Header: "Transporter Name", accessor: "transporterName" },
      { Header: "Contact Person", accessor: "contactPerson" },
      { Header: "Phone No.", accessor: "phoneNo" },
      { Header: "Email Id", accessor: "emailId" },
      { Header: "R-Type", accessor: "rType" },
      {
        Header: "Assign Plant",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Link
              to="#"
              className="text-info"
              onClick={() => handleViewPlants(row.original.transporterCode)}
            >
              <i className="ri-eye-line fs-16"></i>
            </Link>
            <Link
              to="#"
              className="text-success"
              onClick={() => {
                setCurrentTransporterCode(row.original.transporterCode);
                fetchPlants();
                handleModalToggle();
              }}
            >
              <i className="ri-map-pin-line fs-16"></i>
            </Link>
          </div>
        ),
        disableSortBy: true,
      }
    ],
    [selectedRows, transporters]
  );

  document.title = "Plant Mapping | EPLMS";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Transporter Plant Mapping" pageTitle="Transporter Plant Mapping" />

          <div className="bg-white rounded p-4" style={{ width: "100%" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div style={{ width: "68%" }}>
                <h5 className="card-title mb-0 bg-light px-3 py-2">
                  Transporter Plant Mapping
                </h5>
              </div>

              <div className="d-flex gap-2">
                <Button
                  style={{
                    backgroundColor: '#4FC3A1',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: selectedRows.length > 0 ? 'pointer' : 'not-allowed'
                  }}
                  id="assignMultiplePlant"
                  onClick={() => {
                    if (selectedRows.length > 0) {
                      setCurrentTransporterCode("");
                      fetchPlants();
                      handleModalToggle();
                    }
                  }}
                  disabled={selectedRows.length === 0}
                >
                  <i className="ri-map-pin-line align-bottom me-1"></i> Assign Multiple Plant
                </Button>

                <Button color="info" onClick={() => setIsExportCSV(true)}>
                  <i className="ri-file-download-line align-bottom me-1"></i> Export
                </Button>
              </div>
            </div>

            <div className="table-container">
              {isTransportersLoading ? (
                <div className="text-center my-5">
                  <Loader />
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={transporters}
                  isGlobalFilter={true}
                  isAddUserList={false}
                  customPageSize={10}
                  isGlobalSearch={true}
                  className="custom-header-css"
                  SearchPlaceholder="Search for Transporter..."
                />
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* View Plants Modal */}
      <ViewPlantsModal
        isOpen={isViewPlantModalOpen}
        toggle={() => setIsViewPlantModalOpen(!isViewPlantModalOpen)}
        currentTransporterCode={currentTransporterCode}
        viewPlantData={viewPlantData}
        isLoading={isViewPlantsLoading}
      />

      {/* Assign Plant Modal with Search */}
      <AssignPlantModal
        isOpen={isAssignPlantModalOpen}
        toggle={handleModalToggle}
        currentTransporterCode={currentTransporterCode}
        plants={plants}
        selectedPlants={selectedPlants}
        setSelectedPlants={setSelectedPlants}
        handleAssignPlants={handleAssignPlants}
        isLoading={isPlantsLoading || isAssigningPlants}
        getAuthHeaders={getAuthHeaders}
      />

      {/* Export CSV Modal */}
      {isExportCSV && (
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          onDownloadClick={handleDownload}
          data={transporters}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{ backgroundColor: "white" }}
      />
    </React.Fragment>
  );
};

export default PlantMapping;