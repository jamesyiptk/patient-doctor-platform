import React, { useState } from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber, Layout, Menu,
  Row,
  Select,
  Upload,
  message
} from 'antd';
import {LockOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import {Link, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';


const cardStyle = {
  width: 620,
};
const imgStyle = {
  display: 'block',
  width: 273,
};

const { Option } = Select;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const residences = [
  {
    value: 'pittsburgh',
    label: 'Pittsburgh',
    children: [
      {
        value: 'PA',
        label: 'PA',
        children: [
          {
            value: '5000',
            label: 'Forbes Ave',
          },
        ],
      },
    ],
  },
  {
    value: 'NY',
    label: 'NY',
    children: [
      {
        value: 'newyork',
        label: 'NewYork',
        children: [
          {
            value: 'brooklyn',
            label: 'Brooklyn',
          },
        ],
      },
    ],
  },
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 9,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 15,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const { Header, Content, Footer } = Layout;
const items = [
    {
        key: '1',
        label: <Link to="/patient-login">Go to patient platform</Link>,
    },
]

const App = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('confirm_password', values.confirm);
    formData.append('first_name', values.username);
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    formData.append('email', values.email);
    formData.append('phone_number', values.phone);
    formData.append('specialty', values.specialty);
    formData.append('position', values.position);
    formData.append('hospital', values.hospital);
    formData.append('address', values.residence.join(', '));
    if (values.photo && values.photo.length > 0) {
        formData.append('photo', values.photo[0].originFileObj);
    }

    const csrftoken = Cookies.get('csrftoken');
    fetch('/api/doctor-register/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            // Registration successful, redirect to login page
            message.success('Registration successful! Please login.');
            navigate('/doctor-login');
        } else {
          // Registration failed, display error messages
          const errorMessages = Object.values(data.errors).join(' ');
          message.error(errorMessages);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        message.error('An error occurred. Please try again.');
      });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  );

  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
    }
  };
  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));
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
            width: '500px',
      }}
      >

        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ['Carnegie Mellon University', 'Forbes Ave', 'Pittsburgh'],
            prefix: '+1',
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="username"
            label="User name"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

            <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
              name="specialty"
              label="Specialty"
              rules={[
                {
                  required: true,
                  message: 'Please select your specialty!',
                },
              ]}
            >
              <Select placeholder="Select your specialty">
                <Option value="cardiology">Cardiology</Option>
                <Option value="dermatology">Dermatology</Option>
                <Option value="neurology">Neurology</Option>
                {/* Add more specialty options as needed */}
              </Select>
            </Form.Item>

          <Form.Item
            name="position"
            label="Position"
            rules={[
              {
                required: true,
                message: 'Please input your position!',
              },
            ]}
          >
            <Select placeholder="Select your position">
                <Option value="physician">Dean</Option>
                <Option value="general_practitioner">General Practitioner</Option>
                <Option value="medical_director">Medical Director</Option>
                {/* Add more specialty options as needed */}
            </Select>
          </Form.Item>

         <Form.Item
            name="hospital"
            label="Hospital"
            rules={[
              {
                required: true,
                message: 'Please input your hospital!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="residence"
            label="Address"
            rules={[
              {
                type: 'array',
                required: true,
                message: 'Please select your address',
              },
            ]}
          >
            <Cascader options={residences} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item
          name="photo"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: 'Please upload your photo!',
            },
          ]}
        >
          <Upload
            action="/upload.do"
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            <span style={{ color: 'black', marginLeft: '8px' }}><br/><br/>Already have an account!</span>{' '}
            <Link to="/doctor-login">Login here</Link>
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
export default App;