import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import axios from 'axios';
import { Container, Row, Col, Card, CardHeader, Media, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, CardBody } from 'reactstrap'
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import {Email,MarekjecnoMailId,BOD,DDMMYY,Designer,ContactUs,ContactUsNumber,LocationDetails,JOHANDIO,UserProfileDesc1,UserProfileDesc2,UserProfileDesc3,Comment,MarkJecno,Like,Follower,Following,Location} from '../../constant'
import { data } from '../charts/chartsjs/chartsData';
import { useNavigate } from "react-router-dom";

const JobProfile = (props) => {

  const params = useParams();
  const id = params.id;

  const [job, setJob] = useState();
  const [processData, setProcessData] = useState();
  const [processTableColumns, setprocessTableColumns] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [candidateTableColumns, setCandidateTableColumns] = useState([]);
  const navigate = useNavigate();

  const [modalData, setModalData] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = (row) => {
    setModal(!modal);
    setModalData(row);
    console.log(modalData);
  };

  const startProcess = (candidate_id) => {
    axios
      .post('http://127.0.0.1:8000/jobs/startProcess', {
        job_id: id,
        candidate_id: candidate_id,
      }, { headers: { 'x-access-token': localStorage.getItem('token') } })
      .then((response) => {
        if(response.data.status==true){
          toast.success(response.data.message);
          getInProcessCandidates();
          getAllCandidates();
        }
        else{
          toast.error(response.data.message);
        }
      })
  }

  const getAllCandidates = () => {
    axios
      .get('http://127.0.0.1:8000/jobs/getCandidatesNotInProcess/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setCandidateData(response.data.data);
        setCandidateTableColumns([
          {
            name: 'ID',
            selector: 'id',
            sortable: true,
            width: '75px',
          },
          {
            name: <div>First Name</div>,
            selector: 'first_name',
            sortable: true,
          },
          {
            name: <div>Last Name</div>,
            selector: 'last_name',
            sortable: true,
          },
          {
            name: <div>Gender</div>,
            selector: 'gender',
            sortable: false,
          },
          {
            name: <div>Date of Birth</div>,
            selector: 'dob',
            sortable: true,
          },
          {
            name: <div>Email</div>,
            selector: 'email',
            sortable: true,
            width: '200px'
          },
          {
            name: <div>Phone</div>,
            selector: 'phone',
            sortable: true,
          },
          {
            name: <div>Actions</div>,
            cell: (row) => (
              <div>
                <Button color="primary" className="mr-2" onClick={() => navigate('/dashboard/candidateProfile/' + row.id + '/home')}>View</Button>
              </div>
            ),
          },
          {
            name: '',
            cell: (row) => (
              <div>
                <Button color="primary" className="mr-2" onClick={() => startProcess(row.id)}>Start Process</Button>
              </div>
            ),
          },
        ]);
    });
  }

  useEffect(() => {
    getAllCandidates();
  }, []);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/jobs/getJob/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setJob(response.data.data[0]);
        console.log(job);
    });
    getInProcessCandidates();
  }, []);

  const updateStatus = (id) => {
    axios
      .post('http://127.0.0.1:8000/jobs/updateStatus',
      {id: id, status: document.getElementById("status"). value},
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => { 
        getInProcessCandidates();
        toast.success(response.data.message);
    });
  }

  const getInProcessCandidates = () => {
    axios
      .get('http://127.0.0.1:8000/jobs/getInProcessCandidates/' + id,  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setProcessData(response.data.data);
    });
    setprocessTableColumns([
      {
        name: 'ID',
        selector: 'id',
        sortable: true,
        width: '75px',
      },
      {
        name: <div>First Name</div>,
        selector: 'first_name',
        sortable: true,
      },
      {
        name: <div>Last Name</div>,
        selector: 'last_name',
        sortable: true,
      },
      {
        name: <div>Gender</div>,
        selector: 'gender',
        sortable: false,
      },
      {
        name: <div>Date of Birth</div>,
        selector: 'dob',
        sortable: true,
      },
      {
        name: <div>Email</div>,
        selector: 'email',
        sortable: true,
        width: '200px'
      },
      {
        name: <div>Phone</div>,
        selector: 'phone',
        sortable: true,
      },
      {
        name: <div>Job Status</div>,
        selector: 'job_status',
        sortable: true,
      },
      {
        name: <div>Actions</div>,
        cell: (row) => (
          <div>
            <Button color="primary" className="mr-2" onClick={() => navigate('/dashboard/candidateProfile/' + row.id + '/home')}>View</Button>
          </div>
        ),
      },
      {
        name: '',
        width: '200px',
        cell: (row) => (
          <div>
            <Input type="select" name="select" id="status" onChange={() => updateStatus(row.link_id)}>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Not Hired">Not Hired</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Not Reachable">Not Reachable</option>
              <option value="Not Suitable">Not Suitable</option>
              <option value="Not Available">Not Available</option>
              <option value="Not Eligible">Not Eligible</option>
            </Input>
          </div>
        ),
      },
    ]);
  }


  return (
    <Fragment>
      <Breadcrumb parent="Users" title="Job Profile" />
      <Container fluid={true}>
        <div className="user-profile">
          <Row>
            <Col sm="12">
              <Card className="card hovercard text-center">
                <div>
                  <br></br>
                  <br></br>
                </div>
                <div className="info">
                  <Row>
                    <Col sm="6" lg="4" className="order-sm-1 order-xl-0">
                      <Row >
                        <Col md="6">
                          <div className="ttl-info text-start">
                            <h6> {'Status'}</h6><span>{job && job.status}</span>
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="ttl-info text-start ttl-sm-mb-0">
                            <h6> {'Salary'}</h6><span>{job && job.salary}</span>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm="12" lg="4" className="order-sm-0 order-xl-1">
                      <div className="user-designation">
                        <div className="title">{job && job.title}</div>
                      </div>
                    </Col>
                    <Col sm="6" lg="4" className="order-sm-2 order-xl-2">
                      <Row>
                        <Col md="6">
                          <div className="ttl-info text-start ttl-xs-mt">
                            <h6> {'Company Name'}</h6><span>{job && job.company_name}</span>
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
                    <Card>
                        <div className="media-body align-self-center">
                          <h5 className="mt-0 user-name">{'Candidates In Process'}</h5>
                        </div>
                    </Card>
                  </Row>
                  <hr />
                    <CardBody>
                      <DataTable
                        data={processData}
                        columns={processTableColumns}
                        striped={true}
                        center={true}
                        selectableRows
                        persistTableHead
                        />
                    </CardBody>
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
                    <Card>
                        <div className="media-body align-self-center">
                          <h5 className="mt-0 user-name">{'All Candidates'}</h5>
                        </div>
                    </Card>
                  </Row>
                  <hr />
                    <CardBody>
                      <DataTable
                        data={candidateData}
                        columns={candidateTableColumns}
                        striped={true}
                        center={true}
                        selectableRows
                        persistTableHead
                        />
                    </CardBody>
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

export default JobProfile;