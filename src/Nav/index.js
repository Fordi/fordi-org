import React from 'react';
import ExtLink from '../ExtLink';
import fordi from './fordi.png';
import styles from './index.module.scss';
import { joinClass, asset } from '../globals';

export default ({ setToTop, setToBottom, selected }) => (
    <div className={joinClass(styles.nav, styles[`nav-${selected}`])}>
        <img className={styles.logo} src={fordi} alt="Personal logo" style={{ height: 96 }} />
        <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 40 141" width="40" height="141" className={styles.callout}>
            <path fill="#99e8ff" d="M0 0v141h13c9-6 0-22 0-22s13 8 16 22h11V0H29c-3 14-16 22-16 22s9-16 0-22z"/>
        </svg>
        <div className={styles.controls}>
            <button 
                type="button" 
                className={joinClass(
                    selected === 'top' ? styles.active : styles.inactive,
                    styles.button,
                    'button--text'
                )} 
                onClick={setToTop}
            >
                Portfolio
            </button>
            <span className={styles.resume}>
                {'Resume: '}
                <ExtLink className={joinClass('button--text', styles.button)} href={asset('Bryan_Elliott.docx')}>Word</ExtLink>
                {' | '}
                <ExtLink className={joinClass('button--text', styles.button)} href={asset('Bryan_Elliott.md')}>Text</ExtLink>
            </span>
            <button 
                type="button"
                className={joinClass(
                    selected === 'bottom' ? 'active' : 'inactive',
                    styles.button,
                    'button--text'
                )} 
                onClick={setToBottom}
            >
                About
            </button>
        </div>
    </div>
);