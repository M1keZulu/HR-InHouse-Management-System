import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Breadcrumb from '../../layout/breadcrumb'
import { toast } from 'react-toastify';
import {Container,Row,Col,Card,CardHeader,CardBody,CardFooter,Form,FormGroup,Label,Input,Button} from 'reactstrap'
import { DefaultFormLayout,EmailAddress,Email,Password,Username,Website,BillingInformation,CompanyInformation,InlineForm,InlineFormWithLabel,InlineFormWithoutLabel,HorizontalFormLayout,MegaForm,Submit,Cancel,AccountInformation,Option,Login,ContactNumber,CompanyName,YourName,Checkboxes,Radios,Disabled } from "../../constant";


const AddJob = () => { 
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
  const [skills, setSkills] = useState([]);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSelect = (e) => {
    var arr = [];
    for(let i = 0; i < e.length; i++) {
      arr.push(e[i].value);
    }
    updateFormData({
      ...formData,
      skills: arr
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
    .post('http://127.0.0.1:8000/jobs/addJob', 
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

  const [companies, setCompanies] = useState([]);
  const getCompanies = async () => {
    axios
      .get('http://127.0.0.1:8000/companies/getCompanies',  
      {headers : 
        {'x-access-token': localStorage.getItem('token')}, })
      .then((response) => {
        if(response.data.status===true){
          setCompanies(response.data.data);
        }
        else{
          toast.error(response.data.message);
        }
      });
  };

  useEffect(() => {
    getCompanies();
    getSkills();
  }, []);

  return (
    <Fragment>
      <Breadcrumb parent="Dashboard" title="Add Job"/>
      <Container fluid={true}>
        <Row>
          <Col sm="12" xl="6">
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>Enter Job Details</h5>
                  </CardHeader>
                  <CardBody>
                    <Form className="theme-form">
                      <FormGroup>
                        <Label className="col-form-label pt-0">Job Title</Label>
                        <Input className="form-control" type="text" name="title" onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Job Description</Label>
                        <Input className="form-control" type="textarea" name="description" onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Company</Label>
                        <Input className="form-control" type="select" name="company_id" onChange={handleChange}>
                          <option value="">Select Company</option>
                          {companies.map((company) => (
                            <option value={company.id}>{company.name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Job Status</Label>
                        <Input className="form-control" type="select" name="status" onChange={handleChange}>
                          <option value="">Select Status</option>
                          <option value="9">Active</option>
                          <option value="10">Inactive</option>
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Job Salary</Label>
                        <Input className="form-control" type="text" name="salary" onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Extra Requirements</Label>
                        <Input className="form-control" type="text" name="extra_requirements" onChange={handleChange} />
                      </FormGroup>
                      <FormGroup>
                        <Label className="col-form-label">Skills</Label>
                        <Select
                          options={skills.map ((skill) => ({value: skill.id, label: skill.name}))}
                          placeholder="Select Skills"
                          isSearchable={true}
                          isMulti={true}
                          onChange={handleSelect}
                        />
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

export default AddJob;