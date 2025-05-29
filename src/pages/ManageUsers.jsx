import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline, MdLibraryMusic, MdPersonOutline } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/v1/auth/users', {
          headers: { 'x-auth-token': token }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response?.status === 403) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`http://localhost:1337/api/v1/auth/users/${userId}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(users.filter(user => user._id !== userId));
      if (selectedUser?._id === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteSong = async (songId, file) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;

    try {
      await axios.delete(`http://localhost:1337/api/v1/song/delete/${songId}?file=${file}`, {
        headers: { 'x-auth-token': token }
      });
      
      setUsers(users.map(user => {
        if (user._id === selectedUser._id) {
          return {
            ...user,
            songs: user.songs.filter(song => song._id !== songId)
          };
        }
        return user;
      }));

      setSelectedUser(prev => ({
        ...prev,
        songs: prev.songs.filter(song => song._id !== songId)
      }));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex items-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10">
          <MdPersonOutline className="text-white text-4xl mr-4" />
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <motion.div 
            layout
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-white/5 transition-colors duration-150 ease-in-out ${
                        selectedUser?._id === user._id ? 'bg-white/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-3 shadow-lg">
                            {user.fullName.charAt(0)}
                          </div>
                          <span className="text-gray-300 font-medium">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                          >
                            <MdLibraryMusic size={24} />
                          </button>
                          {!user.isAdmin && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-150"
                            >
                              <MdDeleteOutline size={24} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* User's Songs List */}
          <AnimatePresence mode="wait">
            {selectedUser && (
              <motion.div
                key={selectedUser._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10"
              >
                <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-3 shadow-lg">
                      {selectedUser.fullName.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                      {selectedUser.fullName}'s Songs
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  {selectedUser.songs && selectedUser.songs.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.songs.map((song) => (
                        <motion.div
                          key={song._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors duration-150 backdrop-blur-sm border border-white/5"
                        >
                          <div className="text-gray-300">
                            <p className="font-medium text-lg">{song.title}</p>
                            <p className="text-sm text-gray-400">{song.artist} • {song.album}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteSong(song._id, song.file)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150 p-2 hover:bg-red-400/10 rounded-lg"
                          >
                            <MdDeleteOutline size={24} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No songs found for this user</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageUsers; 