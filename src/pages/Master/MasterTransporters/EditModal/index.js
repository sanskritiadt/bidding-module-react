// import React from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Label, Input } from "reactstrap";

// const EditModal = ({
//     isOpen,
//     toggle,
//     isEdit,
//     values,
//     handleInputChange,
//     handleSubmit
// }) => {
//     // Status options defined in the same format as original code
//     const status = [
//         {
//             options: [
//                 { label: "Select Status", value: "" },
//                 { label: "Active", value: "A" },
//                 { label: "Deactive", value: "D" },
//             ],
//         },
//     ];

//     const validateName = (name) => {
//         if (!name) return true; // Allow empty initially
//         const nameRegex = /^[A-Za-z0-9 ]+$/;
//         return nameRegex.test(name);
//     };
//     const validateAddress = (address) => {
//         if (!address) return true; // Allow empty initially
//         const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;  // Example regex to allow alphanumeric and common address symbols
//         return addressRegex.test(address);
//     };
//     const validateContactPerson = (person) => {
//         if (!person) return true;
//         const personRegex = /^[A-Za-z0-9 ]+$/;
//         return personRegex.test(person);
//     }

//     const validatePhoneNumber = (phoneNumber) => {
//         if (!phoneNumber) return true; // Allow empty initially
//         const phoneRegex = /^[0-9]{1,10}$/; // Only numbers, max 10 digits
//         return phoneRegex.test(phoneNumber);
//     };
//     // Email validation function
//     const validateEmail = (email) => {
//         if (!email) return true; // Allow empty initially
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         return emailRegex.test(email);
//     };
//     const validatePrice = (price) => {
//         if (!price) return true; // Allow empty initially
//         const priceRegex = /^\d+(\.\d{1,2})?$/; // Accepts numbers with optional 1-2 decimal places
//         return priceRegex.test(price);
//     };
//     const validateTaxInfo = (taxInfo) => {
//         if (!taxInfo) return true; // Allow empty initially
//         const taxInfoRegex = /^[a-zA-Z0-9\s\-\/&. ]+$/; // Letters, numbers, space, -, /, &, .
//         return taxInfoRegex.test(taxInfo);
//     };

//     const validateRegionLocation = (region) => {
//         if (!region) return true;
//         const regionRegex = /^[a-zA-Z\s,.\-()&/ ]{2,100}$/;
//         return regionRegex.test(region);
//     };

//     const validateSLA = (sla) => {
//         if (!sla) return true;
//         const slaRegex = /^[a-zA-Z0-9\s\-\/&.() ]+$/;
//         return slaRegex.test(sla);
//     };

//     const validatePAN = (panNumber) => {
//         if (!panNumber) return true;
//         const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//         return panRegex.test(panNumber);
//     };

//     const validateGST = (gstNumber) => {
//         if (!gstNumber) return true;
//         const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//         return gstRegex.test(gstNumber);
//     };

//     return (
//         <Modal id="showModal" isOpen={isOpen} toggle={toggle} centered size="lg">
//             <ModalHeader className="bg-light p-3" toggle={toggle}>
//                 {!!isEdit ? "Edit Transporter" : "Add Transporter"}
//             </ModalHeader>
//             <Form className="tablelist-form" onSubmit={handleSubmit}>
//                 <ModalBody className="p-3">
//                     <div>
//                         {/* ROW 1: Code, Name, Address */}
//                         <div className="d-flex mb-2">
//                             {/* <div className="flex-grow-1" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="code" className="form-label mb-1">
//                                     Transporter Code<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="code"
//                                     name="code"
//                                     placeholder="Enter Transporter Code"
//                                     value={values.code||""}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                 />
//                             </div> */}
//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="name" className="form-label mb-1">
//                                     Transporter Name<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="name"
//                                     name="name"
//                                     placeholder="Enter Transporter Name"
//                                     value={values.name || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.name && !validateName(values.name) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.name && !validateName(values.name) && (
//                                     <div className="invalid-feedback">
//                                         Invalid name. Only letters,spaces and characters.
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="address" className="form-label mb-1">
//                                     Address<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="address"
//                                     name="address"
//                                     placeholder="Enter Address"
//                                     value={values.address || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.address && !validateAddress(values.address) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.address && !validateAddress(values.address) && (
//                                     <div className="invalid-feedback">
//                                         Invalid address. Only letters, numbers, spaces, and basic punctuation are allowed.
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="contactPerson" className="form-label mb-1">
//                                     Contact Person<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="contactPerson"
//                                     name="contactPerson"
//                                     placeholder="Enter Contact Person"
//                                     value={values.contactPerson || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.contactPerson && !validateContactPerson(values.contactPerson) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.contactPerson && !validateContactPerson(values.contactPerson) && (
//                                     <div className="invalid-feedback">
//                                         Invalid details. Only letters,spaces and characters.
//                                     </div>
//                                 )}
//                             </div>

