import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";

// Import Components
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import TableContainer from "../../../Components/Common/TableContainer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../../Components/Common/Loader";

// Import Modal Components
import EditModal from "./EditModal/EditModal";
import ViewModal from "./ViewModal/ViewModal";

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
    meanOfTransport: "Truck",
    modeOfTransport: "",
    pricePerKm: "",
    termsOfPayment: "",
    transporterRating: "",
    taxInformation: "",
    regionLocation: "",
    serviceLevelAgreement: "",
    allowedForBidding: "Yes",
};

    // Helper function to map API term payment values to dropdown values
    const mapTermPaymentValue = (apiValue) => {
        if (!apiValue) return "";
        
        // Map API values to form dropdown options
        if (apiValue === "45 Days") return "Net45";
        if (apiValue === "30 Days") return "Net30";
        if (apiValue === "60 Days") return "Net60";
        if (apiValue === "Online Payment" || apiValue === "Online") return "Online";
        
        // If no exact match, try to extract the days value
        if (apiValue.includes("Days") || apiValue.includes("days")) {
            const days = apiValue.match(/\d+/);
            if (days && days[0]) {
                return `Net${days[0]}`;
            }
        }
        
        return "";
    };

    // Helper function to map form dropdown values back to API values
const mapFormTermPaymentToApi = (formValue) => {
    switch(formValue) {
        case "Net30": return "30 Days";
        case "Net45": return "45 Days";
        case "Net60": return "60 Days";
        case "Online": return "Online Payment";
        default: return formValue;
    }
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
        // Create API payload with correct field mappings
        const apiPayload = {
            ...values,
          
          
        };

        if (isEdit) {
            const res = await axios.put(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters/${CurrentID}`, apiPayload, config)
            console.log(res);
            toast.success("Transporter Updated Successfully", { autoClose: 3000 });
            getAllDeviceData(Plant_Code);
        }
        else {
            const res = await axios.post(`${process.env.REACT_APP_LOCAL_URL_8082}/api/transporters`, apiPayload, config)
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
   // Update Data
const handleCustomerClick = useCallback((arg) => {
    setClickedRowId(arg);
    setIsEdit(true);
    toggle();
    const id = arg;

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
                "meanOfTransport": result.meanOfTransport || "Truck",
                "modeOfTransport": result.modeTransport || "",
                "pricePerKm": result.priceKm || "",
                // Apply mapping for termsOfPayment
                "termsOfPayment": mapTermPaymentValue(result.termPayment)||"",
                "transporterRating": result.transporterRating || "",
                "taxInformation": result.taxInfo || "",
                "regionLocation": result.regionLocation || "",
                "serviceLevelAgreement": result.serviceLevelAgreement || "",
                "allowedForBidding": result.allowedBidding ? "Yes" : "No",
            });
        })
}, [toggle, values, config]);

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
    }, [config]);

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
                                            <div >
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

                                    {/* Edit/Add Modal Component */}
                                    <EditModal
                                        isOpen={modal}
                                        toggle={toggle}
                                        isEdit={isEdit}
                                        values={values}
                                        handleInputChange={handleInputChange}
                                        handleSubmit={handleSubmit}
                                    />

                                    {/* View Modal Component */}
                                    <ViewModal
                                        isOpen={viewModal}
                                        toggle={toggleView}
                                        viewData={viewData}
                                    />

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