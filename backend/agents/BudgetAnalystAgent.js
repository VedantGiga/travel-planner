const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');

class BudgetAnalystAgent {
  constructor() {
    this.llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0.3
    });
  }

  async analyzeBudget(intent, options) {
    const { destination, budget, duration, travelers } = intent;
    const { flights, hotels, activities } = options;

    // Calculate base costs
    const baseCosts = this.calculateBaseCosts(flights, hotels, activities, duration, travelers);
    
    // Check if budget is exceeded
    if (baseCosts.total > budget) {
      return await this.optimizeBudget(intent, options, baseCosts);
    }

    return this.createBudgetPlan(intent, baseCosts, false);
  }

  calculateBaseCosts(flights, hotels, activities, duration, travelers) {
    const flightCost = flights.length > 0 ? flights[0].price * travelers : 0;
    const hotelCost = hotels.length > 0 ? hotels[0].price * duration : 3000 * duration;
    const activityCost = activities.slice(0, 3).reduce((sum, act) => sum + act.price, 0);
    const mealCost = 800 * duration * travelers; // ₹800 per person per day
    const localTransport = 500 * duration; // ₹500 per day

    return {
      flights: flightCost,
      accommodation: hotelCost,
      activities: activityCost,
      meals: mealCost,
      localTransport: localTransport,
      total: flightCost + hotelCost + activityCost + mealCost + localTransport
    };
  }

  async optimizeBudget(intent, options, baseCosts) {
    const { budget, duration, travelers } = intent;
    const overspend = baseCosts.total - budget;

    const optimizations = [];
    let optimizedCosts = { ...baseCosts };

    // Optimize accommodation (30-40% of budget)
    const maxAccommodation = budget * 0.4;
    if (optimizedCosts.accommodation > maxAccommodation) {
      const savings = optimizedCosts.accommodation - maxAccommodation;
      optimizedCosts.accommodation = maxAccommodation;
      optimizations.push({
        category: 'Accommodation',
        suggestion: 'Switch to budget hotels or homestays',
        savings: savings
      });
    }

    // Optimize flights (25-35% of budget)
    const maxFlights = budget * 0.35;
    if (optimizedCosts.flights > maxFlights) {
      const savings = optimizedCosts.flights - maxFlights;
      optimizedCosts.flights = maxFlights;
      optimizations.push({
        category: 'Flights',
        suggestion: 'Book 2-3 days earlier or choose nearby airports',
        savings: savings
      });
    }

    // Optimize activities (15-20% of budget)
    const maxActivities = budget * 0.2;
    if (optimizedCosts.activities > maxActivities) {
      const savings = optimizedCosts.activities - maxActivities;
      optimizedCosts.activities = maxActivities;
      optimizations.push({
        category: 'Activities',
        suggestion: 'Mix free attractions with paid experiences',
        savings: savings
      });
    }

    // Optimize meals (20-25% of budget)
    const maxMeals = budget * 0.25;
    if (optimizedCosts.meals > maxMeals) {
      const savings = optimizedCosts.meals - maxMeals;
      optimizedCosts.meals = maxMeals;
      optimizations.push({
        category: 'Meals',
        suggestion: 'Try local street food and budget restaurants',
        savings: savings
      });
    }

    optimizedCosts.total = Object.values(optimizedCosts).reduce((sum, cost) => sum + cost, 0) - optimizedCosts.total;

    return this.createBudgetPlan(intent, optimizedCosts, true, optimizations);
  }

  createBudgetPlan(intent, costs, isOptimized, optimizations = []) {
    const { budget, duration } = intent;
    const dailyBudget = Math.floor(budget / duration);

    return {
      budgetBreakdown: {
        totalBudget: budget,
        estimatedCost: costs.total,
        isWithinBudget: costs.total <= budget,
        savings: budget - costs.total,
        dailyBudget: dailyBudget,
        breakdown: {
          flights: {
            amount: costs.flights,
            percentage: Math.round((costs.flights / budget) * 100)
          },
          accommodation: {
            amount: costs.accommodation,
            percentage: Math.round((costs.accommodation / budget) * 100)
          },
          activities: {
            amount: costs.activities,
            percentage: Math.round((costs.activities / budget) * 100)
          },
          meals: {
            amount: costs.meals,
            percentage: Math.round((costs.meals / budget) * 100)
          },
          localTransport: {
            amount: costs.localTransport,
            percentage: Math.round((costs.localTransport / budget) * 100)
          }
        }
      },
      optimizations: optimizations,
      recommendations: this.generateRecommendations(intent, costs),
      isOptimized: isOptimized
    };
  }

  generateRecommendations(intent, costs) {
    const { budget, destination, duration } = intent;
    const recommendations = [];

    // Budget-based recommendations
    if (budget < 15000) {
      recommendations.push('Consider hostels or budget hotels to save on accommodation');
      recommendations.push('Use public transport and walk when possible');
      recommendations.push('Look for free walking tours and public attractions');
    } else if (budget > 50000) {
      recommendations.push('You can afford premium experiences and hotels');
      recommendations.push('Consider private tours and fine dining options');
    }

    // Duration-based recommendations
    if (duration >= 7) {
      recommendations.push('Book weekly hotel rates for better deals');
      recommendations.push('Consider multi-city passes for attractions');
    }

    // Destination-specific recommendations
    recommendations.push(`Visit local markets in ${destination} for authentic and affordable meals`);
    recommendations.push(`Book activities in advance for better prices in ${destination}`);

    return recommendations;
  }

  async generateOptimizedItinerary(intent, budgetPlan, options) {
    const prompt = PromptTemplate.fromTemplate(`
      Create an optimized {duration}-day itinerary for {destination} within ₹{budget} budget.
      
      BUDGET BREAKDOWN (MUST FOLLOW):
      - Flights: ₹{flightBudget}
      - Accommodation: ₹{accommodationBudget} 
      - Activities: ₹{activityBudget}
      - Meals: ₹{mealBudget}
      - Local Transport: ₹{transportBudget}
      - Daily Budget: ₹{dailyBudget}
      
      OPTIMIZATION SUGGESTIONS:
      {optimizations}
      
      RECOMMENDATIONS:
      {recommendations}
      
      Available Options:
      Hotels: {hotels}
      Activities: {activities}
      
      Create a detailed day-by-day itinerary that:
      1. Stays within each category budget
      2. Maximizes value for money
      3. Includes cost breakdown for each day
      4. Suggests specific budget-friendly options
      5. Provides money-saving tips
    `);

    const formattedPrompt = await prompt.format({
      destination: intent.destination,
      duration: intent.duration,
      budget: intent.budget,
      flightBudget: budgetPlan.budgetBreakdown.breakdown.flights.amount,
      accommodationBudget: budgetPlan.budgetBreakdown.breakdown.accommodation.amount,
      activityBudget: budgetPlan.budgetBreakdown.breakdown.activities.amount,
      mealBudget: budgetPlan.budgetBreakdown.breakdown.meals.amount,
      transportBudget: budgetPlan.budgetBreakdown.breakdown.localTransport.amount,
      dailyBudget: budgetPlan.budgetBreakdown.dailyBudget,
      optimizations: budgetPlan.optimizations.map(opt => 
        `${opt.category}: ${opt.suggestion} (Save ₹${opt.savings})`
      ).join('\n'),
      recommendations: budgetPlan.recommendations.join('\n'),
      hotels: JSON.stringify(options.hotels.slice(0, 3)),
      activities: JSON.stringify(options.activities.slice(0, 6))
    });

    const result = await this.llm.invoke(formattedPrompt);
    
    return {
      ...budgetPlan,
      optimizedItinerary: result.content
    };
  }
}

module.exports = BudgetAnalystAgent;