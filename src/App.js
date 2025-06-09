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

import Player from "./components/Player";
import { React } from 'react';



function App() {

  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
  const videoEl = useRef(undefined)
  const playerRef = useRef(null);
  const [audioElement, setAudioElement] = useState(null); // New state variable for the audio element
  const allData = [];
  

  // Function to download the data and clear the array
  const downloadData = useCallback(() => {
    const jsonData = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${new Date().toISOString()}.json`; // Unique file name
    link.click();

    // Clear the array after download
    allData.length = 0;
  }, [allData]);

  useEffect(() => {
    let isRecording = false;
    videoEl.current = document.getElementById("videoEl");
    async function getAiSdk() {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        const { source, start } = await getAiSdkControls();
        await source.useCamera({
          toVideoElement: document.getElementById("videoEl"),
        });
        await start();


        // Event listener to capture and save data
        // window.addEventListener(CY.modules().EVENT_BARRIER.eventName, (event) => {
        //     const data = event.detail;
            
        //     // Check if the audio element exists and get the current time
        //     if (audioElement && !audioElement.paused) {
        //         data.audio_current_time = Math.floor(audioElement.currentTime);
        //     } else {
        //         data.audio_current_time = null;
        //     }

        //   // Exclude the "data" field from the "faces" array within the "face_detector" object
        //   if (data.face_detector && data.face_detector.faces) {
        //     data.face_detector.faces.forEach(face => {
        //       delete face.data;
        //     });
        //   }

        //     allData.push(data);
        
        // });
      }

    }
    getAiSdk();
  }, [aiSdkState, mphToolsState, audioElement]);
    // Set up the interval once outside of useEffect
    const intervalId = setInterval(downloadData, 5000);
    //cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalId);
      }, [])
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "640px", height: "480px", position: "relative" }}>
            <video id="videoEl"></video>
            <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
          </div>
          <GenderComponent></GenderComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <DominantEmotionComponent></DominantEmotionComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <AgeComponent></AgeComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <FeatureComponent></FeatureComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <EngagementComponent></EngagementComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <MoodComponent></MoodComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <EmotionBarsComponent></EmotionBarsComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <Player ref={playerRef} setAudioElement={setAudioElement} />
          <hr className="solid" style={{ width: "100%" }}></hr>
        </div>
      </header>
    </div>
  );
}

export default App;