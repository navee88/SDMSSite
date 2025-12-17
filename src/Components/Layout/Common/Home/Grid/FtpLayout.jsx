import { Grid } from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  // REF: To measure the container's position on the screen
  const containerRef = useRef(null);

  // REFS: Keep track of widths without triggering re-renders in the event listener
  const widthsRef = useRef({ left: leftWidth, right: rightWidth });

  useEffect(() => {
    widthsRef.current = { left: leftWidth, right: rightWidth };
  }, [leftWidth, rightWidth]);

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
    if (!dragging) return;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // FIX: Calculate positions relative to the container, not the window
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerLeft = containerRect.left;
      const containerWidth = containerRect.width;
      
      // Mouse X position relative to the start of the container
      const mouseRelativeX = e.clientX - containerLeft;

      const currentLeft = widthsRef.current.left;
      const currentRight = widthsRef.current.right;

      if (dragging === 'left') {
        const newLeft = Math.min(
          Math.max(mouseRelativeX, 150), // Min width 150px
          containerWidth - currentRight - 150 // Max width (constrained by right panel)
        );
        setLeftWidth(newLeft);
      }

      if (dragging === 'right') {
        // Calculate distance from the right edge of the container
        const newRight = Math.min(
          Math.max(containerWidth - mouseRelativeX, 150),
          containerWidth - currentLeft - 150
        );
        setRightWidth(newRight);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [dragging]);

  const startDragLeft = () => setDragging('left');
  const startDragRight = () => setDragging('right');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3100/users');
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
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    // FIX: Add ref here to measure the container
    <div ref={containerRef} className="flex h-[600px] w-full ms-1">
      
      {/* Left Panel */}
      <div
        style={{ width: leftWidth }}
        className={leftWidth === 0 ? 'hidden' : 'border-2 border-gray-900 p-4 shrink-0 me-1'}
      >
        File Layout
      </div>

      {/* Left Resize Handle */}
      <div
        className="w-[6px] bg-gray-300 cursor-col-resize flex items-center justify-center shrink-0 hover:bg-gray-400 transition-colors"
        onMouseDown={startDragLeft}
      >
        <button
          type="button"
          draggable="false" // FIX: Prevent ghost image
          onDragStart={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={(e) => {
            e.stopPropagation(); 
            toggleLeft(); 
          }}
          className="w-12 h-12 cursor-pointer rounded-sm bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-md z-10 select-none"
        >
          {isLeftCollapsed ? '>' : '<'}
        </button>
      </div>

      {/* Middle Panel */}
      <div
        style={{ width: middleWidth }}
        className={middleWidth === 0 ? 'hidden' : 'flex-1 min-w-0'}
      >
        <GridLayout columns={userColumns} data={userData} />
      </div>

     
      <div
        className="w-[6px] bg-gray-300 cursor-col-resize flex items-center justify-center shrink-0 hover:bg-gray-400 transition-colors"
        onMouseDown={startDragRight}
      >
        <button
          type="button"
          draggable="false" 
          onDragStart={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            toggleMiddle();
          }}
          className="w-12 h-8 cursor-pointer rounded-sm bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white shadow-md z-10 select-none"
        >
           {isMiddleCollapsed ? '<' : '>'}
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
