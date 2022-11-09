import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import { tableData } from '../../data/dummyTableData'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input } from 'reactstrap';
import { BasicModal,Simple,StaticExample,NewMessage,SendMessage,ModalTitle,Close,SaveChanges,VerticallyCentered,TooltipsAndPopovers,UsingTheGrid,SizesModal,LargeModal,SmallModal,ScrollingLongContent,VaryingModalContent } from '../../constant';


const ViewUsers = () => {

  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [button, showButton] = useState(false);
  const [modalData, setModalData] = useState({});
  
  const [modal, setModal] = useState(false);

  const toggle = (row) => {
    setModal(!modal);
    setModalData(row);
    console.log(modalData);
  };

  const tableColumns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      center: true,
    },
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
      center: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      center: true,
    },
    {
      cell: row => (<button className="btn btn-link" onClick={() => toggle(row)} >Edit</button>),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ]

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/user/getUsers',  
      {headers : 
        {accessToken: localStorage.getItem('token')}, })
      .then((response) => {
        setData(response.data);
    });
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
      .post('http://127.0.0.1:8000/user/deleteUsers', 
      {id: selectedRows.map(r => r.id)}, 
      {headers : 
        {accessToken: localStorage.getItem('token')}, })
      .then((response) => {
            setToggleCleared(!toggleCleared);
            setData(differenceBy(data, selectedRows, 'username'));
            showButton(false);
            toast.success("Successfully Deleted")
      }).catch((error) => {
            toast.error("Error Deleting User");
      });
    }
  };

  const handleUpdate = () => {
    axios
      .post('http://127.0.0.1:8000/user/updateUser', 
      {modalData}, 
      {headers : 
        {accessToken: localStorage.getItem('token')}, })
      .then((response) => {
            toast.success("Successfully Updated");
            const temp = data.map((item) => {
              if (item.id === modalData.id) {
                return modalData;
              }
              return item;
            });
            setData(temp);
            setModal(false);
      }).catch((error) => {
            toast.error("Error Updating User");
      }); 
  }

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
                <Label for="ID">ID</Label>
                <Input name="id" value={modalData.id} disabled/>
              </FormGroup>
              <FormGroup>
                <Label for="Username">Username</Label>
                <Input name="username" onChange={handleChange} defaultValue={modalData.username}/>
              </FormGroup>
              <FormGroup>
                <Label for="Email">Email</Label>
                <Input name="email" onChange={handleChange} id="email" defaultValue={modalData.email}/>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>{' '}
            <Button color="secondary" onClick={toggle}>{Close}</Button>
          </ModalFooter>
        </Modal>
      <Breadcrumb parent="Dashboard" title="View Users" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5>{"Users"}</h5>
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
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default ViewUsers;