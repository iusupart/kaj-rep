import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import './assets/MusicPlayer.css';

// Component for the music player
function MusicPlayer({ tracks, isMusicPlayerOpened }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // State for the index of the currently playing track
  const [isPlaying, setIsPlaying] = useState(false); // State for tracking if the music is currently playing
  const audioRef = useRef(); // Reference to the audio element

  // Function to play the audio
  const play = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  // Function to pause the audio
  const pause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  // Function to play the previous track
  const previous = () => {
    setCurrentTrackIndex((oldTrackIndex) => {
      let newTrackIndex = oldTrackIndex - 1;
      if (newTrackIndex < 0) newTrackIndex = tracks.length - 1;
      return newTrackIndex;
    });
  };

  // Function to play the next track
  const next = () => {
    setCurrentTrackIndex((oldTrackIndex) => {
      let newTrackIndex = oldTrackIndex + 1;
      if (newTrackIndex >= tracks.length) newTrackIndex = 0;
      return newTrackIndex;
    });
  };

  // Rendering the music player component
  return (
    <div className={`music-container ${isMusicPlayerOpened ? '' : 'hidden'}`}>
      <div className="music-header-text">Music for you</div>
      <div className="music-player">
        <audio src={tracks[currentTrackIndex].src} ref={audioRef} autoPlay={isPlaying}></audio>
        <div className="controls">
          <FaStepBackward className="player-icon" onClick={previous} />
          {isPlaying ? (
            <FaPause className="player-icon" onClick={pause} />
          ) : (
            <FaPlay className="player-icon" onClick={play} />
          )}
          <FaStepForward className="player-icon" onClick={next} />
        </div>
        <div className="track-info">
          <span>{tracks[currentTrackIndex].title}</span>
        </div>
      </div>
      <div className="track-list">
        {tracks.map((track, index) => (
          <div 
            key={index} 
            className={`track-list-item ${index === currentTrackIndex ? 'active' : ''}`}
          >
            {track.title}
            <span className="track-duration">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MusicPlayer;