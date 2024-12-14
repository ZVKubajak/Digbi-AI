import { type Request, type Response } from 'express';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let model: OpenAI;

if (apiKey) {
  model = new OpenAI({
    temperature: 0,
    openAIApiKey: apiKey,
    modelName: "gpt-4o",
  });
} else {
  console.error("OPENAI_API_KEY is not configured.");
}

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  code: "The code snippet extracted from the JSON data.",
  explanation: "A detailed explanation of the code snippet.",
});

const formatInstructions = parser.getFormatInstructions();

const promptTemplate = new PromptTemplate({
  template:
    "You are a expert with json data and will not answer to anything that isnt about the json data you are provided. Your goal is to find patterns in the json data and understand and sort it thoroughly as prompted. If the question is not related to data, do not answer.\n{format_instructions}\n{question}",
  inputVariables: ["question"],
  partialVariables: { format_instructions: formatInstructions },
});

const formatPrompt = async (question: string): Promise<string> => {
  return await promptTemplate.format({ question });
};

const promptFunc = async (input: string): Promise<string> => {
  try {
    if (model) {
      return await model.invoke(input);
    }
    return '```json\n{\n    "code": "No OpenAI API key provided.",\n    "explanation": "Unable to provide a response."\n}\n```';
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const parseResponse = async (
  response: string
): Promise<{ [key: string]: string }> => {
  try {
    return await parser.parse(response);
  } catch (err) {
    console.error("Error in parseResponse:", err);
    return { error: "Failed to parse the response from the model." };
  }
};

export const askQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userQuestion: string = req.body.question;

  try {
    if (!userQuestion) {
      res
        .status(400)
        .json({
          question: null,
          response: "Please provide a question in the request body.",
          formattedResponse: null,
        });
      return;
    }

    const formattedPrompt: string = await formatPrompt(userQuestion);
    const rawResponse: string = await promptFunc(formattedPrompt);
    const result: { [key: string]: string } = await parseResponse(rawResponse);
    res.json({
      question: userQuestion,
      prompt: formattedPrompt,
      response: rawResponse,
      formattedResponse: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    res
      .status(500)
      .json({
        question: userQuestion,
        prompt: null,
        response: "Internal Server Error",
        formattedResponse: null,
      });
  }
};