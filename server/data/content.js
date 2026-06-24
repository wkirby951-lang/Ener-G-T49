const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Content library data loader.
 * Reads markdown files from the shared content/ directory
 * and creates a structured API for sessions and literature.
 */

const CONTENT_DIR = path.join(__dirname, '..', '..', 'content');

// Modality metadata with display names, slugs, and descriptions
const MODALITIES = [
  {
    id: 'emdr',
    name: 'EMDR',
    fullName: 'Eye Movement Desensitization and Reprocessing',
    slug: 'emdr',
    description: 'Bilateral stimulation to reprocess traumatic memories',
    icon: '🫣',
    color: '#4A90D9' // deep blue
  },
  {
    id: 'eft-tapping',
    name: 'EFT Tapping',
    fullName: 'Emotional Freedom Technique',
    slug: 'eft-tapping',
    description: 'Acupressure tapping to calm the amygdala and rewire stress responses',
    icon: '👆',
    color: '#5B9F7A' // soft green
  },
  {
    id: 'faster-eft',
    name: 'Faster EFT',
    fullName: 'Faster EFT (Emotional Freedom Techniques)',
    slug: 'faster-eft',
    description: 'An accelerated version of EFT tapping for rapid relief',
    icon: '⚡',
    color: '#D4A84B' // warm gold
  },
  {
    id: 'tft-tapping',
    name: 'TFT Tapping',
    fullName: 'Thought Field Therapy',
    slug: 'tft-tapping',
    description: 'Algorithm-based tapping sequences for specific emotional issues',
    icon: '🧠',
    color: '#8B6FC0' // purple
  },
  {
    id: 'silva-mind-control',
    name: 'Silva Mind Control',
    fullName: 'Silva Mind Control Method',
    slug: 'silva-mind-control',
    description: 'Guided visualization and alpha-state brainwave techniques',
    icon: '🌌',
    color: '#3D7EA6' // teal
  },
  {
    id: 'havening',
    name: 'Havening',
    fullName: 'Havening Technique',
    slug: 'havening',
    description: 'Gentle touch and visualization to clear traumatic memories',
    icon: '🤲',
    color: '#C77D9A' // rose
  },
  {
    id: 'deep-breathing',
    name: 'Deep Breathing',
    fullName: 'Deep Breathing Meditation',
    slug: 'deep-breathing',
    description: 'Structured breathwork for instant calm and emotional regulation',
    icon: '🌬️',
    color: '#7AB8C9' // light blue
  }
];

const AGE_SEGMENTS = [
  { id: 'teens', label: 'Teens (14–18)', range: '14-18' },
  { id: 'young-adults', label: 'Young Adults (19–36)', range: '19-36' },
  { id: 'adults', label: 'Adults (37–65+)', range: '37-65+' }
];

/**
 * Load all content files from the shared content directory
 */
function loadAllContent() {
  const library = [];

  MODALITIES.forEach(mod => {
    const modDir = path.join(CONTENT_DIR, mod.slug);
    if (!fs.existsSync(modDir)) return;

    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.md'));

    files.forEach(file => {
      const filePath = path.join(modDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const name = file.replace('.md', '');
      
      // Determine type and age segment from filename
      let type = 'literature';
      let ageSegment = null;
      
      if (name === 'introduction') {
        type = 'introduction';
      } else if (name === 'cheatsheet') {
        type = 'cheatsheet';
      } else if (name.startsWith('session-')) {
        type = 'session';
        // Extract age segment: session-teens.md, session-young-adults.md, session-adults.md
        const segment = name.replace('session-', '');
        ageSegment = segment === 'teens' ? 'teens' : 
                     segment === 'young-adults' ? 'young-adults' : 
                     segment === 'adults' ? 'adults' : null;
      }
      
      // Extract title from markdown heading
      const titleMatch = content.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : name;

      // Extract duration if available
      const durationMatch = content.match(/\*\*Duration:\*\*\s*([^\n]+)/i);
      const duration = durationMatch ? durationMatch[1].trim() : null;

      // Extract focus if available
      const focusMatch = content.match(/\*\*Focus:\*\*\s*([^\n]+)/i);
      const focus = focusMatch ? focusMatch[1].trim() : null;

      // Extract goal if available
      const goalMatch = content.match(/\*\*Goal:\*\*\s*([^\n]+)/i);
      const goal = goalMatch ? goalMatch[1].trim() : null;

      library.push({
        id: `${mod.slug}-${name}`,
        modalityId: mod.id,
        type,
        title,
        fileName: file,
        filePath: filePath,
        ageSegment,
        duration,
        focus,
        goal,
        abstract: content.substring(0, 200).replace(/[#*\n]/g, ' ').trim() + '...'
      });
    });
  });

  return library;
}

/**
 * Get all modalities with their available content counts
 */
function getModalitiesWithCounts() {
  const library = loadAllContent();
  
  return MODALITIES.map(mod => {
    const modContent = library.filter(item => item.modalityId === mod.id);
    return {
      ...mod,
      contentCount: modContent.length,
      sessionCount: modContent.filter(i => i.type === 'session').length,
      hasContent: modContent.length > 0
    };
  });
}

/**
 * Get content items filtered by modality, age segment, and/or type
 */
function getContent(filter = {}) {
  let library = loadAllContent();
  
  if (filter.modalityId) {
    library = library.filter(item => item.modalityId === filter.modalityId);
  }
  if (filter.ageSegment) {
    library = library.filter(item => 
      item.ageSegment === filter.ageSegment || item.type !== 'session'
    );
  }
  if (filter.type) {
    library = library.filter(item => item.type === filter.type);
  }
  
  return library;
}

/**
 * Get a single content item by ID
 */
function getContentById(id) {
  const library = loadAllContent();
  return library.find(item => item.id === id);
}

/**
 * Get the full file content for a session/literature item
 */
function getContentBody(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Get content grouped by modality for the content library page
 */
function getContentByModality() {
  const library = loadAllContent();
  const grouped = {};
  
  MODALITIES.forEach(mod => {
    grouped[mod.id] = {
      modality: mod,
      items: library.filter(item => item.modalityId === mod.id)
    };
  });
  
  return grouped;
}

module.exports = {
  MODALITIES,
  AGE_SEGMENTS,
  loadAllContent,
  getModalitiesWithCounts,
  getContent,
  getContentById,
  getContentBody,
  getContentByModality
};