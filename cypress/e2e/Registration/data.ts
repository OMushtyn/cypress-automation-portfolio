// Generated dynamically so each test run signs up with a fresh, guaranteed-unique
// email — this avoids depending on backend/DB state to know if an email is already taken.
const uniqueSignupEmail = `testuser.${Date.now()}@example.com`;

export const data = {
    dataProvider: {
        newUser: {
            name: 'Test User',
            email: uniqueSignupEmail,
        },
        invalidEmail: {
            name: 'Test User',
            email: 'not-an-email',
        },
        // Native browser validation messages, not controlled by the site's code
        // (the site does not use setCustomValidity()). This exact wording matches
        // Chrome in Ukrainian. Chrome's UI language is pinned to uk-UA in
        // cypress.config.ts (before:browser:launch) so this stays consistent
        // between local runs and CI, regardless of the machine's OS locale.
        expectedValidationMessages: {
            requiredField: 'Заповніть це поле.',
            invalidEmailFormat: 'Електронна адреса має містити знак "@". В електронній адресі "not-an-email" знака "@" немає.',
        },
    },
};
