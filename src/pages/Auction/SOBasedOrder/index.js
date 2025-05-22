import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Label } from "reactstrap";
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './SOBasedOrder.css'; // Make sure to create this CSS file
import TransporterViewer from "./TransporterViewer/TransporterViewer";// Import the TransporterViewer component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a custom connector with withStyles (Material-UI v4 approach)
const GreenConnector = withStyles({
  alternativeLabel: {
    top: 22, // Align with circle center
  },
  active: {
    '& $line': {
      borderColor: '#00A389',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#00A389',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

// Custom StepIcon component for Material-UI v4
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;

  return (
    <div
      className={`custom-step-icon ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: completed ? '#00A389' : active ? '#4361ee' : '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: active || completed ? '0 4px 8px rgba(0,0,0,0.15)' : 'none',
        position: 'relative',
        transition: 'all 0.3s ease',
      }}
    >
      {completed ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        icon
      )}
    </div>
  );
};

const SOBasedOrder = ({ bidNo }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false); // State for accordion
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [selectedOrders, setSelectedOrders] = useState([]); // State for selected orders
  // Add errors state
  const [errors, setErrors] = useState({});

  // Add states for transporter selection
  const [showTransporterDropdown, setShowTransporterDropdown] = useState(false);
  const [transporterSearchTerm, setTransporterSearchTerm] = useState("");
  const [selectAllTransporters, setSelectAllTransporters] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  // NEW: Add state for sales orders API data
  const [salesOrders, setSalesOrders] = useState([]);
  const [loadingSalesOrders, setLoadingSalesOrders] = useState(false);
  const [salesOrdersError, setSalesOrdersError] = useState(null);
  const [totalSalesOrders, setTotalSalesOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const[biddingOrderNo,setBiddingOrderNo]=useState("");
  const ordersPerPage = 10; // Number of orders to display per page

  // Set initial transporter options
  const [transporterOptions, setTransporterOptions] = useState([
    { id: "0916005637", name: "Jaya Roadways" },
    { id: "0916003431", name: "R & B Transport" },
    { id: "0916006094", name: "RAJ ENTERPRISE" },
    { id: "0916005708", name: "Jaya Transport Services" },
    { id: "0916005858", name: "Laxmi Roadways" }
  ]);

  const [values, setValues] = useState({
    // SO Details
    bidStartingFrom: "",
    bidStartTo: "",
    ceilingAmount: "",
    intervalAmount: "",
    uom: "",
    lastMinutesExtension: "",

    // Material and Transporter
    extensionQuantity: "",
    displayToTransporter: "",
    selectTransporter: [], // Changed to array for multiple selection

    // Delivery and Allocation
    autoAllocateTo: "",
    intervalTimeForAllocatingVehicle: "",
    intervalTimeToReachPlant: "",
    gracePeriodToReachPlant: ""
  });

  // Helper function for authentication headers
  const getAuthHeaders = () => {
    const username = 'Amazin';
    const password = 'TE@M-W@RK';
    const base64Auth = btoa(`${username}:${password}`);

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64Auth}`,
      'Accept': 'application/json'
    };
  };

  // NEW: Function to fetch sales orders from API
  const fetchSalesOrders = async () => {
    setLoadingSalesOrders(true);
    setSalesOrdersError(null);

    try {
      // Get authentication data from session
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantCode = obj?.data?.plantCode || '';

      // Create API URL with optional filters
    //  const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/salesorder_allocation?plant=${plantCode}&page=${currentPage}&limit=${ordersPerPage}&search=${searchTerm}`;
      const apiUrl = `http://10.6.0.5:8081/salesorder_allocation?plant=${plantCode}&page=${currentPage}&limit=${ordersPerPage}&search=${searchTerm}`;
      console.log("Fetching sales orders from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Sales orders API response:", result);

      if (result && result.data && Array.isArray(result.data)) {
        // Map API response to the format expected by the component
        const mappedOrders = result.data.map(order => {
          // Format creation date if available
          let formattedDate = "N/A";
          if (order.creationDate && Array.isArray(order.creationDate) && order.creationDate.length === 3) {
            const [year, month, day] = order.creationDate;
            formattedDate = `${day}${getMonthAbbreviation(month)}`;
          }

          return {
            orderNo: order.orderNumber || order.salesDocNumber,
            validity: formattedDate,
            material: order.materialDesc || order.materialCode,
            quantity: `${order.orderQuantity || "0"} ${order.incoTerms || ""}`,
            status: order.soStatus,
            // Store the original data for later use
            originalData: order
          };
        });

        // Update state with mapped orders
        setSalesOrders(mappedOrders);
        setTotalSalesOrders(result.meta?.total || mappedOrders.length);
        setTotalPages(Math.ceil((result.meta?.total || mappedOrders.length) / ordersPerPage));

        // Log success
        console.log("Mapped sales orders:", mappedOrders);
      } else {
        // Handle empty or invalid response
        setSalesOrders([]);
        toast.info("No sales orders found", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching sales orders:", error);
      setSalesOrdersError(error.message);
      toast.error(`Failed to fetch sales orders: ${error.message}`, { autoClose: 3000 });
    } finally {
      setLoadingSalesOrders(false);
    }
  };

  // Helper function to get month abbreviation
  const getMonthAbbreviation = (monthNumber) => {
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthAbbreviations[monthNumber - 1] || '';
  };

  // Function to fetch transporters
  const fetchTransporters = async () => {
    setLoadingTransporters(true);
    try {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantCode = obj.data.plantCode;

      const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransportersByFlag?flag=A&filterParam=${plantCode}`;
      
      console.log("Fetching transporters from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response data:", result);

      // Check if result has the expected structure with data array
      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        // Map the API response fields
        const mappedTransporters = result.data.map(transporter => ({
          id: transporter.code,
          name: transporter.name.trim() // Trim to remove extra spaces
        }));

        console.log("Mapped transporters:", mappedTransporters);

        // Update the state
        setTransporterOptions(mappedTransporters);
      
      } else {
        toast.info("No transporters found", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.error(`Failed to fetch transporters: ${error.message}`, { autoClose: 3000 });
    } finally {
      setLoadingTransporters(false);
    }
  };

  // Updated handleInputChange to also fetch transporters
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues(prevValues => ({
      ...prevValues,
      [name]: value === 'Select' ? '' : value
    }));

    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Handle special case for Display To Transporter dropdown
    if (name === 'displayToTransporter') {
      // Reset selected transporters when changing display mode
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: []
      }));

      if (value === 'All') {
        fetchTransporters();
      }
    }
  };

  const handleBackPage = () => {
    // Navigate to previous step
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  // // Updated handleSubmit with API integration and fixed date formatting
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted with values:", values);
  //   console.log("Selected Sales Orders:", selectedOrders);

  //   // Initialize validation errors object
  //   const validationErrors = {};

  //   // Step 0 validation (Bid Details)
  //   if (activeStep === 0) {
  //     if (!values.bidStartingFrom) {
  //       validationErrors.bidStartingFrom = "Please select bid starting date";
  //     }

  //     if (!values.bidStartTo) {
  //       validationErrors.bidStartTo = "Please select bid end date";
  //     }

  //     if (!values.intervalAmount) {
  //       validationErrors.intervalAmount = "Please enter interval amount";
  //     }

  //     if (!values.uom || values.uom === "Select") {
  //       validationErrors.uom = "Please select UOM";
  //     }
  //   }

  //   // Step 1 validation (Material and Transporter)
  //   else if (activeStep === 1) {
  //     if (!values.extensionQuantity) {
  //       validationErrors.extensionQuantity = "Please enter extension quantity";
  //     }

  //     if (!values.displayToTransporter || values.displayToTransporter === "Select") {
  //       validationErrors.displayToTransporter = "Please select display option";
  //     }

  //     if (!values.selectTransporter || values.selectTransporter.length === 0) {
  //       validationErrors.selectTransporter = "Please select at least one transporter";
  //     }

  //     if (selectedOrders.length === 0) {
  //       validationErrors.salesOrders = "Please select at least one sales order";
  //     }
  //   }

  //   // Step 2 validation (Delivery and Allocation)
  //   else if (activeStep === 2) {
  //     if (!values.autoAllocateTo || values.autoAllocateTo === "Select") {
  //       validationErrors.autoAllocateTo = "Please select auto allocate option";
  //     }

  //     if (!values.intervalTimeForAllocatingVehicle) {
  //       validationErrors.intervalTimeForAllocatingVehicle = "Please select interval time";
  //     }

  //     if (!values.intervalTimeToReachPlant) {
  //       validationErrors.intervalTimeToReachPlant = "Please select interval time";
  //     }

  //     if (!values.gracePeriodToReachPlant) {
  //       validationErrors.gracePeriodToReachPlant = "Please select grace period";
  //     }
  //   }

  //   // Update the errors state
  //   setErrors(validationErrors);

  //   // If there are validation errors, don't proceed
  //   if (Object.keys(validationErrors).length > 0) {
  //     console.log("Validation errors:", validationErrors);
  //     return;
  //   }

  //   // If validation passes
  //   if (activeStep === 2) {
  //     // Go to Preview (which is not in the stepper)
  //     setActiveStep(3);
  //   } else if (activeStep === 3) {
  //     // If we're at Preview, submit to API
  //     setIsSubmitting(true);

  //     try {
  //       // Format dates for API with multiple options to try
  //       const formatDateOption1 = (dateString) => {
  //         if (!dateString) return null;
  //         const date = new Date(dateString);
  //         const year = date.getFullYear();
  //         const month = String(date.getMonth() + 1).padStart(2, '0');
  //         const day = String(date.getDate()).padStart(2, '0');
  //         const hours = String(date.getHours()).padStart(2, '0');
  //         const minutes = String(date.getMinutes()).padStart(2, '0');
  //         const seconds = String(date.getSeconds()).padStart(2, '0');

  //         // Use 'T' as separator instead of space
  //         return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  //       };

  //       const formatDateOption2 = (dateString) => {
  //         if (!dateString) return null;
  //         const date = new Date(dateString);
  //         const year = date.getFullYear();
  //         const month = String(date.getMonth() + 1).padStart(2, '0');
  //         const day = String(date.getDate()).padStart(2, '0');
  //         return `${year}-${month}-${day}`; // Date only, no time
  //       };

  //       // Convert time to minutes for API
  //       const timeToMinutes = (timeString) => {
  //         if (!timeString) return 0;

  //         // Handle different formats
  //         let hours = 0;
  //         let minutes = 0;

  //         if (timeString.includes(':')) {
  //           const parts = timeString.split(':');
  //           if (parts.length >= 2) {
  //             hours = parseInt(parts[0]) || 0;
  //             minutes = parseInt(parts[1]) || 0;
  //           }
  //         } else {
  //           // If it's already a number, return it
  //           const parsed = parseInt(timeString);
  //           if (!isNaN(parsed)) {
  //             return parsed;
  //           }
  //         }

  //         return (hours * 60) + minutes;
  //       };

  //       // Get unique transporters (remove duplicates by ID)
  //       const uniqueTransporters = [...new Map(
  //         values.selectTransporter.map(item => [item.id, item])
  //       ).values()];

  //       // Find selected order details from the salesOrders array
  //       const getSelectedOrderDetails = (orderNo) => {
  //         return salesOrders.find(order => order.orderNo === orderNo);
  //       };

  //       // Create a bid objects array for all selected transporters
  //       const biddingObjects = uniqueTransporters.map(transporter => {
  //         // Prepare the sales orders data for this transporter
  //         const formattedSalesOrders = selectedOrders.map(orderNo => {
  //           const orderDetails = getSelectedOrderDetails(orderNo);

  //           // Get original data if it exists, otherwise use the mapped order
  //           const originalOrder = orderDetails?.originalData || {};

  //           // Use a simple date string for validity
  //           const today = new Date();
  //           const validityStr = formatDateOption2(today);

  //           // Extract quantity numeric value
  //           const quantityStr = orderDetails?.quantity || "0";
  //           const quantityNum = parseInt(quantityStr.toString().replace(/\D/g, '')) || 0;

  //           return {
  //             soNumber: orderDetails?.orderNo || orderNo,
  //             validity: validityStr, // Use date-only format
  //             material: originalOrder.materialCode || orderDetails?.material || '',
  //             quantity: quantityNum,
  //             transporterCode: transporter.id,
  //             plantCode: originalOrder.plant || "PLANT01",
  //             biddingOrderNo: bidNo,
  //             status: "A"
  //           };
  //         });

  //         // Return a complete bidding object for each transporter
  //         return {
  //           biddingMaster: {
  //             transporterCode: transporter.id,
  //             ceilingPrice: parseFloat(values.ceilingAmount) || 0,
  //             uom: values.uom,
  //             bidFrom: formatDateOption1(values.bidStartingFrom),
  //             bidTo: formatDateOption1(values.bidStartTo),
  //             lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
  //             extentionQuantity: parseInt(values.extensionQuantity) || 0,
  //             bidUnit: 1,
  //             addOn: "Created from SO Based Order",
  //             intervalAmount: parseFloat(values.intervalAmount) || 0,
  //             noOfInput: selectedOrders.length,
  //             intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
  //             intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
  //             gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
  //             status: "A",
  //             autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
  //             bid: 1,
  //             bidType: "ONLINE",
  //             biddingOrderNo: bidNo,
  //             createdDate: formatDateOption2(new Date()), // Date only
  //             route: 0, // Use numeric value for route
  //             multiMaterial: 1,
  //             city: "Mumbai",
  //             material: formattedSalesOrders[0]?.material || "",
  //             quantity: formattedSalesOrders.reduce((total, order) => total + order.quantity, 0),
  //             extentionQty: parseInt(values.extensionQuantity) || 0,
  //             autoAllocationSalesOrder: values.autoAllocateTo === "Yes" ? 1 : 0,
  //             fromLocation: "PlantA",
  //             toLocation: "PlantB"
  //           },
  //           salesOrders: formattedSalesOrders
  //         };
  //       });

  //       const apiData = {
  //         bulk: false,
  //         biddings: biddingObjects
  //       };

  //       // Enhanced logging for debugging
  //       console.log("API Request Data:", JSON.stringify(apiData, null, 2));
  //       console.log("Date format being tested for validity:", formatDateOption2(new Date()));
  //       console.log("Date format being tested for bid dates:", formatDateOption1(new Date()));

  //       // API call with enhanced error handling
  //       const response = await fetch('http://localhost:8085/biddingMaster/bulk', {
  //         method: 'POST',
  //         headers: getAuthHeaders(),
  //         body: JSON.stringify(apiData)
  //       });

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error("API Error Response:", errorText);
  //         console.error("Response Status:", response.status);
  //         console.error("Response Headers:", Object.fromEntries([...response.headers.entries()]));
  //         throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
  //       }

  //       const result = await response.json();
  //       console.log("API Success Response:", result);

  //       // Show success toast notification
  //       toast.success("Your SO based bid has been created successfully!", { 
  //         autoClose: 3000,
  //         position: "top-right",
  //         style: {
  //           background: "#00A389",
  //           color: "black"
  //         }
  //       });

  //       // After successful submission, go to Finish
  //       setActiveStep(4);
  //       // Show success modal
  //       setShowSuccessModal(true);
  //     } catch (error) {
  //       console.error("API Error Details:", error);
  //       setSubmitError(error.message);
  //       // Show error toast notification
  //       toast.error("Something went wrong!", {
  //         toastId: 'error-toast',
  //         position: "top-right",
  //         autoClose: 4000,
  //         style: {
  //           background: "#EF4444",
  //           color: "black"
  //         }
  //       });
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   } else {
  //     // For other steps, just go to next step if validation passed
  //     setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", values);
    console.log("Selected Sales Orders:", selectedOrders);

    // Initialize validation errors object
    const validationErrors = {};

    // Step 0 validation (Bid Details)
    if (activeStep === 0) {
      if (!values.bidStartingFrom) {
        validationErrors.bidStartingFrom = "Please select bid starting date";
      }

      if (!values.bidStartTo) {
        validationErrors.bidStartTo = "Please select bid end date";
      }

      if (!values.intervalAmount) {
        validationErrors.intervalAmount = "Please enter interval amount";
      }

      if (!values.uom || values.uom === "Select") {
        validationErrors.uom = "Please select UOM";
      }
    }

    // Step 1 validation (Material and Transporter)
    else if (activeStep === 1) {
      if (!values.extensionQuantity) {
        validationErrors.extensionQuantity = "Please enter extension quantity";
      }

      if (!values.displayToTransporter || values.displayToTransporter === "Select") {
        validationErrors.displayToTransporter = "Please select display option";
      }

      if (!values.selectTransporter || values.selectTransporter.length === 0) {
        validationErrors.selectTransporter = "Please select at least one transporter";
      }

      if (selectedOrders.length === 0) {
        validationErrors.salesOrders = "Please select at least one sales order";
      }
    }

    // Step 2 validation (Delivery and Allocation)
    else if (activeStep === 2) {
      if (!values.autoAllocateTo || values.autoAllocateTo === "Select") {
        validationErrors.autoAllocateTo = "Please select auto allocate option";
      }

      if (!values.intervalTimeForAllocatingVehicle) {
        validationErrors.intervalTimeForAllocatingVehicle = "Please select interval time";
      }

      if (!values.intervalTimeToReachPlant) {
        validationErrors.intervalTimeToReachPlant = "Please select interval time";
      }

      if (!values.gracePeriodToReachPlant) {
        validationErrors.gracePeriodToReachPlant = "Please select grace period";
      }
    }

    // Update the errors state
    setErrors(validationErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors);
      return;
    }

    // If validation passes
    if (activeStep === 2) {
      // Go to Preview (which is not in the stepper)
      setActiveStep(3);
    } else if (activeStep === 3) {
      // If we're at Preview, submit to API
      setIsSubmitting(true);

      try {
        // Format dates for API with correct formats for each field
        const formatDateForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        const formatDateOnlyForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const formatValidityDateForAPI = (dateString) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');

          return `${day}-${month}-${year} ${hours}:${minutes}`;
        };

        // Convert time to minutes for API
        const timeToMinutes = (timeString) => {
          if (!timeString) return 0;

          // Handle different formats
          let hours = 0;
          let minutes = 0;

          if (timeString.includes(':')) {
            const parts = timeString.split(':');
            if (parts.length >= 2) {
              hours = parseInt(parts[0]) || 0;
              minutes = parseInt(parts[1]) || 0;
            }
          } else {
            // If it's already a number, return it
            const parsed = parseInt(timeString);
            if (!isNaN(parsed)) {
              return parsed;
            }
          }

          return (hours * 60) + minutes;
        };

        // Get unique transporters (remove duplicates by ID)
        const uniqueTransporters = [...new Map(
          values.selectTransporter.map(item => [item.id, item])
        ).values()];

        // Find selected order details from the salesOrders array
        const getSelectedOrderDetails = (orderNo) => {
          return salesOrders.find(order => order.orderNo === orderNo);
        };

        // Create a bid objects array for all selected transporters
        const biddingObjects = uniqueTransporters.map(transporter => {
          // Prepare the sales orders data for this transporter
          const formattedSalesOrders = selectedOrders.map(orderNo => {
            const orderDetails = getSelectedOrderDetails(orderNo);
            const originalOrder = orderDetails?.originalData || {};

            // Format validity as "DD-MM-YYYY HH:MM" per API requirements
            const today = new Date();
            const validityStr = formatValidityDateForAPI(today);

            const quantityStr = orderDetails?.quantity || "0";
            const quantityNum = parseInt(quantityStr.toString().replace(/\D/g, '')) || 0;

            return {
              soNumber: orderDetails?.orderNo || orderNo,
              validity: validityStr, // Now using DD-MM-YYYY HH:MM format
              material: originalOrder.materialCode || orderDetails?.material || '',
              quantity: quantityNum,
              transporterCode: transporter.id,
              plantCode: originalOrder.plant || "PLANT01",
              biddingOrderNo: bidNo,
              status: "A"
            };
          });

          // Return a complete bidding object for each transporter
          return {
            biddingMaster: {
              transporterCode: transporter.id,
              ceilingPrice: parseFloat(values.ceilingAmount) || 0,
              uom: values.uom,
              bidFrom: formatDateForAPI(values.bidStartingFrom),
              bidTo: formatDateForAPI(values.bidStartTo),
              lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
              extentionQuantity: parseInt(values.extensionQuantity) || 0,
              bidUnit: 1,
              addOn: "Not Required", // Changed to match API request
              intervalAmount: parseFloat(values.intervalAmount) || 0,
              noOfInput: selectedOrders.length,
              intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
              intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
              gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
              status: "A",
              autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
              bid: 1,
              bidType: "ONLINE",
              biddingOrderNo: bidNo,
              createdDate: formatDateOnlyForAPI(new Date()), // Now using YYYY-MM-DD format
              route: 100.0, // Set to 100.0 as in the example
              multiMaterial: 1,
              city: "Mumbai",
              material: formattedSalesOrders[0]?.material || "Steel", // Default to Steel if no material
              quantity: formattedSalesOrders.reduce((total, order) => total + order.quantity, 0),
              extentionQty: parseInt(values.extensionQuantity) || 0,
              autoAllocationSalesOrder: values.autoAllocateTo === "Yes" ? 1 : 0,
              fromLocation: "PlantA",
              toLocation: "PlantB"
            },
            salesOrders: formattedSalesOrders
          };
        });

        const apiData = {  
          bulk: false,
          biddings: biddingObjects
        };

        // Enhanced logging for debugging
        console.log("API Request Data:", JSON.stringify(apiData, null, 2));
        console.log("Date format being tested for validity:", formatDateOnlyForAPI(new Date()));
        console.log("Date format being tested for bid dates:", formatDateForAPI(new Date()));

        // API call with enhanced error handling
        const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/bulk`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          console.error("Response Status:", response.status);
          console.error("Response Headers:", Object.fromEntries([...response.headers.entries()]));
          throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log("API Success Response:", result);
        setBiddingOrderNo(result[0]?.data?.biddingOrderNo);

        // Show success toast notification
        toast.success("Your SO based bid has been created successfully!", {
          autoClose: 3000,
          position: "top-right",
          style: {
            background: "white",
            
          }
        });

        // After successful submission, go to Finish
        setActiveStep(4);
        // Show success modal
        setShowSuccessModal(true);
      } catch (error) {
        console.error("API Error Details:", error);
        setSubmitError(error.message);
        // Show error toast notification
        toast.error("Something went wrong!", {
          toastId: 'error-toast',
          position: "top-right",
          autoClose: 4000,
          style: {
            background: "#EF4444",
            color: "black"
          }
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For other steps, just go to next step if validation passed
      setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
    }
  };
  // Handle order selection
  const handleOrderSelect = (orderNo) => {
    if (selectedOrders.includes(orderNo)) {
      setSelectedOrders(selectedOrders.filter(item => item !== orderNo));
    } else {
      setSelectedOrders([...selectedOrders, orderNo]);
    }

    // Clear sales order error when selecting orders
    if (errors.salesOrders) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.salesOrders;
        return newErrors;
      });
    }
  };

  // Handle pagination for sales orders
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fetch sales orders when page, search term, or component mounts
  useEffect(() => {
    fetchSalesOrders();
  }, [currentPage, searchTerm]);

  // Fetch transporters on mount
  useEffect(() => {
    document.title = "SO Based Order | EPLMS";

    // Automatically fetch transporters when the component mounts
    fetchTransporters();
  }, []);

  const steps = [
    'Bid Details',
    'Material and Transporter',
    'Delivery and Allocation',
    'Finish'
  ];

  const autoAllocateToOptions = [
    "Select",
    "Yes",
    "No"
  ];

  const uomOptions = [
    "Select",
    "MT",
    "KM",
  ];

  const displayToTransporterOptions = [
    "Select",
    "Yes",
    "No"
  ];

  // Filter sales orders based on search term - this is now handled by API
  const filteredOrders = useMemo(() => {
    return salesOrders;
  }, [salesOrders]);

  // Use memo to improve performance when filtering transporters
  const filteredTransporters = useMemo(() => {
    return transporterOptions.filter(
      t => t.name.toLowerCase().includes(transporterSearchTerm.toLowerCase()) ||
        t.id.includes(transporterSearchTerm)
    );
  }, [transporterOptions, transporterSearchTerm]);

  // Function to reset the form and go back to the first step
  const handleBackToCreateBid = () => {
    // Reset form and go back to first step
    setActiveStep(0);
    setShowSuccessModal(false);
    setValues({
      bidStartingFrom: "",
      bidStartTo: "",
      ceilingAmount: "",
      intervalAmount: "",
      uom: "",
      lastMinutesExtension: "",
      extensionQuantity: "",
      displayToTransporter: "",
      selectTransporter: [], // Reset to empty array
      autoAllocateTo: "",
      intervalTimeForAllocatingVehicle: "",
      intervalTimeToReachPlant: "",
      gracePeriodToReachPlant: ""
    });
    setSelectedOrders([]);
    setErrors({});
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="so-based-order-modal-overlay">
      <div className="so-based-order-modal-content">
        <div className="so-based-order-modal-icon">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#405189"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
        </div>
        <h3 className="so-based-order-modal-title">
          Your SO Based <span style={{ color: "blue" }}> {biddingOrderNo}</span>  has been created!
        </h3>
        <button
          type="button"
          className="so-based-order-modal-button"
          onClick={handleBackToCreateBid}
        >
          Back to Create Bid
        </button>
      </div>
    </div>
  );

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  // Transporter selection functions
  const handleTransporterSelect = (transporter) => {
    // Check if the transporter is already selected by ID
    if (!values.selectTransporter.some(t => t.id === transporter.id)) {
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: [...prevValues.selectTransporter, transporter]
      }));
    }

    // Clear transporter error when selecting transporters
    if (errors.selectTransporter) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.selectTransporter;
        return newErrors;
      });
    }
  };

  const handleRemoveTransporter = (transporterId, e) => {
    if (e) e.stopPropagation();
    setValues(prevValues => ({
      ...prevValues,
      selectTransporter: prevValues.selectTransporter.filter(t => t.id !== transporterId)
    }));
  };

  // Handle select all transporters properly
  const handleSelectAllTransporters = (e) => {
    const isChecked = e.target.checked;
    setSelectAllTransporters(isChecked);

    if (isChecked) {
      // Get all currently filtered transporters
      const filteredIds = filteredTransporters.map(t => t.id);

      // Keep any previously selected transporters that aren't in the current filter
      const previousSelected = values.selectTransporter.filter(t => !filteredIds.includes(t.id));

      // Create a unique list of transporters to add (avoid duplicates)
      const transportersToAdd = filteredTransporters.filter(t =>
        !previousSelected.some(p => p.id === t.id)
      );

      // Add all filtered transporters
      const newSelection = [...previousSelected, ...transportersToAdd];

      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: newSelection
      }));
    } else {
      // Remove only the filtered transporters from selection
      const filteredIds = filteredTransporters.map(t => t.id);

      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: prevValues.selectTransporter.filter(t => !filteredIds.includes(t.id))
      }));
    }

    // Clear transporter error if we now have selections
    if (errors.selectTransporter) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.selectTransporter;
        return newErrors;
      });
    }
  };

  // Check if all filtered transporters are selected
  const areAllFilteredTransportersSelected = () => {
    if (filteredTransporters.length === 0) return false;

    // Create a set of selected transporter IDs for faster lookup
    const selectedIds = new Set(values.selectTransporter.map(t => t.id));

    // Check if all filtered transporters are in the selected set
    return filteredTransporters.every(t => selectedIds.has(t.id));
  };

  // Update useEffect to correctly set the selectAll state
  useEffect(() => {
    const allSelected = areAllFilteredTransportersSelected();
    setSelectAllTransporters(allSelected);
  }, [transporterSearchTerm, values.selectTransporter]);

  // Function to handle sales order search with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  return (
    <>
      {/* Material UI Stepper with custom connector for green lines */}
      <div className="so-based-order-stepper-container">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<GreenConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={activeStep > index}>
              <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <Form onSubmit={handleSubmit}>
        {/* Bid Details Step */}
        {activeStep === 0 && (
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Bid Starting From <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartingFrom"
                    value={values.bidStartingFrom}
                    onChange={handleInputChange}
                    required
                    className={`so-based-order-input ${errors.bidStartingFrom ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.bidStartingFrom ? "#dc3545" : "",
                      borderWidth: errors.bidStartingFrom ? "2px" : ""
                    }}
                  />
                  {errors.bidStartingFrom && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.bidStartingFrom}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Bid Start To<span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartTo"
                    value={values.bidStartTo}
                    onChange={handleInputChange}
                    className={`so-based-order-input ${errors.bidStartTo ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.bidStartTo ? "#dc3545" : "",
                      borderWidth: errors.bidStartTo ? "2px" : ""
                    }}
                  />
                  {errors.bidStartTo && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.bidStartTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Ceiling Amount
                </Label>
                <Input
                  type="text"
                  placeholder="Add Amount"
                  name="ceilingAmount"
                  value={values.ceilingAmount}
                  onChange={handleInputChange}
                  className="so-based-order-input"
                  style={{ color: "#000" }}
                />
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval Amount <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Add Amount"
                  name="intervalAmount"
                  value={values.intervalAmount}
                  onChange={handleInputChange}
                  className={`so-based-order-input ${errors.intervalAmount ? "is-invalid" : ""}`}
                  style={{
                    color: "#000",
                    borderColor: errors.intervalAmount ? "#dc3545" : "",
                    borderWidth: errors.intervalAmount ? "2px" : ""
                  }}
                />
                {errors.intervalAmount && (
                  <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                    {errors.intervalAmount}
                  </div>
                )}
              </div>
            </div>

            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  UOM<span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="uom"
                    value={values.uom}
                    onChange={handleInputChange}
                    className={`so-based-order-select ${errors.uom ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.uom ? "#dc3545" : "",
                      borderWidth: errors.uom ? "2px" : ""
                    }}
                  >
                    {uomOptions.map((uom, index) => (
                      <option key={index} value={uom} style={{ color: "#000" }}>
                        {uom}
                      </option>
                    ))}
                  </Input>
                  {errors.uom && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.uom}
                    </div>
                  )}
                </div>
              </div>

              {/* Updated Last Minutes Extension field */}
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Last Minutes Extension
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder=" --:--:--"
                    name="lastMinutesExtension"
                    value={values.lastMinutesExtension}
                    onChange={handleInputChange}
                    className="so-based-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className={`so-based-order-button so-based-order-back-button ${activeStep === 0 ? 'disabled' : ''}`}
                onClick={handleBackPage}
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? "0.6" : "1" }}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Material and Transporter Step with Improved Accordion Table */}
        {activeStep === 1 && (
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Extension Quantity <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  required
                  placeholder="Add Quantity"
                  name="extensionQuantity"
                  value={values.extensionQuantity}
                  onChange={handleInputChange}
                  className={`so-based-order-input ${errors.extensionQuantity ? "is-invalid" : ""}`}
                  style={{
                    color: "#000",
                    borderColor: errors.extensionQuantity ? "#dc3545" : "",
                    borderWidth: errors.extensionQuantity ? "2px" : ""
                  }}
                />
                {errors.extensionQuantity && (
                  <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                    {errors.extensionQuantity}
                  </div>
                )}
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Display To Transporter <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    required
                    name="displayToTransporter"
                    value={values.displayToTransporter}
                    onChange={handleInputChange}
                    className={`so-based-order-select ${errors.displayToTransporter ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.displayToTransporter ? "#dc3545" : "",
                      borderWidth: errors.displayToTransporter ? "2px" : ""
                    }}
                  >
                    {displayToTransporterOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.displayToTransporter && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.displayToTransporter}
                    </div>
                  )}
                </div>
              </div>

              {/* IMPROVED Transporter Selection with API integration */}
                <div className="so-based-order-form-group">
                  <Label className="so-based-order-label">
                    Select Transporter <span style={{ color: "red" }}>*</span>
                  </Label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <div
                        className="so-based-order-transporter-selector"
                        onClick={() => setShowTransporterDropdown(!showTransporterDropdown)}
                        style={{
                          height: "38px",
                          color: "#000",
                          display: "flex",
                          alignItems: "center",
                          border: errors.selectTransporter ? "2px solid #dc3545" : "1px solid #ced4da",
                          borderRadius: "4px",
                          padding: "0.375rem 0.75rem",
                          backgroundColor: "#fff"
                        }}
                      >
                        <span className="so-based-order-transporter-selector-placeholder" style={{ color: "#000" }}>
                          {values.selectTransporter.length > 0
                            ? `${values.selectTransporter.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).length} Selected`
                            : 'Select'}
                        </span>
                        <span style={{ marginLeft: "auto" }}>
                          <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                        </span>
                      </div>

                      {/* Transporter dropdown with loading state */}
                      {showTransporterDropdown && (
                        <div className="so-based-order-dropdown" style={{
                          position: "absolute",
                          width: "100%",
                          zIndex: 10,
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          marginTop: "4px",
                          maxHeight: "300px",
                          overflowY: "auto"
                        }}>
                          {/* Search header */}
                          <div className="so-based-order-dropdown-header" style={{
                            padding: "8px",
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #ddd"
                          }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <div style={{ flex: "0 0 40px", display: "flex", justifyContent: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={selectAllTransporters}
                                  onChange={handleSelectAllTransporters}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: "pointer"
                                  }}
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Search"
                                value={transporterSearchTerm}
                                onChange={(e) => setTransporterSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="so-based-order-dropdown-search"
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  color: "#000",
                                  fontSize: "14px"
                                }}
                              />
                            </div>
                          </div>

                          {/* Loading indicator for transporters */}
                          {loadingTransporters && (
                            <div style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#4361ee"
                            }}>
                              <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                              <div style={{ marginTop: "8px" }}>Loading transporters...</div>
                            </div>
                          )}

                          {/* Empty state message */}
                          {!loadingTransporters && filteredTransporters.length === 0 && (
                            <div style={{
                              padding: "20px",
                              textAlign: "center",
                              color: "#666"
                            }}>
                              <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                              <div style={{ marginTop: "8px" }}>No transporters found</div>
                            </div>
                          )}

                          {/* Transporter list */}
                          {!loadingTransporters && filteredTransporters.length > 0 && (
                            <div className="so-based-order-dropdown-content">
                              {filteredTransporters.map((transporter, index) => (
                                <div
                                  key={index}
                                  className="so-based-order-dropdown-item"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px 8px",
                                    borderBottom: "1px solid #eee",
                                    color: "#000",
                                    cursor: "pointer"
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const isSelected = values.selectTransporter.some(t => t.id === transporter.id);
                                    if (!isSelected) {
                                      handleTransporterSelect(transporter);
                                    } else {
                                      handleRemoveTransporter(transporter.id, e);
                                    }
                                  }}
                                >
                                  <div style={{ flex: "0 0 40px", display: "flex", justifyContent: "center" }}>
                                    <input
                                      type="checkbox"
                                      checked={values.selectTransporter.some(t => t.id === transporter.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        if (e.target.checked) {
                                          handleTransporterSelect(transporter);
                                        } else {
                                          handleRemoveTransporter(transporter.id, e);
                                        }
                                      }}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer"
                                      }}
                                    />
                                  </div>
                                  <div style={{
                                    flex: "0 0 120px",
                                    paddingRight: "15px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: "14px"
                                  }}>
                                    {transporter.id}
                                  </div>
                                  <div style={{
                                    flex: 1,
                                    fontSize: "14px"
                                  }}>
                                    {transporter.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* TransporterViewer component */}
                    {values.selectTransporter.length > 0 && (
                      <TransporterViewer
                        selectedTransporters={values.selectTransporter}
                        onRemove={(transporterId) => {
                          handleRemoveTransporter(transporterId, new Event('click'));
                        }}
                      />
                    )}
                  </div>
                  {errors.selectTransporter && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.selectTransporter}
                    </div>
                  )}
                </div>
            </div>

            {/* Improved Accordion Sales Order Selection with API integration */}
            <div className="so-based-order-accordion">
              <div
                className="so-based-order-accordion-header"
                onClick={toggleAccordion}
                style={{
                  border: errors.salesOrders ? "2px solid #dc3545" : "none"
                }}
              >
                <span>Select Sales Order Details <span style={{ color: "red" }}>*</span></span>
                <i className={`ri-arrow-${accordionOpen ? 'up' : 'down'}-s-line`}></i>
              </div>

              <div
                className={`so-based-order-accordion-content ${accordionOpen ? 'open' : ''}`}
                style={{
                  display: accordionOpen ? 'block' : 'none', // Use display instead of maxHeight for reliable showing/hiding
                  border: errors.salesOrders ? "2px solid #dc3545" : "1px solid #e0e0e0",
                  borderTop: "none"
                }}
              >
                <div className="so-based-order-search-container">
                  <input
                    type="text"
                    placeholder="Search by Order Number, Material, etc."
                    className="so-based-order-search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ color: "#000" }}
                  />
                </div>

                {/* Loading state for sales orders */}
                {loadingSalesOrders && (
                  <div style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#4361ee"
                  }}>
                    <i className="ri-loader-4-line spin" style={{ fontSize: "28px" }}></i>
                    <div style={{ marginTop: "10px", fontSize: "16px" }}>Loading sales orders...</div>
                  </div>
                )}

                {/* Error state for sales orders */}
                {salesOrdersError && !loadingSalesOrders && (
                  <div style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#dc3545"
                  }}>
                    <i className="ri-error-warning-line" style={{ fontSize: "28px" }}></i>
                    <div style={{ marginTop: "10px", fontSize: "16px" }}>
                      Error loading sales orders: {salesOrdersError}
                    </div>
                    <button
                      type="button"
                      onClick={fetchSalesOrders}
                      style={{
                        padding: "6px 12px",
                        marginTop: "15px",
                        backgroundColor: "#4361ee",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Empty state for no sales orders */}
                {!loadingSalesOrders && !salesOrdersError && filteredOrders.length === 0 && (
                  <div style={{
                    padding: "30px",
                    textAlign: "center",
                    color: "#666"
                  }}>
                    <i className="ri-file-list-3-line" style={{ fontSize: "28px" }}></i>
                    <div style={{ marginTop: "10px", fontSize: "16px" }}>
                      No sales orders found. {searchTerm ? "Try a different search term." : ""}
                    </div>
                  </div>
                )}

                {/* Sales orders table */}
                {!loadingSalesOrders && !salesOrdersError && filteredOrders.length > 0 && (
                  <table className="so-based-order-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}></th>
                        <th>Sales Order No.</th>
                        <th>Status</th>
                        <th>Validity</th>
                        <th>Material</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.orderNo)}
                              onChange={() => handleOrderSelect(order.orderNo)}
                            />
                          </td>
                          <td>{order.orderNo}</td>
                          <td>
                            <span style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: order.status === "Confirmed" ? "#d1fae5" :
                                order.status === "Processing" ? "#e0f2fe" :
                                  order.status === "Blocked" ? "#fee2e2" : "#f3f4f6",
                              color: order.status === "Confirmed" ? "#059669" :
                                order.status === "Processing" ? "#0369a1" :
                                  order.status === "Blocked" ? "#b91c1c" : "#4b5563",
                            }}>
                              {order.status || "N/A"}
                            </span>
                          </td>
                          <td>{order.validity}</td>
                          <td>{order.material}</td>
                          <td>{order.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Improved pagination with API integration */}
                {!loadingSalesOrders && !salesOrdersError && totalPages > 0 && (
                  <div className="so-based-order-pagination">
                    <div className="so-based-order-pagination-count">
                      Total Results: {totalSalesOrders}
                    </div>
                    <div className="so-based-order-pagination-controls">
                      <button
                        type="button"
                        className="so-based-order-pagination-prev"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                      >
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      <div className="so-based-order-pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        type="button"
                        className="so-based-order-pagination-next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                      >
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Display error for sales order selection */}
            {errors.salesOrders && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px", marginBottom: "16px" }}>
                {errors.salesOrders}
              </div>
            )}

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Delivery and Allocation Step */}
        {activeStep === 2 && (
          <div className="so-based-order-container">
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Auto Allocate To L1 <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="autoAllocateTo"
                    value={values.autoAllocateTo}
                    onChange={handleInputChange}
                    required
                    className={`so-based-order-select ${errors.autoAllocateTo ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.autoAllocateTo ? "#dc3545" : "",
                      borderWidth: errors.autoAllocateTo ? "2px" : ""
                    }}
                  >
                    {autoAllocateToOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                  {errors.autoAllocateTo && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.autoAllocateTo}
                    </div>
                  )}
                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval time for Allocating Vehicle <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    name="intervalTimeForAllocatingVehicle"
                    value={values.intervalTimeForAllocatingVehicle}
                    onChange={handleInputChange}
                    required
                    className={`so-based-order-input ${errors.intervalTimeForAllocatingVehicle ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.intervalTimeForAllocatingVehicle ? "#dc3545" : "",
                      borderWidth: errors.intervalTimeForAllocatingVehicle ? "2px" : ""
                    }}
                    placeholder="Select Time"
                  />
                  {errors.intervalTimeForAllocatingVehicle && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.intervalTimeForAllocatingVehicle}
                    </div>
                  )}

                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Interval time for to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    name="intervalTimeToReachPlant"
                    value={values.intervalTimeToReachPlant}
                    onChange={handleInputChange}
                    required
                    className={`so-based-order-input ${errors.intervalTimeToReachPlant ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.intervalTimeToReachPlant ? "#dc3545" : "",
                      borderWidth: errors.intervalTimeToReachPlant ? "2px" : ""
                    }}
                    placeholder="Select Time"
                  />
                  {errors.intervalTimeToReachPlant && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.intervalTimeToReachPlant}
                    </div>
                  )}

                </div>
              </div>

              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">
                  Grace Period to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    name="gracePeriodToReachPlant"
                    value={values.gracePeriodToReachPlant}
                    onChange={handleInputChange}
                    required
                    className={`so-based-order-input ${errors.gracePeriodToReachPlant ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.gracePeriodToReachPlant ? "#dc3545" : "",
                      borderWidth: errors.gracePeriodToReachPlant ? "2px" : ""
                    }}
                    placeholder="Select Time"
                  />
                  {errors.gracePeriodToReachPlant && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.gracePeriodToReachPlant}
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Preview Step (not in stepper but comes after Delivery and Allocation) */}
        {activeStep === 3 && (
          <div className="so-based-order-container">
            {/* Bid Details Section */}
            <div className="so-based-order-section-title">Bid Details</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Bid Starting From</Label>
                <div className="so-based-order-value">{values.bidStartingFrom || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Bid Start To</Label>
                <div className="so-based-order-value">{values.bidStartTo || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Ceiling Amount</Label>
                <div className="so-based-order-value">{values.ceilingAmount || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval Amount</Label>
                <div className="so-based-order-value">{values.intervalAmount || "—"}</div>
              </div>
            </div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">UOM</Label>
                <div className="so-based-order-value">{values.uom || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Last Minutes Extension</Label>
                <div className="so-based-order-value">{values.lastMinutesExtension || "—"}</div>
              </div>
            </div>

            {/* Material and Transporter Section */}
            <div className="so-based-order-section-title">Material and Transporter</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Extension Quantity</Label>
                <div className="so-based-order-value">{values.extensionQuantity || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Display To Transporter</Label>
                <div className="so-based-order-value">{values.displayToTransporter || "—"}</div>
              </div>

              {/* Updated Transporter Display for Preview */}
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Select Transporter</Label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "8px",
                  paddingBottom: "8px"
                }}>
                  <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "8px",
                    color: "#000"
                  }}>
                    {values.selectTransporter.length > 0 ? (
                      (() => {
                        // Get unique transporters by ID
                        const uniqueTransporters = [...new Map(
                          values.selectTransporter.map(item => [item.id, item])
                        ).values()];

                        // Display just the first few transporters
                        const displayTransporters = uniqueTransporters.slice(0, 2);
                        const remaining = uniqueTransporters.length - displayTransporters.length;

                        return (
                          <>
                            {displayTransporters.map((t, i) => (
                              <span
                                key={i}
                                title={t.name}
                                style={{
                                  backgroundColor: "#4361ee",
                                  color: "white",
                                  padding: "5px 12px",
                                  borderRadius: "4px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "inline-block"
                                }}
                              >
                                {t.name}
                              </span>
                            ))}

                            {/* Show ellipsis for additional transporters */}
                            {remaining > 0 && (
                              <span
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                  marginLeft: "4px"
                                }}
                              >
                                ...
                              </span>
                            )}
                          </>
                        );
                      })()
                    ) : (
                      "—"
                    )}
                  </div>

                  {/* View Icon */}
                  {values.selectTransporter.length > 0 && (
                    <span
                      onClick={() => setShowTransporterModal(true)}
                      style={{
                        cursor: "pointer",
                        width: "28px",
                        height: "28px",
                        minWidth: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        backgroundColor: "#f8f9fa",
                        marginLeft: "10px"
                      }}
                    >
                      <i className="ri-eye-line" style={{ fontSize: "16px", color: "#4361ee" }}></i>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transporter Preview Modal */}
            {showTransporterModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    width: "90%",
                    maxWidth: "500px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "18px" }}>Selected Transporters</h3>
                    <button
                      onClick={() => setShowTransporterModal(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div style={{ padding: "16px", maxHeight: "70vh", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #eee" }}>ID</th>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #eee" }}>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...new Map(values.selectTransporter.map(item => [item.id, item])).values()].map((t, i) => (
                          <tr key={i}>
                            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{t.id}</td>
                            <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{t.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      borderTop: "1px solid #eee",
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    <button
                      onClick={() => setShowTransporterModal(false)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#4361ee",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Sales Orders Section */}
            <div className="so-based-order-section-title">Selected Sales Orders</div>
            {selectedOrders.length > 0 ? (
              <table className="so-based-order-preview-table so-based-order-table">
                <thead>
                  <tr>
                    <th>Sales Order No.</th>
                    <th>Status</th>
                    <th>Validity</th>
                    <th>Material</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrders.map((orderNo, index) => {
                    const orderDetails = salesOrders.find(order => order.orderNo === orderNo);
                    return orderDetails ? (
                      <tr key={index}>
                        <td>{orderDetails.orderNo}</td>
                        <td>
                          <span style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: orderDetails.status === "Confirmed" ? "#d1fae5" :
                              orderDetails.status === "Processing" ? "#e0f2fe" :
                                orderDetails.status === "Blocked" ? "#fee2e2" : "#f3f4f6",
                            color: orderDetails.status === "Confirmed" ? "#059669" :
                              orderDetails.status === "Processing" ? "#0369a1" :
                                orderDetails.status === "Blocked" ? "#b91c1c" : "#4b5563",
                          }}>
                            {orderDetails.status || "N/A"}
                          </span>
                        </td>
                        <td>{orderDetails.validity}</td>
                        <td>{orderDetails.material}</td>
                        <td>{orderDetails.quantity}</td>
                      </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
            ) : (
              <div className="so-based-order-no-data">No sales orders selected</div>
            )}

            {/* Delivery and Allocation Section */}
            <div className="so-based-order-section-title">Delivery and Allocation</div>
            <div className="so-based-order-row">
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Auto Allocate To L1</Label>
                <div className="so-based-order-value">{values.autoAllocateTo || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval time for Allocating Vehicle</Label>
                <div className="so-based-order-value">{values.intervalTimeForAllocatingVehicle || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Interval time to reach plant</Label>
                <div className="so-based-order-value">{values.intervalTimeToReachPlant || "—"}</div>
              </div>
              <div className="so-based-order-form-group">
                <Label className="so-based-order-label">Grace Period to reach plant</Label>
                <div className="so-based-order-value">{values.gracePeriodToReachPlant || "—"}</div>
              </div>
            </div>

            <div className="so-based-order-button-container">
              <button
                type="button"
                className="so-based-order-button so-based-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="so-based-order-button so-based-order-next-button"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <span>
                    <i className="ri-loader-4-line spin me-1"></i> Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Finish Step */}
        {activeStep === 4 && (
          <div className="so-based-order-finish-container">
            <div className="so-based-order-finish-icon">
              {submitError ? (
                <div style={{ color: "#EF4444", fontSize: "80px" }}>
                  <i className="ri-error-warning-line"></i>
                </div>
              ) : (
                <lord-icon
                  src="https://cdn.lordicon.com/lupuorrc.json"
                  trigger="loop"
                  colors="primary:#0ab39c,secondary:#405189"
                  style={{ width: "120px", height: "120px" }}
                ></lord-icon>
              )}
            </div>
            <h3 className={`so-based-order-finish-title ${submitError ? 'so-based-order-finish-title-error' : 'so-based-order-finish-title-success'}`}>
              {submitError
                ? "Error submitting your bid"
                : "Your SO Based Bid has been created!"}
            </h3>
            {submitError && (
              <p className="so-based-order-error-message">
                {submitError}
              </p>
            )}
            <button
              type="button"
              className="so-based-order-finish-button"
              onClick={handleBackToCreateBid}
            >
              Back to Create Bid
            </button>
          </div>
        )}
      </Form>

      {/* Add ToastContainer for notifications */}
      <ToastContainer closeButton={false} limit={1}
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{ backgroundColor: "white" }} />
      {/* Show success modal */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default SOBasedOrder;