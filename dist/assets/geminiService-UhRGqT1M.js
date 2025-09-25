async function generateResponse(prompt, context) {
  const message = context ? `AI placeholder response.
Context provided: ${context.slice(0, 140)}...
Question: ${prompt.slice(0, 140)}...` : `AI placeholder response. Question: ${prompt.slice(0, 160)}...`;
  return { text: message + `

(Real AI will be wired post-hackathon)`, tokens: 0 };
}
async function summarizeContent(content) {
  const preview = content ? content.slice(0, 200) : "";
  const text = `Summary placeholder: This page appears to contain textual content.

Key points (mock):
- Extracted ${content?.length || 0} characters
- Preview: "${preview}"
- Real summarization will use Chrome AI APIs later.`;
  return { text, tokens: 0 };
}

export { generateResponse as g, summarizeContent as s };
