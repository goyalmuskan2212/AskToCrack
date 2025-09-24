const { GoogleGenAI } = require("@google/genai");
//const { GoogleGenerativeAI } = require("@google/generative-ai");

const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
//const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });


const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if(!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        //const response = await model.generateContent(prompt);
        //let rawText = response.response.text(); // note: text() is a method


        const cleanedText = rawText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();

        //now save to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
};

const generateConceptExplanation = async(req, res) => {
    try{
        const { question } = req.body;

        if(!question) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        //const response = await model.generateContent(prompt);
        //let rawText = response.response.text(); // note: text() is a method


        const cleanedText = rawText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();

        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };