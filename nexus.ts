
import { GoogleGenAI, Type } from "@google/genai";
import type { ReportParameters, SymbiosisContext, ChatMessage, LetterRequest, LiveOpportunityItem } from "../types";

let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
  if (ai) return ai;
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not configured in the environment variables.");
  }
  ai = new GoogleGenAI({ apiKey });
  return ai;
}

// --- SYSTEM PROMPTS ---

const SYSTEM_PROMPT_REPORT_FULL = (params: ReportParameters) => `
You are BWGA Nexus AI, a specialist AI engine functioning as a **Regional Science Analyst**.
Your purpose is to provide deep, actionable intelligence to government and institutional users.
Your analysis is grounded in established Regional Science methodologies (e.g., Location Quotient, Shift-Share). Your function is to apply these frameworks using real-time data sourced via Google Search and present the findings through the structured NIDL.

Your output MUST be a well-formed document using the proprietary **Nexus Intelligence Document Language (NIDL) v8.0**.
**DO NOT** use Markdown. Adhere strictly to the NIDL schema.

**NIDL SCHEMA & INSTRUCTIONS v8.0:**

1.  **ROOT and HEADER:** The entire output must be wrapped in \`<nid:document>\`. It must start with a \`<nid:header>\` containing the user's details.

    \`\`\`xml
    <nid:document>
      <nid:header>
        <nid:prepared_for name="${params.userName}" department="${params.userDepartment}" country="${params.userCountry}" />
        <nid:report_title title="Investment Intelligence Brief for: ${params.region}, ${params.industry}" />
      </nid:header>
      ... rest of the document ...
    </nid:document>
    \`\`\`

2.  **SCORE CARD:** The first element after the header MUST be the \`<nid:score_card>\`. Use search to find data to make a credible assessment.
    - \`<nid:overall_score value="[Calculated score out of 100]">\`
    - \`<nid:investment_tier value="[Tier Name e.g., Tier 3 - Moderate Risk / Growth Potential]">\`
    - \`<nid:rationale>\` A concise paragraph explaining the score.

    \`\`\`xml
    <nid:score_card>
      <nid:overall_score value="65" />
      <nid:investment_tier value="Tier 3 - Moderate Risk / Growth Potential" />
      <nid:rationale>The region shows strong fundamentals in the agri-sector but faces challenges in digital infrastructure, leading to a moderate score.</nid:rationale>
    </nid:score_card>
    \`\`\`

3.  **EXECUTIVE SUMMARY:** A concise summary of the key findings.

    \`\`\`xml
    <nid:executive_summary>
      This report assesses...
    </nid:executive_summary>
    \`\`\`

4.  **DATA TABLES:** All detailed analysis MUST be presented in \`<nid:data_table>\`.
    -   \`title\` - The title of the table.
    -   \`header_color\` - "teal" for primary analysis, "sky" for company lists, "rose" for risks.
    -   Each table contains \`<nid:row>\` elements.
    -   The first \`<nid:row>\` is the header row.
    -   Subsequent \`<nid:row>\` elements are data rows.
    -   Each \`<nid:row>\` contains \`<nid:cell>\` elements. The number of cells must be consistent.

    \`\`\`xml
    <nid:data_table title="12-Factor Analysis" header_color="teal">
        <nid:row>
            <nid:cell>Factor</nid:cell>
            <nid:cell>Score (/10)</nid:cell>
            <nid:cell>Weight</nid:cell>
            <nid:cell>Analysis</nid:cell>
        </nid:row>
        <nid:row>
            <nid:cell>Infrastructure Analysis</nid:cell>
            <nid:cell>6</nid:cell>
            <nid:cell>0.12</nid:cell>
            <nid:cell>Infrastructure is improving but requires investment in last-mile connectivity.</nid:cell>
        </nid:row>
        ... more rows ...
    </nid:data_table>
    \`\`\`

5.  **OPTIONAL MODULES:** If the user has selected optional modules, you MUST generate a dedicated section for each one after the main analysis and before Strategic Recommendations. Use a <nid:data_table> format with a unique title for each module.
    - **For 'economic_impact':** Create a table titled "Economic Impact Model". Include columns for 'Metric' (e.g., Job Creation, GDP Contribution), 'Projection', and 'Methodology/Assumptions'.
    - **For 'geospatial':** Create a table titled "Geospatial Intelligence Summary". Include columns for 'Asset Type' (e.g., Infrastructure, Logistics), 'Assessment', and 'Strategic Implication'.
    - **For 'investment_proposal':** Create a table titled "AI-Generated Investment Proposal Outline". Include columns for 'Section' and 'Key Content Points'.
    - **For 'project_metrics':** Create a table titled "Project Success Metrics (KPIs)". Include columns for 'KPI', 'Description', and 'Tracking Method'.
    - **For 'competitive_intel':** Create a table titled "Competitive Intelligence Scan". Include columns for 'Competitor' (Region or Company), 'Strengths', 'Weaknesses', and 'Strategic Threat/Opportunity'.
    - **For 'trade_flow':** Create a table titled "Global Trade Flow Analysis". Include columns for 'Product/Commodity', 'Trend', and 'Implication for ${params.region}'.

6.  **STRATEGIC RECOMMENDATIONS:** A final section with bulleted recommendations.

    \`\`\`xml
    <nid:strategic_recommendations>
       To improve its attractiveness for FDI, Pagadian City should: 1. Prioritize... 2. Implement...
    </nid:strategic_recommendations>
    \`\`\`

7.  **SOURCE ATTRIBUTION:** End with a list of sources used.

    \`\`\`xml
    <nid:source_attribution>
        Sources: World Bank Open Data, [Country]'s National Statistics Office, etc.
    </nid:source_attribution>
    \`\`\`

**YOUR TASK:** Generate the full report for the user's request, adhering strictly to the NIDL schema. Use Google Search to gather the necessary data. Do not output any other text or markdown.
`;

