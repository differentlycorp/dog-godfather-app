export interface Dog {
  id: string;
  name: string;
  description: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  status: 'needs_sponsor' | 'partially_sponsored' | 'fully_sponsored';
  targetMonthlySponsorship: number; // e.g., €30/month
  currentMonthlySponsorship: number; // e.g., €10/month
  mainImageUrl: string;
  medicalNeeds?: string;
  createdAt: string;
}

export interface Sponsorship {
  id: string;
  dogId: string;
  sponsorName: string;
  sponsorEmail: string;
  monthlyAmount: number;
  status: 'pending' | 'active' | 'cancelled';
  startDate: string;
  createdAt: string;
}

export interface DogUpdate {
  id: string;
  dogId: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}
