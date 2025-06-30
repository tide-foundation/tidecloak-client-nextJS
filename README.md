🚀 [Try the 2 x click setup in Codespaces](https://github.com/tide-foundation/tidecloakspaces)

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
  -v ./nextjs-test-realm.json:/opt/keycloak/data/import/nextjs-test-realm.json \
  --name tidecloak \
  -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest
npm install
```
Activate license by [Manage License](http://localhost:8080/admin/master/console/#/nextjs-test/identity-providers/tide/tide/settings) then `Request License`.

Get settings by [Clients](http://localhost:8080/admin/master/console/#/nextjs-test/clients) → _myclient_ → _Action_ → `Download adapter config` and put it inside `/data/tidecloak.json`.
```bash
npm run dev
```
[Enable IGA](https://github.com/tide-foundation/tidecloak-client-nextJS/blob/main/SetupIGA.md)
<br/><br/>
And [play](http://localhost:3000)!
<br/><br/>
Otherwise, follow this guide below:

## Prerequisites

Before starting, make sure you have:

* Docker installed and running on your machine
* NPM installed
* Optional: Git installed
* Internet connectivity

For the purpose of this guide, we assume Debian Linux command syntax (either under Windows WSL or not).

## A. Deploy this Next.JS project locally

1. Download and stage the Next.js project structure first. One way is by cloning this repository:
   ```bash
   git clone https://github.com/tide-foundation/tidecloak-client-nextJS.git
   ```

<details>
<summary>Although there are other ways too.</summary>

This can also be done by either:
* Downloading and unzipping this repository from https://github.com/tide-foundation/tidecloak-client-nextJS/archive/refs/heads/main.zip
* Creating each file from scratch.

</details>

2. Set yourself at the root of the project directory. e.g.:
   ```bash
   cd tidecloak-client-nextJS
   ```

## B. Getting TideCloak up and running

TideCloak can be deployed locally, you can host it, or you can have a fully managed instance on [SkyCloak](http://skycloak.io). In this guide, we'll show you how to deploy a dev-mode docker instance locally.
Start a TideCloak-Dev docker container that already includes all the basic configuration and settings to get you going. To get it, open your Docker/WSL/Linux terminal and run the following command from the root folder of this project (where nextjs-test-realm.json is):

```bash
sudo docker run \
  -d \
  -v .:/opt/keycloak/data/h2 \
  -v ./nextjs-test-realm.json:/opt/keycloak/data/import/nextjs-test-realm.json \
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
1. Create a new Realm `nextjs-test`.
2. Set up a Tide IdP:
   - `Identity providers` menu → `Tide` social provider → `Settings` tab
3. You can upload a custom background image and/or custom logo image for your users' Tide login page.
4. Verify user registration (good practice for production environments) is off:
   - `Realm settings` menu → `Login` tab → `User registration` set to `Off`
5. Remove the user detail collection:
   - `Realm settings` menu → `User profile` tab → Delete `lastName`, Delete `firstName`, `email` → `Required field` set to `Off` → `Save`
6. Enable Tide IdP in authentication flow:
   - `Authentication` menu → `Flows` tab → `browser` flow → `Settings` of `Identity Provider Redirector` → `Alias` set to "tide", `Default identity Provider` set to "tide" → `Save`
7. Activate Tide linking:
   - `Authentication` menu → `Required actions` tab → `Link Tide Account` enable to `On`
8. Create client:
    - `Clients` menu → `Clients list` tab → `Create client` button → `Client ID` set to "myclient", `Next` → `Authentication flow` tick only `Standard flow`, `Next` → `Valid redirect URIs` set to _`http://localhost:3000/silent-check-sso.html`_ and _`http://localhost:3000/auth/redirect`_, `Web origins` set to _`http://localhost:3000`_ (NO '/' AT THE END!), `Next`
9. Add roles to JWT:
    - `Clients` menu → `myclient` client ID → `Client scopes` tab → `myclient-dedicated` scope → `Scope` tab → `Full scope allowed` set to `On`
10. Create self-encryption roles:
    - `Realm Roles` menu → `Create role` button → set `Role name` to "_tide_dob.selfdecrypt" → `Save`
    - `Realm Roles` menu → `Create role` button → set `Role name` to "_tide_dob.selfencrypt" → `Save`
11. Add new roles to default roles:
    - `Realm settings` menu → `User registration` tab → `Assign role` button → `Filter by realm roles` dropdown → tick both new roles → `Assign`

</details>

## C. Activate your TideCloak license

To hook your TideCloak host into Tide's Cybersecurity Fabric, you'll need to activate your license. Tide offers free developer license for up to 100 users. To do that, you'll need to:

1. Navigate to your TideCloak administration console at the [Tide IdP Settings page](http://localhost:8080/admin/master/console/#/nextjs-test/identity-providers/tide/tide/settings)
2. Log in using your admin credentials (Username: `admin`, Password: `password`, if you haven't changed it) (You should be automatically navigated to: `nextjs-test` realm → `Identity Providers` menu → `tide` IdP → `Settings` tab)
3. Click on the `Manage License` button next to `License`
4. Click on the blue `Request License` button
5. Go through the checkout process by providing a contact email

Within few seconds, you'll get your TideCloak host licenced and activated!

## D. Set up Quorum-enabled Authorization

To secure your realm against the highest cyber-threat, compromised-insider, set up provable Identity Governance and Administration on your realm (**IGA** for short). This step will achieve two important goals: protecting the realm's authority key with Ineffable Cryptography (where no one will ever hold), and restrict changes to only ones approved by a quorum of Tide-protected admins. For a complete step-by-step guide on setting it up securely, read [here](https://github.com/tide-foundation/tidecloak-client-nextJS/blob/main/SetupIGA.md).

For a quick-guide, follow these steps:

1. **Realm settings** menu → [General](http://localhost:8080/admin/master/console/#/nextjs-test/realm-settings/general) → **Identity Governance and Administration** : *On*
2. **Users** menu → [Create new user](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user) → **Username**: _alice_ , **Email**: _alice@email.here_ → `Create`
3. **[Users](http://localhost:8080/admin/master/console/#/nextjs-test/users)** menu → **alice** user → **Credentials** tab → `Credential Reset` link → **Reset action** : _Link Tide Account_ → `Copy Link` button
4. Paste the link in a new (or private) browser and follow the instructions on screen to associate an existing or a new Tide account to Alice's account. Once associated, close that browser when done.
5. Return to the realm administration: **[Users](http://localhost:8080/admin/master/console/#/nextjs-test/users)** menu → **alice** user → **Role Mapping** tab → **Assign Role** → _tide-realm-admin_ : `Assign`
6. **Change Requests** menu → **[Users](http://localhost:8080/admin/master/console/#/nextjs-test/change-requests/users)** tab → tick **Granting Role to User (tide-realm-admin)** → `Review Draft`
7. Tick same role again → `Commit Draft`

## E. Quorum-Authorize the _nextjs-test_ realm

From this point on, the original TideCloak admin has no longer authority in the **nextjs-test**, and from now on, all administration and provisioning in that realm should be done exclusively as Alice, through the realm direct administration console.

1. Open another new (or private) browser [here](http://localhost:8080/admin/nextjs-test/console/) and use Alice's Tide account to log in.
2. **Change Requests** menu → **[Clients](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/change-requests/clients)** tab → tick **New Client Created (myclient)** → `Review Draft`
3. Tick same client again → `Commit Draft`

## F. Extract your settings

Export your specific TideCloak settings and hardcode it in your project:

1. Go to your [Clients](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/clients) menu → `myclient` client ID → `Action` dropdown → `Download adaptor configs` option (keep it as `keycloak-oidc-keycloak-json` format)
2. Download or copy the details of that config and paste it in the project's root folder under `tidecloak.json`.

## G. Create a demo user

For this example project's purpose, you'll need at least one "standard" user that is allowed in. As the newly appointed realm admin, Alice, set up Bob as a "standard" user:

1. **Users** menu → [Add User](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/users/add-user) → **Username**: _bob_ , **Email**: _bob@email.here_ → `Create`
2. **[Users](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/users)** menu → **bob** user → **Credentials** tab → `Credential Reset` link → **Reset action** : _Link Tide Account_ → `Copy Link` button
3. Paste the link in a new (or private) browser and follow the instructions on screen to associate an existing or a new Tide account to Bob's account. Do not associate Alice's Tide account for Bob! Once associated, close that browser when done.

## H. Deploy this Next.JS project locally

1. Install all the NodeJS dependencies for this project (you only need to do this once):
   
   ```bash
   npm install
   ```

2. Build and run your project for debugging:

   ```bash
   npm run dev
   ```

<details>
<summary>Alternatively, you can set up the project for production.</summary>

1. To build and stage the project, use this instead:
   ```bash
   npm run build
   ```

2. Then run in production:
   ```bash
   npm start
   ```
</details>

## I. Play!

1. Go to [http://localhost:3000](http://localhost:3000/) You should see a welcome message to your app.
2. Click on the `Login` button
3. Use _Bob_'s Tide account to log in
4. Once successfully signed in successfully, you'll land in the "Protected Page" showing you your anonymized username and confirming you have been assigned a UMA role (that's just a random role assigned to everyone we chose for this demo).
5. You can now click on `Make API Call` button to invoke a backend request to retrieve protected information.
6. Once pressed, you'll get the JSON content of the API response displayed.
7. You can also access the protected personal data page by clicking on its link. Here, you can experiment with Tide's End-to-End Encryption (E2EE) to lock and unlock the Date-of-birth (DoB) field, that no one can access except _Bob_.
8. You can also press the `Logout` button to invoke a full Single-Sign-Out.

## Project recap

Let's review what just happened and what you've just accomplished:

* You have built and deployed, from the ground-up, a fully-functional Next.JS full-stack app - both front end and back end.
* Web users, like _Bob_, can be invited by admins, like _Alice_, to use it securely with their Tide account. Your web users enjoy provably-secure Tide accounts, with their identity and access-credentials sitting outside of anyone's reach.
* Your web users can sign in to your app, be served customized content to authenticated and unauthenticated users and based on their predefined roles.
* Your web users' roles and permissions are managed locally on your very own self-hosted instance of TideCloak - one of the most robust, powerful and feature-rich Identity and Access Management system which you have downloaded, installed, configured and deployed locally.
* Your TideCloak realm ("_nextjs-test_") is secured by the global Tide Cybersecurity Fabric that you have activated and licensed.
* Your realm's authority key, the VVK, is secured, out of anyone's reach, by Tide Cybersecurity Fabric, such that even if your administrators, your TideCloak's instance, its source code or even our staff at Tide get compromised, still no one can ever get a hold of it.
* Changes to the realm's users access rights (e.g. roles, settings, clients) can be drafted by any of the realm's Tide-secured admins, but only go into affect after the rightful quorum of admins reviewed, agreed and committed it. No one can manipulate or bypass that process.
* Your web users sensitive date-of-birth field is hermetically secure at rest and in transit, by a key that is literally out of anyone's reach (Including administrators. Including us), and is unlocked only to the authorized users (themselves) at the edge device, on their browser.

### **For our supported access to these capabilities, [sign up to our free Alpha Program](https://tide.org/alpha)**


# How does it work?

The Next.js project structure:

```
tidecloak-client-nextJS/
├── public/
│   └── silent-check-sso.html
├── lib/
│   ├── db.js
│   ├── IAMService.js
│   └── tideJWT.js
├── pages/
│   ├── index.js
│   ├── fail.js
│   ├── protected.js
│   ├── api/
│   |   ├── retrieve.js
│   |   ├── store.js
│   │   └── endpoint.js
│   └── auth/
│       └── redirect.js
├── middleware.js
├── keycloak.json
├── keys.json
└── package.json
```

## Normal authorised access

Here's the process happening on a successful access request:

<img src="ax/nextjs-authorisedaccess.drawio.svg" alt="Authorized flow" title="Authorised access flow" width=100%>

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

<img src="ax/nextjs-authorisedautoaccess.drawio.svg" alt="Authorised flow" title="Automatic authorised access flow" width=100%>

1. User opens the default homepage at http://localhost:3000 (served by `index.js`).
2. The page initializes a TideCloak session (in a hidden frame `silent-check-sso.html`) that performs a background check against TideCloak.
3. If TideCloak recognizes that user to be already signed-in, it'll provide the necessary code required for authentication.
4. Once confirmed as authenticated, the `index.js` page will automatically redirect the user to be routed as authenticated.
5. The `redirect.js` page will initialize the access tokens in the session and redirect the user to the backend for validation.
6. Once the `middleware.js` backend validates the tokens and the specific user's roles in the context of this session, it redirects the user to its final secure destination.
7. The `pretected.js` renders only for the authenticated and authorised user. From this point onwards, the user's token will follow every page they go, where the middleware will recheck before rendering the protected content on the browser.

## Unauthenticated access attempt

When a user fails to successfully authenticate, it will be redirected back to the original home page on `index.js`.

<img src="ax/nextjs-unauthenticatedattempt.drawio.svg" alt="Unauthenticated flow" title="Unauthenticated access attempt flow" width=100%>

## Unauthorized access attempt

A successfully authenticated user that have been assigned roles / permissions / privileges that are insufficient for the pages / section of the web site will be redirected to the `fail.js` page where they could `sign out`.

<img src="ax/nextjs-unauthorisedattempt.drawio.svg" alt="Unauthorized flow" title="Unauthorized access attempt flow" width=100%>

## Authorized API access

While on a protected page (e.g. `protected.js`) the frontend may initiate manual or automated API requests from the backend that require the specific user's credentials.

<img src="ax/nextjs-authorisedAPIaccess.drawio.svg" alt="API flow" title="Authorized API access flow" width=100%>

## Single-Sign-Out

During a normally authorized session, the user may opt to leave, but with explicit request to sign themselves out. This will trigger a system-wide sign-out process that will impact their sessions across other related-platforms as well.

<img src="ax/nextjs-ssologout.drawio.svg" alt="SSOut flow" title="Single-Sign-Out flow" width=100%>

## Automated session refresh flow

To guarantee the user remains connected and properly served while preventing a malicious actor from stealing that user's session, there's a background mechanism happening that continiously checks the session liveness and extends it.

<img src="ax/nextjs-autotokenrefresh.drawio.svg" alt="Refresh flow" title="Automated refresh access flow" width=100%>

## Authorized decryption flow

Although it's not mandatory, it is assumed that end-to-end-encryption (E2EE) flows are served from a protected page. This code example, that is showcasing a standard scenario to decrypt a sensitive user Date-of-Birth field in a form, protects access to the form as described above on how to protect `protected.js` page: navigating with a valid JWT as a bearer token and validating the JWT in back-end's `middleware.js` script. Without these, the page wouldn't even load. 

<img src="ax/nextjs-e2ee-authdecrypt.drawio.svg" alt="Decryption flow" title="Authorized decryption flow" width=100%>

The E2EE flow only starts from that point:

1. User requests to load the dob.js form.
2. The `dob.js` form is loaded and the date-of-birth field is being requested from the `retrieve.js` endpoint at the backend. That request bears the user's access token.
3. The backend validates the user's JWT to assure the user has the correct `_tide_dob.selfdecrypt` role associated. If so, a request to the database is made to retrieve that field in it's encrypted form. IMPORTANT TO NOTE: neither the database nor the backend script have the key to decrypt that field!
4. The field is being sent to the frontend, still in its encrypted form.
5. The frontend sends that encrypted field to the user-interface.
6. The script on the user-agent (browser) performs a request to the swarm in Tide Security Fabric that is responsible for that authority key, using a similar (but not identical) access token.
7. Each Tide node in that authority key's swarm performs a validation of the access token, making sure that Tide-authenticated user-session holds a cryptographically-assured access roles for this particular field - and if so, performs a multi-party decryption on that field. The garbled replies from all the swarm's nodes are being interpolated on the user's browser to finalize the decryption process, and present the date-of-birth clear-text field for the user.

## Authorized encryption flow

<img src="ax/nextjs-e2ee-authencrypt.drawio.svg" alt="Encryption flow" title="Authorized encryption flow" width=100%>

1. Once a user made a change in the Tide-defined sensitive field, the date-of-birth, the user-agent browser communicates with the authority's keys swarm.
2. Each of the swarm nodes performs validation of the user and the field and to finalize the authenticated-encryption of that field before sending it back.
3. Once encrypted, the form is posted to the backend, as a standard HTTP POST request, with the date-of-birth field encrypted.
4. The form details are being sent to the backend, where it all being validated.
5. Once validated, the backend stores the field in the database in its encrypted form - with no key stored in the system.
