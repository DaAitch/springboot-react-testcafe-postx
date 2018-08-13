import React from 'react';

export default ({title, body}) => (
  <div className="post">
    <div>Title: <span className="post-title">{title}</span></div>
    <div className="post-body">{body}</div>
  </div>
);
