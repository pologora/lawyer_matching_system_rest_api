export const specializations = [
  'Family Law',
  'Criminal Law',
  'Corporate Law',
  'Labor Law',
  'Tax Law',
  'Real Estate Law',
  'Intellectual Property Law',
  'Environmental Law',
  'Immigration Law',
  'Personal Injury Law',
  'Bankruptcy Law',
  'Civil Rights Law',
  'Health Law',
  'Elder Law',
  'Entertainment Law',
  'Sports Law',
  'International Law',
  'Other',
] as const;

export type Specialization = (typeof specializations)[number];
export type SpecializationArray = typeof specializations;
