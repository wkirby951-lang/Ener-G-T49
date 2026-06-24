const express = require('express');
const router = express.Router();
const { MODALITIES, AGE_SEGMENTS, getModalitiesWithCounts, getContent, getContentById, getContentBody, getContentByModality } = require('../data/content');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/content/modalities
 * Returns all modalities with content counts
 */
router.get('/modalities', (req, res) => {
  const modalities = getModalitiesWithCounts();
  res.json({ modalities, ageSegments: AGE_SEGMENTS });
});

/**
 * GET /api/content/library
 * Returns all content items, with optional filters
 * Query params: modalityId, ageSegment, type
 */
router.get('/library', (req, res) => {
  const { modalityId, ageSegment, type } = req.query;
  const items = getContent({ modalityId, ageSegment, type });
  res.json({ items, total: items.length });
});

/**
 * GET /api/content/by-modality
 * Returns content grouped by modality
 */
router.get('/by-modality', (req, res) => {
  const grouped = getContentByModality();
  res.json({ grouped });
});

/**
 * GET /api/content/:id
 * Returns a single content item with full body
 */
router.get('/:id', (req, res) => {
  const item = getContentById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Content not found.' });
  }
  
  const body = getContentBody(item.filePath);
  res.json({ item, body });
});

/**
 * GET /api/content/:modality/:type
 * Get content by modality slug and type (introduction, session, cheatsheet)
 */
router.get('/:modality/:type', (req, res) => {
  const { modality, type } = req.params;
  let items = getContent({ modalityId: modality, type });
  
  // If a specific age segment is requested
  if (req.query.ageSegment) {
    items = items.filter(item => 
      item.ageSegment === req.query.ageSegment || 
      item.type !== 'session'
    );
  }
  
  res.json({ items, total: items.length });
});

module.exports = router;