//                         </div>

//                         {/* ROW 2: Contact Person, Phone, Email */}
//                         <div className="d-flex mb-2">

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="contactNumber" className="form-label mb-1">
//                                     Phone No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="contactNumber"
//                                     name="contactNumber"
//                                     placeholder="Enter Phone Number"
//                                     value={values.contactNumber || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.contactNumber && !validatePhoneNumber(values.contactNumber) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.contactNumber && !validatePhoneNumber(values.contactNumber) && (
//                                     <div className="invalid-feedback">
//                                         Invalid phone number. Only numbers allowed and max 10 digits.
//                                     </div>
//                                 )}
//                             </div>


//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="contactEmail" className="form-label mb-1">
//                                     Email ID<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="email"
//                                     required
//                                     id="contactEmail"
//                                     name="contactEmail"
//                                     placeholder="Enter Email ID"
//                                     value={values.contactEmail || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.contactEmail && !validateEmail(values.contactEmail) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.contactEmail && !validateEmail(values.contactEmail) && (
//                                     <div className="invalid-feedback">
//                                         Please enter a valid email address.
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label className="form-label mb-1">
//                                     Mode Of Transport<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="select"
//                                     required
//                                     id="modeTransport"
//                                     name="modeTransport"
//                                     value={values.modeTransport || ""}
//                                     onChange={handleInputChange}
//                                     className="form-select"
//                                 >
//                                     <option value="">Select Mode</option>
//                                     <option value="Road">Road</option>
//                                     <option value="Rail">Rail</option>
//                                     <option value="Air">Air</option>
//                                     <option value="Sea">Sea</option>
//                                     <option value="Multimodal">Multimodal</option>
//                                 </Input>
//                             </div>
//                         </div>

//                         {/* ROW 3: Mean, Mode, Price */}
//                         <div className="d-flex mb-2">


//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label className="form-label mb-1">
//                                     Price (Per KM)<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="priceKm"
//                                     name="priceKm"
//                                     placeholder="Enter Price Per KM"
//                                     value={values.priceKm || ""}
//                                     onChange={handleInputChange}

//                                     className={`form-control ${values.priceKm && !validatePrice(values.priceKm) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.priceKm && !validatePrice(values.priceKm) && (
//                                     <div className="invalid-feedback">
//                                         Price must be a valid number (e.g., 25 or 25.50).
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="termsOfPayment" className="form-label mb-1">
//                                     Term of Payment<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="select"
//                                     required
//                                     id="termPayment"
//                                     name="termPayment"
//                                     value={values.termPayment || ""}
//                                     onChange={handleInputChange}
//                                     className="form-select"
//                                 >
//                                     <option value="">Select Term</option>
//                                     <option value="Online">Online</option>
//                                     <option value="Online">Cash</option>
//                                 </Input>
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="taxInformation" className="form-label mb-1">
//                                     Tax Information<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="taxInfo"
//                                     name="taxInfo"
//                                     placeholder="Enter Tax Information"
//                                     value={values.taxInfo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.taxInfo && !validateTaxInfo(values.taxInfo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.taxInfo && !validateTaxInfo(values.taxInfo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
//                                     </div>
//                                 )}
//                             </div>


//                         </div>

//                         {/* ROW 4: Term, Tax, Region */}
//                         <div className="d-flex mb-2">


