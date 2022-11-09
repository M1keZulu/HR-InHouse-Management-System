import React, { useState, Fragment } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import { toast } from 'react-toastify';
import {Container,Row,Col,Card,CardHeader,CardBody,CardFooter,Form,FormGroup,Label,Input,Button} from 'reactstrap'
import { DefaultFormLayout,EmailAddress,Email,Password,Username,Website,BillingInformation,CompanyInformation,InlineForm,InlineFormWithLabel,InlineFormWithoutLabel,HorizontalFormLayout,MegaForm,Submit,Cancel,AccountInformation,Option,Login,ContactNumber,CompanyName,YourName,Checkboxes,Radios,Disabled } from "../../constant";


const AddUser = () => { 
  const initialFormData = Object.freeze({
    email: "",
    password: "",
    username: "",
  });
  const [formData, updateFormData] = React.useState(initialFormData);


  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post('http://127.0.0.1:8000/user', 
      {formData}, 
      {headers : 
        {accessToken: localStorage.getItem('token')}, })
      .then((response) => {
          toast.success("User Added Successfully"); 
    }).catch((error) => {
          toast.error("User Not Added");
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
                    <FormGroup>
                        <Label className="col-form-label pt-0" >{"User Name"}</Label>
                        <Input className="form-control" onChange={handleChange} name="username" type="email" placeholder="Enter email" />
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label pt-0" >{EmailAddress}</Label>
                        <Input className="form-control" onChange={handleChange} name="email" type="email" placeholder="Enter email" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="exampleInputPassword1">{Password}</Label>
                        <Input className="form-control" onChange={handleChange} name="password" type="password" placeholder="Password" />
                      </FormGroup>
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