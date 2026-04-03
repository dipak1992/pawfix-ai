import OpenAI from "openai";

// ── Types ────────────────────────────────────────────────────────────
export type PromptType = "food" | "emergency" | "behavior" | "feeding";

export interface DogAdviceResponse {
  status: string;
  explanation: string;
  actions: string[];
}

// ── System prompts for each feature ──────────────────────────────────
const SYSTEM_PROMPTS: Record<PromptType, string> = {
  food: `You are a veterinary nutrition expert. The user will ask if a dog can eat a specific food.
Respond ONLY with valid JSON in this exact format:
{
  "status": "Safe" | "Unsafe" | "Limited",
  "explanation": "Brief 1-2 sentence explanation",
  "actions": ["action step 1", "action step 2"]
}
Be concise and accurate. If safe, mention serving tips. If unsafe, mention risks. If limited, mention quantity guidelines.`,

  emergency: `You are a veterinary emergency advisor. The user describes an emergency situation with their dog.
Respond ONLY with valid JSON in this exact format:
{
  "status": "Urgent" | "Monitor" | "Normal",
  "explanation": "Brief 1-2 sentence explanation of the situation",
  "actions": ["immediate step 1", "immediate step 2", "when to see vet"]
}
Always err on the side of caution. Include "See a vet immediately" for truly dangerous situations.`,

  behavior: `You are a certified dog behaviorist. The user asks about their dog's behavior.
Respond ONLY with valid JSON in this exact format:
{
  "status": "Normal" | "Attention Needed" | "Consult Vet",
  "explanation": "Likely reason for the behavior in 1-2 sentences",
  "actions": ["suggested fix 1", "suggested fix 2"]
}
Be reassuring but honest.`,

  feeding: `You are a veterinary nutritionist. The user provides their dog's breed, age, and weight.
Respond ONLY with valid JSON in this exact format:
{
  "status": "Recommendation",
  "explanation": "Daily feeding guideline in 1-2 sentences",
  "actions": ["specific amount per day", "feeding frequency", "additional tips"]
}
Use standard veterinary feeding guidelines. Amounts should be in cups per day.`,
};

// ── Main AI function ─────────────────────────────────────────────────

/**
 * Get AI-powered dog advice.
 * Falls back to a local placeholder if OPENAI_API_KEY is not set.
 */
export async function getDogAdvice(
  promptType: PromptType,
  userInput: string
): Promise<DogAdviceResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no API key, use the built-in fallback so the app still works
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return getFallbackResponse(promptType, userInput);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[promptType] },
        { role: "user", content: userInput },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Extract JSON from the response (handles markdown code fences)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const parsed: DogAdviceResponse = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error("OpenAI API error, falling back:", error);
    return getFallbackResponse(promptType, userInput);
  }
}

// ── Fallback responses (works without API key) ───────────────────────

function getFallbackResponse(
  promptType: PromptType,
  userInput: string
): DogAdviceResponse {
  const input = userInput.toLowerCase();

  switch (promptType) {
    case "food":
      return getFoodFallback(input);
    case "emergency":
      return getEmergencyFallback(input);
    case "behavior":
      return getBehaviorFallback(input);
    case "feeding":
      return getFeedingFallback(input);
  }
}

function getFoodFallback(input: string): DogAdviceResponse {
  const unsafeFoods: Record<string, string> = {
    chocolate: "Chocolate contains theobromine which is toxic to dogs.",
    grape: "Grapes and raisins can cause kidney failure in dogs.",
    raisin: "Raisins can cause kidney failure in dogs.",
    onion: "Onions contain compounds that damage red blood cells in dogs.",
    garlic: "Garlic is toxic to dogs and can cause anemia.",
    xylitol: "Xylitol is extremely toxic to dogs, causing liver failure.",
    avocado: "Avocado contains persin which can cause vomiting in dogs.",
    macadamia: "Macadamia nuts can cause weakness and vomiting in dogs.",
    alcohol: "Alcohol is extremely dangerous for dogs, even in small amounts.",
  };

  const safeFoods: Record<string, string> = {
    banana: "Bananas are a great low-calorie treat rich in potassium.",
    apple: "Apples are safe and a great source of vitamins A and C. Remove seeds.",
    carrot: "Carrots are excellent low-calorie snacks good for teeth.",
    blueberr: "Blueberries are packed with antioxidants and safe for dogs.",
    watermelon: "Watermelon is safe and hydrating. Remove seeds and rind.",
    chicken: "Plain cooked chicken is an excellent protein source for dogs.",
    rice: "Plain white rice is easy to digest and good for upset stomachs.",
    pumpkin: "Plain pumpkin is great for digestion and rich in fiber.",
    peanut: "Plain peanut butter (without xylitol) is safe in moderation.",
    "sweet potato": "Cooked sweet potato is nutritious and safe for dogs.",
    egg: "Cooked eggs are a great source of protein for dogs.",
  };

  for (const [food, explanation] of Object.entries(unsafeFoods)) {
    if (input.includes(food)) {
      return {
        status: "Unsafe",
        explanation,
        actions: [
          "Do not feed this to your dog",
          "If ingested, contact your vet immediately",
          "Keep this food out of your dog's reach",
        ],
      };
    }
  }

  for (const [food, explanation] of Object.entries(safeFoods)) {
    if (input.includes(food)) {
      return {
        status: "Safe",
        explanation,
        actions: [
          "Feed in moderation as a treat",
          "Start with small amounts to check for allergies",
          "Always wash and prepare properly",
        ],
      };
    }
  }

  return {
    status: "Limited",
    explanation:
      "We don't have specific data on this food. When in doubt, consult your veterinarian before feeding new foods to your dog.",
    actions: [
      "Check with your vet before feeding",
      "Start with a very small amount if vet approves",
      "Watch for any adverse reactions for 24 hours",
    ],
  };
}

