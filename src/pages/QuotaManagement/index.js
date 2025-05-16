import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import AllTasks from './AllTasks';
import Widgets from './Widgets';
import axios from "axios";

const QuotaManagement = () => {
    document.title="Orders Management | Bid";
    return (
        <React.Fragment>
            <div className="page-content">
            
                <Container fluid>

                    <BreadCrumb title="Orders Management" pageTitle="Auction" />
                    
                    <Row className="row-color-ff" style={{paddingTop:"14px",marginBottom:"-24px"}}>
                        <h2 className="order-mg">Orders Management</h2>
                        <Widgets />
                    </Row>
                    <AllTasks />
                </Container>
            </div>
        </React.Fragment>
    );
};

export default QuotaManagement;