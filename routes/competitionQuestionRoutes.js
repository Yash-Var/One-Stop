// routes/competitionQuestionRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/competitionQuestionController');

router.post('/', controller.createQuestion);
router.get('/event/:eventId', controller.getQuestionsByEvent);
router.get('/:id', controller.getQuestionById);
router.delete('/:id', controller.deleteQuestion);

module.exports = router;
