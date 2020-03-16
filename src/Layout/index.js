import React from 'react';
import styles from './index.module.css';
import { joinClass } from '_/helpers';


export default ({ children, className }) => (
  <div className={joinClass(styles.container, className)}>
    {children}
  </div>
);
