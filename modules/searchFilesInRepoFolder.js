import { fetchDeckFiles } from "/modules/fetchDeckFiles.js";

export async function searchFilesInRepoFolder(searchText, owner, repo, folderPath) {
    const files = await fetchDeckFiles(owner, repo, folderPath);

    const matchingFiles = files.filter(file => file.name.toLowerCase().includes(searchText.toLowerCase()));

    return matchingFiles.map(file => ({
        ...file
    }));
} 