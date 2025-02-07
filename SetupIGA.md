# Setting up Tide-secure-IGA

## Overview 

What guarantees that a rogue system administrator, or malicious TideCloak developer won't grant themselves god-like access to everything? What can assure no one can make effective changes to the IAM? Until today, NOTHING can guarantee that.
TideCloak is the first and only Identity and Access Management system capable of allowing only permitted administrators to make effective changes to user's access with a cryptographic guarantee.

## Here's how it works
User's access rights are granted via the eventual grant of an access token, assigning access privileges (roles/attributes/permissions) on a specific subsystem (client), to a specific successfully-authenticated user, for a specific amount of time. That access token is called a JSON Web Token (JWT), and it is cryptographically signed with the system's (IAM) highest authority key. The designated subsystem should honour the token's access request, if everything checks out.
Unlike all other IAM's, on a IGA-enabled TideCloak realm:
- Subsystems only honour tokens signed by one specific Vendor Verifiable Key (VVK).
- That VVK isn't stored or accessed in the IAM or anywhere in the system. The VVK is never held by anyone ever. Tide is handling that key in an ineffable manner (complete zero-knowledge, blind, cryptographically secure manner). Therefore, Tide is the only thing signing every user's JWT token when needed.
- Before signing, Tide verifies the content of the JWT and make sure all conditions are met according to the set specifications: that the user has authenticated successfully, the destination subsystem, the session duration, the privileges - all conform to what was originally defined by the administrators.
- Those definitions, that act like a set of rules, are also signed by the administrators with their individual keys.
- Enforcing these definition requires the signatures of a quorum of administrators to guarantee that even if one of few administrators go rogue, the others will prevent malicious behaviour. The quorum is set as a minimum of ~70% of the entire group of administrators, allowing for 30% redundancy: 2 out of 3, 3 out of 5, 7 out of 10, 14 out of 20, etc.
- Until a minimal threshold of the quorum approved a change, it remains in a draft mode. Only when a quorum achieved, the change becomes effective.
- The individual keys used by the administrators to approve each change aren't help anywhere either. Tide is managing those personal (and private) keys in the same ineffable manner.
- Any attempt to compromise, change or bypass TideCloak, the administrators' keys, the VVK, the quorum or this mechanism, will cause the eventual JWT signature to fail mathematically. Each step of this process is transparent and entirely verifiable by all participants, making it very easy to pick up on malicious behaviour.
No one, not any one of the administrators, the developers of TideCloak, anyone in Tide - can compromise this mechanism.

## The process

1. Any administrator may draft a change to a user privilege. On a IGA-enabled TideCloak realm, that draft isn't automatically enforced.
2. Any administrator in the quorum may see the pending drafts, review, and either approve or reject the draft.
3. Individual approval of a draft requires the administrator to sign in to their Tide account and use their personal key to sign that approval.
4. Depending which majority is reached first, approvers or rejectors, the draft is either accepted or denied.
5. Once accepted, the approved change is then committed and become effective in the system.

## Creation of the administration quorum

To set up TideCloak with a quorum of administrators that have exclusive, definite, and absolute authority over the VVK (not as individuals, but as a group), these steps need to be followed:
Prerequisites: A VVK must be generated for the specific TideCloak's realm. Each realm can only have 1 VVK. This is achieved by creating a Tide Identity Provider and activating its license.
1. Switch IGA on
2. Create the administrators user accounts
3. Invite the administrators to associate their existing/new Tide accounts
4. Assign Tide realm admin rights to the first administrator
5. Approve and commit that first administrator's change. Once that has been committed, the master administrator can no longer approve changes.
6. Having the Tide administrator sign in
7. Assign the rest of the administrators the Tide realm admin rights
8. Each administrator must review, approve and commit those drafts 

## Step-by-step instructions

It is assumed the realm has been created (realm name: `nextjs-test`).

In this guide, we'll assume that the TideCloak master admin kicks this process off and starts by enabling IGA:

