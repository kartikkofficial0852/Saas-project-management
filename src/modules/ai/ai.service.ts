import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const aiService = {
    async generateTaskDescription(title: string) {
        const response = await openai.responses.create({
            model: process.env.OPENAI_MODEL!,
            instructions: `
                You are an AI assistant inside a professional project management application.

                Generate a concise, implementation-ready task description for a software development task.

                Use exactly these sections:

                ## Overview
                2-3 sentences explaining what needs to be implemented.

                ## Requirements
                3-5 concise bullet points covering the main implementation requirements.

                ## Acceptance Criteria
                3-5 concise bullet points describing how the task will be considered complete.

                ## Edge Cases
                1-3 important edge cases only, when relevant.

                Rules:
                - Focus only on the provided task title.
                - Do not invent unrelated features.
                - Use professional technical language.
                - Keep the entire response under 250 words.
                - Be specific but concise.
                - Do not include code.
                - Do not repeat the task title unnecessarily.
                - Do not add a conclusion or extra sections.
                - Return only the task description.
            `,
            input: `Create a task description for: ${title}`,
        });

        return response.output_text;
    },

    async generateTaskBreakdown(
        title: string,
        description?: string
    ) {
        const response = await openai.responses.create({
            model: process.env.OPENAI_MODEL!,
            instructions: `
                You are an AI assistant inside a professional
                software project management application.

                Break the provided task into 3-7 actionable subtasks.

                Rules:
                - Each subtask should be independently actionable.
                - Keep subtasks specific and practical.
                - Follow the original task scope.
                - Do not invent unrelated requirements.
                - Order subtasks logically when possible.
                - Return only a numbered list of subtasks.
                `,
            input: `
                Task title:
                ${title}

                Task description:
                ${description || "No description provided."}
            `,
        });

        return response.output_text;
    },

    async summarize(content: string) {
        const response = await openai.responses.create({
            model: process.env.OPENAI_MODEL!,
            instructions: `
            You are an AI assistant inside a professional
            software project management application.

            Summarize the provided project content clearly and
            concisely.

            Rules:
            - Capture the main points.
            - Preserve important decisions, requirements,
            blockers, and action items.
            - Remove repetition and irrelevant details.
            - Do not invent information.
            - Use concise bullet points when appropriate.
            - Return only the summary.
            `,
            input: content,
        });

        return response.output_text;
    },
};



export default aiService;