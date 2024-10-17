// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
// import React, { useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';

// function VideoCall() {
//   const { roomId } = useParams();
//   const containerRef = useRef(null);
//   const selectUser = (state) => state.auth.user;
//   const user = useSelector(selectUser);
//   const userId = user._id;
//   const userName = user.userName;
//   const navigate = useNavigate();
  
//   // This flag prevents re-initialization
//   const isRoomJoined = useRef(false);

//   const handleLeaveRoom = () => {
//     navigate('/chat');
//   };

//   useEffect(() => {
//     if (!containerRef.current || isRoomJoined.current) return;

//     const myMeeting = async () => {
//       const appId = 277259769;
//       const serverSecret = "2470e009331f2a86782deb638496683f";
      
//       // Generate Kit Token
//       const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//         appId,
//         serverSecret,
//         roomId,
//         userId,
//         userName
//       );

//       // Create the Zego UIKit instance
//       const zc = ZegoUIKitPrebuilt.create(kitToken);

//       // Join the room
//       zc.joinRoom({
//         container: containerRef.current,
//         scenario: {
//           mode: ZegoUIKitPrebuilt.OneONoneCall,
//         },
//         showScreenSharingButton: true,
//         showPreJoinView: false,
//         turnOnCameraWhenJoining: true,
//         turnOnMicrophoneWhenJoining: false,
//         showLeaveRoomConfirmDialog: false,
//         onLeaveRoom: handleLeaveRoom,
//         onUserLeave: handleLeaveRoom,
//       });

//       // Mark the room as joined
//       isRoomJoined.current = true;
//     };

//     myMeeting();

//     // Cleanup on component unmount
//     return () => {
//       if (isRoomJoined.current) {
//         // Any cleanup logic for ZegoUIKit, if needed
//         isRoomJoined.current = false;
//       }
//     };
//   }, [roomId, userId, userName, navigate]);

//   return (
//     <div>
//       <div ref={containerRef} style={{ height: '100vh', width: '100vw' }} />
//     </div>
//   );
// }

// export default VideoCall;









import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


function VideoCall() {
  const { roomId } = useParams();
  const containerRef = useRef(null);
  const selectUser = (state) => state.auth.user;
  const user = useSelector(selectUser)
  const userId = user._id;
  const userName = user.userName;
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    navigate('/chat');
  }

  useEffect(() => {
    if(!containerRef.current) return

    const myMeeting = async() => {
      const appId = 277259769
      const serverSecret = "2470e009331f2a86782deb638496683f"
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        userId,
        userName,
      )
      const zc = ZegoUIKitPrebuilt.create(kitToken)
      zc.joinRoom({
        container: containerRef.current,
          scenario:{
              mode:ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton:true,
          showPreJoinView: false ,
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: false,
          showLeaveRoomConfirmDialog: false,
          onLeaveRoom: handleLeaveRoom,
          onUserLeave: handleLeaveRoom,
      })
    }
    myMeeting()
  },[ roomId, userId, userName, navigate ])

  return (
    <div>
      <div ref={containerRef} style={{height:'100vh',width:'100vw'}}/>
  </div>
  )
}

export default VideoCall