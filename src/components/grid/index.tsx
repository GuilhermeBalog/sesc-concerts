/* eslint-disable @next/next/no-img-element */
import React from 'react'

import styles from './style.module.scss';
import { MusicActivity } from '@/services/activities';
import { BarcodeOutlined, CalendarOutlined, DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

interface GridProps {
  items: MusicActivity[]
}

type AntIcon = React.ForwardRefExoticComponent<Omit<AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>>

interface MusicActivityDetail {
  Icon: AntIcon,
  text: string
  key: string,
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: "2-digit",
  month: '2-digit',
  year: 'numeric',
  hour: "2-digit",
  minute: "2-digit",
});

function getDetails(item: MusicActivity): MusicActivityDetail[] {
  const details: MusicActivityDetail[] = [
    { key: "local", Icon: EnvironmentOutlined, text: item.places.filter(s => s?.trim()).join(`, `) },
    ...item.dates.map(date => ({ key: `date-${date}`, Icon: CalendarOutlined, text: dateFormatter.format(new Date(date)) })),
    getTicketsDetail(item),
  ];

  return details;
}

function getTicketsDetail(item: MusicActivity): MusicActivityDetail {
  const key = "tickets-info"
  if(item.tickets === null) {
    return {
      key,
      Icon: DollarOutlined,
      text: `Gratuito`,
    }
  }

  if(item.tickets <= 0) {
    return {
      key,
      Icon: BarcodeOutlined,
      text: `Esgotado`
    }
  }

  return {
    key,
    Icon: BarcodeOutlined,
    text: `${item.tickets} ingressos`,
  }
}

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
              {getDetails(item).map((detail) => (
                <li key={detail.key} className={styles.card__detail}>
                  <detail.Icon /> {detail.text}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
