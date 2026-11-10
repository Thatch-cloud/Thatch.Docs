# Accounts & organisations

You manage your account in the **Thatch Portal**, at
<https://app.thatch.cloud>.

## Organisations

Everything in Thatch — members, API keys, usage, and billing — belongs to an
**organisation**. Your login belongs to one or more organisations; if it belongs
to more than one, you choose which one you are viewing, and the Portal shows that
organisation's keys, usage and billing.

## Getting an account

Accounts are **invite-only**. Thatch sets up your organisation and invites its
first admin; from then on, your organisation's admins invite everyone else.
There is no self-service sign-up. To get started, talk to your Thatch contact.

An invitation arrives by email. Its link works once and expires after seven
days. If you are new to Thatch you choose a password and are signed in; if you
already have a login, you sign in and the organisation is added to it.

## Roles

Each member of an organisation is an **Admin** or a **Member**.

| | Admin | Member |
| --- | --- | --- |
| View usage, billing and invoices | ✓ | ✓ |
| Create API keys | ✓ | ✓ |
| Rotate or revoke keys they created | ✓ | ✓ |
| Rotate or revoke anyone's keys | ✓ | |
| See the member list | ✓ | |
| Invite members, change roles, remove members | ✓ | |
| Set up the organisation's billing account | ✓ | |

See [API keys](api-keys.md) for the detail of who can manage which key.

## Managing members

Admins manage members on the **Members** page.

- **Inviting.** Invite someone by email and choose their role. Inviting the same
  address again replaces the earlier invitation with a fresh one.
- **Changing roles.** An organisation always needs at least one admin, so the
  last admin cannot be made a member or removed — make someone else an admin
  first.
- **Removing.** Removing a member does not revoke the API keys they created. The
  Portal lists them when you remove someone; see
  [When a member leaves](api-keys.md#when-a-member-leaves).

## Your login

Manage your own login on the **Account** page.

- **Password.** At least 8 characters. If you forget it, request a reset from the sign-in page — the reset link expires
  after 15 minutes.
- **Email address.** Changing it needs your current password, and takes effect
  when you open the confirmation link sent to the new address while signed in.
  That link also expires after 15 minutes.

<!-- TODO: multi-factor authentication and single sign-on for organisations —
     document them once they are available to customers. -->
