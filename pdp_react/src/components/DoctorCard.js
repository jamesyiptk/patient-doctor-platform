import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './style.css'; // Make sure your custom styles don't conflict with Ant Design

const { Meta } = Card;
const { Text, Title } = Typography;

function DoctorCard({ id,first_name,last_name, hospital, rating, consultations,photo,user_id }) {
  const navigate = useNavigate();

  // Navigate to the doctor's profile
  const navigateToProfile = () => {
    navigate(`/doctor/${user_id}`);
  };

  return (
    <Card
      hoverable
      style={{ width: 300, margin: '16px' }}
      cover={
        // Replace "path_to_your_profile_image.jpg" with the actual path to the doctor's image
        <img alt="Doctor Profile" src={`http://localhost:8000${photo}`} />
      }
      actions={[
        <Button type="primary" onClick={navigateToProfile}>
          Select
        </Button>
      ]}
    >
      <Meta
        avatar={<Avatar size="large" icon={<UserOutlined />} />}
        title={<Title level={4}>{first_name+" "+ last_name}</Title>}
        description={
          <>
            <Text strong>Hospital:</Text> {hospital}<br />
            <Text strong>Rating:</Text> {rating}<br />
            <Text strong>Consultations:</Text> {consultations}
          </>
        }
      />
    </Card>
  );
}

export default DoctorCard;