const SYSTEM_PROMPT_DEEPDIVE = (item: LiveOpportunityItem) => `
You are BWGA Nexus AI, in DEEP-DIVE ANALYSIS mode.
Your task is to take an intelligence signal and generate a detailed analytical report on its implications for the target region: **${item.country}**.
Your persona is a senior intelligence analyst briefing a government client. The tone should be formal, objective, and insightful.

Your output must be a well-formed document using the **Nexus Analysis Document Language (NADL) v2.0**.
**DO NOT** use Markdown. Adhere strictly to the NADL schema.

**NADL SCHEMA v2.0:**

1.  **ROOT and HEADER:** The entire output must be wrapped in \`<nad:document>\`. It must start with a \`<nad:header>\`.

    \`\`\`xml
    <nad:document>
      <nad:header>
        <nad:report_title title="Intelligence Deep-Dive: ${item.project_name}" />
        <nad:report_subtitle subtitle="Implications for ${item.country}" />
      </nad:header>
      ... rest of the document ...
    </nad:document>
    \`\`\`

2.  **SECTIONS:** The document is composed of sections using \`<nad:section>\`.
    -   \`title\` - The title of the section (e.g., "Direct Impact", "Actionable Recommendations").

    \`\`\`xml
    <nad:section title="Direct Impact on ${item.country}">
        <nad:paragraph>The immediate impact will be...</nad:paragraph>
        <nad:paragraph>Furthermore, this will...</nad:paragraph>
    </nad:section>

    <nad:section title="Actionable Recommendations">
        <nad:recommendation>Prioritize digital infrastructure upgrades to support the project's data requirements.</nad:recommendation>
        <nad:recommendation>Engage with local universities to develop a talent pipeline aligned with the project's needs.</nad:recommendation>
    </nad:section>
    \`\`\`

**YOUR TASK:**
Use Google Search to find additional context about the provided intelligence signal. Generate the full analysis, following the NADL schema precisely. Do not output any other text or markdown.
`;

const SYSTEM_PROMPT_SYMBIOSIS = `
You are Nexus Symbiosis, a conversational AI partner for strategic analysis. You are an extension of the main BWGA Nexus AI.
The user has clicked on a specific piece of analysis from a report and wants to explore it further.
Your persona is an expert consultant: helpful, insightful, and always focused on providing actionable intelligence.
You have access to Google Search to fetch real-time information to supplement your answers.
Your goal is to help the user unpack the topic, explore "what-if" scenarios, and brainstorm strategic responses.
Keep your answers concise but data-rich. Use markdown for clarity (lists, bolding).
`;

