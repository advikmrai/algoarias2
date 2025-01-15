import { useEffect, useRef } from "react";
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

  useEffect(() => {
    let isRecording = false; 
    videoEl.current = document.getElementById("videoEl");
    async function getAiSdk (){
      if(aiSdkState === "ready" && mphToolsState === "ready"){
        const { source, start } = await getAiSdkControls();
      await source.useCamera({
        toVideoElement: document.getElementById("videoEl"),
      });
        await start();
        
        /*
        // Using playerRef to access the player element
        useEffect(() => {
          const player = playerRef.current;
          if (player) {
            const handlePlayStatusChange = (event) => {
              isRecording = event.detail.isPlaying;
              if (isRecording) {
                console.log(JSON.stringify({ event: 'audio_playing' }));
              }
            };
            player.addEventListener('play-status-changed', handlePlayStatusChange);
            return () => {
              player.removeEventListener('play-status-changed', handlePlayStatusChange);
            };
          }
        }, [playerRef.current]);
        */
        // Start observing the document body for changes
        //playerObserver.observe(document.body, { childList: true, subtree: true });


        // Event listener to capture and save data, but only if recording is active
        window.addEventListener(CY.modules().EVENT_BARRIER.eventName, (event) => {  
     //     if (isRecording) {
          const data = event.detail;
          data.audio_current_time = playerRef.current?.audioRef?.current?.currentTime || null; 

              // Exclude the "data" field from the "faces" array within the "face_detector" object
              if (data.face_detector && data.face_detector.faces) {
                data.face_detector.faces.forEach(face => {
                  delete face.data;
                });
              }

              // Save data to data.json
              const jsonData = JSON.stringify(data, null, 2);
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'data.json';
              link.click();
      //    }
        }); 
      }
     
    }
    getAiSdk();
  }, [aiSdkState, mphToolsState]);

  return (
    <div className="App">
      <header className="App-header">
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
          <hr className="solid" style={{width:"100%"}}></hr>
          <Player ref={playerRef}></Player> 
          <hr className="solid" style={{width:"100%"}}></hr>
        </div>
      </header>
    </div>
  );
}

export default App;
