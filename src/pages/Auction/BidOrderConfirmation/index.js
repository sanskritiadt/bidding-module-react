import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import axios from "axios";
import BulkOrder from "../BulkOrder";
import SOBasedOrder from "../SOBasedOrder";

const BidOrderConfirmation = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [bidNo, setBidNo] = useState("");
  const [loading, setLoading] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
 
  useEffect(() => {
    
    document.title = "Bid Management | EPLMS";
    fetchBidNo();
  }, []);

  const fetchBidNo = async () => {
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    let plantcode = obj.data.plantCode;
    try {
      setLoading(true);

      // API call with the provided configuration
      const response = await axios({
        method: 'get',


        url: `http://localhost:8085/biddingMaster/getBidNo?plantCode=${plantcode}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YW1hemluOlRFQE0tV0BSSw=='
        }
      });

      console.log("API Response:", response.data);

      // Check the response structure and extract the bid number
      if (response) {
        // Check if the response has the biddingOrderNo property directly
        if (response.biddingOrderNo) {
          setBidNo(response.biddingOrderNo);
        }
        // If the response has a data property (in case of axios or similar client)
        else if (response.data && response.data.biddingOrderNo) {
          setBidNo(response.data.biddingOrderNo);
        }
        // For any other format, use a default or log an error
        else {
          console.error("Unexpected response format:", response);
          setBidNo("Unknown");
        }
      }
    } catch (error) {
      console.error("Error fetching bid number:", error);
      setBidNo("B545"); // Fallback to default value on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <div className="card-body pt-4">
                  <div>
                    <h2 className="mb-4">
                      Bid No :- {loading ? "Loading..." : bidNo}
                    </h2>
                  </div>


                  <Nav pills className="nav-customs nav-danger mb-3 nav nav-pills">
                    <NavItem>
                      <NavLink
                        id="tab1"
                        style={{ cursor: "pointer" }}
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          handleTabChange("1");
                        }}
                      >
                        Bulk Order
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        id="tab2"
                        style={{ cursor: "pointer" }}
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          handleTabChange("2");
                        }}
                      >
                        SO Based Order
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab} className="text-muted">
                    <TabPane tabId="1" id="bulk-order">
                      <BulkOrder bidNo={bidNo} />
                    </TabPane>

                    {/* SO Based Order Tab */}
                    <TabPane tabId="2" id="so-based-order">
                      <SOBasedOrder />
                    </TabPane>
                  </TabContent>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BidOrderConfirmation;