//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="regionLocation" className="form-label mb-1">
//                                     Region/Location<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="regionLocation"
//                                     name="regionLocation"
//                                     placeholder="Enter Region/Location"
//                                     value={values.regionLocation || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.regionLocation && !validateRegionLocation(values.regionLocation) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.regionLocation && !validateRegionLocation(values.regionLocation) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
//                                     </div>
//                                 )}
//                             </div>


//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="serviceLevelAgreement" className="form-label mb-1">
//                                     Service Level Agreement<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="serviceLevelAgreement"
//                                     name="serviceLevelAgreement"
//                                     placeholder="Enter SLA"
//                                     value={values.serviceLevelAgreement || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) && (
//                                     <div className="invalid-feedback">
//                                         Invalid format. Only letters, numbers, spaces, -, /, &, ., and () are allowed.
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="gstnNo" className="form-label mb-1">
//                                     GST No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="gstnNo"
//                                     name="gstnNo"
//                                     placeholder="Enter GST No."
//                                     value={values.gstnNo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.gstnNo && !validateGST(values.gstnNo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.gstnNo && !validateGST(values.gstnNo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid GST format. Should be like: 27AAPFU0939F1ZV
//                                     </div>
//                                 )}
//                             </div>

//                         </div>

//                         {/* ROW 5: PAN, Allowed Bidding, Status/Rating - FIXED THIS ROW */}
//                         <div className="d-flex mb-2">
//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="panNo" className="form-label mb-1">
//                                     PAN No.<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     required
//                                     id="panNo"
//                                     name="panNo"
//                                     placeholder="Enter PAN No."
//                                     value={values.panNo || ""}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${values.panNo && !validatePAN(values.panNo) ? 'is-invalid' : ''}`}
//                                 />
//                                 {values.panNo && !validatePAN(values.panNo) && (
//                                     <div className="invalid-feedback">
//                                         Invalid PAN format. Should be like: ABCDE1234F
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="allowedBidding" className="form-label mb-1">
//                                     Allowed for Bidding<span style={{ color: "red" }}>*</span>
//                                 </Label>
//                                 <Input
//                                     type="select"
//                                     required
//                                     id="allowedBidding"
//                                     name="allowedBidding"
//                                     value={values.allowedBidding || ""}
//                                     onChange={handleInputChange}
//                                     className="form-select"
//                                 >
//                                     <option value="">Select Option</option>
//                                     <option value="Yes">Yes</option>
//                                     <option value="No">No</option>
//                                 </Input>
//                             </div>

//                             <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                 <Label htmlFor="transporterRating" className="form-label mb-1">
//                                     Rating (auto Calculated)
//                                 </Label>
//                                 <div className="mt-1">
//                                     <div className="rating-stars">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <span key={star} className="star me-1">
//                                                 <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Status field - Only shown in edit mode */}
//                         {isEdit && (
//                             <div className="d-flex mb-2">
//                                 <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
//                                     <Label className="form-label mb-1">Status<span style={{ color: "red" }}>*</span></Label>
//                                     <Input
//                                         name="status"
//                                         type="select"
//                                         className="form-select"
//                                         value={values.status || ""}
//                                         onChange={handleInputChange}
//                                         required
//                                     >
//                                         {status.map((item, key) => (
//                                             <React.Fragment key={key}>
//                                                 {item.options.map((item, key) => (
//                                                     <option value={item.value} key={key}>{item.label}</option>
//                                                 ))}
//                                             </React.Fragment>
//                                         ))}
//                                     </Input>
//                                 </div>
//                                 <div className="flex-grow-1 mx-2" style={{ width: '66.66%' }}></div>
//                             </div>
//                         )}

//                         {/* Hidden fields to maintain compatibility with backend */}
//                         <input type="hidden" name="ownerPerson" value={values.ownerPerson || values.contactPerson} />
//                         <input type="hidden" name="ownerNumber" value={values.ownerNumber || values.contactNumber} />
//                         <input type="hidden" name="ownerEmail" value={values.ownerEmail || values.contactEmail} />
//                     </div>
//                     <Row>
//                         <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "30px" }}>
//                             <button type="button" className="btn btn-light" onClick={toggle}>Close</button>
//                             <button type="submit" className="btn btn-success">{!!isEdit ? "Update" : "Submit"}</button>
//                         </Col>
//                     </Row>
//                 </ModalBody>
//             </Form>
//         </Modal>
//     );
// };

