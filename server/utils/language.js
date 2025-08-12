const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

// Translation function
async function translateText(text, targetLanguage = 'Spanish') {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // You can also use 'gpt-3.5-turbo' if needed
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful translator that translates any given text to ${targetLanguage}.`,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Translation error:', error);
        return null;
    }
}

module.exports = translateText;
