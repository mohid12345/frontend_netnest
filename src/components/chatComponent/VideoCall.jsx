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
      const appId = 514787039
      const serverSecret = "c300059b53c148c7ccaa83607656550c"
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