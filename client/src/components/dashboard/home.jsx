import React, { Fragment, useEffect, useState } from 'react';
import Breadcrumb from '../../layout/breadcrumb'
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap'
import DatePicker from "react-datepicker";
import ApexCharts from 'react-apexcharts';
import Knob from "knob";
import ChartistChart from 'react-chartist';
import { smallchart1data, smallchart1option, smallchart2data, smallchart2option, smallchart3data, smallchart3option, smallchart4data, smallchart4option } from './chartsData/chartist-charts-data';
import { Currentlysale, Marketvalue } from './chartsData/apex-charts-data';
import { Send, Clock } from 'react-feather';
import { Dashboard, Summary, NewsUpdate, Appointment, Notification, MarketValue, Chat, New, Tomorrow, Yesterday, Daily, Weekly, Monthly, Store, Online, ReferralEarning, CashBalance, SalesForcasting, Purchase, Sales, SalesReturn, PurchaseRet, PurchaseOrderValue, ProductOrderValue, Pending, Yearly, Hot, Today, VenterLoren, Done, JohnLoren, Year, Month, Day, RightNow } from '../../constant';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'
import axios from 'axios';
import Select from 'react-select';

const Home = () => {

  const [daytimes, setDayTimes] = useState()
  const today = new Date()
  const curHr = today.getHours()
  const curMi = today.getMinutes()
  const [meridiem, setMeridiem] = useState("AM")
  const startDate = new Date();
  const [modalData, setModalData] = useState({});
  const [modal, setModal] = useState(false);
  const [formData, updateFormData] = useState({});

  const toggle = (row) => {
    setModal(!modal);
    console.log(row);
    updateFormData({...formData, 'file_id': row.id});
    console.log(modalData);
  };

  const handleChange = (e) => {
    console.log(e);
    setModalData({
      ...modalData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSelect = (e) => {
    var arr = [];
    console.log(e);
    for(let i = 0; i < e.length; i++) {
      arr.push(e[i].value);
    }
    updateFormData({
      ...formData,
      shared: arr
    });
  };


  const handleUpdate = () => {
    axios
    .post('http://127.0.0.1:8000/user/shareFile', 
      formData,
    {headers :
      {'x-access-token': localStorage.getItem('token')} })
    .then((response) => {
      if(response.data.status===true){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }
    }
    )
  }

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

  const [fileTableColumns, setfileTableColumns] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);

  const getFiles = () => {
    axios
      .get('http://127.0.0.1:8000/user/getFiles',  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        setfileTableColumns([
          {
            name: <div>File Name</div>,
            cell: (e) => (
              <div>
                <a href={'http://localhost:8000/' + e.path}>{e.file_name}</a>
              </div>
            ),
          },
          {
            name: <div>Actions</div>,
            cell: (row) => (
              <div>
                <Button color="primary" onClick={() => toggle(row)}>
                  Share
                </Button>
              </div>
            ),
          },
          {
            name: <div></div>,
            cell: (row) => (
              <div>
                {row.first_name ? 'Shared From ' + row.first_name + ' ' + row.last_name : 'Own File'}
              </div>
            ),
          },
          {
            name: <div></div>,
            cell: (row) => (
              <div>
                <Button color="primary" onClick={() => handleDelete(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]);
        setFiles(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSharedFiles = () => {
    axios
      .get('http://127.0.0.1:8000/user/getSharedFiles',
      {headers :
        {'x-access-token': localStorage.getItem('token')} })
      .then((response) => {
        setFiles(files => [...files, ...response.data.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const uploadFile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);
    axios
      .post('http://127.0.0.1:8000/user/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if(response.data.status==true)
        {
          toast.success(response.data.message);
          getFiles();
          getSharedFiles();
        }
        else
        {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (e) => {
    axios
    .post('http://127.0.0.1:8000/user/deleteFile',
      {file_id: e.id},
    {headers :
      {'x-access-token': localStorage.getItem('token')} })
    .then((response) => {
      if(response.data.status===true){
        toast.success(response.data.message);
        getFiles();
        getSharedFiles();
      }
      else{
        toast.error(response.data.message);
      }
    }
    )
  }



  const getUsers = () => {
    axios
    .get('http://127.0.0.1:8000/permissions/getAllUserPermissions',  
    {headers : 
      {'x-access-token': localStorage.getItem('token')}, })
    .then((response) => {
      setUsers(response.data.data);
    })
  };


  useEffect(() => {
    getFiles();
    getUsers();
    getSharedFiles();
  }, []);



  return (
    <Fragment>
      <Modal isOpen={modal} toggle={toggle} className="modal-dialog-centered">
          <ModalHeader toggle={toggle}>Update Information</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="first_name">Share With</Label>
                <Select
                  options={users.map((user) => { return { value: user.id, label: user.first_name + " " + user.last_name } })}
                  placeholder="Select Users "
                  isSearchable={true}
                  isMulti={true}
                  onChange={handleSelect}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Share</Button>
            <Button color="secondary" onClick={toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      <Breadcrumb parent="Dashboard" title="Home" />
      <Container fluid={true}>
        <Row>
          <div>
            <Card>
              <CardHeader>
                <h5>{'Files'}</h5>
              </CardHeader>
              <CardBody>
                <form onSubmit={uploadFile}>
                  <Input type="file" id="file" />
                  <br/>
                  <Button color="primary" type="submit">
                    Upload
                  </Button>
                </form>
              </CardBody>
                <DataTable
                  columns={fileTableColumns}
                  data={files}
                  noHeader={true}
                  defaultSortField="name"
                  ></DataTable>
            </Card>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Home;