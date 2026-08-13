/**
 * Lighting estimate calculator.
 *
 * Derives approximate linear footage from install preferences
 * and produces a low/mid/high price range + monthly payment.
 *
 * Constants are tuned to Glow's market — adjust as needed.
 */

const PRICE_PER_LF_LOW = 45;
const PRICE_PER_LF_MID = 50;
const PRICE_PER_LF_HIGH = 55;

const FINANCING_TERM_MONTHS = 21; // Enhancify 0% promo

/** Base LF by story count */
const STORY_LF: Record<string, number> = {
  "1": 80,
  "2": 130,
  "3": 180,
};

/** Multiplier by coverage */
const COVERAGE_MULT: Record<string, number> = {
  front: 0.4,
  "front-sides": 0.7,
  full: 1.0,
};

/** Multiplier by gable complexity */
const GABLE_MULT: Record<string, number> = {
  simple: 1.0,
  average: 1.15,
  complex: 1.3,
  unsure: 1.15,
};

/** Multiplier for garage */
const GARAGE_MULT: Record<string, number> = {
  yes: 1.1,
  no: 1.0,
  detached: 1.0,
};

export interface EstimateInput {
  stories: string;
  coverage: string;
  gables: string;
  garage: string;
}

export interface Estimate {
  linearFeet: number;
  low: number;
  mid: number;
  high: number;
  monthlyLow: number;
  monthlyMid: number;
  monthlyHigh: number;
  financingTerm: number;
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const baseLF = STORY_LF[input.stories] ?? 130;
  const coverageMult = COVERAGE_MULT[input.coverage] ?? 0.7;
  const gableMult = GABLE_MULT[input.gables] ?? 1.15;
  const garageMult = GARAGE_MULT[input.garage] ?? 1.0;

  const linearFeet = Math.round(baseLF * coverageMult * gableMult * garageMult);

  const low = Math.round(linearFeet * PRICE_PER_LF_LOW);
  const mid = Math.round(linearFeet * PRICE_PER_LF_MID);
  const high = Math.round(linearFeet * PRICE_PER_LF_HIGH);

  return {
    linearFeet,
    low,
    mid,
    high,
    monthlyLow: Math.ceil(low / FINANCING_TERM_MONTHS),
    monthlyMid: Math.ceil(mid / FINANCING_TERM_MONTHS),
    monthlyHigh: Math.ceil(high / FINANCING_TERM_MONTHS),
    financingTerm: FINANCING_TERM_MONTHS,
  };
}
