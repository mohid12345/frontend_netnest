import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import VideoCall from './VideoCall';

function ProtectedVideoCall() {
  const {  userId } = useParams();
  const selectUser = (state) => state.auth.user;
  const user = useSelector(selectUser);
  console.log("user in room", user);
  const loggedInUserId = user._id
  if(loggedInUserId === userId) {
    return <VideoCall />
  } else {
    return <Error message="Unauthorized access" />;
  }
}

export default ProtectedVideoCall