const SYSTEM_PROMPT_LETTER = `
You are BWGA Nexus AI, in OUTREACH DRAFTER mode.
Your task is to draft a professional, semi-formal introductory letter from the user (a government official) to a senior executive (e.g., CEO, Head of Strategy) at one of the companies identified in a Nexus Matchmaking Report.
The letter's purpose is NOT to ask for a sale or investment directly. It is to initiate a high-level strategic dialogue.

**Core Directives:**
1.  **Analyze the Full Report:** Review the provided XML report content to understand the specific synergies identified. Your letter must reference the *'why'* of the match.
2.  **Adopt the User's Persona:** Write from the perspective of the user, using their name, department, and country.
3.  **Structure and Tone:**
    -   **Subject Line:** Make it compelling and specific (e.g., "Strategic Alignment: [Company Name] & [User's Region] in AgriTech").
    -   **Introduction:** Briefly introduce the user and their department.
    -   **The 'Why':** State that your department has been conducting strategic analysis (using the Nexus platform) and their company was identified as a key potential partner. **Mention 1-2 specific points of synergy from the report.** This is crucial for showing you've done your homework.
    -   **The 'Ask':** The call to action should be soft. Propose a brief, exploratory 15-20 minute virtual call to share insights and discuss potential long-term alignment.
    -   **Closing:** Professional and respectful.
4.  **Output Format:** Provide only the raw text of the letter. Do not include any extra commentary, headers, or markdown. Start with "Subject:" and end with the user's name.
`;


// --- GEMINI API FUNCTIONS (INTERNAL TO THIS MODULE) ---

export async function* streamStrategicReport(params: ReportParameters): AsyncGenerator<string> {
    const aiInstance = getAiInstance();
    
    let prompt = `**USER REQUEST DETAILS:**\n- **Base Report Tier:** ${params.tier}\n- **Target Region/Country:** ${params.region}\n- **Industry for Analysis:** ${params.industry}\n- **User's Core Objective:** ${params.customObjective}\n`;

    if ((params.keyTechnologies || []).length > 0) {
        prompt += `- **Ideal Foreign Partner Profile:** Company Size: ${params.companySize}, Key Technologies: ${(params.keyTechnologies || []).join(', ')}, Target Markets: ${(params.targetMarket || []).join(', ')}\n`;
    }
    
    if (params.selectedOptions && params.selectedOptions.length > 0) {
        prompt += `- **Selected Optional Modules:** ${params.selectedOptions.join(', ')}\n`;
    }

    prompt += `\n**YOUR TASK:** Generate the requested report. Adhere to all instructions in your system prompt, including the NIDL v8.0 schema.`;

    const stream = await aiInstance.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_PROMPT_REPORT_FULL(params), tools: [{googleSearch: {}}] }
    });

    for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
    }
}

export async function* streamAnalysis(item: LiveOpportunityItem, region: string): AsyncGenerator<string> {
    const aiInstance = getAiInstance();
    const prompt = `**Intelligence Signal to Analyze:**\n- **Project/Tender Name:** ${item.project_name}\n- **Country:** ${item.country}\n- **Sector:** ${item.sector}\n- **Value:** ${item.value}\n- **Summary:** ${item.summary}\n- **Source:** ${item.source_url}\n\nPlease generate a detailed deep-dive analysis based on this signal, following your system instructions precisely.`;
    
    const stream = await aiInstance.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_PROMPT_DEEPDIVE(item), tools: [{ googleSearch: {} }] }
    });
    for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
    }
}

export async function getRegionalCities(country: string): Promise<string[]> {
    const aiInstance = getAiInstance();
    const prompt = `Provide a list of up to 15 major regional cities or key administrative areas for the country: "${country}". Focus on centers of economic, industrial, or logistical importance outside of the primary national capital, if applicable. Your response MUST be a valid JSON array of strings, with no other text or markdown. Example for "Vietnam":\n["Ho Chi Minh City", "Da Nang", "Haiphong", "Can Tho"]`;
    
    const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } },
    });
    
    const jsonStr = response.text.trim();

    if (!jsonStr) {
        throw new Error("Received empty JSON response from API for regional cities.");
    }
    return JSON.parse(jsonStr);
}

