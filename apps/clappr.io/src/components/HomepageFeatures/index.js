import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_website_setup_re_d4y9.svg').default,
    description: (
      <>
        Clappr was designed from the ground up to be easily installed and
        used. Just import it, plug it in your page and it&apos;s ready to play.
      </>
    ),
  },
  {
    title: 'Build It Your Way',
    Svg: require('@site/static/img/undraw_programming_re_kg9v.svg').default,
    description: (
      <>
        Clappr is 100% open-source. It&apos;s architecture was projected with extensibility 
        and low coupling by design. You can build new features and customize anything you
        want in Clappr with the use of plugins.
      </>
    ),
  },
  {
    title: 'Play Anywhere',
    Svg: require('@site/static/img/undraw_video_streaming_re_v3qg.svg').default,
    description: (
      <>
        Clappr is HTML5 first and is able to deliver your content across multiple modern media 
        devices. You can also extend the default HTML5 playback or create your own playback 
        interface to create a new media support!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
