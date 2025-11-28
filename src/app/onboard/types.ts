export enum StepType {
  WELCOME = 'WELCOME',
  DIAGNOSIS = 'DIAGNOSIS',
  DEEP_DIVE = 'DEEP_DIVE',
  OFFER_FIT = 'OFFER_FIT',
  BLUEPRINT = 'BLUEPRINT',
  ONBOARD = 'ONBOARD',
}

export interface OnboardingData {
  clientName: string;
  email: string;
  mainStruggle: string;
  triggerEvent: string;
  whys: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
    level6: string;
    level7: string;
  };
  selectedOfferInterest: string;
  budgetCommitment: string;
  aiAnalysis: {
    archetype: string;
    strategy: string;
    personalizedMessage: string;
  } | null;
}

export const INITIAL_DATA: OnboardingData = {
  clientName: '',
  email: '',
  mainStruggle: '',
  triggerEvent: '',
  whys: {
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
    level6: '',
    level7: '',
  },
  selectedOfferInterest: '',
  budgetCommitment: '',
  aiAnalysis: null,
};