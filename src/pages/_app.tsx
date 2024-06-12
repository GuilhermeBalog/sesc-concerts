import React from 'react';
import type { AppProps } from 'next/app';

import { ConfigProvider } from 'antd';

import { ActivitiesProvider } from '@/contexts/activities';
import theme from '@/theme/themeConfig';

import '@/styles/global.scss'

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <ActivitiesProvider>
      <Component {...pageProps} />
    </ActivitiesProvider>
  </ConfigProvider>
);

export default App;