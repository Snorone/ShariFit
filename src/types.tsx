export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  type: "strength" | "cardio";
  equipment: string[];
  createdBy: string;
  approved: boolean;
  createdAt: any; // Firestore Timestamp
  approvedBy?: string;
  approvedAt?: any;
}

export interface Mealsen {
  id: string;
  name: string;
  description: string;
  calories: number;
  createdBy: string;
}

export interface NewMeal {
  name: string;
  description: string;
  calories: number;
}
