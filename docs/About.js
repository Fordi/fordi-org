import html from 'html';
import css from 'css';
import { useI18n } from './I18n.js';

const styles = css`
  .about {
    padding-top: 96px;
    background: #222;
    color: #FEFEFE;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .about article {
    width: 75%;
    display: block;
    margin: 0 auto;
    max-width: 960px;
    padding: 0 1em;
  }
`;

export default () => {
    const _ = useI18n();
    return html`
      <div className=${styles.about}>
          <article>
              <h1>Bryan elliott</h1>

              <h2>${_`a brief history`}</h2>

              <p>
                ${_`Bryan's first experience with programming was in second grade. Dad had
                  just bought their first computer, and Bryan spend months poring over
                  the GW Basic syntax manual, testing commands, breaking things, and
                  wondering what a "Syntax" was.`}
              </p>
              <p>
                ${_`Through middle and high schools, Bryan taught himself Turbo Pascal,
                  rudimentary game programming, Assembly Language, C, and ultimately HTML
                  and JavaScript.`}
              </p>
              <p>
                ${_`Since then, he has freelanced for a number of clients in the
                  Philadelphia area, including The Wharton School, Abacus Studios, Sevens
                  and Sixes, and I-SITE. He then spent two years at TrueAction, Inc.,
                  building the UI for demanding eCommerce clients like Toys R Us. At RSI
                  Content Solutions, he creating the UI and much of the back-end for
                  RSuite CMS version 5.`}
              </p>
              <p>
                ${_`At present, he's a contractor for Comcast, helping to transition the
                  large MyAccount customer portal from a monolithic Angular 1.4 app into
                  a suite of small React apps, maintaining the existing site, updating
                  accessibility, and working with a number of large API teams to create
                  new user features.`}
              </p>

              <h2>${_`a particular set of skills`}</h2>

              <p>
                ${_`Webdev has become a complex space of frameworks, libraries, languages,
                  language flavors, linters, compilers, services, and continuous
                  integrators.  No more can you afford to waste time on a simple HTML and
                  CSS jockey - you need someone who can navigate the world of node, Ruby,
                  Java and more.`}
              </p>
              <p>
                ${_`Bryan has taken on much of what's popular in the professional web
                  development world, and is competent to hit the ground running on
                  almost any project environment.  He's opinionated when it matters,
                  but he'll happily adapt to whatever practices exist in the shop.`}
              </p>
              <p>
                ${_`CSS?  SCSS? LESS?  He's mastered it.  React?  Angular?  Ember?
                  Bryan can work on it.  Rails?  Spring?  Doesn't matter; he's done it
                  before.`}
              </p>

              <h2>${_`future targets`}</h2>

              <p>
                  ${_`Bryan's ambitions are relatively simple. He would like to work on innovative software,
                  and make it a pleasure for others to work on - "others" being a term that includes
                  himself in six months: maintenance can be as challenging as development, and good
                  test-driven development, coupled with good documentation, can ease that pain.`}
              </p>
              <p>
                  ${_`Past that, he would like to have a relationship with a company with clear goals,
                  excellent management, and a developement team that is open to new ideas and
                  technologies.`}
              </p>
          </article>
      </div>
  `;
};
