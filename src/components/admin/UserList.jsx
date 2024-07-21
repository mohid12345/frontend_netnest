import React, { useEffect, useState } from 'react';
import { adminUserBlock, adminUserList } from '../../services/admin/apiMethods';
import { toast } from 'sonner';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [userStates, setUserStates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [blockStatus, setBlockStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminUserList()
      .then((response) => {
        const userData = response.data;
        setUserStates(userData.users);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to fetch users.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = userStates.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const confirmBlockUser = (userId, status) => {
    setUserIdToBlock(userId);
    setBlockStatus(status);
    setModalMessage(`Are you sure you want to ${status} this user?`);
    setModalOpen(true);
  };

  const handleUserBlock = () => {
    adminUserBlock({ userId: userIdToBlock })
      .then((response) => {
        const data = response.data;
        toast[blockStatus === 'block' ? 'error' : 'info'](data.message);
        setUserStates(data.users);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to update user status.');
      })
      .finally(() => {
        setModalOpen(false);
      });
  };

  return (
    <>
      <div className='w-9/12'>
          <div className=' flex justify-center font-serif text-xl mt-6 '>
          Users List
          </div>
          <div className="flex justify-start items-center w-full mr-24 lg:ml-6">
          <div className="mt-6 flex justify-center items-center lg:w-full px-4 rounded-md">
            <div className="flex justify-center border w-full p-4 bg-gray-200 rounded-md">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full lg:w-4/4 p-2 bg-white">
                <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                  <label htmlFor="table-search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="table-search-users"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search for users"
                    />
                  </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">#</th>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3 text-center">Status</th>
                      <th scope="col" className="px-6 py-3 text-center">Google</th>
                      <th scope="col" className="px-6 py-3 text-center">State</th>
                      <th scope="col" className="px-6 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 text-center">{indexOfFirstUser + index + 1}</td>
                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                          <img className="w-10 h-10 rounded-full" src={user.profileImg} alt={`${user.name} image`} />
                          <div className="ps-3">
                            <div className="text-base font-semibold">{user.userName}</div>
                            <div className="font-normal text-gray-500">{user.email}</div>
                          </div>
                        </th>
                        <td className="px-6 py-4 text-center">
                          {user.isOnline ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                              Not Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.isGoogle ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                              Yes
                            </span>
                          ) : (
                            "No"
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">{user.isBlocked ? 'Blocked' : 'Unblocked'}</td>
                        <td className="px-6 py-4 text-center">
                          {user.isBlocked ? (
                            <button
                              type="button"
                              onClick={() => confirmBlockUser(user._id, "unblock")}
                              className=" bg-white text-blue-600 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                              UnBlock
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => confirmBlockUser(user._id, "block")}
                              className=" bg-white text-red-600 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-7 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center py-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ConfirmationModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleUserBlock}
            message={modalMessage}
          />
        </div>
      </div>
    </>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-10">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;