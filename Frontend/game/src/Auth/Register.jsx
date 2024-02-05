import React, { useState } from 'react';
import { Button, Container, Card, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Alert } from '@chakra-ui/react';
import { toast } from 'react-toastify';


const Register=() =>{
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault(); 
    try {
      if (!username || !email || !password) {
        toast.error('Please fill in all fields..', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        })
        return;
      }
  
      await register({ username, email, password });
      navigate('/login');
      toast.success('Sign Up Successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error during registration:', error);
  
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('email')) {
          // Display alert for email already registered
          alert('Email address is already registered. Please use a different email.');
        } else {
          setErrorMessage(error.response.data.message);
        }
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <Container className="my-5">
      {errorMessage && <Alert variant="light  ">{errorMessage}</Alert>}
      <Card>
        <Row className='g-0'>
          <Col md='6' className='p-1 mt-5'>
            <Card.Img src='https://wallpapers.com/images/hd/pubg-full-screen-armed-player-jo9xyb8k0ncjdqs4.jpg' alt="login form" className='rounded-start w-100'/>
          </Col>

          <Col md='6'>
            <Card.Body className='d-flex flex-column'>
        
              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign up for an account</h5>

              <Form>
              <Form.Group className='mb-4' controlId='formControlLg'>
                  <Form.Label>User Name</Form.Label>
                  <Form.Control type='text' size='lg'  placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>


                <Form.Group className='mb-4' controlId='formControlLg'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type='email' size='lg' 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className='mb-4' controlId='formControlLg'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type='password' size='lg'   placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button className="mb-4 px-5" variant='dark' size='lg' type='submit' onClick={handleRegister}>Register</Button>
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default Register;
