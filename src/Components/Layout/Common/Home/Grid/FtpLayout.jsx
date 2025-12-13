import { Grid } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import GridLayout from './GridLayout';
import axios from 'axios';

function FtpLayout() {
  const [leftWidth, setLeftWidth] = useState(300);
  const [middleWidth, setMiddleWidth] = useState(600);
  const [rightWidth, setRightWidth] = useState(300);

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dragging, setDragging] = useState(null); 



const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
const [isMiddleCollapsed, setIsMiddleCollapsed] = useState(false);

const toggleLeft = () => {
  if (isLeftCollapsed) setLeftWidth(300);
  else setLeftWidth(0);
  setIsLeftCollapsed(!isLeftCollapsed);
};

const toggleMiddle = () => {
  if (isMiddleCollapsed) setMiddleWidth(600);
  else setMiddleWidth(0);
  setIsMiddleCollapsed(!isMiddleCollapsed);
};



  useEffect(() => {
  const handleMouseMove = (e) => {
    if (!dragging) return;

    const containerWidth = window.innerWidth; 

    if (dragging === 'left') {
      const newLeft = Math.min(Math.max(e.clientX, 150), containerWidth - rightWidth - 150);
      setLeftWidth(newLeft);
    }

    if (dragging === 'right') {
      const newRight = Math.min(
        Math.max(containerWidth - e.clientX, 150),
        containerWidth - leftWidth - 150
      );
      setRightWidth(newRight);
    }
  };

  const handleMouseUp = () => setDragging(null);

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, [dragging, leftWidth, rightWidth]);


  const startDragLeft = () => setDragging('left');
  const startDragRight = () => setDragging('right');


  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5173/users');
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userColumns = useMemo(
    () => [
      {
        key: 'username',
        label: 'Username',
        width: 150,
        render: (row, isSelected) => (
          <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
            {row.username}
          </span>
        ),
      },
      {
        key: 'profileName',
        label: 'Profile Name',
        width: 150,
        render: (row, isSelected) => (
          <span className={isSelected ? 'font-bold' : ''}>
            {row.profileName}
          </span>
        ),
      },
      {
        key: 'userGroupName',
        label: 'Group',
        width: 150,
        render: (row, isSelected) => (
          <span className={isSelected ? 'font-bold' : ''}>
            {row.userGroupName}
          </span>
        ),
      }
    ],
    []
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500"></div>;
  }

 return (
  <div className="flex h-[600px] w-full ms-1">

    <div
      style={{ width: leftWidth }}
      className={leftWidth === 0 ? 'hidden' : 'border-2 border-gray-900 p-4 shrink-0 me-1'}
    >
      File Layout
    </div>

  
    <div
  className="w-[6px] bg-gray-300 cursor-col-resize flex items-center justify-center shrink-0"
  onMouseDown={startDragLeft}
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();       
      toggleLeft();
    }}
    className="w-12 h-12 rounded-sm bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
  >
  </button>
</div>

    <div
      style={{ width: middleWidth }}
      className={middleWidth === 0 ? 'hidden' : 'flex-1 min-w-0'}
    >
      <GridLayout columns={userColumns} data={userData} />
    </div>

   
    <div
  className="w-[6px] bg-gray-300 cursor-col-resize flex items-center justify-center shrink-0"
  onMouseDown={startDragRight}
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggleMiddle();
    }}
    className="w-12 h-8 rounded-sm bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
  >
  </button>
</div>
    <div
      style={{ width: rightWidth }}
      className={rightWidth === 0 ? 'hidden' : 'border-2 ms-1 border-gray-900 p-4 shrink-0'}
    >
      File view layout
    </div>
  </div>
);

}

export default FtpLayout;