function getEmergencyFallback(input: string): DogAdviceResponse {
  if (input.includes("chocolate")) {
    return {
      status: "Urgent",
      explanation:
        "Chocolate ingestion can be life-threatening depending on the amount and type consumed. Dark chocolate is the most dangerous.",
      actions: [
        "Note the type and amount of chocolate eaten",
        "Do NOT induce vomiting unless directed by a vet",
        "Call your vet or pet poison hotline immediately",
        "Bring the chocolate packaging to the vet",
      ],
    };
  }

  if (input.includes("vomit")) {
    return {
      status: "Monitor",
      explanation:
        "Occasional vomiting can be normal, but persistent vomiting needs attention. Look for blood, unusual color, or foreign objects.",
      actions: [
        "Withhold food for 12 hours but provide small sips of water",
        "Check for signs of dehydration (dry gums, lethargy)",
        "See a vet if vomiting persists beyond 24 hours",
        "See a vet immediately if there is blood in vomit",
      ],
    };
  }

  if (input.includes("not eating") || input.includes("won't eat")) {
    return {
      status: "Monitor",
      explanation:
        "Loss of appetite can be caused by stress, dental issues, or illness. A healthy dog can safely skip a meal occasionally.",
      actions: [
        "Check for dental problems or mouth pain",
        "Try warming the food slightly to enhance smell",
        "See a vet if not eating for more than 48 hours",
        "Watch for other symptoms like lethargy or vomiting",
      ],
    };
  }

  return {
    status: "Urgent",
    explanation:
      "When in doubt about your dog's health, it's always best to consult a veterinarian. Don't wait if your dog seems in distress.",
    actions: [
      "Stay calm and keep your dog calm",
      "Note all symptoms and when they started",
      "Call your vet or emergency animal hospital",
      "Have your vet's number saved for emergencies",
    ],
  };
}

function getBehaviorFallback(input: string): DogAdviceResponse {
  if (input.includes("bark")) {
    return {
      status: "Normal",
      explanation:
        "Barking is a natural form of communication. Excessive barking usually indicates boredom, anxiety, or territorial behavior.",
      actions: [
        "Identify the trigger (strangers, other dogs, boredom)",
        "Increase daily exercise and mental stimulation",
        "Use positive reinforcement to reward quiet behavior",
      ],
    };
  }

  if (input.includes("bite") || input.includes("aggress")) {
    return {
      status: "Attention Needed",
      explanation:
        "Biting or aggression can stem from fear, pain, or lack of socialization. This behavior should be addressed promptly.",
      actions: [
        "Rule out pain or medical issues with your vet",
        "Avoid punishing — it can worsen aggression",
        "Consult a certified dog behaviorist",
      ],
    };
  }

  if (input.includes("anxious") || input.includes("anxiety") || input.includes("scared")) {
    return {
      status: "Attention Needed",
      explanation:
        "Anxiety in dogs can manifest as panting, pacing, destructive behavior, or hiding. It's often triggered by separation, loud noises, or changes.",
      actions: [
        "Create a safe, quiet space for your dog",
        "Try calming aids (thunder shirt, white noise)",
        "Gradually desensitize to triggers with positive rewards",
      ],
    };
  }

  return {
    status: "Normal",
    explanation:
      "Dog behavior can have many causes. Understanding the context helps identify the reason. Most behaviors are normal canine communication.",
    actions: [
      "Observe when and where the behavior occurs",
      "Ensure your dog gets adequate exercise daily",
      "Consider consulting a professional dog trainer",
    ],
  };
}

function getFeedingFallback(_input: string): DogAdviceResponse {
  return {
    status: "Recommendation",
    explanation:
      "As a general guideline, most adult dogs need about 2-3% of their body weight in food daily. Puppies need more frequent, smaller meals.",
    actions: [
      "Small dogs (<20 lbs): ¾ – 1½ cups per day",
      "Medium dogs (20-50 lbs): 1½ – 2½ cups per day",
      "Large dogs (50+ lbs): 2½ – 4 cups per day",
      "Split into 2 meals per day for adults, 3-4 for puppies",
    ],
  };
}
