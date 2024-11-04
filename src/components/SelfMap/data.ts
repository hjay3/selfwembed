export const subCategories: Record<string, string[]> = {
  "Creative Expression": [
    "Artistic Projects",
    "Innovation Methods",
    "Creative Process",
    "Inspiration Sources",
    "Artistic Community"
  ],
  "Technical Mastery": [
    "Core Skills",
    "Learning Path",
    "Problem Solving",
    "Technical Tools",
    "Knowledge Sharing"
  ],
  "Community Building": [
    "Network Growth",
    "Engagement",
    "Support Systems",
    "Collaboration",
    "Impact Measurement"
  ],
  "Personal Growth": [
    "Learning Goals",
    "Self-Reflection",
    "Habits",
    "Mindfulness",
    "Future Vision"
  ],
  "Leadership": [
    "Team Building",
    "Vision Setting",
    "Mentorship",
    "Decision Making",
    "Strategic Planning"
  ]
};

export const generateRelatedData = (originalCategory: string) => {
  const data: Record<string, Record<string, any>> = {
    [`${originalCategory} Detail Map`]: {}
  };

  const categories = subCategories[originalCategory] ||
    ["Aspect 1", "Aspect 2", "Aspect 3", "Aspect 4", "Aspect 5"];

  categories.forEach(category => {
    const strength = Math.floor(Math.random() * 4) + 7;
    data[`${originalCategory} Detail Map`][category] = {
      Strength: strength,
      Title: `${category} Specialist`,
      Beliefs: `Mastering ${category.toLowerCase()} leads to excellence`,
      Style: `Focused on ${category.toLowerCase()} development`
    };
  });

  return data;
};