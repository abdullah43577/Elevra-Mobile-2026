export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company_slug: string | null;
  email: string;
  bio: string | null;
  //   role: DashboardRole;
  resume: string | null;
  resumeId: string | null;
  profile_pic: string | null;
  phone_no: string | null;
  official_phone: string | null;
  organisation_name: string | null;
  organisation_size: string | null;
  postal_code: string | null;
  has_validated_email: boolean;
  googleId: string | null;
  failedLoginAttempts: number;
  isLocked: boolean;
  isTemporary: boolean;
  expiresAt: string | null;
  lastLogin: string;
  account_status: string;
  stripe_customer_id: string | null;
  //   subscription_tier: SubscriptionTiers;
  subscription_status: string;
  subscription_start: string | null;
  subscription_end: string | null;
  is_trial: boolean;
  last_subscription_tier: string | null;
  last_subscription_end: string | null;
  grace_period: string;
  createdAt: string;
  updatedAt: string;
  job_post_max_count: number | "unlimited"; // max job posts allowed based on subscription
  //   resume_json: ResumeFormValues | null; // parsed resume data in JSON format
  organisation_address: string | null;
  //   jobPreferences: {
  //     categories: JobCategory[];
  //     experience_level: ExperienceLevel | null;
  //     preferred_skills: string[];
  //   } | null;
  suiteUserId: string | null;
  gender: string | null;
  work_country: string | null;
  work_state: string | null;
  timezone: string | null;
}
