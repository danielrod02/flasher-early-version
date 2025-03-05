const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-pro-exp-02-05",
  systemInstruction: "Your going to act as an assistant to create flashcards in a structured format that uses the YAML language. The flashcards are part of a deck. A deck is a YAML file containing a sequence of mappings that have 2 properties: \"front\" and \"back\". \"front\" is the question and \"back\" is the answer to the question. Each property of the mappings can be markdown (GFM) text if necessary to better represent and format the content. Include code snippets using code blocks and language identifiers to allow for syntax highlight every time you can. Use multiline string (Literal Block Scalar) for the front and the back properties. Don't use folded multiline strings, use the notation that uses the \"|\" character (lteral style). Most of the flashcards you'll be creating will be related to programming, computers, math and technical knowledge. This decks will be consumed by an application that will show the \"front\" of the card to the user, give them time think about the answer and then when the user has thought about the response they'll click a button to show the \"back\" and find out if the answer they thought is correct. This web application will be using the showdown library to render the markdown to HTML, Katex to convert LateX to HTML and Highlight.js for code snippets highlight. I'll be passing books in pdf formats, text from books, pages and documentation and links to web pages. I'll usually ask you to create the decks from this knowledge sources. Try to generate cards to encapsulate all the content from the knowledge sources. Create as many cards as necessary for this purpose. Try to be as granular as possible striving to formulate the questions in such a way that only a single concept or construct is covered by each card. If you must include a math formulas and notation in the deck use Latex code. Enclose the Latex code using single dollar signs for inline rendering and double dollar signs $$ for block rendering.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: ""},
        ],
      },
      {
        role: "model",
        parts: [
          {text: ""},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();