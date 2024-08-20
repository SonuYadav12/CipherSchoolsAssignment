import React from 'react';

const Navbar = ({ user, onUserClick, onLogout }) => {
  const defaultImageStyle = {
    backgroundColor: '#4A90E2',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const title = user?.role === 'admin' ? 'Admin Panel' : 'Student Panel';

  return (
    <nav className="bg-gray-800 text-white flex items-center justify-between p-4 shadow-md">
      <div className="text-lg font-bold">{title}</div>
      <div className="flex items-center space-x-4">
        <button onClick={onUserClick} className="flex items-center space-x-2">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div style={defaultImageStyle}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span>{user?.name || 'User'}</span>
        </button>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
