import { mapping_registration } from './mapping_registration';

/**
 * Page Object for the "Login / Signup" page (/login).
 */
export class RegistrationArea {
    /**
     * Opens the login/signup page.
     */
    visit(): this {
        cy.visit('/login');

        return this;
    }

    /**
     * Types the name into the signup form's name field.
     * @param name - User's name.
     */
    typeSignupName(name: string): this {
        cy.get(mapping_registration.inputs.signup_name_input)
            .type(name);

        return this;
    }

    /**
     * Types the email into the signup form's email field.
     * @param email - User's email.
     */
    typeSignupEmail(email: string): this {
        cy.get(mapping_registration.inputs.signup_email_input)
            .type(email);

        return this;
    }

    /**
     * Clicks the "Signup" button — submits the signup form.
     */
    clickSignupButton(): this {
        cy.get(mapping_registration.buttons.signup_button)
            .click();

        return this;
    }

    /**
     * Verifies whether the signup email field passes browser-native validation
     * (used for negative test cases with an invalid email format).
     * @param isValid - Expected validity state of the field.
     */
    verifySignupEmailValidity(isValid: boolean): this {
        cy.get(mapping_registration.inputs.signup_email_input)
            .invoke('prop', 'validity')
            .its('valid')
            .should('eq', isValid);

        return this;
    }

    /**
     * Verifies the exact text of the browser-native validation hint for the
     * email field. Consistent across environments because Chrome's UI
     * language is pinned in cypress.config.ts (before:browser:launch).
     * @param expectedMessage - Expected validation message text.
     */
    verifySignupEmailValidationMessage(expectedMessage: string): this {
        cy.get(mapping_registration.inputs.signup_email_input)
            .invoke('prop', 'validationMessage')
            .should('eq', expectedMessage);

        return this;
    }

    /**
     * Verifies that the signup name field fails browser-native validation
     * (validity.valid is false) because the required field was left empty.
     */
    verifySignupNameInvalid(): this {
        cy.get(mapping_registration.inputs.signup_name_input)
            .invoke('prop', 'validity')
            .its('valid')
            .should('eq', false);

        return this;
    }

    /**
     * Verifies the exact text of the browser-native validation hint for the
     * name field (e.g. "Заповніть це поле."). Consistent across environments
     * because Chrome's UI language is pinned in cypress.config.ts
     * (before:browser:launch).
     * @param expectedMessage - Expected validation message text.
     */
    verifySignupNameValidationMessage(expectedMessage: string): this {
        cy.get(mapping_registration.inputs.signup_name_input)
            .invoke('prop', 'validationMessage')
            .should('eq', expectedMessage);

        return this;
    }

    /**
     * Verifies that the URL contains "/signup" after the signup form is submitted.
     */
    verifyOnSignupPage(): this {
        cy.url()
            .should('include', '/signup');

        return this;
    }
}

export const registrationPage = new RegistrationArea();
