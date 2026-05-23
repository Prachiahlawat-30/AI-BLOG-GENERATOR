const asyncHandler = require('express-async-handler');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = asyncHandler(async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) {
        res.status(400);
        throw new Error('Please provide a prompt');
    }

    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const finalPrompt = `
Generate a professional SEO-friendly blog article.

Topic:
${prompt}

Requirements:
- Attractive title
- Introduction
- Proper headings
- Subheadings
- Conclusion
- Human-like writing
- Markdown formatting
`;

        const result = await model.generateContent(finalPrompt);

        const response = result.response.text();

        res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to generate content'
        });
    }
});

module.exports = {
    getGeminiResponse
};