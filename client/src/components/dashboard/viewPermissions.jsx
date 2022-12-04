import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import { tableData } from '../../data/dummyTableData'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input } from 'reactstrap';
import { BasicModal,Simple,StaticExample,NewMessage,SendMessage,ModalTitle,Close,SaveChanges,VerticallyCentered,TooltipsAndPopovers,UsingTheGrid,SizesModal,LargeModal,SmallModal,ScrollingLongContent,VaryingModalContent } from '../../constant';


const ViewPermissions = () => {

  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [button, showButton] = useState(false);

  const [modalData, setModalData] = useState({});
  const [modal, setModal] = useState(false);
  const [permissions, setPermissions] = useState([]);

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

  const getPermissions = () => {
    axios
      .get('http://127.0.0.1:8000/permissions/getPermissions',
      {headers :
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setPermissions(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserPermissions = () => {
    axios
    .get('http://127.0.0.1:8000/permissions/getAllUserPermissions',  
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
          name: <div>Email</div>,
          selector: 'email',
          sortable: true,
        },
        {
          name: <div>Phone</div>,
          selector: 'phone',
          sortable: true,
        },
        {
          name: <div>Designation</div>,
          selector: 'designation',
          sortable: true,
        },
        {
          name: <div>Permissions</div>,
          selector: 'permissions_name',
          sortable: true,
          maxWidth: '200px',
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
  };


  useEffect(() => {
    getPermissions();
   getUserPermissions();
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
      .post('http://127.0.0.1:8000/user/updateUser',
      modalData, 
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        if(response.data.status == true){
          toast.success("Successfully Updated")
          getUserPermissions();
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
                <Label for="designation">Designation</Label>
                <Input
                  type="text"
                  name="designation"
                  id="designation"
                  placeholder="designation"
                  value={modalData.designation}
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
                <Label for="permissions">Permissions</Label>
                <Input
                  type="select"
                  name="permissions"
                  id="permissions"
                  value={modalData.permissions}
                  onChange={handleChange}
                >
                  <option value="">Select Permissions</option>
                  {permissions.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>
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

export default ViewPermissions;