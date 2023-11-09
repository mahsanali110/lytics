import React from 'react';
import './Twitter.scss';
const TwitterDetails = ({ job }) => {
  return (
    <>
      {/* <div className="program-details">
        <h1>{job.programName}</h1>
        <span>
          {job.programType} | {job.language}
        </span>
      </div> */}
      {job.anchor.length > 0 ? (
        <div style={{ lineHeight: '35px', marginTop: '3%' }}>
          <span>Host(s) - {job.anchor.map(anchorName => anchorName + ' , ')}</span>
        </div>
      ) : null}
      {job.guests.length > 0 ? (
        <span>Guest(s) - {job.guests.map(guest => guest.name + ' , ')}</span>
      ) : null}
      <div className="topics-hashtags-div">
        <div className="details-sub-div">
          {job?.segments[0]?.topics?.topic1.length > 0 ? (
            <>
              <h1>{job.segments[0].topics.topic1}</h1>
              <span>
                {job.segments[0]?.topics?.topic2[0]} | {job.segments[0]?.topics?.topic3[0]}
              </span>
            </>
          ) : (
            <h3 style={{ color: 'white' }}></h3>
          )}
        </div>
        {job.queryWords.length > 3 ? (
          <div className="details-sub-div">
            <h1>Keywords </h1>
            {job.queryWords.map((queryWord, index) =>
              index > 2 ? <span>{queryWord.word} &nbsp;</span> : null
            )}
          </div>
        ) : null}
        <div className="hashtag_box">
          {job.segments[0]?.hashtags.map(hashtag => {
            return <span className="hashtags-details">{hashtag}</span>;
          })}
        </div>
      </div>
    </>
  );
};

export default TwitterDetails;
