const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".")
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name)
      }
      if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
      }
    }
    console.log("...all files ready\n");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp-02-05",
    systemInstruction: "Your going to act as an assistant to create flashcards in a structured format that uses the YAML language. The flashcards are part of a deck. A deck is a YAML file containing a sequence of mappings that have 2 properties: \"front\" and \"back\". \"front\" is the question and \"back\" is the answer to the question. Each property of the mappings can be markdown (GFM) text if necessary to better represent and format the content. Include code snippets using code blocks and language identifiers to allow for syntax highlight every time you can. Most of the flashcards you'll be creating will be related to programming, computers, math and technical knowledge. This decks will be consumed by an application that will show the \"front\" of the card to the user, give them time think about the answer and then when the user has thought about the response they'll click a button to show the \"back\" and find out if the answer they thought is correct. This web application will be using the showdown library to render the markdown to HTML, Katex to convert LateX to HTML and Highlight.js for code snippets highlight. I'll be passing books in pdf formats, text from books, pages and documentation and links to web pages. I'll usually ask you to create the decks from this knowledge sources. Try to generate cards to encapsulate all the content from the knowledge sources. Create as many cards as necessary for this purpose. Try to be as granular as possible striving to formulate the questions in such a way that only a single concept or construct is covered by each card. If you must include a math formulas and notation in the deck use Latex code. Enclose the Latex code using single dollar signs for inline rendering and double dollar signs $$ for block rendering. Use ASCII printable characters only.",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      await uploadToGemini("keyboard-shortcuts-linux.pdf", "application/pdf"),
    ];
  
    // Some files have a processing delay. Wait for them to be ready.
    await waitForFilesActive(files);
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
            {text: "create cards for all the shortcuts in the pdf file attached to this message"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```yaml\n- front: |\n    What is the shortcut to show the **Command Palette** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+P, F1\n    ```\n- front: |\n    What is the shortcut to **Quick Open, Go to File...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+P\n    ```\n- front: |\n    What is the shortcut to open a **New window/instance** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+N\n    ```\n- front: |\n    What is the shortcut to **Close window/instance** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+W\n    ```\n- front: |\n    What is the shortcut to open **User Settings** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+,\n    ```\n- front: |\n    What is the shortcut to open **Keyboard Shortcuts** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+S\n    ```\n- front: |\n    What is the shortcut to **Cut line (empty selection)** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+X\n    ```\n- front: |\n    What is the shortcut to **Copy line (empty selection)** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+C\n    ```\n- front: |\n    What is the shortcut to **Move line down/up** in VSCode on Linux?\n  back: |\n    ```\n    Alt+↓/↑\n    ```\n- front: |\n    What is the shortcut to **Delete line** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+K\n    ```\n- front: |\n    What is the shortcut to **Insert line below/above** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Enter / Ctrl+Shift+Enter\n    ```\n- front: |\n    What is the shortcut to **Jump to matching bracket** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+\\\n    ```\n- front: |\n    What is the shortcut to **Indent/Outdent line** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+] / Ctrl+[\n    ```\n- front: |\n    What is the shortcut to **Go to beginning/end of line** in VSCode on Linux?\n  back: |\n    ```\n    Home / End\n    ```\n- front: |\n    What is the shortcut to **Go to beginning/end of file** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Home / End\n    ```\n- front: |\n    What is the shortcut to **Scroll line up/down** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+↑ / ↓\n    ```\n- front: |\n    What is the shortcut to **Scroll page up/down** in VSCode on Linux?\n  back: |\n    ```\n    Alt+PgUp / PgDn\n    ```\n- front: |\n    What is the shortcut to **Fold/unfold region** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+[ / ]\n    ```\n- front: |\n    What is the shortcut to **Fold/unfold all subregions** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+[ / ]\n    ```\n- front: |\n    What is the shortcut to **Fold/Unfold all regions** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+0 / Ctrl+K Ctrl+J\n    ```\n- front: |\n    What is the shortcut to **Add line comment** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+C\n    ```\n- front: |\n    What is the shortcut to **Remove line comment** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+U\n    ```\n- front: |\n    What is the shortcut to **Toggle line comment** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+/\n    ```\n- front: |\n    What is the shortcut to **Toggle block comment** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+A\n    ```\n- front: |\n    What is the shortcut to **Toggle word wrap** in VSCode on Linux?\n  back: |\n    ```\n    Alt+Z\n    ```\n- front: |\n    What is the shortcut to **Insert cursor** in VSCode on Linux?\n  back: |\n    ```\n    Alt+Click\n    ```\n- front: |\n    What is the shortcut to **Insert cursor above/below** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+↑/↓\n    ```\n- front: |\n   What is the shortcut to **Undo last cursor operation** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+U\n    ```\n- front: |\n    What is the shortcut to **Insert cursor at end of each line selected** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+I\n    ```\n- front: |\n    What is the shortcut to **Select current line** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+L\n    ```\n- front: |\n    What is the shortcut to **Select all occurrences of current selection** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+L\n    ```\n- front: |\n    What is the shortcut to **Select all occurrences of current word** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+F2\n    ```\n- front: |\n    What is the shortcut to **Expand selection** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+→\n    ```\n- front: |\n    What is the shortcut to **Shrink selection** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+←\n    ```\n- front: |\n    What is the shortcut to perform a **Column (box) selection** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+drag mouse\n    ```\n- front: |\n    What is the shortcut to **Toggle full screen** in VSCode on Linux?\n  back: |\n    ```\n    F11\n    ```\n- front: |\n    What is the shortcut to **Toggle editor layout (horizontal/vertical)** in VSCode on Linux?\n  back: |\n    ```\n    Shift+Alt+0\n    ```\n- front: |\n    What is the shortcut to **Zoom in/out** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+= / -\n    ```\n- front: |\n    What is the shortcut to **Toggle Sidebar visibility** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+B\n    ```\n- front: |\n    What is the shortcut to **Show Explorer / Toggle focus** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+E\n    ```\n- front: |\n    What is the shortcut to **Show Search** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+F\n    ```\n- front: |\n    What is the shortcut to **Show Source Control** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+G\n    ```\n- front: |\n    What is the shortcut to **Show Debug** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+D\n    ```\n- front: |\n    What is the shortcut to **Show Extensions** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+X\n    ```\n- front: |\n    What is the shortcut to **Replace in files** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+H\n    ```\n- front: |\n    What is the shortcut to **Toggle Search details** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+J\n    ```\n- front: |\n    What is the shortcut to **Open new command prompt/terminal** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+C\n    ```\n- front: |\n    What is the shortcut to **Show Output panel** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+H\n    ```\n- front: |\n    What is the shortcut to **Open Markdown preview** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+V\n    ```\n- front: |\n    What is the shortcut to **Open Markdown preview to the side** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K V\n    ```\n- front: |\n    What is the shortcut to enter **Zen Mode (Esc Esc to exit)** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Z\n    ```\n- front: |\n    What is the shortcut to **Close editor** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+W\n    ```\n- front: |\n    What is the shortcut to **Close folder** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K F\n    ```\n- front: |\n    What is the shortcut to **Split editor** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+\\\n    ```\n- front: |\n    What is the shortcut to **Focus into 1st, 2nd, 3rd editor group** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+1 / 2 / 3\n    ```\n- front: |\n    What is the shortcut to **Focus into previous editor group** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+←\n    ```\n- front: |\n    What is the shortcut to **Focus into next editor group** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+→\n    ```\n- front: |\n    What is the shortcut to **Move editor left** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+PgUp\n    ```\n- front: |\n    What is the shortcut to **Move editor right** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+PgDn\n    ```\n- front: |\n    What is the shortcut to **Move active editor group left/up** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K ← / Ctrl+K ↑\n    ```\n- front: |\n    What is the shortcut to **Move active editor group right/down** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K → / Ctrl+K ↓\n    ```\n- front: |\n    What is the shortcut to open a **New File** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+N\n    ```\n- front: |\n    What is the shortcut to **Open File...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+O\n    ```\n- front: |\n    What is the shortcut to **Save** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+S\n    ```\n- front: |\n    What is the shortcut to **Save As...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+S\n    ```\n- front: |\n    What is the shortcut to **Close** the current file in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+W\n    ```\n- front: |\n    What is the shortcut to **Close All** files in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+W\n    ```\n- front: |\n    What is the shortcut to **Reopen closed editor** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+T\n    ```\n- front: |\n    What is the shortcut to **Keep preview mode editor open** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Enter\n    ```\n- front: |\n    What is the shortcut to **Open next** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Tab\n    ```\n- front: |\n    What is the shortcut to **Open previous** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+Tab\n    ```\n- front: |\n    What is the shortcut to **Copy path of active file** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K P\n    ```\n- front: |\n    What is the shortcut to **Reveal active file in Explorer** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K R\n    ```\n- front: |\n    What is the shortcut to **Show active file in new window/instance** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K O\n    ```\n- front: |\n    What is the shortcut to **Find** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+F\n    ```\n- front: |\n    What is the shortcut to **Replace** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+H\n    ```\n- front: |\n    What is the shortcut to **Find next/previous** in VSCode on Linux?\n  back: |\n    ```\n    F3 / Shift+F3\n    ```\n- front: |\n    What is the shortcut to **Select all occurrences of Find match** in VSCode on Linux?\n  back: |\n    ```\n    Alt+Enter\n    ```\n- front: |\n    What is the shortcut to **Add selection to next Find match** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+D\n    ```\n- front: |\n    What is the shortcut to **Move last selection to next Find match** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+D\n    ```\n- front: |\n    What is the shortcut to **Show all Symbols** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+T\n    ```\n- front: |\n    What is the shortcut to **Go to Line...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+G\n    ```\n- front: |\n    What is the shortcut to quickly **Go to File...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+P\n    ```\n- front: |\n    What is the shortcut to **Go to Symbol...** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+O\n    ```\n- front: |\n    What is the shortcut to **Show Problems panel** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+M\n    ```\n- front: |\n    What is the shortcut to **Go to next error or warning** in VSCode on Linux?\n  back: |\n    ```\n    F8\n    ```\n- front: |\n    What is the shortcut to **Go to previous error or warning** in VSCode on Linux?\n  back: |\n    ```\n    Shift+F8\n    ```\n- front: |\n    What is the shortcut to **Navigate editor group history** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+Tab\n    ```\n- front: |\n    What is the shortcut to **Go back** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Alt+-\n    ```\n- front: |\n    What is the shortcut to **Go forward** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+-\n    ```\n- front: |\n    What is the shortcut to **Toggle Tab moves focus** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+M\n    ```\n- front: |\n    What is the shortcut to **Trigger suggestion** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Space, Ctrl+I\n    ```\n- front: |\n    What is the shortcut to **Trigger parameter hints** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+Space\n    ```\n- front: |\n    What is the shortcut to **Format document** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+I\n    ```\n- front: |\n    What is the shortcut to **Format selection** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+F\n    ```\n- front: |\n    What is the shortcut to **Go to Definition** in VSCode on Linux?\n  back: |\n    ```\n    F12\n    ```\n- front: |\n    What is the shortcut to **Peek Definition** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+F10\n    ```\n- front: |\n    What is the shortcut to **Open Definition to the side** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K F12\n    ```\n- front: |\n    What is the shortcut to access **Quick Fix** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+.\n    ```\n- front: |\n    What is the shortcut to **Show References** in VSCode on Linux?\n  back: |\n    ```\n    Shift+F12\n    ```\n- front: |\n    What is the shortcut to **Rename Symbol** in VSCode on Linux?\n  back: |\n    ```\n    F2\n    ```\n- front: |\n    What is the shortcut to **Trim trailing whitespace** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+X\n    ```\n- front: |\n    What is the shortcut to **Change file language** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K M\n    ```\n- front: |\n    What is the shortcut to **Toggle breakpoint** in VSCode on Linux?\n  back: |\n    ```\n    F9\n    ```\n- front: |\n    What is the shortcut to **Start / Continue** debugging in VSCode on Linux?\n  back: |\n    ```\n    F5\n    ```\n- front: |\n    What is the shortcut to **Step into/out** during debugging in VSCode on Linux?\n  back: |\n    ```\n    F11 / Shift+F11\n    ```\n- front: |\n    What is the shortcut to **Step over** during debugging in VSCode on Linux?\n  back: |\n    ```\n    F10\n    ```\n- front: |\n    What is the shortcut to **Stop** debugging in VSCode on Linux?\n  back: |\n    ```\n    Shift+F5\n    ```\n- front: |\n    What is the shortcut to **Show hover** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+K Ctrl+I\n    ```\n- front: |\n    What is the shortcut to **Show integrated terminal** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+`\n    ```\n- front: |\n    What is the shortcut to **Create new terminal** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+`\n    ```\n- front: |\n    What is the shortcut to **Copy selection** in the terminal in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+C\n    ```\n- front: |\n    What is the shortcut to **Paste into active terminal** in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+V\n    ```\n- front: What is the shortcut to **Scroll up/down** in integrated terminal in VSCode on Linux?\n  back: |\n    ```\n    Ctrl+Shift+↑/↓\n    ```\n- front: |\n    What is the shortcut to **Scroll page up/down** the terminal in VSCode on Linux?\n  back: |\n    ```\n    Shift+PgUp / PgDn\n    ```\n- front: |\n    What is the shortcut to **Scroll to top/bottom** in the integrated terminal in VSCode on Linux?\n  back: |\n    ```\n    Shift+Home / End\n    ```\n- front: Note about using Alt+Click to insert cursor\n  back: The Alt+Click gesture may not work on some Linux distributions. You can change the modifier key for the Insert cursor command to Ctrl+Click with the \"editor.multiCursorModifier\" setting.\n```"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();