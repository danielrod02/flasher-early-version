// Import the js-yaml library
import jsYaml from 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/+esm';


/**
 * Fetch the content of a YAML file from a public GitHub repository and parse it.
 * @param {string} owner - The owner of the GitHub repository.
 * @param {string} repo - The name of the GitHub repository.
 * @param {string} path - The file path of the YAML file in the repository.
 * @returns {Promise<Object>} - A promise that resolves to the parsed YAML content.
 */
export async function fetchDeck(owner, repo, path) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const fileData = await response.json();
        console.log(fileData);
        const fileResponse = await fetch(fileData.download_url);
        if (!fileResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const yamlContent = await fileResponse.text();

        const parsedYaml = jsYaml.load(yamlContent);

        return parsedYaml;
    } catch (error) {
        console.error('Error fetching the YAML file:', error);
        throw error;
    }
}