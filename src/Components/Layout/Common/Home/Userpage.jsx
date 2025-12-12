import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import GridLayout from './Grid/GridLayout';

const UsersPage = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("your url here");
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userColumns = useMemo(() => [
    {
      key: 'username',
      label: 'Username',
      width: 150,
      render: (row, isSelected) => (
        <span className={`${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
          {row.username}
        </span>
      )
    },
    {
      key: 'profileName',
      label: 'Profile Name',
      width: 150,
      render: (row, isSelected) => (
        <span className={isSelected ? 'font-bold' : ''}>{row.profileName}</span>
      )
    },
    {
      key: 'userGroupName',
      label: 'Group',
      width: 150,
      render: (row, isSelected) => (
        <span className={isSelected ? 'font-bold' : ''}>{row.userGroupName}</span>
      )
    },
    {
      key: 'userStatus',
      label: 'Status',
      width: 150,
      render: (row) => (
        <span className={`font-medium ${row.userStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
          {row.userStatus}
        </span>
      )
    }
  ], []);

  const renderUserDetail = (user) => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Email ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.email}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">User ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.id}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Status</div>
        <div className={`col-span-2 font-medium ${user.userStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
          {user.userStatus}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Email ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.email}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">User ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.id}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Status</div>
        <div className={`col-span-2 font-medium ${user.userStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
          {user.userStatus}
        </div>
      </div>

         <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Email ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.email}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">User ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.id}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Status</div>
        <div className={`col-span-2 font-medium ${user.userStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
          {user.userStatus}
        </div>
      </div>

         <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Email ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.email}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">User ID</div>
        <div className="col-span-2 text-gray-800 font-medium">{user.id}</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-[13px]">
        <div className="font-semibold text-teal-700">Status</div>
        <div className={`col-span-2 font-medium ${user.userStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
          {user.userStatus}
        </div>
      </div>

      

    </div>
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500"></div>;
  }
  
  return (
    <>
    <GridLayout
      columns={userColumns}
      data={userData}
      renderDetailPanel={renderUserDetail}
    />
    </>
  );
};

export default UsersPage;
