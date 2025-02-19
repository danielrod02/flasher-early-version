/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Adds or updates a query parameter in the current URL without reloading the page.
 * @param {string} key - The name of the query parameter.
 * @param {string} value - The value of the query parameter.
 */
function addQueryParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    history.pushState({}, '', url);
}