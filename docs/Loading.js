import html from 'html';
import css from 'css';

const { loading, show, container, swish1, swish2, swish3 } = css`
.loading {
  background-color: #3b506b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 141px;
  position: absolute;
  z-index: 9001;
  opacity: 0;
  pointer-events: none;
  transition: 0.4s opacity;
  top: 0;
  left: 0;
}
.loading.show {
  opacity: 1;
  pointer-events: initial;
}
.container {
  position: relative;
  width: 1em;
  height: 1em;
  transform-origin: 50% 50%;
  animation: 62.8s linear loading_atom_spin infinite;
}
@keyframes loading_atom_spin {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
.swish1, .swish2, .swish3 {
  transform-origin: 50% 50%;
  width: 1em;
  height: 1em;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}
.swish1:after, .swish2:after, .swish3:after {
  border: solid white;
  border-width: 0.05em 0 0 0;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-origin: 50% 50%;
  transform: rotate(0deg);
  content: '';
  border-radius: 0.5em;
}
.swish1 {
  transform: rotate(90deg) scale(1, 0.25) rotate(45deg);
}
.swish2 {
  transform: rotate(210deg) scale(1, 0.25) rotate(90deg);
}
.swish3 {
  transform: rotate(330deg) scale(1, 0.25) rotate(180deg);
}
@keyframes loading_atom_anim {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}
.container:after {
  content: '';
  width: 0.15em;
  height: 0.15em;
  display: block;
  border-radius: 0.075em;
  background-color: white;
  box-shadow: 
    0 0 1em black,
    0 0 0.5em black,
    0 0 0.25em black,
    0 0 0.125em black,
    -0.0375em -0.0375em 0.075em 0 inset rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0.425em;
  left: 0.425em;
}
.swish1:after {
  animation: 1.2s linear loading_atom_anim infinite;
}
.swish2:after {
  animation: 1.1s linear loading_atom_anim infinite;
}
.swish3:after {
  animation: 1.3s linear loading_atom_anim infinite;
}
`;

export default ({ visible }) => html`
  <div className=${loading.and(visible && show)}>
    <div className=${container}>
      <div className=${swish1} />
      <div className=${swish2} />
      <div className=${swish3} />
    </div>
  </div>
`;