import React from 'react';
import { joinClass } from '_/globals';

export default ({ children, className, ...props }) => (
  <a
    className={joinClass('link--external', className)}
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    {children}
  </a>
);
