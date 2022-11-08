import React, { Fragment, useEffect, useState } from 'react';
import Breadcrumb from '../../layout/breadcrumb'
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import DatePicker from "react-datepicker";
import ApexCharts from 'react-apexcharts';
import Knob from "knob";
import ChartistChart from 'react-chartist';
import { smallchart1data, smallchart1option, smallchart2data, smallchart2option, smallchart3data, smallchart3option, smallchart4data, smallchart4option } from './chartsData/chartist-charts-data';
import { Currentlysale, Marketvalue } from './chartsData/apex-charts-data';
import { Send, Clock } from 'react-feather';
import { Dashboard, Summary, NewsUpdate, Appointment, Notification, MarketValue, Chat, New, Tomorrow, Yesterday, Daily, Weekly, Monthly, Store, Online, ReferralEarning, CashBalance, SalesForcasting, Purchase, Sales, SalesReturn, PurchaseRet, PurchaseOrderValue, ProductOrderValue, Pending, Yearly, Hot, Today, VenterLoren, Done, JohnLoren, Year, Month, Day, RightNow } from '../../constant';


const Home = () => {

  const [daytimes, setDayTimes] = useState()
  const today = new Date()
  const curHr = today.getHours()
  const curMi = today.getMinutes()
  const [meridiem, setMeridiem] = useState("AM")
  const startDate = new Date();
  const handleChange = date => {
    new Date()
  };

  useEffect(() => {

    if (curHr < 12) {
      setDayTimes('Good Morning')
    } else if (curHr < 18) {
      setDayTimes('Good Afternoon')
    } else {
      setDayTimes('Good Evening')
    }

    if (curHr >= 12) {
      setMeridiem('PM')
    } else {
      setMeridiem('AM')
    }

  }, [curHr])

  return (
    <Fragment>
      <Breadcrumb parent="Dashboard" title="Home" />
      <Container fluid={true}>
        <Row className="second-chart-list third-news-update">
          <Col xl="4 xl-50" lg="12" className="morning-sec box-col-12">
            <Card className="o-hidden profile-greeting">
              <CardBody>
                <div className="media">
                  <div className="badge-groups w-100">
                    <div className="badge f-12">
                      <Clock style={{ width: "16px", height: "16px" }} className="me-1" />
                      <span id="txt">{curHr}:{curMi < 10 ? "0" + curMi : curMi} {meridiem}</span>
                    </div>
                    <div className="badge f-12"><i className="fa fa-spin fa-cog f-14"></i></div>
                  </div>
                </div>
                <div className="greeting-user text-center">
                  <div className="profile-vector"><img className="img-fluid" src={require("../../assets/images/dashboard/welcome.png")} alt="" /></div>
                  <h4 className="f-w-600"><span id="greeting">{daytimes}</span> <span className="right-circle"><i className="fa fa-check-circle f-14 middle"></i></span></h4>
                  <p><span> {"Today's earrning is $405 & your sales increase rate is 3.7 over the last 24 hours"}</span></p>
                  <div className="whatsnew-btn"><a className="btn btn-primary" href="#javascript">{"Whats New !"}</a></div>
                  <div className="left-icon"><i className="fa fa-bell"> </i></div>
                </div>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </Fragment>
  );
}

export default Home;