
//Master Route Updated code with view button functionality 
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row, Col, Card, CardHeader, Modal, Form, ModalBody, ModalFooter, ModalHeader, Label, Input, FormFeedback, Nav, NavItem, NavLink, TabContent, TabPane, CardBody } from "reactstrap";

import { Link } from "react-router-dom";
import axios from "axios";
// Export Modal
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";
import Flatpickr from "react-flatpickr";

const initialValues = {
    routeCode: "",
    routeName: "",
    departureLocation: "",
    destinationLocation: "",
    routeType: "",
    transporterGroup: "",
    deliveryTime: "",
    shippingCondition: "",
    routeCriteria: "",
    intermediateStops: "",
    distance: "",
    transportationCost: "",
    carrier: "",
    routeSelection: "",
    transportationZone: "",
    shippingPoint: "",
    plantCode: "",
    status: "A",
};

// Sample data for testing UI
const sampleData = [
    {
        id: 12345,
        routeCode: "1010",
        routeName: "Berlin Route",
        departureLocation: "Plant A",
        destinationLocation: "Z Cust. in Berlin",
        routeType: "Land",
        transporterGroup: "Truck",
        deliveryTime: "4 Hour",
        shippingCondition: "01",
        routeCriteria: "Automatic",
        intermediateStops: "City X",
        distance: "150 KM",
        transportationCost: "$120",
        carrier: "ABC Transport",
        routeSelection: "Auto",
        transportationZone: "EU-Central",
        shippingPoint: "WH-101",
        status: "A"
    },
    {
        id: 12346,
        routeCode: "1020",
        routeName: "Paris Route",
        departureLocation: "Plant B",
        destinationLocation: "Customer HQ in Paris",
        routeType: "Land",
        transporterGroup: "Truck",
        deliveryTime: "6 Hour",
        shippingCondition: "02",
        routeCriteria: "Manual",
        intermediateStops: "City Y",
        distance: "250 KM",
        transportationCost: "$180",
        carrier: "Euro Logistics",
        routeSelection: "Manual",
        transportationZone: "EU-West",
        shippingPoint: "WH-102",
        status: "A"
    },
    {
        id: 12347,
        routeCode: "1030",
        routeName: "London Route",
        departureLocation: "Plant C",
        destinationLocation: "London Distribution",
        routeType: "Air",
        transporterGroup: "Plane",
        deliveryTime: "2 Hour",
        shippingCondition: "03",
        routeCriteria: "Priority",
        intermediateStops: "None",
        distance: "500 KM",
        transportationCost: "$350",
        carrier: "Fast Air",
        routeSelection: "Auto",
        transportationZone: "EU-Island",
        shippingPoint: "WH-103",
        status: "A"
    },
    {
        id: 12348,
        routeCode: "1040",
        routeName: "Rome Route",
        departureLocation: "Plant A",
        destinationLocation: "Rome Warehouse",
        routeType: "Land",
        transporterGroup: "Rail",
        deliveryTime: "12 Hour",
        shippingCondition: "01",
        routeCriteria: "Economic",
        intermediateStops: "Milan, Florence",
        distance: "800 KM",
        transportationCost: "$220",
        carrier: "Rail Europe",
        routeSelection: "Auto",
        transportationZone: "EU-South",
        shippingPoint: "WH-104",
        status: "A"
    },
    {
        id: 12349,
        routeCode: "1050",
        routeName: "Rotterdam Route",
        departureLocation: "Plant D",
        destinationLocation: "Rotterdam Port",
        routeType: "Sea",
        transporterGroup: "Ship",
        deliveryTime: "48 Hour",
        shippingCondition: "04",
        routeCriteria: "Bulk",
        intermediateStops: "Hamburg Port",
        distance: "950 KM",
        transportationCost: "$550",
        carrier: "Ocean Freight",
        routeSelection: "Manual",
        transportationZone: "EU-North",
        shippingPoint: "WH-105",
        status: "A"
    }
];

