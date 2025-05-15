import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';

const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");

  const handleCancelBid = () => {
    onCancelBid(bidNo, remark);
    setRemark("");
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Cancel Bid
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
            <Input
              type="textarea"
              id="remark"
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={5}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleCancelBid}>
          Cancel Bid
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CancelBidModal;