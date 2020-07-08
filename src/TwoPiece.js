import { html, useState, joinClass, css } from './buildless.js';

const styles = css`
  .twoPiece {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .top, .bottom {
    overflow: hidden;
    flex: 1 1 auto;
    height: 0;
    transition: height 0.4s;
  }
  .top-selected .top {
    height: 100vh;
  }
  .bottom-selected .bottom {
    height: 100vh;
  }
`;

export default ({ className, top: Top, bottom: Bottom, nav: Nav }) => {
  const [selected, setSelected] = useState('top');
  const setToTop = () => setSelected('top');
  const setToBottom = () => setSelected('bottom');
  return html`
    <div className=${joinClass(styles.twoPiece, className, styles[`${selected}-selected`])}>
      <div className=${styles.top}>
        <${Top} selected=${selected === 'top'} />
      </div>
      <${Nav} ...${{ setToTop, setToBottom, selected }} />
      <div className=${styles.bottom}>
        <${Bottom} selected=${selected === 'bottom'} />
      </div>
    </div>
  `;
};
