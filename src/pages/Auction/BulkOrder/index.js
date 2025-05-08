import React, { useState, useEffect } from "react";
import { Form, Input, Label } from "reactstrap";
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './BulkOrder.css'; // Import the CSS file
import TransporterViewer from "./TransporterViewer/TransporterViewer";
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

const BulkOrder = ({bidNo}) => {
  // Define all options and static data first to prevent reference errors
 
  const steps = [
    'Bid Details',
    'Material and Transporter',
    'Delivery and Allocation',
    'Finish'
  ];

  const locationOptions = [
    "Select",
    "Location A",
    "Location B",
    "Location C",
    "Location D",
    "Gurugram",
    "Mumbai"
  ];

  const routeOptions = [
    "Select",
    "Route 1",
    "Route 2",
    "Route 3",
    "RN9823"
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

  const multiMaterialOptions = [
    "Select",
    "Yes",
    "No"
  ];

  const materialOptions = [
    "Select",
    "Steel",
    "Cement",
    "Wood",
    "Copper",
    "Iron"
  ];

  // Initial transporters - will be replaced by API response
  const [transporterOptions, setTransporterOptions] = useState([
    { id: "0916005637", name: "Jaya Roadways" },
    { id: "0916006094", name: "RAJ ENTERPRISE" },
    { id: "0916003431", name: "R & B Transport" },
    { id: "0916005708", name: "Jaya Roadways" },
    { id: "0916005858", name: "Laxmi Roadways" }
  ]);

  const displayToTransporterOptions = [
    'Select',
    'All',
    'Route Based',
    'Plant Based'
  ];

  // Now define state variables
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showTransporterDropdown, setShowTransporterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectAllTransporters, setSelectAllTransporters] = useState(false);
  const [showTransporterModal, setShowTransporterModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityOptions, setCityOptions] = useState(["Select City"]);
  const [routeParam, setRouteParam] = useState('');
  // Add loading state for transporters
  const [loadingTransporters, setLoadingTransporters] = useState(false);

  const [values, setValues] = useState({
    // Bid Details
    bidStartingFrom: "",
    bidStartTo: "",
    city: "",
    ceilingAmount: "",
    intervalAmount: "",
    uom: "",
    lastMinutesExtension: "",

    // Material and Transporter
    multiMaterial: "",
    material: "",
    quantity: "",
    extensionQuantity: "",
    displayToTransporter: "",
    selectTransporter: [],

    // Delivery and Allocation
    fromLocation: "",
    toLocation: "",
    route: "",
    autoAllocateTo: "",
    intervalTimeForAllocatingVehicle: "",
    intervalTimeToReachPlant: "",
    gracePeriodToReachPlant: ""
  });

  // Filter transporters based on search term
  const filteredTransporters = transporterOptions.filter(
    t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.includes(searchTerm)
  );

  // Helper function for authentication headers
  const getAuthHeaders = () => {
    const username = process.env.REACT_APP_API_USER_NAME || 'amazin';
    const password = process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK';
    const base64Auth = btoa(`${username}:${password}`);

    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64Auth}`,
      'Accept': 'application/json'
    };
  };


  const fetchTransportersByFlag = async (flag, filterParam) => {
    setLoadingTransporters(true);
    try {

      const actualFilterParam = 'NE25';

      const apiUrl = `http://localhost:8082/api/transporters/allTransportersByFlag?flag=${flag}&filterParam=${actualFilterParam}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      console.log("Transporters API response:", data);

      // Check if data is an array and has items
      if (Array.isArray(data) && data.length > 0) {

        const mappedTransporters = data.map(transporter => ({
          id: transporter.id || transporter.transporterId || transporter.code || "",
          name: transporter.name || transporter.transporterName || ""
        }));
        setTransporterOptions(mappedTransporters);
        setValues(prevValues => ({
          ...prevValues,
          selectTransporter: []
        }));
        setSelectAllTransporters(false);
      }
    } catch (error) {
      toast.error(`Failed to fetch transporters: ${error.message}`, { autoClose: 3000 });
      setTransporterOptions([]);
    } finally {
      setLoadingTransporters(false);
    }
  };


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
      // Reset selected transporters
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: []
      }));


      if (value === 'All') {

        fetchTransportersByFlag('A', '');
      }
      else if (value === 'Route Based') {

        if (values.route !== 'Select') {
          fetchTransportersByFlag('R', values.route);
        } else {

          toast.info("Please select a route first to see route-based transporters.", { autoClose: 3000 });
        }
      } else if (value === 'Plant Based') {


        fetchTransportersByFlag('P', values.fromLocation);

      }
    }

    // // Update related fields for Route or From Location changes
    // if (name === 'route' && values.displayToTransporter === 'Route Based') {
    //   if (value && value !== 'Select') {
    //     fetchTransportersByFlag('R', value);
    //   }
    // }

    // if (name === 'fromLocation' && values.displayToTransporter === 'Plant Based') {
    //   if (value && value !== 'Select') {
    //     fetchTransportersByFlag('P', value);
    //   }
    // }
  };

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const username = process.env.REACT_APP_API_USER_NAME || 'amazin';
        const password = process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK';
        const base64Auth = btoa(`${username}:${password}`);

        const response = await fetch(`http://localhost:8082/locations/filterLocation/and`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${base64Auth}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API returns an array of city objects with a name property
        // Adjust this mapping according to the actual API response structure
        const cities = data.map(city => city.name || city.cityName || city);

        setCityOptions(["Select city", ...cities]);
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Keep the default options in case of error
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleTransporterSelect = (transporter) => {
    // Check if the transporter is already selected by ID
    if (!values.selectTransporter.some(t => t.id === transporter.id)) {
      setValues(prevValues => ({
        ...prevValues,
        selectTransporter: [...prevValues.selectTransporter, transporter]
      }));
    }
  };

  const handleRemoveTransporter = (transporterId, e) => {
    if (e) e.stopPropagation();
    setValues(prevValues => ({
      ...prevValues,
      selectTransporter: prevValues.selectTransporter.filter(t => t.id !== transporterId)
    }));
  };

  // FIXED: Handle select all transporters properly
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
  };

  // FIXED: Check if all filtered transporters are selected
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
  }, [searchTerm, values.selectTransporter]);


  const formatDate = (dateString) => {
    if (!dateString) return "";

    // If the dateString already has the T format
    if (dateString.includes('T')) {
      // Make sure it has seconds for LocalDateTime compatibility
      if (dateString.length === 16) { // Format: "2025-05-09T11:29"
        return dateString + ":00"; // Add seconds: "2025-05-09T11:29:00"
      }
      return dateString;
    }


    // If it's in another format, convert to ISO format with T
    return dateString.replace(' ', 'T') + ":00";
  };
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
  // Function to map form values to API payload
  const mapFormValuesToPayload = () => {
    // Create an array of biddings, one for each selected transporter
    const biddings = values.selectTransporter.map(transporter => {
      // Create the biddingMaster object for this transporter
      const biddingMaster = {
        id: 1,
        //transporterCode: transporter.id, // Each entry gets its own transporter ID
        transporterCode: "TRANS123",
        ceilingPrice: parseFloat(values.ceilingAmount) || 0,
        uom: values.uom || "MT", // Default to MT if not provided
        bidFrom: formatDate(values.bidStartingFrom), // ISO format with T
        bidTo: formatDate(values.bidStartTo), // ISO format with T
        lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
        extentionQuantity: parseInt(values.extensionQuantity) || 0,
        bidUnit: 1,
        addOn: "EXTRA_COST",
        intervalAmount: parseFloat(values.intervalAmount) || 0,
        noOfInput: 3,
        intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
        intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
        gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
        status: "A",
        autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
        bid: 1,
        bidType: "STANDARD",
        biddingOrderNo: `ORD-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        route: parseFloat(values.route) || 0,
        multiMaterial: values.multiMaterial === "Yes" ? 1 : 0,
        city: values.city || "",
        material: values.material || "Steel", // Default to Steel if not provided
        quantity: parseInt(values.quantity) || 0,
        extentionQty: parseInt(values.extensionQuantity) || 0,
        autoAllocationSalesOrder: 1,
        fromLocation: values.fromLocation || "Location A", // Default if missing
        toLocation: values.toLocation || "Location B" // Default if missing
      };

      return {
        biddingMaster: biddingMaster,
        salesOrders: null
      };
    });

    // If no transporters are selected, create a single entry with blank transporterCode
    if (biddings.length === 0) {
      biddings.push({
        biddingMaster: {
          id: 1,
          transporterCode: "TRANS123",
          ceilingPrice: parseFloat(values.ceilingAmount) || 0,
          uom: values.uom || "MT", // Default to MT if not provided
          bidFrom: formatDate(values.bidStartingFrom), // ISO format with T
          bidTo: formatDate(values.bidStartTo), // ISO format with T
          lastTimeExtension: timeToMinutes(values.lastMinutesExtension),
          extentionQuantity: parseInt(values.extensionQuantity) || 0,
          bidUnit: 1,
          addOn: "EXTRA_COST",
          intervalAmount: parseFloat(values.intervalAmount) || 0,
          noOfInput: 3,
          intervalAllocate: timeToMinutes(values.intervalTimeForAllocatingVehicle),
          intervalReach: timeToMinutes(values.intervalTimeToReachPlant),
          gracePeriod: timeToMinutes(values.gracePeriodToReachPlant),
          status: "A",
          autoAllocation: values.autoAllocateTo === "Yes" ? 1 : 0,
          bid: 1,
          bidType: "STANDARD",
          biddingOrderNo: `ORD-${Date.now()}`,
          createdDate: new Date().toISOString().split('T')[0],
          route: parseFloat(values.route) || 0,
          multiMaterial: values.multiMaterial === "Yes" ? 1 : 0,
          city: values.city || "",
          material: values.material || "Steel", // Default to Steel if not provided
          quantity: parseInt(values.quantity) || 0,
          extentionQty: parseInt(values.extensionQuantity) || 0,
          autoAllocationSalesOrder: 1,
          fromLocation: values.fromLocation || "Location A", // Default if missing
          toLocation: values.toLocation || "Location B" // Default if missing
        },
        salesOrders: null
      });
    }

    // Now construct the bulk payload structure
    return {
      bulk: true,
      biddings: biddings
    };
  };

  // Function to submit the form data to the API
  const submitFormData = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = mapFormValuesToPayload();
      console.log("Submitting payload:", payload);

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8085 || 'http://localhost:8085'}/biddingMaster/bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Show success toast with 3 second auto-close
      toast.success("Your bid has been created successfully!", { autoClose: 3000 });

      // Show success modal
      setShowSuccessModal(true);

      // After successful submission, go to Finish step
      setActiveStep(4);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(error.message);

      // Dismiss any existing toasts first
      toast.dismiss();

      // Show error toast with 3 second auto-close
      toast.error("Something went wrong!", {
        toastId: 'error-toast', // Add a unique ID to prevent multiple toasts
        style: {
          background: '#fff',
          color: '#000',
          opacity: 1,
        },
        toastClassName: "custom-toast-error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated handleSubmit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with values:", values);

    // If we're at the Delivery and Allocation step (index 2)
    if (activeStep === 2) {
      // Initialize validation errors object
      const validationErrors = {};

      // Check required fields for Delivery and Allocation step
      if (!values.fromLocation || values.fromLocation === "Select") {
        validationErrors.fromLocation = "Please select from location";
      }

      if (!values.toLocation || values.toLocation === "Select") {
        validationErrors.toLocation = "Please select to location";
      }

      if (!values.route || values.route === "Select") {
        validationErrors.route = "Please select a route";
      }

      if (!values.intervalTimeForAllocatingVehicle) {
        validationErrors.intervalTimeForAllocatingVehicle = "Please select a date";
      }

      if (!values.intervalTimeToReachPlant) {
        validationErrors.intervalTimeToReachPlant = "Please select a date";
      }

      if (!values.gracePeriodToReachPlant) {
        validationErrors.gracePeriodToReachPlant = "Please select a date";
      }

      // Update the errors state
      setErrors(validationErrors);

      // If there are validation errors, don't proceed
      if (Object.keys(validationErrors).length > 0) {
        console.log("Validation errors:", validationErrors);
        return;
      }

      // If validation passes, proceed to Preview
      setActiveStep(3); // This will be Preview
    } else if (activeStep === 3) {
      // If we're at Preview, submit to API
      await submitFormData();
      // After successful submission, go to Finish
      if (!submitError) {
        setActiveStep(4);
      }
    } else {
      // For other steps, just go to next step
      setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
    }
  };

  const handleBackPage = () => {
    // Navigate to previous step
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const handleBackToCreateBid = () => {
    // Reset form and go back to first step
    setActiveStep(0);
    setShowSuccessModal(false);
    setValues({
      bidStartingFrom: "",
      bidStartTo: "",
      city: "",
      ceilingAmount: "",
      intervalAmount: "",
      uom: "",
      lastMinutesExtension: "",
      multiMaterial: "",
      material: "",
      quantity: "",
      extensionQuantity: "",
      displayToTransporter: "",
      selectTransporter: [],
      fromLocation: "",
      toLocation: "",
      route: "",
      autoAllocateTo: "",
      intervalTimeForAllocatingVehicle: "",
      intervalTimeToReachPlant: "",
      gracePeriodToReachPlant: ""
    });
    // Clear any validation errors
    setErrors({});
  };

  // Success Modal
  const SuccessModal = () => (
    <div className="bulk-order-modal-overlay">
      <div className="bulk-order-modal-content">
        <div className="bulk-order-modal-icon">
          <lord-icon
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#405189"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
        </div>
        <h3 className="bulk-order-modal-title">
          Your <span style={{color:"blue"}}> {bidNo}</span> has been created !
        </h3>
        <button
          type="button"
          className="bulk-order-modal-button"
          onClick={handleBackToCreateBid}
        >
          Back to Create Bid
        </button>
      </div>
    </div>
  );


  return (
    <>
      {/* Material UI Stepper with custom connector for green lines */}
      <div className="bulk-order-stepper-container">
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
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Bid Starting From <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartingFrom"
                    value={values.bidStartingFrom}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-input"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Bid Start To  <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="datetime-local"
                    name="bidStartTo"
                    value={values.bidStartTo}
                    onChange={handleInputChange}
                    className="bulk-order-input"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  City
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="city"
                    value={values.city}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                    disabled={loadingCities}
                  >
                    {loadingCities ? (
                      <option>Loading cities...</option>
                    ) : (
                      cityOptions.map((city, index) => (
                        <option key={index} value={city} style={{ color: "#000" }}>
                          {city}
                        </option>
                      ))
                    )}
                  </Input>
                  {loadingCities && (
                    <div style={{ position: "absolute", right: "10px", top: "8px", color: "#aaa" }}>
                      <i className="ri-loader-4-line spin"></i>
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Ceiling Amount
                </Label>
                <Input
                  type="number"
                  placeholder="Add Amount"
                  name="ceilingAmount"
                  value={values.ceilingAmount}
                  onChange={handleInputChange}
                  required
                  className="bulk-order-input"
                  style={{ color: "#000" }}
                />
              </div>
            </div>

            {/* Second row: 3 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval Amount <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Add Amount"
                  name="intervalAmount"
                  value={values.intervalAmount}
                  onChange={handleInputChange}
                  required
                  className="bulk-order-input"
                  style={{ color: "#000" }}
                />
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  UOM <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="uom"
                    value={values.uom}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {uomOptions.map((uom, index) => (
                      <option key={index} value={uom} style={{ color: "#000" }}>
                        {uom}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Last Minutes Extension
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder=" --:--:--"
                    name="lastMinutesExtension"
                    value={values.lastMinutesExtension}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className={`bulk-order-button bulk-order-back-button ${activeStep === 0 ? 'disabled' : ''}`}
                onClick={handleBackPage}
                disabled={activeStep === 0}
                style={{ opacity: activeStep === 0 ? "0.6" : "1" }}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Material and Transporter Step */}
        {activeStep === 1 && (
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Multi Material <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="multiMaterial"
                    disabled
                    value={values.multiMaterial}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {multiMaterialOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Material <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="material"
                    value={values.material}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {materialOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Quantity <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Add Quantity"
                  name="quantity"
                  value={values.quantity}
                  onChange={handleInputChange}
                  required
                  className="bulk-order-input"
                  style={{ color: "#000" }}
                />
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Extension Quantity <span style={{ color: "red" }}>*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Add Quantity"
                  name="extensionQuantity"
                  value={values.extensionQuantity}
                  onChange={handleInputChange}
                  required
                  className="bulk-order-input"
                  style={{ color: "#000" }}
                />
              </div>
            </div>

            {/* Second row: 2 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Display To Transporter <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="displayToTransporter"
                    value={values.displayToTransporter}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {displayToTransporterOptions.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        style={{ color: "#000" }}
                      >
                        {option}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Select Transporter <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <div
                      className="bulk-order-transporter-selector"
                      onClick={() => setShowTransporterDropdown(!showTransporterDropdown)}
                      style={{
                        height: "38px",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        padding: "0.375rem 0.75rem",
                        backgroundColor: "#fff"
                      }}
                    >
                      {/* Display correct count of selected transporters */}
                      <span className="bulk-order-transporter-selector-placeholder" style={{ color: "#000" }}>
                        {values.selectTransporter.length > 0
                          ? `${values.selectTransporter.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).length} Selected`
                          : 'Select'}
                      </span>
                      <span style={{ marginLeft: "auto" }}>
                        <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                      </span>
                    </div>

                    {/* Transporter dropdown with select all functionality */}
                    {showTransporterDropdown && (
                      <div className="bulk-order-dropdown" style={{
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
                        {/* Search header with clean styling */}
                        <div className="bulk-order-dropdown-header" style={{
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
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="bulk-order-dropdown-search"
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

                        {/* Transporter list items */}
                        {!loadingTransporters && filteredTransporters.length > 0 && (
                          <div className="bulk-order-dropdown-content">
                            {filteredTransporters.map((transporter, index) => (
                              <div
                                key={index}
                                className="bulk-order-dropdown-item"
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
                                    handleTransporterSelect(transporter); // Pass the whole transporter object
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
                                        handleTransporterSelect(transporter); // Pass the whole transporter object
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

                  {/* Add the TransporterViewer component if there are any selected transporters */}
                  {values.selectTransporter.length > 0 && (
                    <TransporterViewer
                      selectedTransporters={values.selectTransporter}
                      onRemove={(transporterId) => {
                        handleRemoveTransporter(transporterId, new Event('click'));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
                style={{
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px"
                }}
              >
                Save & Next <i className="ri-arrow-right-line ms-1" style={{ marginLeft: "8px" }}></i>
              </button>
            </div>
          </div>
        )}

        {/* Delivery and Allocation Step */}
        {activeStep === 2 && (
          <div className="bulk-order-container">
            {/* First row: 4 fields */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  From Location <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="fromLocation"
                    value={values.fromLocation}
                    onChange={handleInputChange}
                    required
                    className={`bulk-order-select ${errors.fromLocation ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.fromLocation ? "#dc3545" : "",
                      borderWidth: errors.fromLocation ? "2px" : ""
                    }}
                  >
                    {locationOptions.map((location, index) => (
                      <option key={index} value={location} style={{ color: "#000" }}>
                        {location}
                      </option>
                    ))}
                  </Input>
                  {errors.fromLocation && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.fromLocation}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  To Location <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="toLocation"
                    value={values.toLocation}
                    onChange={handleInputChange}
                    required
                    className={`bulk-order-select ${errors.toLocation ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.toLocation ? "#dc3545" : "",
                      borderWidth: errors.toLocation ? "2px" : ""
                    }}
                  >
                    {locationOptions.map((location, index) => (
                      <option key={index} value={location} style={{ color: "#000" }}>
                        {location}
                      </option>
                    ))}
                  </Input>
                  {errors.toLocation && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.toLocation}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Route <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="route"
                    value={values.route}
                    onChange={handleInputChange}
                    required
                    className={`bulk-order-select ${errors.route ? "is-invalid" : ""}`}
                    style={{
                      color: "#000",
                      borderColor: errors.route ? "#dc3545" : "",
                      borderWidth: errors.route ? "2px" : ""
                    }}
                  >
                    {routeOptions.map((route, index) => (
                      <option key={index} value={route} style={{ color: "#000" }}>
                        {route}
                      </option>
                    ))}
                  </Input>
                  {errors.route && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.route}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Auto Allocate To L1
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="select"
                    name="autoAllocateTo"
                    value={values.autoAllocateTo}
                    onChange={handleInputChange}
                    className="bulk-order-select"
                    style={{ color: "#000" }}
                  >
                    {autoAllocateToOptions.map((option, index) => (
                      <option key={index} value={option} style={{ color: "#000" }}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </div>
              </div>
            </div>

            {/* Second row: 3 fields with TIME inputs - with BLACK placeholder text */}
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval time for Allocating Vehicle <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="intervalTimeForAllocatingVehicle"
                    value={values.intervalTimeForAllocatingVehicle}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Interval time for to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="intervalTimeToReachPlant"
                    value={values.intervalTimeToReachPlant}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">
                  Grace Period to reach plant <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    type="time"
                    placeholder="--:--:--"
                    name="gracePeriodToReachPlant"
                    value={values.gracePeriodToReachPlant}
                    onChange={handleInputChange}
                    required
                    className="bulk-order-input black-placeholder"
                    style={{ color: "#000" }}
                  />
                </div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button
                type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-next-button"
              >
                Save & Next <i className="ri-arrow-right-line ms-1"></i>
              </button>
            </div>
          </div>
        )}

        {/* Preview Step (not in stepper but comes after Delivery and Allocation) */}
        {activeStep === 3 && (
          <div className="bulk-order-container">
            {/* Bid Details Section */}
            <div className="bulk-order-section-title">Bid Details</div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Bid Starting From</Label>
                <div className="bulk-order-value-text">{values.bidStartingFrom || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Bid Start To</Label>
                <div className="bulk-order-value-text">{values.bidStartTo || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">City</Label>
                <div className="bulk-order-value-text">{values.city || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Ceiling Amount</Label>
                <div className="bulk-order-value-text">{values.ceilingAmount || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval Amount</Label>
                <div className="bulk-order-value-text">{values.intervalAmount || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">UOM</Label>
                <div className="bulk-order-value-text">{values.uom || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Last Minutes Extension</Label>
                <div className="bulk-order-value-text">{values.lastMinutesExtension || "—"}</div>
              </div>
            </div>

            {/* Material and Transporter Section */}
            <div className="bulk-order-section-title">Material and Transporter</div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Multi Material</Label>
                <div className="bulk-order-value-text">{values.multiMaterial || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Material</Label>
                <div className="bulk-order-value-text">{values.material || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Quantity</Label>
                <div className="bulk-order-value-text">{values.quantity || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Extension Quantity</Label>
                <div className="bulk-order-value-text">{values.extensionQuantity || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Display To Transporter</Label>
                <div className="bulk-order-value-text">{values.displayToTransporter || "—"}</div>
              </div>

              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Select Transporter</Label>
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
              {/* Add Modal component that will be shown when viewing transporters from preview */}
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
            </div>

            {/* Delivery and Allocation Section */}
            <div className="bulk-order-section-title">Delivery and Allocation</div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">From Location</Label>
                <div className="bulk-order-value-text">{values.fromLocation || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">To Location</Label>
                <div className="bulk-order-value-text">{values.toLocation || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Route</Label>
                <div className="bulk-order-value-text">{values.route || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Auto Allocate To L1</Label>
                <div className="bulk-order-value-text">{values.autoAllocateTo || "—"}</div>
              </div>
            </div>
            <div className="bulk-order-row">
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval time for Allocating Vehicle</Label>
                <div className="bulk-order-value-text">{values.intervalTimeForAllocatingVehicle || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Interval time to reach plant</Label>
                <div className="bulk-order-value-text">{values.intervalTimeToReachPlant || "—"}</div>
              </div>
              <div className="bulk-order-form-group">
                <Label className="bulk-order-label">Grace Period to reach plant</Label>
                <div className="bulk-order-value-text">{values.gracePeriodToReachPlant || "—"}</div>
              </div>
            </div>

            <div className="bulk-order-button-container">
              <button type="button"
                className="bulk-order-button bulk-order-back-button"
                onClick={handleBackPage}
              >
                <i className="ri-arrow-left-line me-1"></i> Back
              </button>
              <button
                type="submit"
                className="bulk-order-button bulk-order-submit-button"
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

        {/* Finish Step - This is shown in the stepper as step 4 */}
        {activeStep === 4 && (
          <div className="bulk-order-finish-container">

            <button
              type="button"
              className="bulk-order-finish-button"
              onClick={handleBackToCreateBid}
            >
              Back to Create Bid
            </button>
          </div>
        )}
      </Form>
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

export default BulkOrder;