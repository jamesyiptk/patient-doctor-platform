import React from 'react';
import {Form, Input, Button, Checkbox, Breadcrumb, Layout, Menu, theme, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {ProConfigProvider} from "@ant-design/pro-components";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const { Header, Content, Footer } = Layout;
const items = [
    {
        key: '1',
        label: <Link to="/patient-login">Go to patient platform</Link>,
    },
]

const NormalLoginForm = () => {
  const {token: { colorBgContainer, borderRadiusLG },} = theme.useToken();
  const navigate = useNavigate(); // Hook to get access to the navigate function
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);

    try {
      const csrftoken = Cookies.get('csrftoken');
      const response = await fetch('/api/doctor-login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
          body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          message.success('Login success.');
          navigate('/page2'); // Redirect to /page2
        } else {
            message.error('Login failed.');
            console.error('Login failed:', data.message);
          // Handle login failure, like showing an error message
        }
      } else {
        console.error('Authentication error:', response.statusText);
        if (response.status === 401) {
          alert('Login failed: Invalid credentials');
        } else {
          alert('Error: ' + response.statusText);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
      <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Content
        style={{
          padding: '0 48px',
          flex: 1,
          backgroundImage: 'url("https://cpsnb.org/images/slideshow/cpsnb_slide3.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '8px',
            width: '400px',
          }}
      >
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
        >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <span style={{ color: 'black', marginLeft: '8px' }}><br/><br/>Or</span>{' '}
          <Link to="/doctor-register">register now!</Link>
        </Form.Item>
      </Form>
      </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
          Patient Doctor Platform ©{new Date().getFullYear()} Created by Team 29
      </Footer>
    </Layout>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <NormalLoginForm />
    </ProConfigProvider>
  );
};