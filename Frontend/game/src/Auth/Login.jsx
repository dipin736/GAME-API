import React, { useState } from 'react'
import { Button, Container, Card, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      await login({ username, password });
      navigate('/');
      toast.success('Sign In Successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  return (
    <Container className="my-5">
    <Card>
      <Row className='g-0'>
        <Col md='6' className='p-1 mt-5'>
          <Card.Img src='https://wallpapers.com/images/hd/pubg-full-screen-armed-player-jo9xyb8k0ncjdqs4.jpg' alt="login form" className='rounded-start w-100'/>
        </Col>

        <Col md='6'>
          <Card.Body className='d-flex flex-column'>
    
            <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

            <Form>
              <Form.Group className='mb-4' controlId='formControlLg'>
                <Form.Label>User Name</Form.Label>
                <Form.Control type='text' size='lg'  placeholder='Enter Username'   value={username}
            onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>

              <Form.Group className='mb-4' controlId='formControlLg'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' size='lg'  placeholder='Enter Password'  value={password}
            onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              <Button className="mb-4 px-5" variant='dark' size='lg' type='submit' onClick={handleLogin}>Login</Button>
            </Form>

            <a className="small text-muted" href="#!">Forgot password?</a>
            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <a href="#!" style={{ color: '#393f81' }}>
              <Link to='/register'>Register here</Link></a>
              </p>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  </Container>
  )
}

export default Login