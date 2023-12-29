import React from 'react'
import Translate from '@docusaurus/Translate'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomepageFeatures from '@site/src/components/HomepageFeatures'

import styles from './index.module.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle"><Translate>An extensible media player for web applications</Translate></p>
        <div className={styles.buttons}>
          <Link className="button button--secondary" to="/docs/intro">
            <Translate>Get Started</Translate>
          </Link>
          <Link className="button button--info" href="http://clappr.io/demo">
            <Translate>Try a Demo</Translate>
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=clappr&amp;repo=clappr&amp;type=star&amp;count=true&amp;size=large"
              width={160}
              height={60}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </header>
  )
}

export default function Home() {
  return (
    <Layout description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
