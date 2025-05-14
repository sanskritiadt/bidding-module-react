import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, Label } from "reactstrap";
import { Stepper, Step, StepLabel, StepConnector } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './BulkOrder.css'; // Import the CSS file
import TransporterViewer from "./TransporterViewer/TransporterViewer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

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

const BulkOrder = ({ bidNo }) => {
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

  const [materialOptions, setMaterialOptions] = useState([]);
  useEffect(() => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const plantCode = obj?.data?.plantCode;

    const fetchMaterials = async () => {
      try {
        const rawResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/materials?plantCode=${plantCode}`,
          config
        );
        console.log("RAW API Response:", rawResponse);

        let materialData = [];

        if (Array.isArray(rawResponse)) {
          materialData = rawResponse;
        } else if (Array.isArray(rawResponse.data)) {
          materialData = rawResponse.data;
        } else if (rawResponse.data && Array.isArray(rawResponse.data.data)) {
          materialData = rawResponse.data.data;
        } else {
          console.warn("Unexpected material response format", rawResponse);
          materialData = [];
        }

        const materialNames = materialData.map(item => item.name);
        console.log("Mapped material names:", materialNames);

        if (!materialNames.length) {
          console.log("No materials found. Setting default values.");
          setMaterialOptions(["Default Material 1", "Default Material 2"]);
        } else {
          setMaterialOptions(materialNames);
        }

      } catch (error) {
        console.error("Error fetching materials:", error);
        setMaterialOptions(["Default Material 1", "Default Material 2"]);
      }
    };

    if (plantCode) {
      fetchMaterials();
    }
  }, []);


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
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [citiesData, setCitiesData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [materialSearchTerm, setMaterialSearchTerm] = useState("");
  const [showFromLocationDropdown, setShowFromLocationDropdown] = useState(false);
  const [showToLocationDropdown, setShowToLocationDropdown] = useState(false);
  const [fromLocationSearchTerm, setFromLocationSearchTerm] = useState("");
  const [toLocationSearchTerm, setToLocationSearchTerm] = useState("");

  const [routeOptions, setRouteOptions] = useState([]);
  const [showRouteDropdown, setShowRouteDropdown] = useState(false);
  const [routeSearchTerm, setRouteSearchTerm] = useState("");
  const [loadingRoutes, setLoadingRoutes] = useState(false);



  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Get plantCode from sessionStorage
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        const plantCode = obj?.data?.plantCode || 'N205';

        setLoadingRoutes(true);

        // Use full configuration for debugging
        const axiosConfig = {
          ...config,
          headers: {
            ...config.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },

        };

        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/routes?plantCode=${plantCode}`,
          axiosConfig
        );

        console.log("response Route====>>>>>>>>>", response);

        // Initialize route data
        let routeData = ['Select'];

        // Multiple parsing strategies
        const parseStrategies = [
          () => response.data?.data?.map(route => route.routeName),
          () => response.data?.map(route => route.routeName),
          () => response.data?.data?.map(route => route.routeCode),
          () => response.map(route => route.routeName)
        ];

        // Try each parsing strategy
        for (let strategy of parseStrategies) {
          try {
            const parsedRoutes = strategy();
            if (parsedRoutes && parsedRoutes.length > 0) {
              routeData = [...parsedRoutes.filter(r => r)];
              break;
            }
          } catch (strategyError) {
            console.warn("Strategy failed:", strategyError);
          }
        }

        console.log("Final Parsed Routes:", routeData);

        // Update route options
        if (routeData.length > 0) {
          setRouteOptions(routeData);
        } else {
          console.warn("No routes found in the API response");
          setRouteOptions(['Select']);
        }

      } catch (error) {
        console.error("Comprehensive Route Fetch Error:", {
          message: error.message,
          response: error.response,
          request: error.request
        });

        // Set fallback
        setRouteOptions(['Select']);

        // Optional: Toast or error notification
        toast.error("Failed to load routes. Please try again.", {
          position: "top-right",
          autoClose: 3000
        });
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutes();
  }, []); // No dependencies to run once on mount

  // Existing filteredRoutes logic remains the same
  const filteredRoutes = useMemo(() => {
    if (!routeSearchTerm || routeSearchTerm.trim() === '') {
      return routeOptions;
    }

    const searchTermLower = routeSearchTerm.toLowerCase();
    return routeOptions.filter(route =>
      route && route.toLowerCase().includes(searchTermLower)
    );
  }, [routeOptions, routeSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showRouteDropdown && !event.target.closest('.route-dropdown-container')) {
        setShowRouteDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRouteDropdown]);

  const filteredFromLocations = useMemo(() => {
    if (!fromLocationSearchTerm || fromLocationSearchTerm.trim() === '') {
      return citiesData;
    }

    const searchTermLower = fromLocationSearchTerm.toLowerCase();
    return citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );
  }, [citiesData, fromLocationSearchTerm]);

  const filteredToLocations = useMemo(() => {
    if (!toLocationSearchTerm || toLocationSearchTerm.trim() === '') {
      return citiesData;
    }

    const searchTermLower = toLocationSearchTerm.toLowerCase();
    return citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );
  }, [citiesData, toLocationSearchTerm]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (showFromLocationDropdown && !event.target.closest('.from-location-dropdown-container')) {
        setShowFromLocationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFromLocationDropdown]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showToLocationDropdown && !event.target.closest('.to-location-dropdown-container')) {
        setShowToLocationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToLocationDropdown]);

  const filteredMaterials = useMemo(() => {
    if (!materialSearchTerm || materialSearchTerm.trim() === '') {
      return materialOptions;
    }

    const searchTermLower = materialSearchTerm.toLowerCase();
    return materialOptions.filter(material =>
      material && material.toLowerCase().includes(searchTermLower)
    );
  }, [materialOptions, materialSearchTerm]);

  const filteredCities = useMemo(() => {
    console.log("Search term:", citySearchTerm);
    console.log("Available cities data:", citiesData);

    // When no search term, show all cities
    if (!citySearchTerm || citySearchTerm.trim() === '') {
      return citiesData;
    }

    // Filter with any length search term (no minimum characters required)
    const searchTermLower = citySearchTerm.toLowerCase();
    const filtered = citiesData.filter(city =>
      city && city.toLowerCase().includes(searchTermLower)
    );

    console.log("Filtered results:", filtered);
    return filtered;
  }, [citiesData, citySearchTerm]);




  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showCityDropdown && !event.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityDropdown]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (showMaterialDropdown && !event.target.closest('.bulk-order-material-selector') &&
        !event.target.closest('.bulk-order-dropdown')) {
        setShowMaterialDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMaterialDropdown]);
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
  const filteredTransporters = useMemo(() => {
    const filtered = transporterOptions.filter(
      t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm)
    );
    console.log("FILTERED TRANSPORTERS CALCULATED:", {
      transporterOptions: transporterOptions.length,
      filtered: filtered.length,
      searchTerm
    });
    return filtered;
  }, [transporterOptions, searchTerm]);



  // const obj = JSON.parse(sessionStorage.getItem("authUser"));
  // let plantcode = obj.data.plantCode;

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
      // Use the actual parameter or default
      //    let actualFilterParam = filterParam;
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantcode = obj.data.plantCode;


      const apiUrl = `${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/allTransportersByFlag?flag=${flag}&filterParam=${plantcode}`;
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
        // Map the API response fields to match your requirements
        const mappedTransporters = result.data.map(transporter => ({
          id: transporter.code,
          name: transporter.name.trim() // Trim to remove extra spaces
        }));

        console.log("Mapped transporters:", mappedTransporters);

        // Update the state
        setTransporterOptions(mappedTransporters);
        setShowTransporterDropdown(true);
      } else {
        setTransporterOptions([]);

      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
      toast.error(`Failed to fetch transporters: ${error.message}`, { autoClose: 3000 });
      setTransporterOptions([]);
    } finally {
      setLoadingTransporters(false);
    }
  };


  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update the values state
  //   setValues(prevValues => {
  //     const newValues = {
  //       ...prevValues,
  //       [name]: value === 'Select' ? '' : value
  //     };

  //     // These console logs will help debug
  //     if (name === 'displayToTransporter' || name === 'route' || name === 'fromLocation') {
  //       console.log(`Changed ${name} to "${value}"`);
  //       console.log(`Current values: fromLocation=${newValues.fromLocation}, route=${newValues.route}, displayToTransporter=${newValues.displayToTransporter}`);
  //     }

  //     return newValues;
  //   });

  //   // Clear the error for this field if it exists
  //   if (errors[name]) {
  //     setErrors(prevErrors => {
  //       const newErrors = { ...prevErrors };
  //       delete newErrors[name];
  //       return newErrors;
  //     });
  //   }

  //   // Handle special case for Display To Transporter dropdown
  //   if (name === 'displayToTransporter') {
  //     // Reset selected transporters when changing display mode
  //     setValues(prevValues => ({
  //       ...prevValues,
  //       selectTransporter: []
  //     }));

  //     if (value === 'All') {
  //       const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //       let plantCode1 = obj.data.plantCode;

  //       fetchTransportersByFlag('A', plantCode1);
  //     }
  //     else if (value === 'Route Based') {
  //       if (values.route && values.route !== 'Select') {
  //         fetchTransportersByFlag('R', values.route);
  //       }
  //     }
  //     else if (value === 'Plant Based') {
  //       if (values.fromLocation && values.fromLocation !== 'Select') {
  //         fetchTransportersByFlag('P', values.fromLocation);
  //       } 
  //     }
  //   }

  //   // Update related fields for Route changes
  //   if (name === 'route' && values.displayToTransporter === 'Route Based') {
  //     if (value && value !== 'Select') {
  //       fetchTransportersByFlag('R', value);
  //     }
  //   }

  //   // Update related fields for From Location changes
  //   if (name === 'fromLocation' && values.displayToTransporter === 'Plant Based') {
  //     if (value && value !== 'Select') {
  //       fetchTransportersByFlag('P', value);
  //     }
  //   }
  // };

  // Create a config similar to your existing config
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update the values state
  //   setValues(prevValues => {
  //     const newValues = {
  //       ...prevValues,
  //       [name]: value === 'Select' ? '' : value
  //     };

  //     // These console logs will help debug
  //     if (name === 'displayToTransporter' || name === 'route' || name === 'fromLocation') {
  //       console.log(`Changed ${name} to "${value}"`);
  //       console.log(`Current values: fromLocation=${newValues.fromLocation}, route=${newValues.route}, displayToTransporter=${newValues.displayToTransporter}`);
  //     }

  //     return newValues;
  //   });

  //   // Clear the error for this field if it exists
  //   if (errors[name]) {
  //     setErrors(prevErrors => {
  //       const newErrors = { ...prevErrors };
  //       delete newErrors[name];
  //       return newErrors;
  //     });
  //   }

  //   // Handle special case for Display To Transporter dropdown
  //   if (name === 'displayToTransporter') {
  //     // Reset selected transporters when changing display mode
  //     setValues(prevValues => ({
  //       ...prevValues,
  //       selectTransporter: []
  //     }));
  //     const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //     let plantCode1 = obj.data.plantCode;
  //     if (value === 'All') {


  //       fetchTransportersByFlag('A', plantCode1);
  //     }
  //     else if (value === 'Route Based') {

  //       fetchTransportersByFlag('R', plantCode1);

  //     }
  //     else if (value === 'Plant Based') {

  //       fetchTransportersByFlag('P', plantCode1);

  //     }
  //   }

  //   // Update related fields for Route changes
  //   if (name === 'route' && values.displayToTransporter === 'Route Based') {
  //     if (value && value !== 'Select') {
  //       fetchTransportersByFlag('R', value);
  //     }
  //   }

  //   // Update related fields for From Location changes
  //   if (name === 'fromLocation' && values.displayToTransporter === 'Plant Based') {
  //     if (value && value !== 'Select') {
  //       fetchTransportersByFlag('P', value);
  //     }
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the values state
    setValues(prevValues => {
      const newValues = {
        ...prevValues,
        [name]: value === 'Select' ? '' : value
      };

      // These console logs will help debug
      if (name === 'displayToTransporter' || name === 'route' || name === 'fromLocation') {
        console.log(`Changed ${name} to "${value}"`);
        console.log(`Current values: fromLocation=${newValues.fromLocation}, route=${newValues.route}, displayToTransporter=${newValues.displayToTransporter}`);
      }

      return newValues;
    });

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

      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      let plantCode1 = obj.data.plantCode;

      if (value === 'All') {
        fetchTransportersByFlag('A', plantCode1);
      }
      else if (value === 'Route Based') {
        fetchTransportersByFlag('R', plantCode1);
      }
      else if (value === 'Plant Based') {
        fetchTransportersByFlag('P', plantCode1);
      }
      else if (value === 'Select' || value === '') {
        // Clear the transporter options when 'Select' is chosen
        setTransporterOptions([]);
        setShowTransporterDropdown(false);
      }
    }

    // Update related fields for Route changes
    if (name === 'route' && values.displayToTransporter === 'Route Based') {
      if (value && value !== 'Select') {
        fetchTransportersByFlag('R', value);
      }
    }

    // Update related fields for From Location changes
    if (name === 'fromLocation' && values.displayToTransporter === 'Plant Based') {
      if (value && value !== 'Select') {
        fetchTransportersByFlag('P', value);
      }
    }
  };


  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    auth: {
      username: process.env.REACT_APP_API_USER_NAME || 'amazin',
      password: process.env.REACT_APP_API_PASSWORD || 'TE@M-W@RK'
    }
  };
  const extractCitiesFromData = (data) => {
    let cities = [];

    // Handle case where data is an array containing objects with cityName
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item && typeof item === 'object') {
          if (item.cityName) {
            cities.push(item.cityName);
          }
        }
      });
    }

    // If we have no cities yet, try to extract from a nested data structure
    if (cities.length === 0 && data) {
      // Check if data has a nested structure with cityName properties
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item && item.cityName) {
            cities.push(item.cityName);
          }
        });
      }
    }

    // Based on your screenshot, the response might contain a special format
    // with cityName in each object of an array
    if (cities.length === 0 && typeof data === 'object') {
      // Try to find cityName in a more nested structure
      if (data.meta && data.data && Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (item && item.cityName) {
            cities.push(item.cityName);
          }
        });
      }
    }

    return cities;
  };

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const rawResponse = await axios.get(
          `${process.env.REACT_APP_LOCAL_URL_8082}/locations/filterLocation/a`,
          config
        );

        console.log("RAW API Response:", rawResponse);

        // If rawResponse is already an array (as seen in logs)
        let locationData = rawResponse;

        // OR, if Axios returns the full object and data is an array directly
        if (Array.isArray(rawResponse)) {
          locationData = rawResponse;
        } else if (Array.isArray(rawResponse.data)) {
          locationData = rawResponse.data;
        } else if (rawResponse.data && Array.isArray(rawResponse.data.data)) {
          locationData = rawResponse.data.data;
        } else {
          console.warn("Unexpected response format", rawResponse);
          locationData = [];
        }

        const cities = locationData.map(item => item.cityName);
        console.log("Mapped city names:", cities);

        if (!cities.length) {
          console.log("Fallback cities used");
          setCitiesData(["UJJAIN", "INDORE"]);
        } else {
          setCitiesData(cities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCitiesData(["UJJAIN", "INDORE"]);
      } finally {
        setLoadingCities(false);
      }
    };


    fetchCities();
  }, []);



  const handleTransporterSelect = (transporter) => {
    console.log("Selecting transporter:", transporter);

    // Check if the transporter is already selected by ID
    if (!values.selectTransporter.some(t => t.id === transporter.id)) {
      setValues(prevValues => {
        const newSelection = [...prevValues.selectTransporter, transporter];
        console.log("Updated selection:", newSelection);
        return {
          ...prevValues,
          selectTransporter: newSelection
        };
      });
    } else {
      console.log("Transporter already selected, skipping");
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
    // This ensures filteredTransporters is always up-to-date with transporterOptions
    console.log("transporterOptions changed:", transporterOptions);

    // Since searchTerm might not have changed, we need to manually update the filtered list
    const newFilteredTransporters = transporterOptions.filter(
      t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm)
    );

    console.log("New filtered transporters:", newFilteredTransporters);

    // If this doesn't trigger a re-render, we might need to use a different approach
  }, [transporterOptions, searchTerm]);


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
  // Function to map form values to API payload
  const mapFormValuesToPayload = () => {
    // Remove duplicates from the selected transporters before creating the biddings
    const uniqueTransporters = [...new Map(values.selectTransporter.map(item => [item.id, item])).values()];

    // Create an array of biddings, one for each selected transporter
    const biddings = uniqueTransporters.map(transporter => {
      // Extract the numeric part from route if possible
      let routeValue = 0;
      if (values.route && values.route !== "Select") {
        // Try to extract number from route string (e.g. "Route 2" -> 2)
        const routeMatch = values.route.match(/\d+/);
        if (routeMatch) {
          routeValue = parseFloat(routeMatch[0]);
        }
      }

      // Create the biddingMaster object for this transporter
      const biddingMaster = {
        id: 1,
        transporterCode: transporter.id, // Use the transporter ID from selection
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
        route: routeValue, // Use the numeric value instead of the string
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
      // Extract the numeric part from route if possible
      let routeValue = 0;
      if (values.route && values.route !== "Select") {
        // Try to extract number from route string (e.g. "Route 2" -> 2)
        const routeMatch = values.route.match(/\d+/);
        if (routeMatch) {
          routeValue = parseFloat(routeMatch[0]);
        }
      }

      biddings.push({
        biddingMaster: {
          id: 1,
          transporterCode: "",
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
          route: routeValue, // Use the numeric value instead of the string
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

      const response = await fetch(`${process.env.REACT_APP_LOCAL_URL_8082}/biddingMaster/bulk`, {
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
          Your <span style={{ color: "blue" }}> {bidNo}</span> has been created !
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


              <div className="bulk-order-form-group city-dropdown-container">
                <Label className="bulk-order-label">
                  City
                </Label>
                <div style={{ position: "relative" }}>
                  {/* Main selector that shows the current selection */}
                  <div
                    className="bulk-order-city-selector"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
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
                    <span className="bulk-order-city-selector-placeholder" style={{ color: "#000" }}>
                      {values.city || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {/* City dropdown with search functionality */}
                  {showCityDropdown && (
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
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>

                        <input
                          type="text"
                          placeholder="Search"
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()} // This prevents the dropdown from closing
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingCities && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading cities...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingCities && filteredCities.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No cities found</div>
                        </div>
                      )}

                      {/* City list items styled to match transporter style */}
                      {!loadingCities && filteredCities.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredCities.map((city, index) => (
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
                                setValues(prevValues => ({
                                  ...prevValues,
                                  city: city
                                }));
                                setCitySearchTerm("");
                                setShowCityDropdown(false);
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {city}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                  {/* Main material selector that shows the current selection */}
                  <div
                    className="bulk-order-material-selector"
                    onClick={() => setShowMaterialDropdown(!showMaterialDropdown)}
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
                    <span className="bulk-order-material-selector-placeholder" style={{ color: "#000" }}>
                      {values.material || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {/* Material dropdown with search functionality */}
                  {showMaterialDropdown && (
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
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={materialSearchTerm}
                          onChange={(e) => setMaterialSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Material list items */}
                      <div className="bulk-order-dropdown-content">
                        {filteredMaterials.map((material, index) => (
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
                              setValues(prevValues => ({
                                ...prevValues,
                                material: material
                              }));
                              setMaterialSearchTerm("");
                              setShowMaterialDropdown(false);
                            }}
                          >
                            <div style={{
                              flex: 1,
                              fontSize: "14px",
                              paddingLeft: "10px"
                            }}>
                              {material}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    {/* Transporter dropdown list with checkboxes as shown in figma */}
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
                        {/* Search header */}
                        <div className="bulk-order-dropdown-header" style={{
                          padding: "8px",
                          backgroundColor: "#fff",
                          borderBottom: "1px solid #ddd"
                        }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ flex: "0 0 40px", display: "flex", justifyContent: "center" }}>
                              <input
                                type="checkbox"
                                checked={areAllFilteredTransportersSelected()}
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

                        {/* Loading indicator */}
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

                        {/* Empty state */}
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

                        {/* Transporter list items styled to match figma design */}
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
                <div style={{ position: "relative" }} className="from-location-dropdown-container">
                  {/* Main selector that shows the current selection */}
                  <div
                    className="bulk-order-location-selector"
                    onClick={() => setShowFromLocationDropdown(!showFromLocationDropdown)}
                    style={{
                      height: "38px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      //border: "1px solid #ced4da",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                      // borderColor: errors.fromLocation ? "#dc3545" : "",
                      // borderWidth: errors.fromLocation ? "2px" : ""
                    }}
                  >
                    <span className="bulk-order-location-selector-placeholder" style={{ color: "#000" }}>
                      {values.fromLocation || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {/* From Location dropdown with search functionality */}
                  {showFromLocationDropdown && (
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
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={fromLocationSearchTerm}
                          onChange={(e) => setFromLocationSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingCities && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading locations...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingCities && filteredFromLocations.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No locations found</div>
                        </div>
                      )}

                      {/* From Location list items */}
                      {!loadingCities && filteredFromLocations.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredFromLocations.map((location, index) => (
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
                                setValues(prevValues => ({
                                  ...prevValues,
                                  fromLocation: location
                                }));
                                setFromLocationSearchTerm("");
                                setShowFromLocationDropdown(false);
                                // Clear error if it exists
                                if (errors.fromLocation) {
                                  setErrors(prevErrors => {
                                    const newErrors = { ...prevErrors };
                                    delete newErrors.fromLocation;
                                    return newErrors;
                                  });
                                }
                                // Update transporters if Plant Based is selected
                                if (values.displayToTransporter === 'Plant Based') {
                                  fetchTransportersByFlag('P', location);
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                <div style={{ position: "relative" }} className="to-location-dropdown-container">
                  {/* Main selector that shows the current selection */}
                  <div
                    className="bulk-order-location-selector"
                    onClick={() => setShowToLocationDropdown(!showToLocationDropdown)}
                    style={{
                      height: "38px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      // border: "1px solid #ced4da",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",
                      // borderColor: errors.toLocation ? "#dc3545" : "",
                      // borderWidth: errors.toLocation ? "2px" : ""
                    }}
                  >
                    <span className="bulk-order-location-selector-placeholder" style={{ color: "#000" }}>
                      {values.toLocation || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {/* To Location dropdown with search functionality */}
                  {showToLocationDropdown && (
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
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={toLocationSearchTerm}
                          onChange={(e) => setToLocationSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingCities && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading locations...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingCities && filteredToLocations.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No locations found</div>
                        </div>
                      )}

                      {/* To Location list items */}
                      {!loadingCities && filteredToLocations.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredToLocations.map((location, index) => (
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
                                setValues(prevValues => ({
                                  ...prevValues,
                                  toLocation: location
                                }));
                                setToLocationSearchTerm("");
                                setShowToLocationDropdown(false);
                                // Clear error if it exists
                                if (errors.toLocation) {
                                  setErrors(prevErrors => {
                                    const newErrors = { ...prevErrors };
                                    delete newErrors.toLocation;
                                    return newErrors;
                                  });
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {location}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {errors.toLocation && (
                    <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "12px", marginTop: "4px" }}>
                      {errors.toLocation}
                    </div>
                  )}
                </div>
              </div>

              <div className="bulk-order-form-group route-dropdown-container">
                <Label className="bulk-order-label">
                  Route <span style={{ color: "red" }}>*</span>
                </Label>
                <div style={{ position: "relative" }}>
                  {/* Main selector that shows the current selection */}
                  <div
                    className="bulk-order-route-selector"
                    onClick={() => setShowRouteDropdown(!showRouteDropdown)}
                    style={{
                      height: "38px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "0.375rem 0.75rem",
                      backgroundColor: "#fff",

                    }}
                  >
                    <span className="bulk-order-route-selector-placeholder" style={{ color: "#000" }}>
                      {values.route || 'Select'}
                    </span>
                    <span style={{ marginLeft: "auto" }}>
                      <i className="ri-arrow-down-s-line" style={{ fontSize: "18px", color: "black" }}></i>
                    </span>
                  </div>

                  {/* Route dropdown with search functionality */}
                  {showRouteDropdown && (
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
                      {/* Search header */}
                      <div className="bulk-order-dropdown-header" style={{
                        padding: "8px",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #ddd"
                      }}>
                        <input
                          type="text"
                          placeholder="Search"
                          value={routeSearchTerm}
                          onChange={(e) => setRouteSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bulk-order-dropdown-search"
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            color: "#000",
                            fontSize: "14px"
                          }}
                        />
                      </div>

                      {/* Loading indicator */}
                      {loadingRoutes && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#4361ee"
                        }}>
                          <i className="ri-loader-4-line spin" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>Loading routes...</div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!loadingRoutes && filteredRoutes.length === 0 && (
                        <div style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#666"
                        }}>
                          <i className="ri-inbox-line" style={{ fontSize: "24px" }}></i>
                          <div style={{ marginTop: "8px" }}>No routes found</div>
                        </div>
                      )}

                      {/* Route list items */}
                      {!loadingRoutes && filteredRoutes.length > 0 && (
                        <div className="bulk-order-dropdown-content">
                          {filteredRoutes.map((route, index) => (
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
                                // Only set route if it's not the 'Select' option
                                if (route !== 'Select') {
                                  setValues(prevValues => ({
                                    ...prevValues,
                                    route: route
                                  }));
                                  // Clear error if it exists
                                  if (errors.route) {
                                    setErrors(prevErrors => {
                                      const newErrors = { ...prevErrors };
                                      delete newErrors.route;
                                      return newErrors;
                                    });
                                  }
                                }
                                setRouteSearchTerm("");
                                setShowRouteDropdown(false);

                                // Update transporters if Route Based is selected
                                if (values.displayToTransporter === 'Route Based') {
                                  fetchTransportersByFlag('R', route);
                                }
                              }}
                            >
                              <div style={{
                                flex: 1,
                                fontSize: "14px",
                                paddingLeft: "10px"
                              }}>
                                {route}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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


