import React from 'react'
import { AudioRecorder } from 'react-audio-voice-recorder';

function VoiceRecorder({ onRecordingComplete, setRecordedAudioBlob }) {

  const addAudioElement = (blob) => {
    setRecordedAudioBlob(blob);
    onRecordingComplete(blob);
  };
  

  return (
    <>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        showVisualizer={true}
        downloadFileExtension="mp3"
        onNotAllowedOrFound={()=>console.log("error")}
      />
    </>
  )
}

export default VoiceRecorder