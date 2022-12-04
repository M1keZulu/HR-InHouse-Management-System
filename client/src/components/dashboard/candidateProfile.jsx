import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Breadcrumb from '../../layout/breadcrumb'
import axios from 'axios';
import { Container, Row, Col, Card, CardHeader, Media, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { toast } from 'react-toastify';
import {Email,MarekjecnoMailId,BOD,DDMMYY,Designer,ContactUs,ContactUsNumber,LocationDetails,JOHANDIO,UserProfileDesc1,UserProfileDesc2,UserProfileDesc3,Comment,MarkJecno,Like,Follower,Following,Location} from '../../constant'
import { data } from '../charts/chartsjs/chartsData';

const CandidateProfile = (props) => {

  const params = useParams();
  const id = params.id;

  const [candidate, setCandidate] = useState();
  const [candidateEducation, setCandidateEducation] = useState();
  const [candidateExperience, setCandidateExperience] = useState();

  const [modalData, setModalData] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = (row) => {
    setModal(!modal);
    setModalData(row);
  };

  const handleChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const addCandidateEducation = () => {
    var sendData =
    {
      'candidatecv_id': id,
      'degree_type': modalData.degree_type,
      'institute': modalData.institute,
      'starting_date': modalData.starting_date,
      'ending_date': modalData.ending_date
    }
    axios
    .post('http://127.0.0.1:8000/candidates/addCandidateEducation', 
    sendData,
    {headers : 
      {'x-access-token': localStorage.getItem('token') } })
    .then((response) => {
      if(response.data.status===true){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }   
      toggle();
    });
  };

  const getCandidateEducation = async () => {
    axios
      .get('http://127.0.0.1:8000/candidates/getCandidateEducation/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setCandidateEducation(response.data.data);
    });
  }
  
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/candidates/getCandidateProfile/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setCandidate(response.data.data[0]);
    });
  }, []);

  useEffect(() => {
    getCandidateEducation();
  }, []);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/candidates/getCandidateExperience/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setCandidateExperience(response.data.data);
    });
  }, []);


  return (
    <Fragment>
      <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered">
          <ModalHeader toggle={toggle}>Add Education Details</ModalHeader>
          <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleEmail">Institute Name</Label>
              <Input type="text" name="institute" id="institute" placeholder="Enter Institute Name" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Degree Type</Label>
              <Input type="text" name="degree_type" id="degree_type" placeholder="Enter Degree" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Start Date</Label>
              <Input type="date" name="starting_date" id="start_date" placeholder="Enter Start Date" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">End Date</Label>
              <Input type="date" name="ending_date" id="end_date" placeholder="Enter End Date" onChange={handleChange} />
            </FormGroup>
          </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={addCandidateEducation}>Add</Button>
            <Button color="secondary" onClick={toggle}>{'Close'}</Button>
          </ModalFooter>
        </Modal>
      <Breadcrumb parent="Users" title="Candidate Profile" />
      <Container fluid={true}>
        <div className="user-profile">
          <Row>
            <Col sm="12">
              <Card className="card hovercard text-center">
                <div>
                  <br></br>
                  <br></br>
                </div>
                <div className="user-image">
                  <div className="avatar"><Media body alt="" src={require('../../assets/images/user/7.jpg')} data-intro="Profile image" /></div>
                </div>
                <div className="info">
                  <Row>
                    <Col sm="6" lg="4" className="order-sm-1 order-xl-0">
                      <Row >
                        <Col md="6">
                          <div className="ttl-info text-start">
                            <h6><i className="fa fa-envelope me-2"></i> {'Email'}</h6><span>{candidate && candidate.email}</span>
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="ttl-info text-start ttl-sm-mb-0">
                            <h6><i className="fa fa-calendar"></i>   {'DOB'}</h6><span>{candidate && candidate.dob}</span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm="12" lg="4" className="order-sm-0 order-xl-1">
                      <div className="user-designation">
                        <div className="title">{candidate && candidate.first_name + ' ' + candidate.last_name}</div>
                        <div className="desc mt-2">{Designer}</div>
                      </div>
                    </Col>
                    <Col sm="6" lg="4" className="order-sm-2 order-xl-2">
                      <Row>
                        <Col md="6">
                          <div className="ttl-info text-start ttl-xs-mt">
                            <h6><i className="fa fa-phone"></i>   {'Phone'}</h6><span>{candidate && candidate.phone}</span>
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="ttl-info text-start ttl-sm-mb-0">
                            <h6><i className="fa fa-location-arrow"></i>   {'Location'}</h6><span>{candidate && candidate.location}</span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <hr />
                </div>
              </Card>
            </Col>
            <Col sm="12" >
              <Card>
                <div className="profile-img-style">
                  <Row>
                    <Col sm="8">
                        <div className="media-body align-self-center">
                          <h5 className="mt-0 user-name">{'Education Details'}</h5>
                        </div>
                    </Col>
                    <Col sm="4">
                      <button className="btn btn-primary" onClick={toggle}>Add Education</button>
                    </Col>
                  </Row>
                  <hr />
                  {candidateEducation && candidateEducation.map((education) => (
                    <div className="media">
                      <div className="media-body">
                        <h6 className="mt-0 f-w-600">{education.degree_type}</h6>
                        <p>{education.degree_name}</p>
                        <p>{education.institute}</p>
                        <p>{education.starting_date}</p>
                        <p>{education.ending_date}</p>
                      </div>
                    </div>
                  ))}
                  <div className="img-container">
                    <div id="aniimated-thumbnials">
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col sm="12" >
              <Card>
                <div className="profile-img-style">
                  <Row>
                    <Col sm="8">
                        <div className="media-body align-self-center">
                          <h5 className="mt-0 user-name">{'Job History'}</h5>
                        </div>
                    </Col>
                    <Col sm="4" className="align-self-center">
                    </Col>
                  </Row>
                  <hr />
                  <p>{UserProfileDesc1}</p>
                  <div className="img-container">
                    <div id="aniimated-thumbnials">
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col sm="12" >
              <Card>
                <div className="profile-img-style">
                  <Row>
                    <Col sm="8">
                        <div className="media-body align-self-center">
                          <h5 className="mt-0 user-name">{'Skills'}</h5>
                        </div>
                    </Col>
                    <Col sm="4" className="align-self-center">
                    </Col>
                  </Row>
                  <hr />
                  <p>{UserProfileDesc1}</p>
                  <div className="img-container">
                    <div id="aniimated-thumbnials">
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}

export default CandidateProfile;