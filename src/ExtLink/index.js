import React from 'react';
import { joinClass } from '../globals';

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
