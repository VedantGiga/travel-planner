const TravelPlannerAgent = require('./TravelPlannerAgent');
const BudgetAnalystAgent = require('./BudgetAnalystAgent');
const HotelFlightFinderAgent = require('./HotelFlightFinderAgent');
const TravelAdvisorAgent = require('./TravelAdvisorAgent');
const MemoryAgent = require('./MemoryAgent');

class OrchestratorAgent {
  constructor() {
    this.travelPlanner = new TravelPlannerAgent();
    this.budgetAnalyst = new BudgetAnalystAgent();
    this.hotelFlightFinder = new HotelFlightFinderAgent();
    this.travelAdvisor = new TravelAdvisorAgent();
    this.memory = new MemoryAgent();
  }

  async processRequest(userMessage, userId) {
    try {
      // Step 1: Extract intent
      const intent = await this.travelPlanner.extractIntent(userMessage);
      
      // Step 2: Find options
      const options = await this.hotelFlightFinder.searchOptions(intent);
      
      // Step 3: Budget analysis
      const budgetAnalysis = await this.budgetAnalyst.analyzeBudget(intent, options);
      
      // Step 4: Generate itinerary
      const baseItinerary = await this.travelPlanner.generateBaseItinerary(intent, options);
      
      // Step 5: Get local tips
      const localTips = await this.travelAdvisor.getLocalTips(intent.destination);
      
      // Step 6: Final optimization
      const optimizedResult = await this.budgetAnalyst.generateOptimizedItinerary(
        intent, 
        budgetAnalysis, 
        options
      );

      return {
        intent,
        options,
        budgetAnalysis: optimizedResult,
        itinerary: optimizedResult.optimizedItinerary,
        localTips,
        totalBudget: optimizedResult.budgetBreakdown
      };

    } catch (error) {
      console.error('Orchestration error:', error);
      throw new Error(`Orchestration failed: ${error.message}`);
    }
  }
}

module.exports = OrchestratorAgent;