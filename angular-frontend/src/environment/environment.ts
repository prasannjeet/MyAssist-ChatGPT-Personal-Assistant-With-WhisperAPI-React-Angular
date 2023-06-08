export const environment = {
  production: false,
  serverUrl: '/api',
  tweetBackUrl: 'https://tweetback.giize.com',
  appUrl: 'https://myassist.ooguy.com',
  // appUrl: 'http://localhost:4200',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'https://keycloak.ooguy.com:8443/',
    // Realm
    realm: 'timetable-oauth',
    clientId: 'angular-client',
  },
};
