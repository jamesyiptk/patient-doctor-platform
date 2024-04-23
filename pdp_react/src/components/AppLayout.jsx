import {
  CaretDownFilled,
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { css } from '@emotion/css';
import {
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Input,
  Popover,
  theme,
  Menu,
  message,
  FloatButton 
} from 'antd';
import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, ContainerOutlined, MonitorOutlined } from '@ant-design/icons';
import { useLocation, useNavigate  } from 'react-router-dom';
import Logo from '../static/logo.png';
import axios from 'axios';
import { useUser} from '../contexts/UserContext';


const Item = (props) => {
  const { token } = theme.useToken();
  return (
    <div
      className={css`
        color: ${token.colorTextSecondary};
        font-size: 14px;
        cursor: pointer;
        line-height: 22px;
        margin-bottom: 8px;
        &:hover {
          color: ${token.colorPrimary};
        }
      `}
      style={{
        width: '33.33%',
      }}
    >
      {props.children}
      <DoubleRightOutlined
        style={{
          marginInlineStart: 4,
        }}
      />
    </div>
  );
};

// const SearchInput = () => {
//   const { token } = theme.useToken();
//   return (
//     <div
//       key="SearchOutlined"
//       aria-hidden
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         marginInlineEnd: 24,
//       }}
//       onMouseDown={(e) => {
//         e.stopPropagation();
//         e.preventDefault();
//       }}
//     >
//       <Input
//         style={{
//           borderRadius: 4,
//           marginInlineEnd: 12,
//           backgroundColor: token.colorBgTextHover,
//         }}
//         prefix={
//           <SearchOutlined
//             style={{
//               color: token.colorTextLightSolid,
//             }}
//           />
//         }
//         placeholder="搜索方案"
//         variant="borderless"
//       />
//       <PlusCircleFilled
//         style={{
//           color: token.colorPrimary,
//           fontSize: 24,
//         }}
//       />
//     </div>
//   );
// };

const AppLayout = ({ children }) => {
  const location = useLocation();
  const routeKeyMapping = {
    '/page1': 'mail',
    '/page2': 'test2',
    // 添加其他路由和对应 key 的映射
  };
  const items = [
    {
      label: 'Consultation',
      key: 'mail',
      icon: <ContainerOutlined />,
      onClick: () => {
        window.location.href = '/page1';
      },
    },
    {
      label: 'Common articles',
      key: 'test2',
      icon: <MonitorOutlined />,
      onClick: () => {
        window.location.href = '/page2';
      },
    },
    {
      label: 'Find Doctors',
      key: 'test3',
      icon: <AppstoreOutlined />,
      onClick: () => {
        window.location.href = '/find_doctors';
      },
    },
    {
      label: 'Navigation four',
      key: 'test4',
      icon: <AppstoreOutlined />,
    },
    {
      label: 'Navigation five',
      key: 'test5',
      icon: <MailOutlined />,
    },
  ];


  // const [userData, setUserData] = useState({ user: { name: '', email: '', crypto: 0 } });
  const { user} = useUser();
  // console.log(user);
  const navigate = useNavigate ();
  const { updateUser } = useUser();

    const handleLogout = async () => {
        try {
            // 发送请求到后端，让后端销毁当前的会话或Token
            // await axios.post('/api/logout');
            // console.log('Logged out successfully.');
        } catch (error) {
            // console.error('Logout failed:', error);
        }

        // 清除Context中的用户信息
        updateUser(null);

        // 清除本地存储中的认证信息
        localStorage.removeItem('authToken'); // 假设使用authToken存储用户认证信息

        // 重定向到登录页面
        navigate('/');
    };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8000/api/user/',{
  //         withCredentials: true});
  //       setUserData(response.data);
  //       console.log('test.here');
  //       console.log(response.data);
  //       // console.log(userData);
  //     } catch (err) {
  //       setError('Failed to fetch user data');
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // console.log(userData);
  // const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');
  // const [num, setNum] = useState(40);
  if (typeof document === 'undefined') {
    return <div />;
  }
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body;
          }}
        >
          <ProLayout
            fixSiderbar={true}
            layout="top"
            splitMenus={false}
            prefixCls="my-prefix1"
            // token={{
            //   header: {
            //     colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            //   },
            // }}
            siderMenuType="group"
            menu={{
              collapsedShowGroupTitle: false,
            }}
            avatarProps={{
              src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
              size: 'small',
              title: user ? user.name : 'Guest',
              render: (props, dom) => {
                return (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: 'Logout',
                          onClick: handleLogout,
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                );
              },
            }}
            actionsRender={(props) => {
              if (props.isMobile) return [];
              if (typeof window === 'undefined') return [];
              return [
                props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                  // <SearchInput />
                  <></>
                ) : undefined,
                <Button>{user ? `Crypto: ${user.crypto}` : 'Loading...'}</Button>,
                <InfoCircleFilled key="InfoCircleFilled" />,
                <QuestionCircleFilled key="QuestionCircleFilled" />,
                <GithubFilled key="GithubFilled" />,
              ];
            }}
            menuHeaderRender={(_, __, ___) => {
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={Logo} alt="logo" style={{ width: '50px', marginRight: '8px' }} />
                    <span>PDP</span>
                    <Menu
                      mode="horizontal"
                      defaultSelectedKeys={[routeKeyMapping[location.pathname]]}
                      items={items}
                      style={{ flex: 1, justifyContent: 'space-between' }} // 调整Menu的样式
                    />
                  </div>
                </>
              );
            }}
          >
            <PageContainer>{children}</PageContainer>
          </ProLayout>
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  );
};
export default AppLayout;