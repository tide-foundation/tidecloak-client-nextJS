# Setting up TideCloak Quorum

## Introducing TideCloak Quorum-Enforced Authorization

What if an attacker forges an access token by compromising your IAM’s root keys? What if that attacker is actually one of your own IAM administrators? What if they grant themselves full, unrestricted privileges to your system? What if the attacker is the developer of the IAM itself?

These scenarios are all too possible with today's Identity or Access Management (IAM) solutions. A single bad actor—internal or external—can override or exploit your system and there's nothing you could do about it. You also wouldn't know about it until it's way too late.

**TideCloak Quorum** changes this reality. It is the **first and only IAM** platform that ensures no single individual can create, modify, or forge access privileges. 

By blending a cryptographically protected authorization mechanism with an uncircumventable governance model, TideCloak Quorum solves the greatest security threat plaguing organizations: ensuring that **no single point of failure** or malicious insider can undermine your security.


## How it works

Access rights are enforced according to a cryptographically signed JWTs (JSON Web Tokens). Before your subsystem (client) grants access privileges:

1. **Tokens Signed by an Ineffable Tide Key:**  
   Each token is signed by the realm's Vendor Verifiable Key (VVK), on the Tide Cybersecurity Fabric where it can never be lost, misused or abused.
3. **Automated Policy Enforcements:**  
   Before signing, Tide's Fabric automatically verifies all the requested privileges and session details against cryptographically signed administrator-approved rules.
4. **Quorum Approval of Rules:**  
   Any change to these rules requires cryptographic approval from a majority of admins—protecting against rogue actors. No single malicious actor can subvert the quorum’s controls.
5. **Protected Admin Keys:**  
   Each admin’s personal key is also safeguarded by Tide's Fabric with same zero-knowledge approach.

Any attempt to tamper with these tokens or bypass the multi-admin policies simply fails mathematically, and the fraud is exposed instantly. 

## The Quorum Governance Process

1. **Draft a Change:** Any administrator drafts a modification to an access privileges or system configuration.  
2. **Review:** Quorum administrators inspect this draft and either approve or reject it.
3. **Cryptographic Endorsement:** Each approving admin signs in using their personal Tide-protected key to cryptographically confirm change.
4. **Commit:** If approvals meet the required ~70% quorum threshold (e.g., 2 out of 3, 3 out of 5), the changes are committed and become immediately effective.

No attacker, admin, or even a compromised developer—no matter how privileged—can circumvent this process. Not even us at Tide.

## Forming the Admin Quorum

1. **Enable Quorum in TideCloak:** Switch on this multi-admin governance mode within your chosen realm.  
2. **Invite Admins:** Securely send invitation links for each admin to associate their Tide account with the realm.
3. **Assign Initial Quorum Admin:** Grant the first admin the quorum role, establishing the quorum and relinquishing local authority.
4. **Quorum Formation:** Newly authorized admins can add more administrators. Each assignment requires majority approval before it’s final.  
5. **Ongoing Governance:** From that point forward, every critical realm change—adding new privileges, clients, or roles—requires approval from majority of the quorum.

## Step-by-Step Example

Below is a concrete example of enabling Quorum in a realm named `nextjs-test`, with a licensed `Tide` IdP, and a client named `myclient`.

### 1. Enable Quorum-enabled Governance

As a realm's admin, follow these steps:

