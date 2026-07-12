/**
 * Audio file manifest.
 * Maps content IDs to their audio file paths.
 * Uses the convention: /audio/{modalityId}/{ageSegment}.wav
 * When audio files are available, the session player will use them.
 * Falls back to browser TTS when no audio file exists.
 */

const MODALITY_SLUGS = {
  emdr: 'emdr',
  'eft-tapping': 'eft-tapping',
  'faster-eft': 'faster-eft',
  'tft-tapping': 'tft-tapping',
  'silva-mind-control': 'silva-mind-control',
  havening: 'havening',
  'deep-breathing': 'deep-breathing',
};

/**
 * Get the audio file URL for a given content item.
 * @param {object} item - Content item from the API
 * @returns {string|null} Audio file URL or null if not available
 */
export function getAudioUrl(item) {
  if (!item || !item.modalityId || !item.ageSegment) return null;
  const slug = MODALITY_SLUGS[item.modalityId];
  if (!slug) return null;
  return `/audio/${slug}/${item.ageSegment}.wav`;
}

/**
 * Check if audio exists for a content item by trying to load it.
 * @param {object} item - Content item
 * @returns {Promise<boolean>} Whether audio file exists
 */
export async function audioExists(item) {
  const url = getAudioUrl(item);
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export default { getAudioUrl, audioExists };