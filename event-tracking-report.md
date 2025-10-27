# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app\auth\login\page.tsx

- **login_form_submitted**: Fired when a user attempts to log in by submitting the sign-in form. Captures the outcome (success or failure) of the login attempt, along with any error details.

### app\auth\signup\page.tsx

- **signup_success**: Fired when a user successfully creates a new account.
- **signup_failed**: Fired when a user's attempt to create a new account fails.

### app\onboarding\page.tsx

- **onboarding_step_completed**: Fired when the user clicks 'Continue' or 'Save and continue' to proceed to the next step in the onboarding flow.
- **onboarding_completed**: Fired when the user clicks 'Complete' on the final step, successfully finishing the entire onboarding process.

### app\(protected)\accounts\wallet\add\page.tsx

- **add-wallet-form-submitted**: Fired when a user submits the form to add a new crypto wallet.
- **plan-upgrade-initiated**: Fired when a user clicks the upgrade button from the plan limit dialog on the add wallet page.

### app\(protected)\accounts\connection\page.tsx

- **bank_accounts_import_confirmed**: Fired when a user confirms their selection of bank accounts to import.
- **service_sync_preferences_confirmed**: Fired when a user confirms their data synchronization preferences for a service integration like QuickBooks.

### components\banking\BankAccountSyncModal.tsx

- **bank_account_sync_modal_closed_manually**: Tracks when a user manually closes the bank account sync progress modal. This can happen while the sync is in progress, has failed, or has completed.

### components\budgets\budget-form-modal.tsx

- **budget_created**: Fired when a user successfully submits the form to create a new budget.
- **budget_updated**: Fired when a user successfully submits the form to update an existing budget.

### components\goals\create-goal-dialog.tsx

- **goal_created**: Fired when a user successfully creates a new financial goal.
- **goal_updated**: Fired when a user successfully updates an existing financial goal.

### components\integrations\RequestIntegrationDialog.tsx

- **integration-request-submitted**: User successfully submits a request for a new integration.
- **integration-request-form-closed**: User closes the integration request form after starting to fill it out, but before submitting.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