a. Switch on IGA
   - Navigate to **Realm Settings → [General](http://localhost:8080/admin/master/console/#/nextjs-test/realm-settings/general)**
   - Set **Identity Governance and Administration** to **On**.

> [!IMPORTANT]
> Once you've switched IGA on, and before you've added the first admin to your realm's quorum, your realm is now in a **Zero-Quorum** state. While in this state, the VVK is governed exclusively by the temporary VRK that's on TideCloak. This means that while the IGA is still operational, changes are not being reviewd and authorized by Tide-enabled admins - which means, it's a less secure state that can be compromised if the VRK is compromised (i.e. TideCloak hacked). This state will operate for up to 5 full days to allow you to set up of a quorum of Tide-enabled Admins of at least 1 admin. After 5 days, the VRK authority will expire and you may lose all access to the VVK permenantly. Be sure to quickly move to the next step to set up a quorum as soon as possible.

### 2. Add the First Admin

a. **Create User “Alice”**  
   - Go to **Users → [Add User](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user)**
     - Set **Username:** `Alice`  
     - Set **Email:** `alice@email.here`
	 - Click `Create`

b. **Associate Her Tide Account**
   - In Alice’s profile, under **Credentials**, click **Credential Reset**
     - In **Reset action** field, add **Link Tide Account**
     - Click `Copy Link`
   - Paste the link in a direct message to Alice (or email automatically if you've set up TideCloak’s [email settings](http://localhost:8080/admin/master/console/#/nextjs-test/realm-settings/email))

Alice opens the link and authenticates with Tide, finalizing her TideCloak association.
Once she's done, the realm's admin continues:

### 3. Assign Alice as a Quorum Admin

a. **Grant Role**  
   - Go to **[Users](http://localhost:8080/admin/master/console/#/nextjs-test/users) → Alice → Role Mapping → Assign Role**
   - Tick **tide-realm-admin**
   - Click `Assign`

b. **Approve Commit**
   - Navigate to **Change Requests → [Users](http://localhost:8080/admin/master/console/#/nextjs-test/change-requests/users)**  
   - Tick the draft: **Granting Role to User** (tide-realm-admin)
   - Click `Review Draft` (Its status will turn `APPROVED`)

c. **Commit**
   - Tick that same draft
   - Click `Commit Draft` (The draft will disappear)

Alice now has administrative rights in the `nextjs-test` realm and can sign in at  
[http://localhost:8080/admin/nextjs-test/console/](http://localhost:8080/admin/nextjs-test/console/) using her Tide account. Alice will take this from here and follow these steps:

### 4. Invite Other Admins

a. **Create Bob & Carol**  
   - Navigate to **Users → [Add User](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user)** for each
   - Provide usernames (**Bob** and **Carol**) & emails (**bob@email.here**, **carol@email.here**)
   - Click `Create`

b. **Invite to Link Tide Accounts**  
   - **Users → Bob → Credentials → Reset action: _Link Tide Account_ → Copy Link**
   - Paste the link in a direct message to Bob 
   - **Users → Carol → Credentials → Reset action: _Link Tide Account_ → Copy Link**
   - Paste the link in a direct message to Carol 
   - Send each link securely to Bob and Carol.

c. **Associate Accounts**  
   - Bob and Carol finalize their Tide associations individually.

Once Bob and Carol associated their Tide account, Alice proceeds:

### 5. Form the Quorum

a. **Suggest Adding Bob to the Quorum**  
   - Navigate to **[Users](http://localhost:8080/admin/master/console/#/nextjs-test/users) → Bob → Role Mapping → Assign Role → _tide-realm-admin_ → Assign**

b. **Endorse Bob's addition**
   - Navigate to **Change Requests → [Users](http://localhost:8080/admin/master/console/#/nextjs-test/change-requests/users)** → _Granting Role to User (tide-realm-admin)_ → Review Draft
   - Sign in her Tide account
   - Click `Approve changeset request`

c. **Activate Bob's Quorum membership**  
   - Tick **Change Requests → [Users](http://localhost:8080/admin/master/console/#/nextjs-test/change-requests/users)** → _Granting Role to User (tide-realm-admin)_ → Commit Draft

d. **Add Carol to the Quorum**  
   - Repeat same step **a.** above for Carol
   - Both existing admins (e.g., Alice and Bob) review and approve (follow step **b.**)
   - Commit (step **c.**) once quorum approval is met.

Now you have a quorum of three admins (Alice, Bob, Carol). Any action that requires approval must pass at least 2 of 3 votes.

### 6. Approve remaining Realm Changes

At minimum, you'll need the quorum to approve the creation of the new client `myclient`:

a. **Approve the New Client _myclient_**
   - Navigate to **Change Requests → [Clients](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/change-requests/clients)**  
   - Select **New Client Created (myclient)** draft and click `Review Draft`

b. **Finalize Quorum Approval**
   - Once two admins approve, anyone can `Commit` that change.

The new client is now fully active, and in the `nextjs-test` example, is available at http://localhost:3000/


---

## Conclusion

**TideCloak’s Quorum-Enforced Authorization**: Where every access is *provably* transparent, tamperproof and secure.

This mechanism uniquely delivers a **game-changing** approach to IAM:

- **Impenetrable Access Tokens:** No one can forge or tamper with a user’s cryptographically signed JWT, even if the IAM is compromised.  
- **Un-bypassable Multi-Admin Governance:** Every authorization change requires a quorum of admins, whose private keys are protected in a zero-knowledge manner.

By eliminating single points of failure and preventing any single entity from overriding your security, TideCloak Quorum ensures that **no attacker, insider, or rogue developer** can compromise your most critical resources.

---  
