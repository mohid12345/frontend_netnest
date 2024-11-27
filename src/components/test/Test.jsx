// Test.jsx
import React from 'react';
import { useNotificationSocket } from '../../utils/context/SocketContext/nofi_Socket';

function Test() {
  const { sendNotification, isConnected } = useNotificationSocket();

  // Example usage
  const receiverId = '43432432423'; // Make sure this is a valid user ID
  
  const handleSomeAction = () => {
    if (!isConnected) {
      console.log('Socket not connected');
      return;
    }
    
    sendNotification(
      receiverId,
      'info',
      'Test notification message'
    );
    console.log('Notification sent');
  };

  return (
    <div>
      <div className='w-screen h-screen flex justify-center items-center'>
        <div className='w-44 h-44 bg-violet-100'>
          <div>Hello Mohid</div>
          <div>
            <p className="text-sm mb-2">Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
            <button 
              onClick={handleSomeAction} 
              className='p-4 px-5 bg-yellow-300 hover:bg-yellow-400'
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;