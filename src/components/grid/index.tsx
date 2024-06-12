/* eslint-disable @next/next/no-img-element */
import React from 'react'

import styles from './style.module.scss';
import { MusicActivity } from '@/contexts/activities';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';

interface GridProps {
  items: MusicActivity[]
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: "2-digit",
  month: '2-digit',
  year: 'numeric',
  hour: "2-digit",
  minute: "2-digit",
});


export function Grid({ items }: GridProps) {
  return (
    <ul className={styles.grid}>
      {items.map(item => (
        <li key={item.id} className={styles.card}>
          <a href={item.link} target="_blank" rel="noreferrer noopener">
            <img
              src={item.image}
              alt={item.title + " - " + item.subtitle}
              loading="lazy"
              className={styles.card__image}
            />
          </a>

          <div className={styles.card__content}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.card__heading}
            >
              <p className={styles.card__title}><strong>{item.title}</strong></p>

              {item.subtitle && <p className={styles.card__subtitle}>{item.subtitle}</p>}
            </a>

            <ul className={styles.card__details}>
                <li className={styles.card__detail}>
                  <EnvironmentOutlined /> {item.places}
                </li>
                <li className={styles.card__detail}>
                  <CalendarOutlined /> {dateFormatter.format(item.date)}
                </li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
