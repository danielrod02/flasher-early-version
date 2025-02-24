import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm';
import vscodemarkdownItKatex from 'https://cdn.jsdelivr.net/npm/@vscode/markdown-it-katex@1.1.1/+esm';
import highlightJs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/+esm';

/* 
You must provide the following link elements so the Latex elements and code snippets and block show
propertly:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/monokai-sublime.css">

See: https://www.jsdelivr.com/package/npm/@vscode/markdown-it-katex
*/

export default function renderHTMLfromMD(content) {
    const md = markdownIt({
        highlight: function (str, lang) {
            if (lang && highlightJs.getLanguage(lang)) {
                try {
                    return highlightJs.highlight(str, { language: lang }).value;
                } catch (__) {
                        
                }
            }
            return ''; // use external default escaping
        }
    });
    md.use(vscodemarkdownItKatex.default);
    return md.render(content);
}