// export default EditModal;


import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, Row, Col, Label, Input } from "reactstrap";

const EditModal = ({
    isOpen,
    toggle,
    isEdit,
    values,
    handleInputChange,
    handleSubmit
}) => {
    // Status options defined in the same format as original code
    const status = [
        {
            options: [
                { label: "Select Status", value: "" },
                { label: "Active", value: "A" },
                { label: "Deactive", value: "D" },
            ],
        },
    ];

    const validateName = (name) => {
        if (!name) return true; // Allow empty initially
        const nameRegex = /^[A-Za-z0-9 ]+$/;
        return nameRegex.test(name);
    };
    const validateAddress = (address) => {
        if (!address) return true; // Allow empty initially
        const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;  // Example regex to allow alphanumeric and common address symbols
        return addressRegex.test(address);
    };
    const validateContactPerson = (person) => {
        if (!person) return true;
        const personRegex = /^[A-Za-z0-9 ]+$/;
        return personRegex.test(person);
    }

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return true; // Allow empty initially
        const phoneRegex = /^[0-9]{1,10}$/; // Only numbers, max 10 digits
        return phoneRegex.test(phoneNumber);
    };
    // Email validation function
    const validateEmail = (email) => {
        if (!email) return true; // Allow empty initially
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(email);
    };
    const validatePrice = (price) => {
        if (!price) return true; // Allow empty initially
        const priceRegex = /^\d+(\.\d{1,2})?$/; // Accepts numbers with optional 1-2 decimal places
        return priceRegex.test(price);
    };
    const validateTaxInfo = (taxInfo) => {
        if (!taxInfo) return true; // Allow empty initially
        const taxInfoRegex = /^[a-zA-Z0-9\s\-\/&. ]+$/; // Letters, numbers, space, -, /, &, .
        return taxInfoRegex.test(taxInfo);
    };

    const validateRegionLocation = (region) => {
        if (!region) return true;
        const regionRegex = /^[a-zA-Z\s,.\-()&/ ]{2,100}$/;
        return regionRegex.test(region);
    };

    const validateSLA = (sla) => {
        if (!sla) return true;
        const slaRegex = /^[a-zA-Z0-9\s\-\/&.() ]+$/;
        return slaRegex.test(sla);
    };

    const validatePAN = (panNumber) => {
        if (!panNumber) return true;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(panNumber);
    };

    const validateGST = (gstNumber) => {
        if (!gstNumber) return true;
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gstNumber);
    };

    return (
        <Modal id="showModal" isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader className="bg-light p-3" toggle={toggle}>
                {!!isEdit ? "Edit Transporter" : "Add Transporter"}
            </ModalHeader>
            <Form className="tablelist-form" onSubmit={handleSubmit}>
                <ModalBody className="p-3">
                    <div>
                        {/* ROW 1: Transporter Code, Name, Address */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="code" className="form-label">
                                            Transporter Code
                                        </Label>
                                        <Input
                                            type="text"
                                            id="code"
                                            name="code"
                                            placeholder="Enter Transporter Code"
                                            value={values.code || ""}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            disabled={true}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="name" className="form-label">
                                            Transporter Name<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="name"
                                            name="name"
                                            placeholder="Enter Transporter Name"
                                            value={values.name || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.name && !validateName(values.name) ? 'is-invalid' : ''}`}
                                        />
                                        {values.name && !validateName(values.name) && (
                                            <div className="invalid-feedback">
                                                Invalid name. Only letters, spaces and numbers are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                            
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="name" className="form-label">
                                            Transporter Name<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="name"
                                            name="name"
                                            placeholder="Enter Transporter Name"
                                            value={values.name || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.name && !validateName(values.name) ? 'is-invalid' : ''}`}
                                        />
                                        {values.name && !validateName(values.name) && (
                                            <div className="invalid-feedback">
                                                Invalid name. Only letters, spaces and numbers are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="address" className="form-label">
                                            Address<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="address"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={values.address || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.address && !validateAddress(values.address) ? 'is-invalid' : ''}`}
                                        />
                                        {values.address && !validateAddress(values.address) && (
                                            <div className="invalid-feedback">
                                                Invalid address. Only letters, numbers, spaces, and basic punctuation are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="address" className="form-label">
                                            Address<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="address"
                                            name="address"
                                            placeholder="Enter Address"
                                            value={values.address || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.address && !validateAddress(values.address) ? 'is-invalid' : ''}`}
                                        />
                                        {values.address && !validateAddress(values.address) && (
                                            <div className="invalid-feedback">
                                                Invalid address. Only letters, numbers, spaces, and basic punctuation are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="contactPerson" className="form-label">
                                            Contact Person<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="contactPerson"
                                            name="contactPerson"
                                            placeholder="Enter Contact Person"
                                            value={values.contactPerson || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactPerson && !validateContactPerson(values.contactPerson) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactPerson && !validateContactPerson(values.contactPerson) && (
                                            <div className="invalid-feedback">
                                                Invalid details. Only letters, spaces and numbers are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 2: Contact Person/Phone, Phone/Email, Email/Mode (based on Edit/Add) */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="contactPerson" className="form-label">
                                            Contact Person<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="contactPerson"
                                            name="contactPerson"
                                            placeholder="Enter Contact Person"
                                            value={values.contactPerson || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactPerson && !validateContactPerson(values.contactPerson) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactPerson && !validateContactPerson(values.contactPerson) && (
                                            <div className="invalid-feedback">
                                                Invalid details. Only letters, spaces and numbers are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="contactNumber" className="form-label">
                                            Phone No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="contactNumber"
                                            name="contactNumber"
                                            placeholder="Enter Phone Number"
                                            value={values.contactNumber || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactNumber && !validatePhoneNumber(values.contactNumber) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactNumber && !validatePhoneNumber(values.contactNumber) && (
                                            <div className="invalid-feedback">
                                                Invalid phone number. Only numbers allowed and max 10 digits.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="contactNumber" className="form-label">
                                            Phone No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="contactNumber"
                                            name="contactNumber"
                                            placeholder="Enter Phone Number"
                                            value={values.contactNumber || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactNumber && !validatePhoneNumber(values.contactNumber) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactNumber && !validatePhoneNumber(values.contactNumber) && (
                                            <div className="invalid-feedback">
                                                Invalid phone number. Only numbers allowed and max 10 digits.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="contactEmail" className="form-label">
                                            Email ID<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            required
                                            id="contactEmail"
                                            name="contactEmail"
                                            placeholder="Enter Email ID"
                                            value={values.contactEmail || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactEmail && !validateEmail(values.contactEmail) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactEmail && !validateEmail(values.contactEmail) && (
                                            <div className="invalid-feedback">
                                                Please enter a valid email address.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="contactEmail" className="form-label">
                                            Email ID<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="email"
                                            required
                                            id="contactEmail"
                                            name="contactEmail"
                                            placeholder="Enter Email ID"
                                            value={values.contactEmail || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.contactEmail && !validateEmail(values.contactEmail) ? 'is-invalid' : ''}`}
                                        />
                                        {values.contactEmail && !validateEmail(values.contactEmail) && (
                                            <div className="invalid-feedback">
                                                Please enter a valid email address.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label className="form-label">
                                            Mode Of Transport<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="modeTransport"
                                            name="modeTransport"
                                            value={values.modeTransport || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Mode</option>
                                            <option value="Road">Road</option>
                                            <option value="Rail">Rail</option>
                                            <option value="Air">Air</option>
                                            <option value="Sea">Sea</option>
                                            <option value="Multimodal">Multimodal</option>
                                        </Input>
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 3: Mode of Transport/Price, Price/Term of Payment, Term of Payment/Tax Information */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label className="form-label">
                                            Mode Of Transport<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="modeTransport"
                                            name="modeTransport"
                                            value={values.modeTransport || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Mode</option>
                                            <option value="Road">Road</option>
                                            <option value="Rail">Rail</option>
                                            <option value="Air">Air</option>
                                            <option value="Sea">Sea</option>
                                            <option value="Multimodal">Multimodal</option>
                                        </Input>
                                    </>
                                ) : (
                                    <>
                                        <Label className="form-label">
                                            Price (Per KM)<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="priceKm"
                                            name="priceKm"
                                            placeholder="Enter Price Per KM"
                                            value={values.priceKm || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.priceKm && !validatePrice(values.priceKm) ? 'is-invalid' : ''}`}
                                        />
                                        {values.priceKm && !validatePrice(values.priceKm) && (
                                            <div className="invalid-feedback">
                                                Price must be a valid number (e.g., 25 or 25.50).
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label className="form-label">
                                            Price (Per KM)<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="priceKm"
                                            name="priceKm"
                                            placeholder="Enter Price Per KM"
                                            value={values.priceKm || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.priceKm && !validatePrice(values.priceKm) ? 'is-invalid' : ''}`}
                                        />
                                        {values.priceKm && !validatePrice(values.priceKm) && (
                                            <div className="invalid-feedback">
                                                Price must be a valid number (e.g., 25 or 25.50).
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="termsOfPayment" className="form-label">
                                            Term of Payment<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="termPayment"
                                            name="termPayment"
                                            value={values.termPayment || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Term</option>
                                            <option value="Online">Online</option>
                                            <option value="Cash">Cash</option>
                                        </Input>
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="termsOfPayment" className="form-label">
                                            Term of Payment<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="termPayment"
                                            name="termPayment"
                                            value={values.termPayment || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Term</option>
                                            <option value="Online">Online</option>
                                            <option value="Cash">Cash</option>
                                        </Input>
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="taxInformation" className="form-label">
                                            Tax Information<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="taxInfo"
                                            name="taxInfo"
                                            placeholder="Enter Tax Information"
                                            value={values.taxInfo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.taxInfo && !validateTaxInfo(values.taxInfo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.taxInfo && !validateTaxInfo(values.taxInfo) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 4: Tax Information/Region, Region/Service Level Agreement, Service Level Agreement/GST No. */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="taxInformation" className="form-label">
                                            Tax Information<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="taxInfo"
                                            name="taxInfo"
                                            placeholder="Enter Tax Information"
                                            value={values.taxInfo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.taxInfo && !validateTaxInfo(values.taxInfo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.taxInfo && !validateTaxInfo(values.taxInfo) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="regionLocation" className="form-label">
                                            Region/Location<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="regionLocation"
                                            name="regionLocation"
                                            placeholder="Enter Region/Location"
                                            value={values.regionLocation || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.regionLocation && !validateRegionLocation(values.regionLocation) ? 'is-invalid' : ''}`}
                                        />
                                        {values.regionLocation && !validateRegionLocation(values.regionLocation) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="regionLocation" className="form-label">
                                            Region/Location<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="regionLocation"
                                            name="regionLocation"
                                            placeholder="Enter Region/Location"
                                            value={values.regionLocation || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.regionLocation && !validateRegionLocation(values.regionLocation) ? 'is-invalid' : ''}`}
                                        />
                                        {values.regionLocation && !validateRegionLocation(values.regionLocation) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, and . are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="serviceLevelAgreement" className="form-label">
                                            Service Level Agreement<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="serviceLevelAgreement"
                                            name="serviceLevelAgreement"
                                            placeholder="Enter SLA"
                                            value={values.serviceLevelAgreement || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) ? 'is-invalid' : ''}`}
                                        />
                                        {values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, ., and () are allowed.
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="serviceLevelAgreement" className="form-label">
                                            Service Level Agreement<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="serviceLevelAgreement"
                                            name="serviceLevelAgreement"
                                            placeholder="Enter SLA"
                                            value={values.serviceLevelAgreement || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) ? 'is-invalid' : ''}`}
                                        />
                                        {values.serviceLevelAgreement && !validateSLA(values.serviceLevelAgreement) && (
                                            <div className="invalid-feedback">
                                                Invalid format. Only letters, numbers, spaces, -, /, &, ., and () are allowed.
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="gstnNo" className="form-label">
                                            GST No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="gstnNo"
                                            name="gstnNo"
                                            placeholder="Enter GST No."
                                            value={values.gstnNo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.gstnNo && !validateGST(values.gstnNo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.gstnNo && !validateGST(values.gstnNo) && (
                                            <div className="invalid-feedback">
                                                Invalid GST format. Should be like: 27AAPFU0939F1ZV
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 5: GST No./PAN No., PAN No./Allowed Bidding, Allowed Bidding/Rating */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="gstnNo" className="form-label">
                                            GST No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="gstnNo"
                                            name="gstnNo"
                                            placeholder="Enter GST No."
                                            value={values.gstnNo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.gstnNo && !validateGST(values.gstnNo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.gstnNo && !validateGST(values.gstnNo) && (
                                            <div className="invalid-feedback">
                                                Invalid GST format. Should be like: 27AAPFU0939F1ZV
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="panNo" className="form-label">
                                            PAN No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="panNo"
                                            name="panNo"
                                            placeholder="Enter PAN No."
                                            value={values.panNo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.panNo && !validatePAN(values.panNo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.panNo && !validatePAN(values.panNo) && (
                                            <div className="invalid-feedback">
                                                Invalid PAN format. Should be like: ABCDE1234F
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="panNo" className="form-label">
                                            PAN No.<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            id="panNo"
                                            name="panNo"
                                            placeholder="Enter PAN No."
                                            value={values.panNo || ""}
                                            onChange={handleInputChange}
                                            className={`form-control ${values.panNo && !validatePAN(values.panNo) ? 'is-invalid' : ''}`}
                                        />
                                        {values.panNo && !validatePAN(values.panNo) && (
                                            <div className="invalid-feedback">
                                                Invalid PAN format. Should be like: ABCDE1234F
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="allowedBidding" className="form-label">
                                            Allowed for Bidding<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="allowedBidding"
                                            name="allowedBidding"
                                            value={values.allowedBidding || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Input>
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="allowedBidding" className="form-label">
                                            Allowed for Bidding<span style={{ color: "red" }}>*</span>
                                        </Label>
                                        <Input
                                            type="select"
                                            required
                                            id="allowedBidding"
                                            name="allowedBidding"
                                            value={values.allowedBidding || ""}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Select Option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Input>
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor="transporterRating" className="form-label">
                                            Rating (auto Calculated)
                                        </Label>
                                        <div className="mt-2">
                                            <div className="rating-stars">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className="star me-1">
                                                        <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* ROW 6: Rating/Status, Status (Edit mode only) */}
                        <Row className="mb-1">
                            <Col md={4}>
                                {isEdit ? (
                                    <>
                                        <Label htmlFor="transporterRating" className="form-label">
                                            Rating (auto Calculated)
                                        </Label>
                                        <div className="mt-2">
                                            <div className="rating-stars">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className="star me-1">
                                                        <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div></div>
                                )}
                            </Col>

                            <Col md={4}>
                                {isEdit && (
                                    <>
                                        <Label className="form-label">Status<span style={{ color: "red" }}>*</span></Label>
                                        <Input
                                            name="status"
                                            type="select"
                                            className="form-select"
                                            value={values.status || ""}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {status.map((item, key) => (
                                                <React.Fragment key={key}>
                                                    {item.options.map((item, key) => (
                                                        <option value={item.value} key={key}>{item.label}</option>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </Input>
                                    </>
                                )}
                            </Col>

                            <Col md={4}>
                                <div></div>
                            </Col>
                        </Row>

                        {/* Hidden fields to maintain compatibility with backend */}
                        <input type="hidden" name="ownerPerson" value={values.ownerPerson || values.contactPerson} />
                        <input type="hidden" name="ownerNumber" value={values.ownerNumber || values.contactNumber} />
                        <input type="hidden" name="ownerEmail" value={values.ownerEmail || values.contactEmail} />
                    </div>
                    <div>
                        <div className="hstack gap-2 justify-content-end" style={{ marginTop: "30px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}>Close</button>
                            <button type="submit" className="btn btn-success">{!!isEdit ? "Update" : "Submit"}</button>
                        </div>
                    </div>
                </ModalBody>
            </Form>
        </Modal>
    );
};

export default EditModal;