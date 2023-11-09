import { createContext, useState } from 'react';

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);

  const addMarker = () => {
    // Current Time and video duration can be found from common reducer;
    let currentTime = 0;
    let duration = 1;
    calculateMarkerPosition(currentTime / duration);
    const rect = canvas.getBoundingClientRect();

    setMarkers([...markers, currentPosition + rect.left]);
  };

  const calculateMarkerPosition = videoLength => {
    const totalWidth = canvas.offsetWidth;
    const rect = canvas.getBoundingClientRect();
    const markerPosition = videoLength * totalWidth + rect.left;

    setCurrentPosition(markerPosition - rect.left);
  };

  return (
    <TimelineContext.Provider
      value={{
        markers,
        setMarkers,
        canvas,
        setCanvas,
        currentPosition,
        setCurrentPosition,
        addMarker,
        calculateMarkerPosition,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
