import React from 'react';
import './KeywordCount.scss';

const KeywordCount = ({ highest, word, count }) => {
  let height = (count / highest) * 100;
  return (
    <div className="progress-container">
    
      <div className="progress" style={{background: `linear-gradient(0deg, #334288 ${count}%,#293255 5% )`}}>
        <div className="word keyword">{word}</div>
        <div className="word count">{`x${count}`}</div>
        <div style={{ height: `${height}%` }} className="progress-bar"></div>
      </div>
    </div>
  );
};

export default KeywordCount;
