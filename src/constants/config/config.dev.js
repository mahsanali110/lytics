export const USERS_BASE_URL = process.env.REACT_APP_SERVER_PATH || 'https://backend.lytics.systems';
// export const USERS_BASE_URL = process.env.REACT_APP_SERVER_PATH || 'http://182.180.119.154:5000';
const infoRoutes = [
  // '/info',
  // '/info/training-book',
  // '/info/software-manual',
  // '/info/shortcut-sheet',
  // '/info/support-document',
];

export const VALID_ROUTES_BY_ROLE = {
  admin: {
    paths: [
      '/settings/user',
      '/settings/guests',
      '/settings/association',
      '/settings/program-name',
      '/settings/theme',
      '/settings/channels',
      '/settings/program-type',
      '/settings/hosts',
      '/settings/writers',
      '/work-assessment',
      '/settings/alarms',
      '/settings/company',
      '/settings/group',
      '/dashboard',
      '/reports',
      ...infoRoutes,
    ],
    landingPage: '/settings/user',
    redirectUrl: '/access-denied',
  },
  clipper: {
    paths: [
      '/clipper',
      '/liveClipping',
      '/multiview',
      '/awareness',
      '/web',
      '/print',
      '/onlineVideos',
      '/social',
      '/qc-edit/:jobId',
      '/onlineSinlgeImport',
      '/printClipper',
      // '/libraries',
      ...infoRoutes,
    ],
    landingPage: '/multiview',
    redirectUrl: '/access-denied',
  },
  qc: {
    paths: ['/jobs', '/qc-edit/:jobId', '/hyper-qc', ...infoRoutes],
    landingPage: '/jobs',
    redirectUrl: '/access-denied',
  },
  marker: {
    paths: ['/jobs', '/marker-edit/:jobId', ...infoRoutes],
    landingPage: '/jobs',
    redirectUrl: '/access-denied',
  },
  compiler: {
    paths: [
      '/search',
      '/dashboard',
      '/reports',
      '/marker-edit/:jobId',
      '/qc-edit/:jobId',

      ...infoRoutes,
    ],
    landingPage: '/search',
    redirectUrl: '/access-denied',
  },
  reviewer: {
    paths: ['/search', '/dashboard', '/reports', '/marker-view/:jobId', ...infoRoutes],
    landingPage: '/search',
    redirectUrl: '/access-denied',
  },
  client: {
    paths: [
      '/clientSearch',
      '/libraries',
      '/clientMultiview',
      '/clientReports',
      '/clientDashboard',
      '/mediamanager',
      '/news-board',
      '/news-board-new',
      '/map',
    ],
    landingPage: '/libraries',
    redirectUrl: '/access-denied',
  },
};

const pannels = {
  paths: [
    '/clientSearch',
    '/libraries',
    '/clientMultiview',
    '/clientReports',
    '/clientDashboard',
    '/mediamanager',
    '/news-board',
  ],
  landingPage: '/libraries',
};
