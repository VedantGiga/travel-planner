const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');

class TravelAdvisorAgent {
  constructor() {
    this.llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0.8
    });
  }

  async enhanceItinerary(baseItinerary, intent) {
    const prompt = PromptTemplate.fromTemplate(`
      Enhance this travel itinerary with local insights and cultural tips for {destination}:
      
      Base Itinerary: {itinerary}
      
      Add:
      - Local customs and etiquette
      - Best local food spots and dishes to try
      - Hidden gems and off-the-beaten-path locations
      - Cultural experiences and festivals
      - Safety tips and local transportation advice
      - Best times to visit attractions (avoid crowds)
      
      Keep the original structure but add rich local context.
    `);

    const formattedPrompt = await prompt.format({
      destination: intent.destination,
      itinerary: baseItinerary
    });

    const result = await this.llm.invoke(formattedPrompt);
    return result.content;
  }

  async getLocalTips(destination) {
    const prompt = PromptTemplate.fromTemplate(`
      Provide essential local tips for travelers visiting {destination}:
      
      Include:
      1. Cultural do's and don'ts
      2. Local transportation hacks
      3. Must-try street food (with safety tips)
      4. Best local markets and shopping areas
      5. Emergency contacts and useful phrases
      6. Tipping customs and bargaining tips
      
      Format as practical, actionable advice.
    `);

    const formattedPrompt = await prompt.format({ destination });
    const result = await this.llm.invoke(formattedPrompt);
    
    return this.parseLocalTips(result.content);
  }

  parseLocalTips(content) {
    const sections = content.split(/\d+\./);
    return {
      cultural: sections[1]?.trim() || '',
      transportation: sections[2]?.trim() || '',
      food: sections[3]?.trim() || '',
      shopping: sections[4]?.trim() || '',
      emergency: sections[5]?.trim() || '',
      tipping: sections[6]?.trim() || ''
    };
  }
}

module.exports = TravelAdvisorAgent;