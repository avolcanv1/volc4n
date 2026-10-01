import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { AboutBio } from './AboutBio'
import { PageHeader } from './PageHeader'
import '../styles/page.css'
import './About.css'

const SERVICES = ['Editorial design', 'Web design', 'Web development', 'Exhibition identities']

/* Enough copies that the strip still covers very wide screens one copy into the loop. */
const MARQUEE_COPIES = 4

function ServicesMarquee() {
  return (
    <section className="about-marquee" aria-label="Services">
      <div className="about-marquee__track">
        {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
          <ul
            key={copy}
            className="about-marquee__list page__counter"
            aria-hidden={copy > 0 ? true : undefined}
          >
            {SERVICES.map((service) => (
              <li key={service} className="about-marquee__item">
                {service}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}

export function About() {
  const { isDark } = useTheme()
  const { about } = useContent()

  return (
    <div className={`page about${isDark ? ' page--dark' : ''}`}>
      <PageHeader />
      <ServicesMarquee />

      <main className="about__main">
        <AboutBio value={about.bio} className="about__text" />
      </main>

      <footer className="about__footer">
        <a className="page__link about__footer-item" href={`mailto:${about.email}`}>
          {about.email}
        </a>
        <p className="about__footer-item about__address">{about.address}</p>
        <p className="about__footer-item about__credit">Design and web development by volc4n</p>
        <p className="about__footer-item about__copyright">© 2026</p>
      </footer>
    </div>
  )
}
