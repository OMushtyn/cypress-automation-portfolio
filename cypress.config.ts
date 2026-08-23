import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'https://automationexercise.com',
        specPattern: 'cypress/e2e/**/test_*.spec.ts',
        viewportWidth: 1366,
        viewportHeight: 768,
        defaultCommandTimeout: 8000,
        requestTimeout: 10000,
        pageLoadTimeout: 15000,
        numTestsKeptInMemory: 10,
        video: false,
        screenshotOnRunFailure: true,
        retries: {
            runMode: 1,
            openMode: 0,
        },
        setupNodeEvents(on, config) {
            // Force Chrome/Chromium to launch with a fixed UI language so native
            // browser validation messages (e.g. HTML5 form validation hints) are
            // identical locally and in CI, regardless of the machine's OS locale.
            on('before:browser:launch', (browser, launchOptions) => {
                if (browser.family === 'chromium') {
                    launchOptions.args.push('--lang=uk-UA');
                }

                return launchOptions;
            });

            return config;
        },
    },
});