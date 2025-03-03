export function setAfterContentDeck(deckElement, deckName) {
    // Get the JSON from decks_last_session
    const decksLastSession = JSON.parse(localStorage.getItem('decks_last_session')) || [];
    // Find the corresponding deck or create it if not present by name
    let currentDeck = decksLastSession.find(deck => deck.name === deckName);
    if (!currentDeck) {
        return;
    }
    const lastSessionDate = new Date(currentDeck.lastSessionDate);
    const now = new Date();
    const diffTime = Math.abs(now - lastSessionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60));
    if (diffDays > 60) {
        deckElement.dataset.afterContent = `${Math.ceil(diffDays / 60)} hours ago`;
        return;
    } else if (diffDays > 1440) {
        deckElement.dataset.afterContent = `${Math.ceil(diffDays / 1440)} days ago`;
        return;
    }
    deckElement.dataset.afterContent = `${diffDays} minutes ago`;
}