1. Access `Realm settings` menu --> `General` [tab](http://localhost:8080/admin/master/console/#/nextjs-test/realm-settings/general) --> `Identity Governance and Administration`: _On_

The master admin then proceeds to invite Alice, the first Tide realm admin, to associate her account:

2. `Users` menu --> `Add user` [button](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user) --> `Username`: _Alice_, `Email`: _alice@email.here_ --> `Create` button
3. `Users` [menu](http://localhost:8080/admin/master/console/#/nextjs-test/users) --> `Alice` user --> `Credentials` tab --> `Credential Reset` link --> `Reset action`: _Link Tide Account_ --> `Copy Link` button
4. The **Master admin* manually DM Alice the link over any desired established communications channel. It is also possible to let TideCloak send that link directly via email by [setting up the email server](http://localhost:8080/admin/master/console/#/nextjs-test/realm-settings/email) first under `Realm settings` menu --> `email` tab.

Alice receives the invitation link and use it on her own browser:

5. She opens the link
6. Clicks the _Click here to proceed_ link
7. Signs in / Signs up for a Tide account

Once Alice completed associating her Tide account per invitation, the TideCloak's **Master admin** then continues to grant Alice her Tide realm admin privileges:

8. `Users` [menu](http://localhost:8080/admin/master/console/#/nextjs-test/users) --> `Alice` user --> `Role mapping` tab --> `Assign role` button --> Tick `tide-realm-admin` role --> `Assign` button
9. `Change Requests` menu --> `Users` [tab](http://localhost:8080/admin/master/console/#/nextjs-test/change-requests/users) --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Review Draft` button (--> status should turn to APPROVED)
10. `Change Requests` menu --> `Users` tab --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Commit Draft` button (--> draft should disappear)

Alice has now been appointed first effective Tide Admin of the `nextjs-test` realm and can access it on http://localhost:8080/admin/nextjs-test/console/ and use her secure Tide account to log in and continue the set up:

11. `Users` menu --> `Add user` [button](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user) --> `Username`: _Bob_, `Email`: _bob@email.here_ --> `Create` button
12. `Users` [menu](http://localhost:8080/admin/master/console/#/nextjs-test/users) --> `Bob` user --> `Credentials` tab --> `Credential Reset` link --> `Reset action`: _Link Tide Account_ --> `Copy Link` button
13. Alice manually DM Bob the link over any desired established communications channel.
14. `Users` menu --> `Add user` [button](http://localhost:8080/admin/master/console/#/nextjs-test/users/add-user) --> `Username`: _Carol_, `Email`: _carol@email.here_ --> `Create` button
15. `Users` [menu](http://localhost:8080/admin/master/console/#/nextjs-test/users) --> `Carol` user --> `Credentials` tab --> `Credential Reset` link --> `Reset action`: _Link Tide Account_ --> `Copy Link` button
16. Alice manually DM Carol the link over any desired established communications channel.

Bob and Carol, each at their leisure, proceed and use the invite link to associate their existing/new Tide account. When either or both complete this, Alice proceeds to grow the quorum:

17. `Users` menu --> `Bob` user --> `Role mapping` tab --> `Assign role` button --> Tick `tide-realm-admin` role --> `Assign` button
18. `Change Requests` menu --> `Users` tab --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Review Draft` button 
19. Alice sign in the approval enclave using her Tide account --> `Approve changeset request` button
20. `Change Requests` menu --> `Users` tab --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Commit Draft` button
21. `Users` menu --> `Carol` user --> `Role mapping` tab --> `Assign role` button --> Tick `tide-realm-admin` role --> `Assign` button
22. `Change Requests` menu --> `Users` tab --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Review Draft` button 
23. Alice sign in the approval enclave using her Tide account --> `Approve changeset request` button

Now that Bob is part of the quorum, Alice may want to wait for Bob to review and approve Carol's addition to the quorum:

24. Bob goes to his `Change Requests` menu --> `Users` tab --> Tick `Granting Role to User (tide-realm-admin)` draft --> `Review Draft` button 
25. Bob sign in his approval enclave using his Tide account --> `Approve changeset request` button

Now the quorum includes Alice, Bob and Carol where either 2 of the 3 is sufficient to approve any change set before it can be committed in TideCloak securely.
To enforce the newly created `myclient` in the `nextjs-test` realm, either two of the 3 admins may review and approve the draft:

26. `Change Requests` menu --> `Clients` [tab](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/change-requests/clients) --> Tick `New Client Created (myclient)` draft --> `Review Draft` button
27. Sign in the approval enclave using their Tide account --> `Approve changeset request` button

Once two admins approve the draft, anyone can proceed and enforce it: 

28. `Change Requests` menu --> `Clients` [tab](http://localhost:8080/admin/nextjs-test/console/#/nextjs-test/change-requests/clients) --> Tick `New Client Created (myclient)` draft --> `Commit Draft` button 

Now, the `myclient` client application has been committed and can be used at: http://localhost:3000/

