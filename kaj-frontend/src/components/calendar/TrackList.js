import React from 'react';

// Component for rendering a list of tracks
function TrackList({ tracks, onTrackSelect }) {
  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 100px)' }}>
      {tracks.map((track, index) => (
        <div key={index} onClick={() => onTrackSelect(track)}>
          {track.title}
        </div>
      ))}
    </div>
  );
}

export default TrackList;