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

    return (
        <Modal id="showModal" isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader className="bg-light p-3" toggle={toggle}>
                {!!isEdit ? "Edit Transporter" : "Add Transporter"}
            </ModalHeader>
            <Form className="tablelist-form" onSubmit={handleSubmit}>
                <ModalBody className="p-3">
                    <div>
                        <h5 className="modal-title mb-2">Transporter Details</h5>

                        {/* ROW 1: Code, Name, Address */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="code" className="form-label mb-1">
                                    Transporter Code<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="code"
                                    name="code"
                                    placeholder="Enter Transporter Code"
                                    value={values.code}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                <Label htmlFor="name" className="form-label mb-1">
                                    Transporter Name<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="name"
                                    name="name"
                                    placeholder="Enter Transporter Name"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="address" className="form-label mb-1">
                                    Address<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="address"
                                    name="address"
                                    placeholder="Enter Address"
                                    value={values.address}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* ROW 2: Contact Person, Phone, Email */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="contactPerson" className="form-label mb-1">
                                    Contact Person<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="contactPerson"
                                    name="contactPerson"
                                    placeholder="Enter Contact Person"
                                    value={values.contactPerson}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                <Label htmlFor="contactNumber" className="form-label mb-1">
                                    Phone No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="Enter Phone Number"
                                    value={values.contactNumber}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="contactEmail" className="form-label mb-1">
                                    Email ID<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="email"
                                    required
                                    id="contactEmail"
                                    name="contactEmail"
                                    placeholder="Enter Email ID"
                                    value={values.contactEmail}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* ROW 3: Mean, Mode, Price */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="meanOfTransport" className="form-label mb-1">
                                    Mean Of Transport<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="meanOfTransport"
                                    name="meanOfTransport"
                                    value={values.meanOfTransport}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select Mean</option>
                                    <option value="Truck">Truck</option>
                                    <option value="Van">Van</option>
                                    <option value="Container">Container</option>
                                </Input>
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                <Label htmlFor="modeOfTransport" className="form-label mb-1">
                                    Mode Of Transport<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="modeOfTransport"
                                    name="modeOfTransport"
                                    value={values.modeOfTransport}
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
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="pricePerKm" className="form-label mb-1">
                                    Price (Per KM)<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="number"
                                    required
                                    id="pricePerKm"
                                    name="pricePerKm"
                                    placeholder="Enter Price Per KM"
                                    value={values.pricePerKm}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* ROW 4: Term, Tax, Region */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="termsOfPayment" className="form-label mb-1">
                                    Term Of Payment<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="termsOfPayment"
                                    name="termsOfPayment"
                                    value={values.termsOfPayment}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select Term</option>
                                    <option value="Online">Online</option>
                                    <option value="Net30">Net 30</option>
                                    <option value="Net45">Net 45</option>
                                    <option value="Net60">Net 60</option>
                                </Input>
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                <Label htmlFor="taxInformation" className="form-label mb-1">
                                    Tax Information<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="taxInformation"
                                    name="taxInformation"
                                    placeholder="Enter Tax Information"
                                    value={values.taxInformation}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="regionLocation" className="form-label mb-1">
                                    Region/Location<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="regionLocation"
                                    name="regionLocation"
                                    placeholder="Enter Region/Location"
                                    value={values.regionLocation}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* ROW 5: SLA, GST, PAN */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="serviceLevelAgreement" className="form-label mb-1">
                                    Service Level Agreement<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="serviceLevelAgreement"
                                    name="serviceLevelAgreement"
                                    placeholder="Enter SLA"
                                    value={values.serviceLevelAgreement}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                <Label htmlFor="gstnNo" className="form-label mb-1">
                                    GST No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="gstnNo"
                                    name="gstnNo"
                                    placeholder="Enter GST No."
                                    value={values.gstnNo}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="panNo" className="form-label mb-1">
                                    PAN No.<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    id="panNo"
                                    name="panNo"
                                    placeholder="Enter PAN No."
                                    value={values.panNo}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* ROW 6: Bidding, Status, Rating - Reordered as requested */}
                        <div className="d-flex mb-2">
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="allowedForBidding" className="form-label mb-1">
                                    Allowed for Bidding<span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input
                                    type="select"
                                    required
                                    id="allowedForBidding"
                                    name="allowedForBidding"
                                    value={values.allowedForBidding}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Select Option</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Input>
                            </div>
                            <div className="flex-grow-1 mx-2" style={{ width: '33.33%' }}>
                                {isEdit ? (
                                    <>
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
                                                    {item.options.map((item, key) => (
                                                        <option value={item.value} key={key}>{item.label}</option>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </Input>
                                    </>
                                ) : (
                                    <div className="invisible">
                                        <Label className="form-label mb-1">Placeholder</Label>
                                        <Input
                                            type="text"
                                            className="form-control"
                                            disabled
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow-1" style={{ width: '33.33%' }}>
                                <Label htmlFor="transporterRating" className="form-label mb-1">
                                    Rating (auto Calculated)
                                </Label>
                                <div className="mt-1">
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className="star me-1">
                                                <i className={`ri-star-${parseInt(values.transporterRating || 0) >= star ? 'fill' : 'line'} text-warning fs-16`}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden fields to maintain compatibility with backend */}
                        <input type="hidden" name="ownerPerson" value={values.ownerPerson || values.contactPerson} />
                        <input type="hidden" name="ownerNumber" value={values.ownerNumber || values.contactNumber} />
                        <input type="hidden" name="ownerEmail" value={values.ownerEmail || values.contactEmail} />
                    </div>
                    <Row>
                        <Col md={12} className="hstack gap-2 justify-content-end" style={{ marginTop: "30px" }}>
                            <button type="button" className="btn btn-light" onClick={toggle}>Close</button>
                            <button type="submit" className="btn btn-success">{!!isEdit ? "Update" : "Add Transporter"}</button>
                        </Col>
                    </Row>
                </ModalBody>
            </Form>
        </Modal>
    );
};

export default EditModal;