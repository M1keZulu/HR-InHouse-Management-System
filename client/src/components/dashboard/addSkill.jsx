import React, { useState, Fragment } from 'react';
import axios from 'axios';
import Breadcrumb from '../../layout/breadcrumb'
import { toast } from 'react-toastify';
import {Container,Row,Col,Card,CardHeader,CardBody,CardFooter,Form,FormGroup,Label,Input,Button} from 'reactstrap'
import { DefaultFormLayout,EmailAddress,Email,Password,Username,Website,BillingInformation,CompanyInformation,InlineForm,InlineFormWithLabel,InlineFormWithoutLabel,HorizontalFormLayout,MegaForm,Submit,Cancel,AccountInformation,Option,Login,ContactNumber,CompanyName,YourName,Checkboxes,Radios,Disabled } from "../../constant";


const AddSkill = () => { 
  const initialFormData = Object.freeze({
    name: '',
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
    axios
    .post('http://127.0.0.1:8000/companies/addSkill', 
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
    });
  };

  return (
    <Fragment>
      <Breadcrumb parent="Dashboard" title="Add Skill"/>
      <Container fluid={true}>
        <Row>
          <Col sm="12" xl="6">
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>Enter Skill Name</h5>
                  </CardHeader>
                  <CardBody>
                    <Form className="theme-form">
                      <Row>
                        <Col>
                          <FormGroup>
                            <Label className="col-form-label pt-0" for="first_name">Skill Name</Label>
                            <Input className="form-control" id="name" type="text" name="name" onChange={handleChange} />
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

export default AddSkill;