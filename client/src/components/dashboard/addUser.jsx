import React, { useState, Fragment } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import { toast } from 'react-toastify';
import {Container,Row,Col,Card,CardHeader,CardBody,CardFooter,Form,FormGroup,Label,Input,Button} from 'reactstrap'
import { DefaultFormLayout,EmailAddress,Email,Password,Username,Website,BillingInformation,CompanyInformation,InlineForm,InlineFormWithLabel,InlineFormWithoutLabel,HorizontalFormLayout,MegaForm,Submit,Cancel,AccountInformation,Option,Login,ContactNumber,CompanyName,YourName,Checkboxes,Radios,Disabled } from "../../constant";


const AddUser = () => { 
  const initialFormData = Object.freeze({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: '',
    gender: '',
    dob: '',
    phone: '',
    mother_language: '',
    job_type: '',
    description:  '',
    source: '',
    photo: '',
  });
  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', document.getElementById('photo').files[0]);
    for (var key in formData) {
      data.append(key, formData[key]);
    }
    axios
    .post('http://127.0.0.1:8000/user/addUser', 
    data,
    {headers : 
      {'x-access-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data'} })
    .then((response) => {
      if(response.data.status===true){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }   
    });
  };

  return (
    <Fragment>
      <Breadcrumb parent="Dashboard" title="Add User"/>
      <Container fluid={true}>
        <Row>
          <Col sm="12" xl="6">
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>Enter User Details</h5>
                  </CardHeader>
                  <CardBody>
                    <Form className="theme-form">
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="first_name">First Name</Label>
                            <Input className="form-control" id="first_name" type="text" name="first_name" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="last_name">Last Name</Label>
                            <Input className="form-control" id="last_name" type="text" name="last_name" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="email">Email</Label>
                            <Input className="form-control" id="email" type="email" name="email" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                        <FormGroup>
                            <Label className="col-form-label pt-0" for="last_name">Designation</Label>
                            <Input className="form-control" id="designation" type="text" name="designation" onChange={handleChange} />
                          </FormGroup>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="phone">Phone</Label>
                            <Input className="form-control" id="phone" type="text" name="phone" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                      <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="password">Password</Label>
                            <Input className="form-control" id="password" type="password" name="password" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="photo">Photo</Label>
                            <Input className="form-control" id="photo" type="file" name="photo" />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" onClick={handleSubmit} className="me-1">{Submit}</Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddUser;