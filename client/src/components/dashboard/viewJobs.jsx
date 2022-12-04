import React, { Fragment, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import differenceBy from 'lodash/differenceBy';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import { tableData } from '../../data/dummyTableData'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input } from 'reactstrap';
import { BasicModal,Simple,StaticExample,NewMessage,SendMessage,ModalTitle,Close,SaveChanges,VerticallyCentered,TooltipsAndPopovers,UsingTheGrid,SizesModal,LargeModal,SmallModal,ScrollingLongContent,VaryingModalContent } from '../../constant';
import { useNavigate } from "react-router-dom";


const ViewJobs = () => {

  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [button, showButton] = useState(false);
  const navigate = useNavigate();


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
        overflow: 'visible',
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/jobs/getJobs',  
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
            name: <div>Job Title</div>,
            selector: 'title',
            sortable: true,
          },
          {
            name: <div>Company Name</div>,
            selector: 'company_name',
            sortable: true,
          },
          {
            name: <div>Description</div>,
            selector: 'description',
            sortable: true,
          },
          {
            name: <div>Salary</div>,
            selector: 'salary',
            sortable: false,
          },
          {
            name: <div>Extra Requirements</div>,
            selector: 'extra_requirements',
            sortable: false,
            width : '200px'
          },
          {
            name: <div>Status</div>,
            selector: 'status',
            sortable: false,
          },
          {
            name: <div>Actions</div>,
            cell: (row) => (
              <div>
                <Button color="primary" onClick={() => navigate(`/dashboard/jobProfile/${row.id}/home`)}>Edit</Button>
              </div>
            ),
          },
        ]);
        setData(response.data.data);
    });
  }, []);

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
      <Breadcrumb parent="Dashboard" title="View Jobs" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5>{"Jobs"}</h5>
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

export default ViewJobs;