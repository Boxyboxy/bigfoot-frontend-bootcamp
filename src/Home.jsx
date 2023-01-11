import { EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export function Home() {
  const location = useLocation();
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSelected([location.pathname]);
  }, [location.pathname]);

  return (
    <>
      <Menu
        mode="horizontal"
        items={[
          {
            label: 'All Sightings',
            key: '/sightings',
            icon: <EyeOutlined />,
            onClick: () => navigate('/sightings')
          },
          {
            label: 'New Sighting',
            key: '/sightings/new',
            icon: <FormOutlined />,
            onClick: () => navigate('/sightings/new')
          }
        ]}
        selectedKeys={selected}
      />
      <Outlet />
    </>
  );
}
