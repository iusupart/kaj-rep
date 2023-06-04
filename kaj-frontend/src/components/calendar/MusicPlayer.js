import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import './assets/MusicPlayer.css';

function MusicPlayer({ tracks, isMusicPlayerOpened }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();


  const play = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  useEffect(() => {
    console.log(tracks)
  }, []);

  const pause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const previous = () => {
    setCurrentTrackIndex((oldTrackIndex) => {
      let newTrackIndex = oldTrackIndex - 1;
      if (newTrackIndex < 0) newTrackIndex = tracks.length - 1;
      return newTrackIndex;
    });
  };

  const next = () => {
    setCurrentTrackIndex((oldTrackIndex) => {
      let newTrackIndex = oldTrackIndex + 1;
      if (newTrackIndex >= tracks.length) newTrackIndex = 0;
      return newTrackIndex;
    });
  };


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
