import { registrationPage } from '../page_objects/RegistrationArea/RegistrationPageArea';
import { data } from './data';

describe('User Registration', () => {
    beforeEach(() => {
        registrationPage.visit();
    });

    it('should navigate to the account information page after signing up with a new email', () => {
        const testData = data.dataProvider.newUser;

        registrationPage
            .typeSignupName(testData.name)
            .typeSignupEmail(testData.email)
            .clickSignupButton()
            .verifyOnSignupPage();
    });

    it('should display a validation hint for an invalid email format', () => {
        const testData = data.dataProvider.invalidEmail;

        registrationPage
            .typeSignupName(testData.name)
            .typeSignupEmail(testData.email)
            .clickSignupButton()
            .verifySignupEmailValidity(false)
            .verifySignupEmailValidationMessage(data.dataProvider.expectedValidationMessages.invalidEmailFormat);
    });

    it('should block signup with empty fields and show the required-field hint on the name field', () => {
        registrationPage
            .clickSignupButton()
            .verifySignupNameInvalid()
            .verifySignupNameValidationMessage(data.dataProvider.expectedValidationMessages.requiredField);
    });
});
