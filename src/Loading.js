import { html, css } from 'https://unpkg.com/@fordi-org/buildless';

const { loading } = css`
.loading {
  background-color: #3b506b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 80px;
}

.loading:before, .loading:after {
  box-sizing: border-box;
  flex: 0 0 auto;
  position: absolute;
  content: '';
  opacity: 0;
  border-radius: 50%;
  animation: loading_animation 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  display: block;
  box-shadow: 0 0 5px 0 white, 0 0 5px 0 inset white;
}

.loading:before {
  animation-delay: 0.5s !important;
}

@keyframes loading_animation {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 1em;
        height: 1em;
        opacity: 0;
    }
}

`;

export default () => html`<div className=${loading} />`;