/**
 * Script parser: converts markdown session scripts with timing cues
 * into a queue of "speak" and "pause" actions for the TTS engine.
 *
 * Timing cues supported:
 *   *(Pause X seconds)*       — silent pause
 *   *(Pause — ... for X seconds)*  — pause with description
 *   *(... for X seconds)*     — pause (any description ending in "for X seconds")
 *   *(bilateral stimulation ...)* — pause for EMDR
 *
 * Spoken content is anything in double-quoted lines or plain paragraph text
 * that isn't a timing cue, markdown heading, or instruction.
 */

const TIMING_CUE_RE = /[(*]\s*(?:Pause|pause|Bilateral|bilateral|Slow|slow)[^)]*\b(\d+)\s*seconds?[^)]*\)/g;

/**
 * Parse a session script body into an array of segments.
 * Each segment is either { type: 'speak', text: '...' } or { type: 'pause', seconds: N }
 */
export function parseScript(body) {
  if (!body) return [];

  const segments = [];

  // Split into lines
  const lines = body.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip empty lines, separators, headers, preparation notes
    if (!line || line.startsWith('---') || line.startsWith('#')) continue;
    if (line.startsWith('**') || line.startsWith('*This information')) continue;
    if (line.match(/^-\s*(Ensure|User should|Have water|If at any|End of session)/i)) continue;

    // Check for timing cues: *(Pause X seconds)* or variations
    const timingMatch = line.match(/[(*]\s*(?:Pause|pause|Bilateral|bilateral|Slow|slow)[^)]*\b(\d+)\s*seconds?/);
    if (timingMatch) {
      const seconds = parseInt(timingMatch[1], 10);
      // Cap extremely long pauses (bilateral stimulation can be up to 30s)
      segments.push({ type: 'pause', seconds: Math.min(seconds, 30) });
      continue;
    }

    // Extract spoken content from double-quoted strings
    // Lines like: "Hi there. I'm glad you're here."
    const quoteMatch = line.match(/^"([^"]+)"$/);
    if (quoteMatch) {
      segments.push({ type: 'speak', text: quoteMatch[1] });
      continue;
    }

    // Lines that end with a quote but have leading text: `\"Good. Take a breath.\\"\\n`
    const trailingQuote = line.match(/"([^"]+)"\s*$/);
    if (trailingQuote) {
      segments.push({ type: 'speak', text: trailingQuote[1] });
      continue;
    }

    // Plain text that might be part of the narration (instructions to user)
    // Skip voice instructions in *(italics)*, stage directions
    if (line.startsWith('*(') || line.startsWith('*(Calm') || line.match(/^\*\([^)]+\)\*$/)) continue;
    if (line.match(/^Voice|^Phase|^The dot|^Bilateral/)) continue;

    // Anything else meaningful that looks like spoken content
    const cleanLine = line
      .replace(/^\*\*[^*]+\*\*\s*/g, '') // remove leading bold labels
      .replace(/\*\*/g, '')              // remove remaining bold
      .replace(/^\*|^\*/g, '')            // remove italic markers at start
      .trim();

    if (cleanLine && cleanLine.length > 5 && !cleanLine.startsWith('(') && !cleanLine.startsWith('*')) {
      segments.push({ type: 'speak', text: cleanLine });
    }
  }

  return segments;
}

/**
 * Clean text for TTS: strip markdown artifacts, normalize whitespace
 */
export function cleanForTTS(text) {
  return text
    .replace(/\*\*/g, '')           // bold markers
    .replace(/\*/g, '')             // italic markers
    .replace(/\[pause[^\]]*\]/gi, '')  // any remaining pause cues
    .replace(/\s+/g, ' ')           // collapse whitespace
    .replace(/…/g, '...')           // ellipsis
    .replace(/["""]/g, '"')         // normalize quotes
    .trim();
}

/**
 * Parse all spoken lines from a body (just the text portions, no pauses)
 * Used for highlighting the current segment
 */
export function getSpokenLines(body) {
  return parseScript(body).filter(s => s.type === 'speak').map(s => s.text);
}