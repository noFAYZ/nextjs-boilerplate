export interface TemplateCategory {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    categoryType: 'TRANSACTION' | 'ENVELOPE';
    cycleType?: string;
    purpose?: string[];
  }
  
export interface TemplateGroup {
    name: string;
    description: string;
    sortOrder: number;
    categories: TemplateCategory[];
  }
  

  export const CATEGORIES: TemplateGroup[] =  [
    // ===========================================
    // HOUSING & ESSENTIALS
    // ===========================================
    {
      name: 'Housing & Essentials',
      description: 'Fixed housing and essential utilities',
      sortOrder: 1,
      categories: [
        {
          name: 'Rent/Mortgage',
          description: 'Housing payment',
          icon: '🏠',
          color: '#8B4513',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Electricity',
          description: 'Electric bills',
          icon: '⚡',
          color: '#FFD700',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Gas/Water',
          description: 'Gas and water bills',
          icon: '💧',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Internet & Phone',
          description: 'Internet, mobile, landline',
          icon: '📱',
          color: '#1E90FF',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Home Insurance',
          description: 'Homeowners or renters insurance',
          icon: '🏡',
          color: '#DC143C',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Property Tax',
          description: 'Property taxes',
          icon: '📋',
          color: '#696969',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'HOA Fees',
          description: 'Homeowners association fees',
          icon: '🏢',
          color: '#A0522D',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // FOOD & GROCERIES
    // ===========================================
    {
      name: 'Food & Groceries',
      description: 'Food shopping and dining',
      sortOrder: 2,
      categories: [
        {
          name: 'Groceries',
          description: 'Grocery store shopping',
          icon: '🛒',
          color: '#228B22',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Dining Out',
          description: 'Restaurants and takeout',
          icon: '🍽️',
          color: '#FF6347',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Coffee & Snacks',
          description: 'Coffee shops, snacks, quick bites',
          icon: '☕',
          color: '#CD853F',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Work Lunches',
          description: 'Lunch at work or packed',
          icon: '🥗',
          color: '#90EE90',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // TRANSPORTATION
    // ===========================================
    {
      name: 'Transportation',
      description: 'Vehicle and commute expenses',
      sortOrder: 3,
      categories: [
        {
          name: 'Car Payment',
          description: 'Vehicle loan payment',
          icon: '🚗',
          color: '#DC143C',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Gas/Fuel',
          description: 'Gasoline and fuel',
          icon: '⛽',
          color: '#FF8C00',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Car Maintenance',
          description: 'Oil changes, repairs, service',
          icon: '🔧',
          color: '#696969',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Car Insurance',
          description: 'Auto insurance premiums',
          icon: '🛡️',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Registration & License',
          description: 'Vehicle registration and license',
          icon: '📇',
          color: '#2F4F4F',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Public Transit',
          description: 'Bus, train, metro passes',
          icon: '🚌',
          color: '#20B2AA',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Parking',
          description: 'Parking fees and tolls',
          icon: '🅿️',
          color: '#808080',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // INSURANCE
    // ===========================================
    {
      name: 'Insurance',
      description: 'Insurance policies and premiums',
      sortOrder: 4,
      categories: [
        {
          name: 'Health Insurance',
          description: 'Medical insurance premiums',
          icon: '🏥',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Life Insurance',
          description: 'Life insurance premiums',
          icon: '💚',
          color: '#3CB371',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Disability Insurance',
          description: 'Disability coverage',
          icon: '♿',
          color: '#9370DB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // HEALTHCARE & MEDICAL
    // ===========================================
    {
      name: 'Healthcare & Medical',
      description: 'Medical and health expenses',
      sortOrder: 5,
      categories: [
        {
          name: 'Doctor Visits',
          description: 'Doctor appointments and visits',
          icon: '👨‍⚕️',
          color: '#FF1493',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Prescriptions',
          description: 'Medications and prescriptions',
          icon: '💊',
          color: '#FF6347',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Dental Care',
          description: 'Dental appointments and cleaning',
          icon: '🦷',
          color: '#FFFFFF',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Eye Care',
          description: 'Optometrist, glasses, contacts',
          icon: '👁️',
          color: '#87CEEB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Therapy & Counseling',
          description: 'Mental health services',
          icon: '🧠',
          color: '#9370DB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // PERSONAL & SELF-CARE
    // ===========================================
    {
      name: 'Personal & Self-Care',
      description: 'Personal grooming and wellness',
      sortOrder: 6,
      categories: [
        {
          name: 'Gym & Fitness',
          description: 'Gym membership, fitness classes',
          icon: '💪',
          color: '#FF4500',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Haircut & Salon',
          description: 'Haircuts and salon services',
          icon: '✂️',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Clothing & Shoes',
          description: 'Clothes, shoes, and accessories',
          icon: '👕',
          color: '#FF1493',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Beauty & Cosmetics',
          description: 'Makeup, skincare, beauty products',
          icon: '💄',
          color: '#FFB6C1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // ENTERTAINMENT & HOBBIES
    // ===========================================
    {
      name: 'Entertainment & Hobbies',
      description: 'Entertainment and leisure activities',
      sortOrder: 7,
      categories: [
        {
          name: 'Streaming Services',
          description: 'Netflix, Hulu, Disney+, etc.',
          icon: '📺',
          color: '#FF6347',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Movies & Concerts',
          description: 'Movie tickets and live events',
          icon: '🎬',
          color: '#9370DB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Gaming',
          description: 'Video games and gaming subscriptions',
          icon: '🎮',
          color: '#32CD32',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Hobbies & Crafts',
          description: 'Hobby supplies and activities',
          icon: '🎨',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Sports & Recreation',
          description: 'Sports equipment and activities',
          icon: '⚽',
          color: '#228B22',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Books & Learning',
          description: 'Books, courses, educational content',
          icon: '📚',
          color: '#8B4513',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // KIDS & FAMILY
    // ===========================================
    {
      name: 'Kids & Family',
      description: 'Family and childcare expenses',
      sortOrder: 8,
      categories: [
        {
          name: 'Childcare',
          description: 'Daycare and nanny services',
          icon: '👶',
          color: '#FFB6C1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'School Tuition',
          description: 'School and tuition fees',
          icon: '🎓',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'School Supplies',
          description: 'Books and school supplies',
          icon: '📓',
          color: '#DC143C',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Activities & Classes',
          description: 'Sports, music, dance classes',
          icon: '🎵',
          color: '#9370DB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Children Clothing',
          description: 'Kids clothes and shoes',
          icon: '👶👕',
          color: '#FFD700',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Child Support',
          description: 'Child support payments',
          icon: '👨‍👧',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // PETS
    // ===========================================
    {
      name: 'Pets',
      description: 'Pet care and expenses',
      sortOrder: 9,
      categories: [
        {
          name: 'Pet Food',
          description: 'Food and treats for pets',
          icon: '🍖',
          color: '#8B4513',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Vet Care',
          description: 'Veterinary visits and treatment',
          icon: '🐾',
          color: '#DC143C',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Pet Grooming',
          description: 'Grooming and bathing',
          icon: '🐕',
          color: '#FFB6C1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Pet Insurance',
          description: 'Pet health insurance',
          icon: '🛡️',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Pet Supplies',
          description: 'Toys, beds, and pet supplies',
          icon: '🎾',
          color: '#32CD32',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // SAVINGS & GOALS
    // ===========================================
    {
      name: 'Savings & Goals',
      description: 'Saving for future goals',
      sortOrder: 10,
      categories: [
        {
          name: 'Emergency Fund',
          description: 'Emergency savings buffer',
          icon: '🆘',
          color: '#FF4500',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'General Savings',
          description: 'General savings account',
          icon: '🏦',
          color: '#006400',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Down Payment',
          description: 'Saving for down payment on home',
          icon: '🏡',
          color: '#8B4513',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'Car Fund',
          description: 'Saving for next car',
          icon: '🚗',
          color: '#DC143C',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'Vacation',
          description: 'Travel and vacation fund',
          icon: '✈️',
          color: '#1E90FF',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'Wedding',
          description: 'Wedding expenses fund',
          icon: '💒',
          color: '#FFB6C1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'Education Fund',
          description: 'College and education savings',
          icon: '🎓',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation', 'goal-tracking'],
        },
        {
          name: 'Retirement',
          description: 'Retirement savings',
          icon: '👴',
          color: '#FFD700',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // GIFTS & CELEBRATIONS
    // ===========================================
    {
      name: 'Gifts & Celebrations',
      description: 'Gifts and special occasions',
      sortOrder: 11,
      categories: [
        {
          name: 'Gifts',
          description: 'Gifts for family and friends',
          icon: '🎁',
          color: '#FFD700',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Holidays',
          description: 'Holiday spending and decorations',
          icon: '🎄',
          color: '#FF6347',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Birthdays',
          description: 'Birthday celebrations',
          icon: '🎂',
          color: '#FFB6C1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Anniversaries',
          description: 'Anniversary celebrations',
          icon: '💕',
          color: '#FF1493',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Charitable Giving',
          description: 'Charity and donations',
          icon: '🤝',
          color: '#32CD32',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // HOME & MAINTENANCE
    // ===========================================
    {
      name: 'Home & Maintenance',
      description: 'Home repairs and maintenance',
      sortOrder: 12,
      categories: [
        {
          name: 'Home Repairs',
          description: 'General repairs and fixes',
          icon: '🔨',
          color: '#696969',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Home Improvements',
          description: 'Renovations and upgrades',
          icon: '🏗️',
          color: '#A9A9A9',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Lawn & Garden',
          description: 'Yard work and gardening',
          icon: '🌱',
          color: '#228B22',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Household Supplies',
          description: 'Cleaning and household items',
          icon: '🧹',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Furniture',
          description: 'Furniture and home furnishings',
          icon: '🛋️',
          color: '#8B4513',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // DEBT PAYMENTS
    // ===========================================
    {
      name: 'Debt Payments',
      description: 'Loan and debt payments',
      sortOrder: 13,
      categories: [
        {
          name: 'Credit Card Payment',
          description: 'Credit card payments',
          icon: '💳',
          color: '#4169E1',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Student Loans',
          description: 'Student loan payments',
          icon: '🎓',
          color: '#9370DB',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Personal Loans',
          description: 'Personal loan payments',
          icon: '📊',
          color: '#696969',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
        {
          name: 'Medical Debt',
          description: 'Medical bills and debt',
          icon: '🏥',
          color: '#FF69B4',
          categoryType: 'ENVELOPE',
          cycleType: 'MONTHLY',
          purpose: ['budgeting', 'allocation'],
        },
      ],
    },
  
    // ===========================================
    // INCOME TRACKING
    // ===========================================
    {
      name: 'Income',
      description: 'All income sources for tracking',
      sortOrder: 14,
      categories: [
        {
          name: 'Primary Income',
          description: 'Main employment salary',
          icon: '💼',
          color: '#32CD32',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Freelance Income',
          description: 'Freelance and contract work',
          icon: '💻',
          color: '#3CB371',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Side Gigs',
          description: 'Side projects and gigs',
          icon: '🚀',
          color: '#32CD32',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Investment Income',
          description: 'Dividends, interest, capital gains',
          icon: '📈',
          color: '#7FFF00',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Bonus & Commissions',
          description: 'Work bonuses and commissions',
          icon: '🎉',
          color: '#FFD700',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Refunds & Reimbursements',
          description: 'Tax refunds and reimbursements',
          icon: '💰',
          color: '#90EE90',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
        {
          name: 'Gifts & Transfers In',
          description: 'Money received as gifts',
          icon: '💝',
          color: '#00CED1',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
      ],
    },
  
    // ===========================================
    // TRANSFERS & ADJUSTMENTS
    // ===========================================
    {
      name: 'Transfers & Adjustments',
      description: 'Internal transfers and adjustments',
      sortOrder: 15,
      categories: [
        {
          name: 'Transfer to Savings',
          description: 'Money moving to savings',
          icon: '➡️',
          color: '#228B22',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'internal-transfer'],
        },
        {
          name: 'Transfer from Savings',
          description: 'Money coming from savings',
          icon: '⬅️',
          color: '#FFD700',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'internal-transfer'],
        },
        {
          name: 'Transfer to Investments',
          description: 'Money moving to investments',
          icon: '📈',
          color: '#32CD32',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'internal-transfer'],
        },
        {
          name: 'Transfer from Investments',
          description: 'Money coming from investments',
          icon: '💹',
          color: '#FFB6C1',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'internal-transfer'],
        },
        {
          name: 'Account Transfer',
          description: 'Transfers between accounts',
          icon: '🔄',
          color: '#808080',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'internal-transfer'],
        },
        {
          name: 'Uncategorized',
          description: 'Uncategorized transactions',
          icon: '❓',
          color: '#A9A9A9',
          categoryType: 'TRANSACTION',
          purpose: ['tracking', 'classification'],
        },
      ],
    },
      ]