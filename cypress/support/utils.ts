/**
 * Parses a "Rs. <integer>" amount and fails the test if the text has another format.
 * @param text - Amount text as shown on the site (e.g. "Rs. 500").
 */
export const parseRupees = (text: string): number => {
    const match = text.trim().match(/^Rs\.\s*(-?\d+)$/);

    expect(match, `amount format of "${text.trim()}"`).to.not.be.null;

    return Number(match![1]);
};

/**
 * Returns the trimmed text of every element.
 * @param $elements - Elements to read the text from.
 */
export const getTrimmedTexts = ($elements: JQuery<HTMLElement>): string[] =>
    $elements.toArray().map((el) => Cypress.$(el).text().trim());

/**
 * Returns a sorted copy of the list, leaving the original unchanged.
 * @param list - Strings to sort.
 */
export const sortedCopy = (list: readonly string[]): string[] => [...list].sort();

/**
 * Returns the pathname of a URL.
 * @param url - Absolute URL.
 */
export const getUrlPathname = (url: string): string => new URL(url).pathname;
