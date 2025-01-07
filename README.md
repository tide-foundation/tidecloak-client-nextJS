# Securing applications using Next.JS and TideCloak

So, you want to build the best digital platforms on the planet, without the burden of worrying about security, and simultaneously grant your users sovereignty over their identities? Great!

This example repo demonstrates the minimal steps required to secure a web-based platform utilizing NextJS and TideCloak -  **all in under 10 minutes** .

TideCloak gives you a plug and play tool that incorporates all the concepts and technology discussed [in this series](https://tide.org/blog/rethinking-cybersecurity-for-developers). It allows you to manage your web users' roles and permissions - It's an adaptation of Redhat's open-source KeyCloak, one of the most robust, powerful and feature-rich Identity and Access Management system. But best of all it's secured by Tide's Cybersecurity Fabric so no-one holds the keys to the kingdom.

## Prerequisites

Before starting, make sure you have:

* Docker installed and running on your machine
* NPM installed
* Internet connectivity

For the purpose of this guide, we assume to run on a Debian linux host (either under Windows WSL or not).

## 1. Deploy this Next.JS project locally

Download and stage the Next.js project structure first. This can be done by **either**:
1. Cloning this repository: `git clone https://github.com/tide-foundation/tidecloak-client-nextJS.git`
2. Downloading and unzipping this repository from https://github.com/tide-foundation/tidecloak-client-nextJS/archive/refs/heads/main.zip
3. Creating each file from scratch.

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
3. Copy your Tide's public key for this realm from [http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs](http://localhost:8080/realms/nextjs-test/protocol/openid-connect/certs) and paste it in `/keys.json`. This is the only key you can and should trust!

## 5. Deploy this Next.JS project locally

Install and stage all the NodeJS dependencies for this project (you only need to do this once):

```bash
npm install
```

Build and run your project for debugging:

```bash
npm run dev
```

Or stage the project for production:
```bash
npm run build
```

then run in production:
```bash
npm start
```

## 6. Play!

1. Go to [http://localhost:3000](http://localhost:3000/) You should see a welcome message to your app.
2. Click on the `Login` button
3. Click on `Create an account`
4. Provide a new username, password, recovery email

It will now show you that you're "Signed in" and it will show you your anonymous Tide username for this app.

![This flow](ax/AuthorisedAccess.drawio.svg?raw=true "Flow")
![This flow](ax/AuthorisedAccess.drawio.svg)

![Alt text](ax/AuthorisedAccess.drawio.svg)
<img src="./ax/AuthorisedAccess.drawio.svg">

## Project recap

Let's review what just happened and what you've just accomplished:

1. You have programmed, compiled, built and deployed, from the ground-up, a fully-functional Next.JS full-stack app with frontend and backend.
2. Web users can now sign up and sign in to your app, being served customized content to authenticated and unauthenticated users and based on their predefined roles.
3. Your web users' roles and permissions are managed locally on your very own self-hosted instance of TideCloak - one of the most robust, powerful and feature-rich Identity and Access Management system which you have downloaded, installed, configured and deployed locally.
4. Your web users enjoy fully-secured Tide accounts, with their identity and access-credentials sitting outside of anyone's reach.
5. Your TideCloak instance is secured by the global Tide Cybersecurity Fabric that you have activated and licensed.

## What next?

There's two additional layers of protection you can configure through TideCloak:

1. **Identity Governance:** Establish workflow processes ensuring that no compromised administrator can cause damage.
2. **User walletization:** Ability to lock user data with unique user keys secured by Tide's Cybersecurity Fabric - so ownership and privacy can be guaranteed.

### **For early access to these features [Sign up for our Beta Program](https://tide.org/beta)**

# Here's what in the project

Let's create the following simple Next.js project structure:

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
