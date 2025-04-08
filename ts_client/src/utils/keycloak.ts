import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'master', // default realm
  clientId: 'whiteboard-client', // make sure this client exists under 'master'
});

export default keycloak;