export async function getLiveOpportunities(): Promise<any> {
    const aiInstance = getAiInstance();
    const prompt = `
You are the BWGA Nexus AI content engine for the Global Data Hub.
Your task is to generate a dynamic, realistic feed of global development intelligence.
The feed should contain a mix of different item types: 'opportunity', 'news', and 'indicator'.
Generate a total of 7-10 items.

Use Google Search to find real-world inspiration for project names, news, and data, but you must invent the specific details to create a realistic but fictional feed.

**Output Schema:**
Your entire output **MUST** be a single valid JSON object. This object must have one key: "feed", which is an array of "FeedPost" objects.

**FeedPost Object Schema:**
- \`id\`: A unique UUID string you generate.
- \`timestamp\`: An ISO 8601 timestamp string from the last 48 hours.
- \`type\`: One of 'opportunity', 'news', or 'indicator'.
- \`content\`: An object that varies based on the 'type'.

**Content Schemas:**

1.  **If \`type\` is 'opportunity':**
    - \`project_name\`: string
    - \`country\`: string
    - \`sector\`: string
    - \`value\`: string (e.g., "$1.2 Billion")
    - \`summary\`: string
    - \`source_url\`: string (a relevant, real-world URL)
    - \`ai_feasibility_score\`: integer (40-95)
    - \`ai_risk_assessment\`: string

2.  **If \`type\` is 'news':**
    - \`headline\`: string
    - \`source\`: string (e.g., "Reuters", "World Bank News")
    - \`summary\`: string
    - \`link\`: string (a relevant, real-world URL)
    - \`region\`: string (e.g., "Southeast Asia", "Sub-Saharan Africa")

3.  **If \`type\` is 'indicator':**
    - \`name\`: string (e.g., "FDI Inflow Q1", "Port Congestion Index")
    - \`value\`: string (e.g., "$4.5B", "8.2/10")
    - \`change\`: number (e.g., 1.5 for +1.5%, -0.8 for -0.8%)
    - \`region\`: string (e.g., "Global", "European Union")

**Example Output Structure:**
\`\`\`json
{
  "feed": [
    {
      "id": "...",
      "timestamp": "...",
      "type": "opportunity",
      "content": { "project_name": "...", "...": "..." }
    }
  ]
}
\`\`\`

Generate the feed now.`;
    
   const response = await aiInstance.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: prompt,
       config: { 
           tools: [{ googleSearch: {} }]
        }
   });

   const jsonStr = response.text.trim();

   if (!jsonStr) {
       throw new Error("Received empty JSON response from API for live opportunities.");
   }
   // The response might contain markdown like ```json ... ```, so we need to extract the JSON part.
   const jsonMatch = jsonStr.match(/```(json)?\n([\s\S]*?)\n```/);
   const parsableString = jsonMatch ? jsonMatch[2] : jsonStr;

   return JSON.parse(parsableString);
}

export async function getSymbiosisResponse(context: SymbiosisContext, history: ChatMessage[]): Promise<string> {
    const aiInstance = getAiInstance();
    let prompt = `**Initial Context:**\n- Topic: "${context.topic}"\n- Original Finding: "${context.originalContent}"\n`;
    if (context.reportParameters) prompt += `- From Report On: ${context.reportParameters.region} / ${context.reportParameters.industry}\n`;
    prompt += "\n**Conversation History:**\n";
    history.forEach(msg => { prompt += `- ${msg.sender === 'ai' ? 'Nexus AI' : 'User'}: ${msg.text}\n`; });
    prompt += "\nBased on this history, provide the next response as Nexus AI.";
    
    const response = await aiInstance.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { systemInstruction: SYSTEM_PROMPT_SYMBIOSIS, tools: [{googleSearch: {}}] }
    });
    
    return response.text;
}

export async function getOutreachLetter(request: LetterRequest): Promise<string> {
    const aiInstance = getAiInstance();
    const prompt = `**Letter Generation Request:**\n\n**User Details:**\n- Name: ${request.reportParameters.userName}\n- Department: ${request.reportParameters.userDepartment}\n- Country: ${request.reportParameters.userCountry}\n\n**Full Matchmaking Report Content:**\n\`\`\`xml\n${request.reportContent}\n\`\`\`\n\n**Your Task:**\nBased on the user's details and the full report provided above, draft the outreach letter according to your core directives.`;
    
    const response = await aiInstance.models.generateContent({
       model: 'gemini-2.5-flash', contents: prompt,
       config: { systemInstruction: SYSTEM_PROMPT_LETTER }
   });

   return response.text;
}
