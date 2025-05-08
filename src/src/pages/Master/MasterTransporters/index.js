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
    name: "",
    code: "",
    plantCode: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    contactEmail: "",
    ownerPerson: "",
    ownerNumber: "",
    ownerEmail: "",
    gstnNo: "",
    panNo: "",
    status: "A",
    // Added new fields
    modeOfTransport: "",
    termsOfPayment: "",
    transporterRating: "",
    taxInformation: "",
    regionLocation: "",
    serviceLevelAgreement: "",
    allowedForBidding: "Yes",
};


const MasterTransporter = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [devices, setDevice] = useState([]);
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
        const obj = JSON.parse(sessionStorage.getItem("authUser"));
        let plantcode = obj.data.plantCode;
        setPlantCode(plantcode);
        getAllDeviceData(plantcode)

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

    const getAllDeviceData = (plantcode) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/all?plantCode=${plantcode}`, config)
            .then(res => {
                const device = res;
                setDevice(device);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setValues({
            ...values,
            [name]: value || value.valueAsNumber,
            ['plantCode']: Plant_Code,
        });
    };

    const handleSubmit = async (e) => {
        console.log(values)
        e.preventDefault();

        try {
            if (isEdit) {
                const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${CurrentID}`, values, config)
                console.log(res);
                toast.success("Transporter Updated Successfully", { autoClose: 3000 });
                getAllDeviceData(Plant_Code);
            }
            else {
                const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters`, values, config)
                console.log(res);
                if (!res.errorMsg) {
                    toast.success("Transporter Added Successfully.", { autoClose: 3000 });
                }
                else {
                    toast.error(res.errorMsg, { autoClose: 3000 });
                }
                getAllDeviceData(Plant_Code);
            }
        }
        catch (e) {
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
        const id = arg;

        var date = new Date();
        const year = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hr = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        if (dd < 10) { var date = '0' + dd; } else { var date = dd; }
        if (mm < 10) { var month = '0' + mm; } else { var month = mm; }
        if (min < 10) { var minutes = '0' + min; } else { var minutes = min; }
        if (sec < 10) { var seconds = '0' + sec; } else { var seconds = sec; }

        var fulldate = date + '-' + month + '-' + year + ' ' + hr + ':' + minutes + ':' + seconds;

        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${id}`, config)
            .then(res => {
                const result = res;
                setValues({
                    ...values,
                    "name": result.name,
                    "code": result.code,
                    "plantCode": result.Plant_Code,
                    "address": result.address,
                    "contactPerson": result.contactPerson,
                    "contactNumber": result.contactNumber,
                    "contactEmail": result.contactEmail,
                    "ownerPerson": result.ownerPerson,
                    "ownerNumber": result.ownerNumber,
                    "ownerEmail": result.ownerEmail,
                    "gstnNo": result.gstnNo,
                    "panNo": result.panNo,
                    "status": result.status,
                    // Added new fields
                    "modeOfTransport": result.modeOfTransport || "",
                    "termsOfPayment": result.termsOfPayment || "",
                    "transporterRating": result.transporterRating || "",
                    "taxInformation": result.taxInformation || "",
                    "regionLocation": result.regionLocation || "",
                    "serviceLevelAgreement": result.serviceLevelAgreement || "",
                    "allowedForBidding": result.allowedForBidding || "Yes",
                });
            })
    }, [toggle, values]);

    // View Data
    const handleViewClick = useCallback((id) => {
        axios.get(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${id}`, config)
            .then(res => {
                const result = res;
                setViewData(result);
                setViewModal(true);
            })
            .catch(error => {
                toast.error("Error fetching transporter details", { autoClose: 3000 });
            });
    }, []);

    // Delete Data
    const onClickDelete = (id) => {
        setClickedRowId(id);
        setDeleteModal(true);
    };

    const handleDeleteCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${CurrentID}`, config)
            console.log(res.data);
            if (res.errorMsg) {
                toast.error(res.errorMsg, { autoClose: 3000 });
                setDeleteModal(false);
            }
            else {
                getAllDeviceData(Plant_Code);
                toast.success("Transporter Deleted Successfully", { autoClose: 3000 });
                setDeleteModal(false);
            }

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

    const biddingOptions = [
        {
            options: [
                { label: "Select Option", value: "" },
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
            ],
        },
    ];

    const transportModes = [
        {
            options: [
                { label: "Select Mode", value: "" },
                { label: "Road", value: "Road" },
                { label: "Rail", value: "Rail" },
                { label: "Air", value: "Air" },
                { label: "Sea", value: "Sea" },
                { label: "Multimodal", value: "Multimodal" },
            ],
        },
    ];

    const ratings = [
        {
            options: [
                { label: "Select Rating", value: "" },
                { label: "5 - Excellent", value: "5" },
                { label: "4 - Very Good", value: "4" },
                { label: "3 - Good", value: "3" },
                { label: "2 - Fair", value: "2" },
                { label: "1 - Poor", value: "1" },
            ],
        },
    ];

    // Customers Column - Updated to show only primary columns as in reference image
    const columns = useMemo(
        () => [
            {
                Header: "Transporter Code",
                accessor: "code",
                filterable: false,
            },
            {
                Header: "Transporter name",
                accessor: "name",
                filterable: false,
            },
            {
                Header: "Contact Person",
                accessor: "contactPerson",
                filterable: false,
            },
            {
                Header: "Phone No.",
                accessor: "contactNumber",
                filterable: false,
            },
            {
                Header: "Email Id",
                accessor: "contactEmail",
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

    document.title = "Transporter | EPLMS";
    return (
        <React.Fragment>
            <div className="page-content">
                <ExportCSVModal
                    show={isExportCSV}
                    onCloseClick={() => setIsExportCSV(false)}
                    data={devices}
                />
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteCustomer}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title={"Transporter"} pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card id="customerList">
                                <CardHeader className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <div className="col-sm">
                                            <div>
                                                <h5 className="card-title mb-0 bg-light">Transporter Details</h5>
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
                                                    <i className="ri-add-line align-bottom me-1"></i> Add Transporter
                                                </button>{" "}
                                            </div>
                                        </div>
                                    </Row>
                                </CardHeader>
                                <div className="card-body pt-0">
                                    <div>
                                        {devices && devices.length ? (
                                            <TableContainer
                                                columns={columns}
                                                data={devices}
                                                isGlobalFilter={true}
                                                isAddUserList={false}
                                                customPageSize={5}
                                                isGlobalSearch={true}
                                                className="custom-header-css"
                                                handleCustomerClick={handleCustomerClicks}
                                                SearchPlaceholder='Search for Transporter Name or something...'
                                                divClass="overflow-auto"
                                                tableClass="width-50"
                                            />) : (<Loader />)
                                        }
                                    </div>

                                    {/* Edit/Add Modal */}
                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                                            {!!isEdit ? "Edit Transporter" : "Add Transporter"}
                                        </ModalHeader>
                                        <Form className="tablelist-form" onSubmit={handleSubmit}>
                                            <ModalBody className="p-3">
                                                <div>
                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault01" className="form-label mb-1">Transporter Name<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                name="name"
                                                                id="validationDefault01"
                                                                placeholder="Enter Transporter Name"
                                                                maxlength="100"
                                                                value={values.name}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault03" className="form-label mb-1">Transporter Code<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault03"
                                                                name="code"
                                                                placeholder="Enter Transporter Code"
                                                                maxlength="15"
                                                                value={values.code}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Contact Person<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault04"
                                                                name="contactPerson"
                                                                placeholder="Enter Contact Person"
                                                                value={values.contactPerson}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Contact Number<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="number" required className="form-control"
                                                                id="validationDefault04"
                                                                name="contactNumber"
                                                                placeholder="Enter Contact Number"
                                                                maxlength="10"
                                                                value={values.contactNumber}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Contact Email<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="email" required className="form-control"
                                                                id="validationDefault04"
                                                                name="contactEmail"
                                                                placeholder="Enter Contact Email"
                                                                maxlength="50"
                                                                value={values.contactEmail}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Owner Person<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault04"
                                                                name="ownerPerson"
                                                                placeholder="Enter Owner Person"
                                                                value={values.ownerPerson}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Owner Number<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault04"
                                                                name="ownerNumber"
                                                                placeholder="Enter Owner Number"
                                                                maxlength="10"
                                                                value={values.ownerNumber}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Owner Email<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="email" required className="form-control"
                                                                id="validationDefault04"
                                                                name="ownerEmail"
                                                                maxlength="50"
                                                                placeholder="Enter Owner Email"
                                                                value={values.ownerEmail}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Gstn No<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault04"
                                                                name="gstnNo"
                                                                placeholder="Enter Gstn No"
                                                                value={values.gstnNo}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="address" className="form-label mb-1">Address<span style={{ color: "red" }}>*</span></Label>
                                                            <textarea required className="form-control" style={{ height: "23px" }}
                                                                id="address"
                                                                name="address"
                                                                placeholder="Enter Address"
                                                                value={values.address}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="validationDefault04" className="form-label mb-1">Pan No<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="validationDefault04"
                                                                name="panNo"
                                                                placeholder="Enter Pan No"
                                                                value={values.panNo}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="modeOfTransport" className="form-label mb-1">Mode of Transport<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="modeOfTransport"
                                                                type="select"
                                                                className="form-select"
                                                                id="modeOfTransport"
                                                                value={values.modeOfTransport}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                {transportModes.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="termsOfPayment" className="form-label mb-1">Terms of Payment<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="termsOfPayment"
                                                                name="termsOfPayment"
                                                                placeholder="Enter Terms of Payment"
                                                                value={values.termsOfPayment}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="transporterRating" className="form-label mb-1">Transporter Rating</Label>
                                                            <Input
                                                                name="transporterRating"
                                                                type="select"
                                                                className="form-select"
                                                                id="transporterRating"
                                                                value={values.transporterRating}
                                                                onChange={handleInputChange}
                                                            >
                                                                {ratings.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="taxInformation" className="form-label mb-1">Tax Information</Label>
                                                            <Input type="text" className="form-control"
                                                                id="taxInformation"
                                                                name="taxInformation"
                                                                placeholder="Enter Tax Information"
                                                                value={values.taxInformation}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="d-flex mb-2">
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="regionLocation" className="form-label mb-1">Region/Location<span style={{ color: "red" }}>*</span></Label>
                                                            <Input type="text" required className="form-control"
                                                                id="regionLocation"
                                                                name="regionLocation"
                                                                placeholder="Enter Region/Location"
                                                                value={values.regionLocation}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="serviceLevelAgreement" className="form-label mb-1">Service Level Agreement</Label>
                                                            <Input type="text" className="form-control"
                                                                id="serviceLevelAgreement"
                                                                name="serviceLevelAgreement"
                                                                placeholder="Enter Service Level Agreement"
                                                                value={values.serviceLevelAgreement}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                            <Label htmlFor="allowedForBidding" className="form-label mb-1">Allowed for Bidding<span style={{ color: "red" }}>*</span></Label>
                                                            <Input
                                                                name="allowedForBidding"
                                                                type="select"
                                                                className="form-select"
                                                                id="allowedForBidding"
                                                                value={values.allowedForBidding}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                {biddingOptions.map((item, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </Input>
                                                        </div>
                                                    </div>

                                                    {isEdit && (
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                                <Label className="form-label mb-1">Status<span style={{ color: "red" }}>*</span></Label>
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
                                                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}></div>
                                                            <div className="flex-grow-1" style={{ width: '33.33%' }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <Row>
                                                    <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "45px" }}>
                                                        <button type="button" className="btn btn-light" onClick={toggle}> Close </button>
                                                        <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Transporter"} </button>
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                            <ModalFooter>
                                            </ModalFooter>
                                        </Form>
                                    </Modal>

                                    {/* View Modal */}
                                    <Modal id="viewModal" isOpen={viewModal} toggle={toggleView} centered size="lg">
                                        <ModalHeader className="bg-light p-3" toggle={toggleView}>
                                            Transporter Details
                                        </ModalHeader>
                                        <ModalBody className="p-3">
                                            <div>
                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Transporter Name</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.name}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Transporter Code</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.code}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Contact Person</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.contactPerson}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Contact Number</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.contactNumber}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Contact Email</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.contactEmail}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Owner Person</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.ownerPerson}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Owner Number</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.ownerNumber}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Owner Email</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.ownerEmail}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">GST Number</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.gstnNo}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">PAN Number</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.panNo}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Address</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.address}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Mode of Transport</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.modeOfTransport}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Terms of Payment</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.termsOfPayment}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Transporter Rating</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.transporterRating}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Tax Information</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.taxInformation}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex mb-2">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Region/Location</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.regionLocation}</p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Service Level Agreement</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.serviceLevelAgreement}</p>
                                                    </div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Allowed for Bidding</Label>
                                                        <p className="form-control bg-light mb-0">{viewData.allowedForBidding}</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex">
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                                        <Label className="form-label mb-1 fw-semibold">Status</Label>
                                                        <p className="form-control bg-light mb-0">
                                                            {viewData.status === 'A' ? 'Active' : viewData.status === 'D' ? 'Deactive' : viewData.status}
                                                        </p>
                                                    </div>
                                                    <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}></div>
                                                    <div className="flex-grow-1" style={{ width: '33.33%' }}></div>
                                                </div>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
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

export default MasterTransporter;