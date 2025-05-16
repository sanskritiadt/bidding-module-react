// import React, { useState } from 'react';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button
// } from 'reactstrap';

// const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
//   const [remark, setRemark] = useState("");

//   const handleCancelBid = () => {
//     onCancelBid(bidNo, remark);
//     setRemark("");
//     toggle();
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered>
//       <ModalHeader toggle={toggle}>
//         Cancel Bid
//       </ModalHeader>
//       <ModalBody>
//         <Form>
//           <FormGroup>
//             <Label for="remark">Add Remark <span className="text-danger">*</span></Label>
//             <Input
//               type="textarea"
//               id="remark"
//               placeholder="Remark"
//               value={remark}
//               onChange={(e) => setRemark(e.target.value)}
//               rows={5}
//             />
//           </FormGroup>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleCancelBid}>
//           Cancel Bid
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default CancelBidModal;
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelBid = async () => {
    // Validate remark
    if (!remark.trim()) {
      toast.error("Please enter a remark before cancelling the bid");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Show loading toast
      const toastId = toast.loading("Cancelling bid...");
      
      // Call the parent function to handle the API call
      const result = await onCancelBid(bidNo, remark);
      
      if (result.success) {
        // Show success toast
        toast.update(toastId, {
          render: result.message || `Bid ${bidNo} cancelled successfully`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
        
        // Reset form and close modal
        setRemark("");
        toggle();
      } else {
        // Show error toast
        toast.update(toastId, {
          render: result.message || "Failed to cancel bid",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      }
    } catch (error) {
      // Handle unexpected errors
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
          <Button 
            color="secondary" 
            onClick={toggle}
            className="me-2"
            disabled={isSubmitting}
          >
            Close
          </Button>
          <Button 
            color="primary" 
            onClick={handleCancelBid}
            disabled={isSubmitting || !remark.trim()}
          >
            {isSubmitting ? 'Processing...' : 'Cancel Bid'}
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default CancelBidModal;