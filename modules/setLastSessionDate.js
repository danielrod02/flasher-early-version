export function setLastSessionDate(deckName) {
    // Get the JSON from decks_last_session
    const decksLastSession = JSON.parse(localStorage.getItem('decks_last_session')) || [];
    // Find the corresponding deck or create it if not present by name
    let currentDeck = decksLastSession.find(deck => deck.name === deckName);
    if (!currentDeck) {
        currentDeck = { name: deckName, lastSessionDate: null };
        decksLastSession.push(currentDeck);
    }
    // Set the lastSessionDate to now
    currentDeck.lastSessionDate = new Date().toISOString();
    // Save the updated decks_last_session back to localStorage
    localStorage.setItem('decks_last_session', JSON.stringify(decksLastSession));
}