const MasterRoute = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [routes, setRoutes] = useState(sampleData); // Using sample data for UI testing
    const [modal, setModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewData, setViewData] = useState({});
    const [values, setValues] = useState(initialValues);
    const [CurrentID, setClickedRowId] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [latestHeader, setLatestHeader] = useState('');
    const [Plant_Code, setPlantCode] = useState('');

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    const toggleView = useCallback(() => {
        if (viewModal) {
            setViewModal(false);
        } else {
            setViewModal(true);
        }
    }, [viewModal]);

    useEffect(() => {
        const HeaderName = localStorage.getItem("HeaderName");
        setLatestHeader(HeaderName);
    }, []);

    useEffect(() => {
        // In a real application, you would get the plant code from session storage
        // For UI testing, we'll use a dummy value
        try {
            const obj = JSON.parse(sessionStorage.getItem("authUser"));
            let plantcode = obj?.data?.plantCode || "PLANT001";
            setPlantCode(plantcode);
            // Commented API call - using sample data directly
            // getAllRouteData(plantcode);
            setRoutes(sampleData); // Always use sample data
        } catch (error) {
            // Fallback for testing
            setPlantCode("PLANT001");
            // Use sample data instead of API call for UI testing
            setRoutes(sampleData);
        }
    }, []);

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: process.env.REACT_APP_API_USER_NAME,
            password: process.env.REACT_APP_API_PASSWORD,
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            ['plantCode']: Plant_Code,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(values);

        try {
            // For UI testing - update the routes state directly
            if (isEdit) {
                const updatedRoutes = routes.map(route =>
                    route.id === CurrentID ? { ...route, ...values } : route
                );
                setRoutes(updatedRoutes);
                toast.success("Route Updated Successfully", { autoClose: 3000 });
            } else {
                // For new entries, generate a sequential ID 
                const lastId = routes.length > 0 ? Math.max(...routes.map(route => route.id)) : 12344;
                const newRoute = {
                    id: lastId + 1,
                    ...values
                };
                setRoutes([...routes, newRoute]);
                toast.success("Route Added Successfully.", { autoClose: 3000 });
            }
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
        }
        toggle();
    };

    // Add Data
    const handleCustomerClicks = () => {
        setIsEdit(false);
        toggle();
    };

    // Update Data
    const handleCustomerClick = useCallback((arg) => {
        setClickedRowId(arg);
        setIsEdit(true);
        toggle();

        // For UI testing - find the route in the sample data
        const selectedRoute = routes.find(route => route.id === arg);
        if (selectedRoute) {
            setValues({
                routeCode: selectedRoute.routeCode,
                routeName: selectedRoute.routeName,
                departureLocation: selectedRoute.departureLocation,
                destinationLocation: selectedRoute.destinationLocation,
                routeType: selectedRoute.routeType,
                transporterGroup: selectedRoute.transporterGroup,
                deliveryTime: selectedRoute.deliveryTime,
                shippingCondition: selectedRoute.shippingCondition,
                routeCriteria: selectedRoute.routeCriteria,
                intermediateStops: selectedRoute.intermediateStops,
                distance: selectedRoute.distance,
                transportationCost: selectedRoute.transportationCost,
                carrier: selectedRoute.carrier,
                routeSelection: selectedRoute.routeSelection,
                transportationZone: selectedRoute.transportationZone,
                shippingPoint: selectedRoute.shippingPoint,
                plantCode: Plant_Code,
                status: selectedRoute.status,
            });
        }
    }, [toggle, routes, Plant_Code]);

    // View Data
    const handleViewClick = useCallback((id) => {
        // Find the route in the sample data
        const selectedRoute = routes.find(route => route.id === id);
        if (selectedRoute) {
            setViewData(selectedRoute);
            setViewModal(true);
        } else {
            toast.error("Route details not found", { autoClose: 3000 });
        }
    }, [routes]);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();

        try {
            // For UI testing - update the routes state directly
            const updatedRoutes = routes.filter(route => route.id !== CurrentID);
            setRoutes(updatedRoutes);
            toast.success("Route Deleted Successfully", { autoClose: 3000 });
            setDeleteModal(false);
        } catch (e) {
            toast.error("Something went wrong!", { autoClose: 3000 });
            setDeleteModal(false);
        }
    };

    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    const routeTypes = [
        {
            options: [
                { label: "Select Type", value: "" },
                { label: "Land", value: "Land" },
                { label: "Air", value: "Air" },
                { label: "Sea", value: "Sea" },
            ],
        },
    ];

    const transporterGroups = [
        {
            options: [
                { label: "Select Group", value: "" },
                { label: "Truck", value: "Truck" },
                { label: "Rail", value: "Rail" },
                { label: "Plane", value: "Plane" },
                { label: "Ship", value: "Ship" },
            ],
        },
    ];

    const routeCriterias = [
        {
            options: [
                { label: "Select Criteria", value: "" },
                { label: "Automatic", value: "Automatic" },
                { label: "Manual", value: "Manual" },
                { label: "Priority", value: "Priority" },
                { label: "Economic", value: "Economic" },
                { label: "Bulk", value: "Bulk" },
            ],
        },
    ];

    const routeSelections = [
        {
            options: [
                { label: "Select Selection", value: "" },
                { label: "Auto", value: "Auto" },
                { label: "Manual", value: "Manual" },
            ],
        },
    ];

    // Routes Column - Removed ID column and updated for minimized view
    const columns = useMemo(
        () => [
            {
                Header: "Route Code",
                accessor: "routeCode",
                sticky: "left",
                filterable: false,
            },
            {
                Header: "Route Name",
                accessor: "routeName",
                filterable: false,
            },
            {
                Header: "Departure Location",
                accessor: "departureLocation",
                filterable: false,
            },
            {
                Header: "Destination Location",
                accessor: "destinationLocation",
                filterable: false,
            },
            {
                Header: "Route Type",
                accessor: "routeType",
                filterable: false,
            },
            {
                Header: "Action",
                Cell: (cellProps) => {
                    return (
                        <ul className="list-inline hstack gap-2 mb-0">
                            <li className="list-inline-item edit" title="Edit">
                                <Link
                                    to="#"
                                    className="text-primary d-inline-block edit-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; handleCustomerClick(id); }}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item view" title="View">
                                <Link
                                    to="#"
                                    className="text-info d-inline-block"
                                    onClick={() => { const id = cellProps.row.original.id; handleViewClick(id); }}
                                >
                                    <i className="ri-eye-line fs-16"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item" title="Remove">
                                <Link
                                    to="#"
                                    className="text-danger d-inline-block remove-item-btn"
                                    onClick={() => { const id = cellProps.row.original.id; onClickDelete(id); }}>
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </li>
                        </ul>
                    );
                },
            },
        ],
        []
    );

    // Export Modal
    const [isExportCSV, setIsExportCSV] = useState(false);

    document.title = "Route Master | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={routes}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={"Route"} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Route Details</h5>
                                            </div>
                                        </div>
                                        <div className="col-sm-auto">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-success add-btn"
                                                    id="create-btn"
                                                    onClick={() => { setIsEdit(false); toggle(); setValues(initialValues); }}
                                                >
                                                    <i className="ri-add-line align-bottom me-1"></i> Add Route
                                                </button>{" "}
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {routes && routes.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={routes}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                handleCustomerClick={handleCustomerClicks}
                                                SearchPlaceholder='Search for Route Name or something...'
                                                divClass="overflow-auto"
                                                tableClass="width-50"
                                            />) : (<Loader />)
                                        }
                                    </div>

                                    {/* Edit/Add Modal */}
                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Route" : "Add Route"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody>
                                                <Row className="g-3">
                                                    <Col md={4}>
                                                        <Label htmlFor="routeCode" className="form-label">Route Code<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="routeCode"
                                                            id="routeCode"
                                                            placeholder="Enter Route Code"
                                                            maxlength="15"
                                                            value={values.routeCode}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="routeName" className="form-label">Route Name<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="routeName"
                                                            id="routeName"
                                                            placeholder="Enter Route Name"
                                                            maxlength="100"
                                                            value={values.routeName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="departureLocation" className="form-label">Departure Location<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="departureLocation"
                                                            id="departureLocation"
                                                            placeholder="Enter Departure Location"
                                                            value={values.departureLocation}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="destinationLocation" className="form-label">Destination Location<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="destinationLocation"
                                                            id="destinationLocation"
                                                            placeholder="Enter Destination Location"
                                                            value={values.destinationLocation}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="routeType" className="form-label">Route Type<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="routeType"
                                                            type="select"
                                                            className="form-select"
                                                            id="routeType"
                                                            value={values.routeType}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {routeTypes.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="transporterGroup" className="form-label">Transporter Group<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="transporterGroup"
                                                            type="select"
                                                            className="form-select"
                                                            id="transporterGroup"
                                                            value={values.transporterGroup}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {transporterGroups.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="deliveryTime" className="form-label">Delivery Time<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="deliveryTime"
                                                            id="deliveryTime"
                                                            placeholder="Enter Delivery Time"
                                                            value={values.deliveryTime}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="shippingCondition" className="form-label">Shipping Condition<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="shippingCondition"
                                                            id="shippingCondition"
                                                            placeholder="Enter Shipping Condition"
                                                            value={values.shippingCondition}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="routeCriteria" className="form-label">Route Criteria<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="routeCriteria"
                                                            type="select"
                                                            className="form-select"
                                                            id="routeCriteria"
                                                            value={values.routeCriteria}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {routeCriterias.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="intermediateStops" className="form-label">Intermediate Stops<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="intermediateStops"
                                                            id="intermediateStops"
                                                            placeholder="Enter Intermediate Stops"
                                                            value={values.intermediateStops}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="distance" className="form-label">Distance<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="distance"
                                                            id="distance"
                                                            placeholder="Enter Distance"
                                                            value={values.distance}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="transportationCost" className="form-label">Transportation Cost<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="transportationCost"
                                                            id="transportationCost"
                                                            placeholder="Enter Transportation Cost"
                                                            value={values.transportationCost}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="carrier" className="form-label">Carrier<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="carrier"
                                                            id="carrier"
                                                            placeholder="Enter Carrier"
                                                            value={values.carrier}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="routeSelection" className="form-label">Route Selection<span style={{ color: "red" }}>*</span></Label>
                                                        <Input
                                                            name="routeSelection"
                                                            type="select"
                                                            className="form-select"
                                                            id="routeSelection"
                                                            value={values.routeSelection}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            {routeSelections.map((item, key) => (
                                                                <React.Fragment key={key}>
                                                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                </React.Fragment>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="transportationZone" className="form-label">Transportation Zone<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="transportationZone"
                                                            id="transportationZone"
                                                            placeholder="Enter Transportation Zone"
                                                            value={values.transportationZone}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="shippingPoint" className="form-label">Shipping Point<span style={{ color: "red" }}>*</span></Label>
                                                        <Input type="text" required className="form-control"
                                                            name="shippingPoint"
                                                            id="shippingPoint"
                                                            placeholder="Enter Shipping Point"
                                                            value={values.shippingPoint}
                                                            onChange={handleInputChange}
                                                        />
                                                    </Col>
                                                    {isEdit &&
                                                        <Col lg={4}>
                                                            <div>
                                                                <Label className="form-label">Status<span style={{ color: "red" }}>*</span></Label>
                                                                <Input
                                                                    name="status"
                                                                    type="select"
                                                                    className="form-select"
                                                                    value={values.status}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                >
                                                                    {status.map((item, key) => (
                                                                        <React.Fragment key={key}>
                                                                            {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </Input>
                                                            </div>
                                                        </Col>
                                                    }
                                                </Row>
                                                <Row>
                                                    <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                        <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                        <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Route"} </button>
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                            <ModalFooter>
                                            </ModalFooter>
                                        </Form>
                                    </Modal>

                                    {/* View Modal */}
                               {/* View Modal - with reduced vertical spacing */}
<Modal id="viewModal" isOpen={viewModal} toggle={toggleView} centered size="lg">
    <ModalHeader className="bg-light p-3" toggle={toggleView}>
        Route Details
    </ModalHeader>
    <ModalBody className="py-2">
        <Row className="g-2">
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Route Code</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.routeCode}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Route Name</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.routeName}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Departure Location</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.departureLocation}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Destination Location</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.destinationLocation}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Route Type</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.routeType}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Transporter Group</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.transporterGroup}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Delivery Time</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.deliveryTime}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Shipping Condition</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.shippingCondition}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Route Criteria</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.routeCriteria}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Intermediate Stops</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.intermediateStops}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Distance</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.distance}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Transportation Cost</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.transportationCost}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Carrier</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.carrier}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Route Selection</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.routeSelection}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Transportation Zone</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.transportationZone}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Shipping Point</Label>
                    <p className="form-control form-control-sm bg-light py-1">{viewData.shippingPoint}</p>
                </div>
            </Col>
            <Col md={4}>
                <div className="mb-2">
                    <Label className="form-label fw-semibold mb-1">Status</Label>
                    <p className="form-control form-control-sm bg-light py-1">
                        {viewData.status === 'A' ? 'Active' : viewData.status === 'D' ? 'Deactive' : viewData.status}
                    </p>
                </div>
            </Col>
        </Row>
    </ModalBody>
    <ModalFooter className="pt-0">
        <button type="button" className="btn btn-light" onClick={toggleView}>Close</button>
    </ModalFooter>
</Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MasterRoute;
