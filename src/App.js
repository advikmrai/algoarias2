import { useEffect, useRef, useState, useCallback } from "react";
import { useExternalScript } from "./helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "./helpers/ai-sdk/loader";

import './App.css';

import GenderComponent from "./components/GenderComponent";
import AgeComponent from "./components/AgeComponent";
import DominantEmotionComponent from "./components/DominantEmotionComponent";
import FeatureComponent from "./components/FeatureComponent";
import EngagementComponent from "./components/EngagementComponent";
import FaceTrackerComponent from "./components/FaceTrackerComponent";
import MoodComponent from "./components/MoodComponent";
import EmotionBarsComponent from "./components/EmotionBarsComponent";

import Player from "./components/Player"
import { React } from 'react';



function App() {

  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
  const videoEl = useRef(undefined)
  const playerRef = useRef(null); 
  const [isRecording, setIsRecording] = useState(false);

   const handlePlayStatusChange = useCallback((event) => {
     setIsRecording(event.detail.isPlaying);
   }, []);


  const handleBarrierEvent = useCallback((event) => {
    const data = event.detail;

    if (data.face_detector && data.face_detector.faces) {
      data.face_detector.faces.forEach(face => {
        delete face.data;
      });
    }

    const currentTime = playerRef.current?.getAudio()?.currentTime || 0;
    data.audio_current_time = currentTime;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';

    if (!isRecording) {
      link.click();
    }
  }, [isRecording]);


  useEffect(() => {
    videoEl.current = document.getElementById("videoEl");
    let aiSdkLoaded = false

    const loadAiSdk = async () => {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        if (!aiSdkLoaded) {
          const { source, start } = await getAiSdkControls();
          await source.useCamera({
            toVideoElement: document.getElementById("videoEl"),
          });
          await start();
          aiSdkLoaded = true;
          if (playerRef.current?.getAudio()) {
            playerRef.current.getAudio().addEventListener("play-status-changed", handlePlayStatusChange);
            window.addEventListener(CY.modules().EVENT_BARRIER.eventName, handleBarrierEvent);
          }
        }
      }
    };

    loadAiSdk();

    return () => {
      if(playerRef.current?.getAudio()){
        playerRef.current.getAudio().removeEventListener("play-status-changed", handlePlayStatusChange);
        window.removeEventListener(CY.modules().EVENT_BARRIER.eventName, handleBarrierEvent);
      }
    };
  }, [aiSdkState, mphToolsState, handlePlayStatusChange, handleBarrierEvent]);

  return (
    <div className="App">
      <header className="App-header" >
        <div style={{display:"flex", flexDirection: "column", alignItems:"center"}}>
          <div style={{width:"640px", height: "480px", position:"relative"}}>
            <video id="videoEl"></video>
            <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
          </div>
          <GenderComponent></GenderComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <DominantEmotionComponent></DominantEmotionComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <AgeComponent></AgeComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <FeatureComponent></FeatureComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <EngagementComponent></EngagementComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <MoodComponent></MoodComponent>
          <hr className="solid" style={{width:"100%"}}></hr>
          <EmotionBarsComponent></EmotionBarsComponent>
          <hr className="solid" style={{width:"100%", marginTop: "20px"}}></hr>
          <Player ref={playerRef}></Player> 
          <hr className="solid" style={{width:"100%"}}></hr>
        </div>
      </header>
    </div>
  );
}

export default App;
