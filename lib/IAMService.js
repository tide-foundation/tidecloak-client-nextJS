import TideCloak from "keycloak-js";
import Heimdall from "../../heimdall-plus/lib/heimdall.js"
import kcData from "/keycloak.json";

let _tc = null;

function getKeycloakClient() {
  if (!_tc) {
    _tc = new Heimdall({
      url: kcData['auth-server-url'],
      realm: kcData['realm'],
      clientId: kcData['resource'],
      vendorId: kcData['vendorId'],
      homeOrkUrl: kcData['homeOrkUrl']
    });
  }
  return _tc;
}

const updateIAMToken = async () => {
  const keycloak = getKeycloakClient();
  await keycloak.updateToken(300).then((refreshed) => {
    if (refreshed) {
      console.debug('[updateIAMToken] Token refreshed: '+ Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      if (! typeof window === "undefined" ) { 
        document.cookie = `kcToken=${keycloak.token}; path=/;`; 
      };
    } else {
      console.debug('[updateIAMToken] Token not refreshed, valid for '
        + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
    }
  }).catch((err) => {
    console.error('[updateIAMToken] Failed to refresh token', err);
    throw err;
  });
}

const initIAM = (onReadyCallback) => {
  const keycloak = getKeycloakClient();
  if (typeof window === "undefined") {
    // We are on the server, do nothing
    return;
  }

  keycloak.onTokenExpired = async () => { await updateIAMToken() };
  
  if (!keycloak.didInitialize) {
    keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      // If authenticated, store the token in a cookie so the middleware can read it.
      if (authenticated && keycloak.token) {
        document.cookie = `kcToken=${keycloak.token}; path=/;`;
      }

      if (onReadyCallback) {
        onReadyCallback(authenticated);
      }
    })
    .catch((err) => console.error("Keycloak init err:", err));
  }

};

const doLogin = () => {
  const keycloak = getKeycloakClient();
  keycloak.login({redirectUri: window.location.origin + "/auth/redirect"});
};

const doEncrypt = async (d) => {
  const heimdall = getKeycloakClient();
  return await heimdall.encrypt(d);
}

const doLogout = () => {
  const keycloak = getKeycloakClient();
  // Clear the cookie so the server no longer sees the old token
  document.cookie = "kcToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  keycloak.logout({redirectUri: window.location.origin +"/auth/redirect" });
};

const isLoggedIn = () => {
  const keycloak = getKeycloakClient();
  return !!keycloak.token;
};

const getToken = async () => {
  const keycloak = getKeycloakClient();
  if (keycloak) {
    const tokenExp = getTokenExp();
    if ( tokenExp < 3 ) {
      try {
        await updateIAMToken();
        console.debug('Refreshed the token');
      } catch (error) {
        console.error('Failed to refresh the token', error);
        keycloak.logout();
        return null;
      }
    }
    return keycloak.token ?? null;
  }
  return null;
};

const getName = () => {
  const keycloak = getKeycloakClient();
  return keycloak.tokenParsed?.preferred_username;
};

const getTokenExp = () => {
  const keycloak = getKeycloakClient();
  return Math.round(keycloak.tokenParsed?.exp + keycloak.timeSkew - new Date().getTime() / 1000);
};

const hasOneRole = (role) => {
  const keycloak = getKeycloakClient();
  return keycloak.hasRealmRole(role);
};

const IAMService = {
  initIAM,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getName,
  hasOneRole,
  getTokenExp,
  doEncrypt
};

export default IAMService;
