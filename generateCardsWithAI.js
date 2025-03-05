
const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
const { readFileSync } = require('fs');

dotenv.config();

async function generateCardsWithAI() {
    const systemMessage = readFileSync('./llm_instructions/context_prompt.txt.txt', 'utf8');
    // You will need to set these environment variables or edit the following values
    const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://main-azureopenai.openai.azure.com/";
    const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
    const apiVersion = "2024-05-01-preview";
    const deployment = "gpt-4o-mini"; // This must match your deployment name

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const result = await client.chat.completions.create({
        messages: [
            { role: "system", content: systemMessage },
        ],
        max_tokens: 16384,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null
    });

    return JSON.stringify(result, null, 2);
}

module.exports = { generateCardsWithAI };