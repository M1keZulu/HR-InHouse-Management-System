import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import { tableData } from '../../data/dummyTableData'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input } from 'reactstrap';
import { BasicModal,Simple,StaticExample,NewMessage,SendMessage,ModalTitle,Close,SaveChanges,VerticallyCentered,TooltipsAndPopovers,UsingTheGrid,SizesModal,LargeModal,SmallModal,ScrollingLongContent,VaryingModalContent } from '../../constant';


const ViewCompanies = () => {

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

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/companies/getCompanies',  
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
            name: <div>Name</div>,
            selector: 'name',
            sortable: true,
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
            name: <div>Email</div>,
            selector: 'email',
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
      .post('http://127.0.0.1:8000/companies/deleteCompany', 
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
      .post('http://127.0.0.1:8000/companies/updateCompany',
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
                  name="name"
                  id="name"
                  placeholder="name"
                  value={modalData.name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="location">Location</Label>
                <Input
                  type="text"
                  name="location"
                  id="location"
                  placeholder="location"
                  value={modalData.location}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
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
                  placeholder="phone"
                  value={modalData.phone}
                  onChange={handleChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>
            <Button color="secondary" onClick={toggle}>{Close}</Button>
          </ModalFooter>
        </Modal>
      <Breadcrumb parent="Dashboard" title="View Companies" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5>{"Companies"}</h5>
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

export default ViewCompanies;