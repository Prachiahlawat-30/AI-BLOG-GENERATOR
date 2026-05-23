const express = require('express');

const { isAuthenticated } = require('../middleware/isAuthenticated');

const { getGeminiResponse } = require('../controllers/openAIController');

const checkUsage = require("../middleware/checkUsage");

const openAIRouter = express.Router();

openAIRouter.post(
    '/response',
    isAuthenticated,
    getGeminiResponse
);

openAIRouter.post(
    "/generate-content",
    isAuthenticated,
    checkUsage,
    getGeminiResponse
);

module.exports = openAIRouter;