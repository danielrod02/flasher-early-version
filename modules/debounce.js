export default async function debounce(func, wait) {
    let timeout = null

    return async function(...args) {
        if (timeout !== null) {
        clearTimeout(timeout)
        }

        timeout = setTimeout(async () => {
            func(...args)
        }, wait)
    }
}  