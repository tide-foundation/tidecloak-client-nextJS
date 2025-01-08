# Securing applications using Next.JS and TideCloak

So, you want to build the best digital platforms on the planet, without the burden of worrying about security, and simultaneously grant your users sovereignty over their identities? Great!

This example repo demonstrates the minimal steps required to secure a web-based platform utilizing NextJS and TideCloak -  **all in under 10 minutes** .

TideCloak gives you a plug and play tool that incorporates all the concepts and technology discussed [in this series](https://tide.org/blog/rethinking-cybersecurity-for-developers). It allows you to manage your web users' roles and permissions - It's an adaptation of Redhat's open-source [Keycloak](https://www.keycloak.org/), one of the most robust, powerful and feature-rich Identity and Access Management system. But best of all it's secured by Tide's Cybersecurity Fabric so no-one holds the keys to the kingdom.

## TL;DR
If you've done this before, or know well what you're doing, you can skip this guide and just follow the summarised steps:
```bash
git clone https://github.com/tide-foundation/tidecloak-client-nextJS.git
cd tidecloak-client-nextJS
sudo docker run \
  -d \
  -v .:/opt/keycloak/data/h2 \
  -v ./test-realm.json:/opt/keycloak/data/import/test-realm.json \
  --name tidecloak \
  -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest
npm install
```
Activate license by [Request License](http://localhost:8080/admin/master/console/#/nextjs-test/identity-providers/tide/tide/settings)
```bash
curl -o ./keys.json "http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs"
npm run dev
```
And [play](http://localhost:3000)!
<br/><br/>
Otherwise, follow this guide below:

## Prerequisites

Before starting, make sure you have:

* Docker installed and running on your machine
* NPM installed
* Internet connectivity

For the purpose of this guide, we assume to run on a Debian linux host (either under Windows WSL or not).

## 1. Deploy this Next.JS project locally

Download and stage the Next.js project structure first. One way is by cloning this repository:
```bash
git clone https://github.com/tide-foundation/tidecloak-client-nextJS.git
```

<details>
<summary>Although there are other ways too.</summary>

This can also be done by either:
1. Downloading and unzipping this repository from https://github.com/tide-foundation/tidecloak-client-nextJS/archive/refs/heads/main.zip
2. Creating each file from scratch.

</details>

Set yourself at the root of the project directory. e.g.:
```bash
cd tidecloak-client-nextJS
```

## 2. Getting TideCloak up and running

TideCloak can be deployed locally, you can host it, or you can have a fully managed instance on [SkyCloak](http://skycloak.io). In this guide, we'll show you how to deploy a dev-mode docker instance locally.
Start a TideCloak-Dev docker container that already includes all the basic configuration and settings to get you going. To get it, open your Docker/WSL/Linux terminal and run the following command from the root folder of this project (where test-realm.json is):

```bash
sudo docker run \
  -d \
  -v .:/opt/keycloak/data/h2 \
  -v ./test-realm.json:/opt/keycloak/data/import/test-realm.json \
  --name tidecloak \
  -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest
```

This may take a couple of minutes, so be patient. When it's done, you'll be able to go to TideCloak's console at: [http://localhost:8080](http://localhost:8080/)

<details>
<summary>Your realms has been automatically imported and set up.</summary>

This is how it was set up:
1. Create a new Realm. E.g. `nextjs-test`
2. Set up a Tide IdP: `Identity providers` menu --> `Tide` social provider --> `Settings` tab
3. You can upload a custom background image and/or custom logo image for your users' Tide login page.
4. Allow unfeted user registration (good for development, bad for production): `Realm settings` menu --> `Login` tab --> `User registration` set to `On`
5. Remove the user detail collection: `Realm settings` menu --> `User profile` tab --> Delete `lastName`, Delete `firstName`, `email` --> `Required field` set to `Off` --> `Save`
6. Enable Tide IdP in authentication flow: `Authentication` menu --> `Flows` tab --> `browser` flow --> `Settings` of `Identity Provider Redirector` --> `Alias` set to "tide", `Default identity Provider` set to "tide" --> `Save`
7. Create client: `Clients` menu --> `Clients list` tab --> `Create client` button --> `Client ID` set to "myclient", `Next` --> `Authentication flow` tick only `Standard flow`, `Next` --> `Valid redirect URIs` set to "http://localhost:3000/silent-check-sso.html" and "http://localhost:3000/auth/redirect", `Web origins` set to "http://localhost:3000" (NO '/' AT THE END!), `Next`
8. Add roles to JWT: `Clients` menu --> `myclient` client ID --> `Client scopes` tab --> `myclient-dedicated` scope --> `Scope` tab --> `Full scope allowed` set to `On`

</details>

## 3. Activate your TideCloak license

To hook your TideCloak host into Tide's Cybersecurity Fabric, you'll need to activate your license. Tide offers free developer license for up to 100 users. To do that, you'll need to:

* Access your TideCloak administration console at [http://localhost:8080/admin/master/console/#/nextjs-test/identity-providers/tide/tide/settings](http://localhost:8080/admin/master/console/#/nextjs-test/identity-providers/tide/tide/settings)
* Log in using your admin credentials (Username: admin, Password: password, if you haven't changed it) (You should be automatically navigated to: `nextjs-test` realm --> `Identity Providers` menu --> `tide` IdP --> `Settings` tab)
* Click on the `Manage License` button next to `License`
* Click on the blue `Request License` button
* Go through the checkout process by providing a contact email

Within few seconds, you'll get your TideCloak host licenced and activated!

## 4. Extract your settings

Export your specific TideCloak settings and hardcode it in your project:
1. Go to your [Clients](http://localhost:8080/admin/master/console/#/nextjs-test/clients) menu --> `myclient` client ID --> `Action` dropdown --> `Download adaptor configs` option (keep it as `keycloak-oidc-keycloak-json` format)
2. Download or copy the details of that config and paste it in the project's root folder under `keycloak.json`. Yes, it's most likely identical to what's there already, but you need to know this if you're deploying a live instance!
3. Copy your Tide's public key for this realm from [http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs](http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs) and paste it in `keys.json`. This is the only key you can and should trust! Here's a quick way: `curl -o ./keys.json "http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs"` .

## 5. Deploy this Next.JS project locally

Install all the NodeJS dependencies for this project (you only need to do this once):

```bash
npm install
```

Build and run your project for debugging:

```bash
npm run dev
```

<details>
<summary>Alternatively, you can set up the project for production.</summary>

To build and stage the project, use this instead:
```bash
npm run build
```

then run in production:
```bash
npm start
```
</details>

## 6. Play!

1. Go to [http://localhost:3000](http://localhost:3000/) You should see a welcome message to your app.
2. Click on the `Login` button
3. Click on `Create an account`
4. Provide a new username, password, recovery email
5. Once successfully signing in / signing up successfuly, you'll land in the "Protected Page" showing you your anonimized username and confirming you have been assigned a UMA role (that's just a random role assigned to everyone we chosed to display for this demo).
6. You can now click on `Make API Call` button to invoke a backend request to retrieve protected information.
7. Once pressed, you'll get the JSON content of the API response displayed.
8. You can also press the `Logout` button to invoke a full Single-Sign-Out.

## Project recap

Let's review what just happened and what you've just accomplished:

1. You have built and deployed, from the ground-up, a fully-functional Next.JS full-stack app - both front end and back end.
2. Web users can now sign up and sign in to your app, being served customized content to authenticated and unauthenticated users and based on their predefined roles.
3. Your web users' roles and permissions are managed locally on your very own self-hosted instance of TideCloak - one of the most robust, powerful and feature-rich Identity and Access Management system which you have downloaded, installed, configured and deployed locally.
4. Your web users enjoy fully-secured Tide accounts, with their identity and access-credentials sitting outside of anyone's reach.
5. Your TideCloak instance is secured by the global Tide Cybersecurity Fabric that you have activated and licensed.

## What next?

There's two additional layers of protection you can configure through TideCloak:

1. **Identity Governance:** Establish workflow processes ensuring that no compromised administrator can cause damage.
2. **User walletization:** Ability to lock user data with unique user keys secured by Tide's Cybersecurity Fabric - so ownership and privacy can be guaranteed.

### **For early access to these features [Sign up for our Beta Program](https://tide.org/beta)**


# How does it work?

The Next.js project structure:

```
MyProject/
│
├── public/
│   └── silent-check-sso.html
│
├── lib/
│   ├── IAMService.js
│   └── tideJWT.js
│
├── pages/
│   ├── index.js
│   ├── fail.js
│   ├── protected.js
│   ├── api/
│   │   └── endpoint.js
│   └── auth/
│       └── redirect.js
│
├── middleware.js
├── keycloak.json
├── keys.json
└── package.json
```

## Normal authorised access

Here's the process happening on a successful access request:

![Authorised flow](ax/nextjs-authorisedaccess.drawio.svg "Authorised access flow")

1. User opens the default homepage at http://localhost:3000 (served by `index.js`) and presses the `Login` button.
2. The page initializes a TideCloak session and calls for a log-in process. The user's browser is then redirected to TideCloak.
3. TideCloak redirects the user to Tide as an external IdP (Identity Social Provider).
4. Tide presents the user with its secure-enclave to conclude a sign-up / sign-in process.
5. The user performs a zero-knowledge registration and authentication with Tide.
6. Once successfully creating / authenticating the user with hermetic anonymity, together with secure authorization information managed on TideCloak, Tide creates and signs the user tokens to be sent back.
7. The `redirect.js` callback page, exchanges the user's authentication code with the user tokens and redirects the user to be validated by the backend.
8. Once the `middleware.js` backend validates the tokens and the specific user's roles in the context of this session, it redirects the user to its final secure destination.
9. The `pretected.js` renders only for the authenticated and authorised user. From this point onwards, the user's token will follow every page they go, where the middleware will recheck before rendering the protected content on the browser.

## Automatic restarting an authorised access

If the user still holds a valid access token, by a previous session or through a Single-Sign-On on a different, related client (web platform), the system will automatically recognize it and redirect the user to its destination, skipping the unnecessary sign-in process.

![Authorised flow](ax/nextjs-authorisedautoaccess.drawio.svg "Automatic authorised access flow")

1. User opens the default homepage at http://localhost:3000 (served by `index.js`).
2. The page initializes a TideCloak session (in a hidden frame `silent-check-sso.html`) that performs a background check against TideCloak.
3. If TideCloak reconizes that user to be already signed-in, it'll provide the necessary code required for authentication.
4. Once confirmed as authneticated, the `index.js` page will automatically redirect the user to be routed as authenticated.
5. The `redirect.js` page will initialize the access tokens in the session and redirect the user to the backend for validation.
6. Once the `middleware.js` backend validates the tokens and the specific user's roles in the context of this session, it redirects the user to its final secure destination.
7. The `pretected.js` renders only for the authenticated and authorised user. From this point onwards, the user's token will follow every page they go, where the middleware will recheck before rendering the protected content on the browser.

## Unauthenticated access attempt

When a user fails to sucessfuly authenticate, it will be redirected back to the original home page on `index.js`.

![Unauthenticated flow](ax/nextjs-unauthenticatedattempt.drawio.svg "Unauthenticated access attempt flow")

## Unauthorized access attempt

A successfuly authenticated user that have been assigned roles / permissions / priviledged that are insufficient for the pages / section of the web site will be redirected to the `fail.js` page where they could `sign out`.

![Unauthorized flow](ax/nextjs-unauthorisedattempt.drawio.svg "Unauthorized access attempt flow")

## Authorized API access

While on a protected page (e.g. `protected.js`) the frontend may initiate manual or automated API requests from the backend that require the specific user's credentials.

![API flow](ax/nextjs-authorisedAPIaccess.drawio.svg "Authorized API access flow")

## Single-Sign-Out

During a normally authorized session, the user may opt to leave, but with explicit request to sign themselves out. This will trigger a system-wide sign-out process that will impact their sessions across other related-platforms as well.

![SSOut flow](ax/nextjs-ssologout.drawio.svg "Single-Sign-Out flow")

## Automated session refresh flow

To guarantee the user remains connected and properly served while preventing a malicious actor from stealing that user's session, there's a background mechanism happening that continiously checks the session liveness and extends it.

![Refresh flow](ax/nextjs-autotokenrefresh.drawio.svg "Automated refresh access flow")
