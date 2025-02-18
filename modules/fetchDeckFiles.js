'use strict';

async function fetchDeckFiles(
    owner = 'danielrod02',
    repo = 'flasher',
    path = 'decks'
) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const files = await response.json();

        const deckFiles = files.filter(file => file.name.endsWith('.deck'));

        return deckFiles;
    } catch (error) {
        console.error('Error fetching deck files:', error);
    }
}