import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import { tableData } from '../../data/dummyTableData'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input } from 'reactstrap';
import { BasicModal,Simple,StaticExample,NewMessage,SendMessage,ModalTitle,Close,SaveChanges,VerticallyCentered,TooltipsAndPopovers,UsingTheGrid,SizesModal,LargeModal,SmallModal,ScrollingLongContent,VaryingModalContent } from '../../constant';


const ViewCandidates = () => {

  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [button, showButton] = useState(false);

  const [modalData, setModalData] = useState({});
  const [modal, setModal] = useState(false);
  const [skills, setSkills] = useState([]);

  const toggle = (row) => {
    setModal(!modal);
    setModalData(row);
    console.log(modalData);
  };

  const [tableColumns, setTableColumns] = useState([]);

  //custom style with visible overflow
  const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  const getSkills = () => {
    axios
      .get('http://127.0.0.1:8000/candidates/getAllSkills',
      {headers :
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setSkills(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleAddSkill = (e) => {
    axios
    .post('http://127.0.0.1:8000/candidates/addSkill',
    {'candidatecv_id': modalData.id, 'skill_id': modalData.skill_id},
    {headers:
      {'x-access-token': localStorage.getItem('token')},
    })
    .then((response) => {
      if(response.data.status === true){
        toast.success(response.data.message);
        getSkills();
      }
      else{
        toast.error(response.data.message);
      }
    });
  };

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/candidates/getCandidates',  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setTableColumns([
          {
            name: 'ID',
            selector: 'id',
            sortable: true,
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
            maxWidth: '5px',
          },
          {
            name: <div>Phone</div>,
            selector: 'phone',
            sortable: true,
          },
          {
            name: <div>Location</div>,
            selector: 'location',
            sortable: true,
          },
          {
            name: <div>Mother Language</div>,
            selector: 'mother_language',
            sortable: true,
          },
          {
            name: <div>Job Type</div>,
            selector: 'job_type',
            sortable: true,
          },
          {
            name: <div>Description</div>,
            selector: 'description',
            sortable: true,
          },
          {
            name: <div>Source</div>,
            selector: 'source',
            sortable: true,
          },
          {
            name: <div>Actions</div>,
            cell: (row) => (
              <div>
                <Button color="primary" onClick={() => toggle(row)}>
                  View
                </Button>
              </div>
            ),
          },
        ]);
        setData(response.data.data);
    });
    getSkills();
  }, []);

  const handleChange = (e) => {
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.username)}?`)) {
      axios
      .post('http://127.0.0.1:8000/candidates/deleteCandidate', 
      {id: selectedRows.map(r => r.id)}, 
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
            setToggleCleared(!toggleCleared);
            setData(differenceBy(data, selectedRows, 'id'));
            showButton(false);
            toast.success("Successfully Deleted")
      }).catch((error) => {
            toast.error("Error Deleting User");
      });
    }
  };

  const handleUpdate = () => {
    axios
      .post('http://127.0.0.1:8000/candidates/updateCandidate',
      modalData, 
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        if(response.data.status == true){
          toast.success("Successfully Updated")
        }
        else{
          toast.error("Error Updating Candidate");
          return;
        }
            const temp = data.map((item) => {
              if (item.id === modalData.id) {
                return modalData;
              }
              return item;
            });
            setData(temp);
            setModal(false);
      })
  }

  const handleAddEducation = () => {
    var sendData =
    {
      'candidatecv_id': modalData.id,
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
        document.getElementById("degree_type").value = "";
        document.getElementById("institute").value = "";
        document.getElementById("starting_date").value = "";
        document.getElementById("ending_date").value = "";
      }
      else{
        toast.error(response.data.message);
      }   
    });
  };

  const handleAddExperience = () => {
    var sendData =
    {
      'candidatecv_id': modalData.id,
      'company_name': modalData.company_name,
      'designation': modalData.designation,
      'starting_date': modalData.starting_date,
      'ending_date': modalData.ending_date
    }
    axios
    .post('http://127.0.0.1:8000/candidates/addCandidateExperience', 
    sendData,
    {headers : 
      {'x-access-token': localStorage.getItem('token') } })
    .then((response) => {
      if(response.data.status===true){
        toast.success(response.data.message);
        document.getElementById("company_name").value = "";
        document.getElementById("designation").value = "";
        document.getElementById("starting_date").value = "";
        document.getElementById("ending_date").value = "";
      }
      else{
        toast.error(response.data.message);
      }   
    });
  };

  const contextActions = useMemo(() => {
     if(selectedRows.length > 0) {
      showButton(true);
     }
     else{
      showButton(false);
     }
  }, [data, selectedRows, toggleCleared]);

  return (
    <Fragment>
      <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered">
          <ModalHeader toggle={toggle}>Update Information</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="first_name">First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="First Name"
                  value={modalData.first_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="last_name">Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Last Name"
                  value={modalData.last_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Input
                  type="text"
                  name="gender"
                  id="gender"
                  placeholder="Gender"
                  value={modalData.gender}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="dob">Date of Birth</Label>
                <Input
                  type="text"
                  name="dob"
                  id="dob"
                  placeholder="Date of Birth"
                  value={modalData.dob}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={modalData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  value={modalData.phone}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="location">Location</Label>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="Location"
                  value={modalData.location}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="mother_language">Mother Language</Label>
                <Input
                  type="text"
                  name="mother_language"
                  id="mother_language"
                  placeholder="Mother Language"
                  value={modalData.mother_language}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="job_type">Job Type</Label>
                <Input
                  type="text"
                  name="job_type"
                  id="job_type"
                  placeholder="Job Type"
                  value={modalData.job_type}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={modalData.description}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="source">Source</Label>
                <Input
                  type="text"
                  name="source"
                  id="source"
                  placeholder="Source"
                  value={modalData.source}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
            <Form>
              <h5>Add Candidate Education</h5>
              <FormGroup>
                <Label for="institute">Institute</Label>
                <Input
                  type="text"
                  name="institute"
                  id="institute"
                  placeholder="Institute"
                  value={modalData.institute}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="degree_type">Degree Type</Label>
                <Input
                  type="text"
                  name="degree_type"
                  id="degree_type"
                  placeholder="Degree Type"
                  value={modalData.degree_type}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="start_date">Start Date</Label>
                <Input
                  type="date"
                  name="starting_date"
                  id="starting_date"
                  placeholder="Start Date"
                  value={modalData.start_date}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="end_date">End Date</Label>
                <Input
                  type="date"
                  name="ending_date"
                  id="ending_date"
                  placeholder="End Date"
                  value={modalData.end_date}
                  onChange={handleChange}
                />
                <br/>
                <Button color="primary" onClick={handleAddEducation}>
                  Add Education
                </Button>
              </FormGroup>
              <h5>Add Candidate Experience</h5>
              <FormGroup>
                <Label for="company_name">Company Name</Label>
                <Input
                  type="text"
                  name="company_name"
                  id="company_name"
                  placeholder="Company Name"
                  value={modalData.company_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="designation">Designation</Label>
                <Input
                  type="text"
                  name="designation"
                  id="designation"
                  placeholder="Designation"
                  value={modalData.designation}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="starting_date">Start Date</Label>
                <Input
                  type="date"
                  name="starting_date"
                  id="starting_date"
                  placeholder="Start Date"
                  value={modalData.starting_date}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="ending_date">End Date</Label>
                <Input
                  type="date"
                  name="ending_date"
                  id="ending_date"
                  placeholder="End Date"
                  value={modalData.ending_date}
                  onChange={handleChange}
                />
                <br/>
                <Button color="primary" onClick={handleAddExperience}>
                  Add Experience
                </Button>
              </FormGroup>
              <FormGroup>
                <Label for="skills">Skills</Label>
                <Input type="select" name="skill_id" id="skill_id" onChange={handleChange}>
                  {skills.map((skill) => (
                    <option value={skill.id}>{skill.name}</option>
                  ))}
                </Input>
                <br/>
                <Button color="primary" onClick={handleAddSkill}>
                  Add Skill
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>
            <Button color="secondary" onClick={toggle}>{Close}</Button>
          </ModalFooter>
        </Modal>
      <Breadcrumb parent="Dashboard" title="View Candidates" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5>{"Candidates"}</h5>
                  </Col>
                  <Col sm="auto">
                    { button ? <button key="delete" className="btn btn-danger" onClick={handleDelete}>Delete</button> : null }
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <DataTable
                  data={data}
                  columns={tableColumns}
                  striped={true}
                  center={true}
                  selectableRows
                  persistTableHead
                  contextActions={contextActions}
                  onSelectedRowsChange={handleRowSelected}
                  clearSelectedRows={toggleCleared}
                  customStyles={customStyles}
                  />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default ViewCandidates;