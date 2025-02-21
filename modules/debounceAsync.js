/**
 * Creates a debounced function that delays invoking the provided asynchronous function until after
 * the specified wait time has elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} asyncFunction - The asynchronous function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - Returns the new debounced function.
 */
export default function debounceAsync(asyncFunction, wait) {
    let timeoutId;

    return async function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        return new Promise((resolve, reject) => {
            timeoutId = setTimeout(async () => {
                try {
                    const result = await asyncFunction.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, wait);
        });
    };
}