import { Product, PrimaryCategory, Currency } from '../types';

export const PRIMARY_CATEGORIES: {
  id: PrimaryCategory;
  name: string;
  tagline: string;
  description: string;
  accent: string;
}[] = [
  {
    id: 'ai',
    name: 'AI',
    tagline: 'Build with AI. Create more. Earn smarter.',
    description: 'Systematic frameworks and actionable blueprints for integrating generative tools and autonomous workflows into high-leverage digital income.',
    accent: '#D4AF37',
  },
  {
    id: 'finance',
    name: 'FINANCE',
    tagline: 'Understand money. Build better financial habits.',
    description: 'Structured methodologies for personal capital management, transparent budgeting, disciplined investing, and multiple income streams.',
    accent: '#E5C07B',
  },
  {
    id: 'communication',
    name: 'COMMUNICATION',
    tagline: 'Speak clearly. Communicate confidently.',
    description: 'Practical guides to vocal poise, executive clarity, conflict resolution, and authoritative presentation in high-stakes environments.',
    accent: '#C9A227',
  },
];

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'GBP (£)' },
};

export const formatPrice = (amountInINR: number, currency: Currency): string => {
  const { symbol, rate } = CURRENCY_RATES[currency];
  const converted = Math.round(amountInINR * rate);
  if (currency === 'INR') {
    return `${symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${symbol}${converted.toLocaleString('en-US')}`;
};

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // CATEGORY 1: AI
  // ==========================================
  {
    id: 'ai-income-blueprint',
    title: 'AI Income Blueprint',
    category: 'ai',
    shortDescription: 'A systematic strategy for identifying, validating, and executing digital income models powered by modern artificial intelligence.',
    fullDescription: 'The AI Income Blueprint outlines realistic, non-hype methodologies for leveraging generative models to create viable digital services, specialized consulting offers, and automated workflows. Rather than promising unrealistic passive shortcuts, it focuses on real operational leverage: reducing manual production time, improving analytical synthesis, and positioning technical services for clients who need modern execution.',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital eBook (PDF & EPUB)',
    whatsIncluded: [
      'Comprehensive Strategy Guide (PDF & EPUB)',
      '12 Ready-to-use Workflow Execution Frameworks',
      'Client Positioning & Service Offering Templates',
      'Digital Architecture Checklist'
    ],
    whatYoullLearn: [
      'How to evaluate real market demand for AI-assisted services',
      'Prompt structuring methods that deliver reliable client deliverables',
      'How to structure pricing and scope for AI-augmented projects',
      'Frameworks for continuous skill updating as models improve'
    ],
    whoItsFor: [
      'Digital freelancers seeking to accelerate deliverable speed',
      'Consultants looking to integrate AI into existing service models',
      'Knowledge workers preparing for modern automated workflows'
    ],
    chapters: [
      { title: 'Chapter 1: The Economics of Generative Leverage', description: 'Deconstructing where margin exists in AI-assisted work.' },
      { title: 'Chapter 2: Identifying High-Demand Micro-Services', description: 'Focusing on business problems rather than tools.' },
      { title: 'Chapter 3: Structuring Reliable Client Deliverables', description: 'Quality control protocols and human-in-the-loop validation.' },
      { title: 'Chapter 4: Scalable Delivery Systems', description: 'Building reproducible SOPs with modern APIs.' }
    ],
    features: [
      'Step-by-step practical implementation',
      'DRM-free universal PDF and EPUB formats',
      'Interactive workflow schematics'
    ],
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-ai-income-blueprint.pdf'
  },
  {
    id: 'chatgpt-money-machine',
    title: 'ChatGPT Money Machine',
    category: 'ai',
    shortDescription: 'Practical prompting architectures and workflows for turning conversational AI into efficient commercial outputs.',
    fullDescription: 'A hands-on manual detailing how to move beyond basic questions to build structured prompting systems that generate research summaries, sales copy frameworks, operational reports, and structured draft content. This guide covers prompt sequencing, persona calibration, few-shot prompting, and validation checks to ensure professional-grade accuracy.',
    price: 999,
    originalPrice: 1699,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Guide (PDF & Markdown Library)',
    whatsIncluded: [
      'Complete Practical Guidebook (PDF & EPUB)',
      'Curated Prompt Library (75+ structured multi-turn prompts)',
      'Output Verification Guide for commercial work'
    ],
    whatYoullLearn: [
      'Multi-turn prompting structures that avoid hallucinated data',
      'How to establish strict role, tone, and format parameters',
      'Creating research digests from large blocks of text',
      'Drafting business proposals, emails, and presentations'
    ],
    whoItsFor: [
      'Content creators, writers, and digital marketers',
      'Business operators looking to streamline communications',
      'Students and researchers needing rapid synthesis methods'
    ],
    chapters: [
      { title: 'Chapter 1: The Prompt Engineering Foundation', description: 'Role assignment, context setting, and constraint definition.' },
      { title: 'Chapter 2: Research & Information Synthesis', description: 'Distilling dense source materials into actionable summaries.' },
      { title: 'Chapter 3: Commercial Writing Systems', description: 'Drafting emails, proposals, memos, and website copy.' },
      { title: 'Chapter 4: Quality Control & Editing Standards', description: 'Removing repetitive syntax and ensuring authenticity.' }
    ],
    features: [
      'Exact copy-paste prompt templates',
      'Markdown format for immediate desktop use',
      'No fluff or generalized filler'
    ],
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-chatgpt-money-machine.pdf'
  },
  {
    id: 'ai-tools-for-earning',
    title: 'AI Tools for Earning',
    category: 'ai',
    shortDescription: 'A curated field guide to the top production-ready generative tools, their specific use cases, and cost-to-output ratios.',
    fullDescription: 'With hundreds of AI tools launching monthly, identifying which software creates tangible business value is difficult. This field manual reviews the top practical tools across text, voice, visual generation, data extraction, and automation. It analyzes pricing models, practical output quality, and specific use cases so you only invest in tools that deliver positive ROI.',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Manual & Interactive Directory',
    whatsIncluded: [
      'Curated Tool Assessment Manual (PDF)',
      'Tool Evaluation Scoring Matrix (Spreadsheet)',
      'Integration Guide for Common Workflows'
    ],
    whatYoullLearn: [
      'Which categories of tools produce sellable commercial outputs',
      'How to chain tools together without expensive custom code',
      'Evaluating cost-per-generation versus billable client value',
      'Avoiding redundant software subscriptions'
    ],
    whoItsFor: [
      'Freelancers looking for production software recommendations',
      'Small agency owners seeking productivity improvements',
      'Independent creators exploring multimodal tools'
    ],
    chapters: [
      { title: 'Chapter 1: The Modern Tool Landscape', description: 'Separating marketing claims from actual utility.' },
      { title: 'Chapter 2: High-Torque Text & Analysis Engines', description: 'Best models for extraction, editing, and coding.' },
      { title: 'Chapter 3: Audio & Visual Generation for Commercial Use', description: 'Licensing, copyright, and visual production.' },
      { title: 'Chapter 4: Automation & Integration Pipelines', description: 'Connecting tools into frictionless workflows.' }
    ],
    features: [
      'Unbiased commercial tool reviews',
      'ROI breakdown per tool category',
      'Clean PDF and spreadsheet format'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-ai-tools-for-earning.pdf'
  },
  {
    id: 'ai-freelancing-starter-kit',
    title: 'AI Freelancing Starter Kit',
    category: 'ai',
    shortDescription: 'Templates, contract clauses, portfolio guidelines, and client management protocols for modern AI-assisted freelancers.',
    fullDescription: 'The comprehensive toolkit for launching or upgrading a freelance practice with AI tools. It covers client transparency, intellectual property expectations, scoping documents, proposal templates, and client onboarding workflows. Designed to help independent professionals position their AI proficiency as an asset of speed and reliability.',
    price: 1299,
    originalPrice: 2199,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Toolkit (PDF + Document Templates)',
    whatsIncluded: [
      'Freelance Operations Field Guide (PDF)',
      'Client Service Agreement Template with AI Transparency Clauses',
      'Project Scope & Deliverable Estimate Worksheet',
      'Proposal & Pitch Decks'
    ],
    whatYoullLearn: [
      'How to discuss AI usage with clients professionally and ethically',
      'Setting milestone-based pricing rather than hourly billing',
      'Building a portfolio demonstrating real business impact',
      'Handling revisions and technical limitations effectively'
    ],
    whoItsFor: [
      'Starting freelancers wanting structured operational templates',
      'Experienced contractors transitioning to value-based pricing',
      'Solopreneurs seeking professional client documentation'
    ],
    chapters: [
      { title: 'Chapter 1: The Value-Based Freelance Model', description: 'Shifting from hours worked to outcomes delivered.' },
      { title: 'Chapter 2: Professional Client Proposals', description: 'Writing proposals that address client risk directly.' },
      { title: 'Chapter 3: Contracts & Legal Transparency', description: 'Addressing data privacy, confidentiality, and copyright.' },
      { title: 'Chapter 4: Project Delivery & Retention', description: 'Standard operating procedures for client satisfaction.' }
    ],
    features: [
      'Ready-to-use contract and proposal documents',
      'Ethical guidelines for commercial client work',
      'Universal digital formats'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-ai-freelancing-starter-kit.zip'
  },
  {
    id: 'digital-products-with-ai',
    title: 'Digital Products With AI',
    category: 'ai',
    shortDescription: 'A practical framework for researching, outlining, building, and launching informational digital products using AI as a synthesis partner.',
    fullDescription: 'Learn how to use AI as an accelerator throughout the digital product lifecycle—from analyzing market gaps and organizing curricula to structuring code templates and designing digital workbooks. Emphasizes personal domain expertise as the foundational core, using AI solely to accelerate the production and formatting stages.',
    price: 1199,
    originalPrice: 1999,
    discount: 40,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Guide & Launch Checklist (PDF)',
    whatsIncluded: [
      'Complete Digital Product Creation Blueprint (PDF)',
      'Product Idea Validation Matrix',
      'Packaging & Formatting Checklist',
      'Launch Sequence Framework'
    ],
    whatYoullLearn: [
      'How to validate customer interest before writing a single word',
      'Using AI to generate chapter outlines and exercise frameworks',
      'Maintaining an authentic, human voice throughout the publication',
      'Formatting professional PDF and digital assets cleanly'
    ],
    whoItsFor: [
      'Educators and professionals looking to package their knowledge',
      'Creators wanting to publish structured guides and templates',
      'Developers creating documentation and starter code packages'
    ],
    chapters: [
      { title: 'Chapter 1: Idea Validation & Audience Research', description: 'Confirming genuine demand before investing time.' },
      { title: 'Chapter 2: Structural Architecture & Curriculum', description: 'Outlining comprehensive guides and toolkits.' },
      { title: 'Chapter 3: The Human-in-the-Loop Writing Process', description: 'Ensuring voice, precision, and depth in every section.' },
      { title: 'Chapter 4: Distribution & Delivery Platforms', description: 'Setting up clean digital stores and delivery workflows.' }
    ],
    features: [
      'Clear step-by-step launch roadmap',
      'Focus on substantive quality over volume',
      'Direct downloadable files'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-digital-products-with-ai.pdf'
  },
  {
    id: 'novora-ai-income-bundle',
    title: 'NOVORA AI INCOME BUNDLE',
    category: 'ai',
    shortDescription: 'The complete compendium of all 5 NOVORA AI resources, blueprints, tool directories, and freelancing kits in one single package.',
    fullDescription: 'The ultimate AI knowledge collection from NOVORA. Contains full editions of AI Income Blueprint, ChatGPT Money Machine, AI Tools for Earning, AI Freelancing Starter Kit, and Digital Products With AI. Designed for operators who want a structured, complete library covering strategy, prompt engineering, software selection, client operations, and digital product creation.',
    price: 2999,
    originalPrice: 5895,
    discount: 49,
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Comprehensive Bundle (All 5 AI Publications)',
    whatsIncluded: [
      '1. AI Income Blueprint (Full Edition)',
      '2. ChatGPT Money Machine (Full Edition + Prompt Library)',
      '3. AI Tools for Earning (Manual + Scoring Matrix)',
      '4. AI Freelancing Starter Kit (Guide + All Contracts/Proposals)',
      '5. Digital Products With AI (Guide + Launch Checklists)',
      'Consolidated Master Index & Reading Path'
    ],
    whatYoullLearn: [
      'End-to-end knowledge from prompt syntax to client acquisition',
      'How to build repeatable service and product delivery pipelines',
      'Evaluating software costs and setting high-margin pricing',
      'Managing client relationships with transparency and professionalism'
    ],
    whoItsFor: [
      'Professionals committing to a comprehensive AI skill upgrade',
      'Freelancers and digital builders seeking all resources in one purchase',
      'Teams looking for shared training frameworks'
    ],
    chapters: [
      { title: 'Module 1: Strategy & Commercial Models', description: 'From the AI Income Blueprint.' },
      { title: 'Module 2: Prompt Systems & Output Quality', description: 'From the ChatGPT Money Machine.' },
      { title: 'Module 3: Software Selection & ROI', description: 'From AI Tools for Earning.' },
      { title: 'Module 4: Client Operations & Contracts', description: 'From the AI Freelancing Starter Kit.' },
      { title: 'Module 5: Product Creation & Launching', description: 'From Digital Products With AI.' }
    ],
    features: [
      'All 5 complete AI publications included',
      '49% bundle savings compared to individual purchase',
      'Instant access to all digital assets'
    ],
    isBundle: true,
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-ai-income-bundle.zip',
    badge: 'ALL-IN-ONE BUNDLE'
  },

  // ==========================================
  // CATEGORY 2: FINANCE
  // ==========================================
  {
    id: 'personal-finance-beginners',
    title: 'Personal Finance for Beginners',
    category: 'finance',
    shortDescription: 'A clear, honest guide to understanding bank accounts, emergency reserves, debt management, and compound interest fundamentals.',
    fullDescription: 'Designed for individuals seeking clarity in managing their everyday money. This guide cuts through complex financial jargon to explain how cash flows work, how to build a reliable emergency buffer, how credit cards and loans function, and how compound growth works over decades. Focuses on disciplined, realistic steps that anyone can take immediately.',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital eBook (PDF & EPUB)',
    whatsIncluded: [
      'Comprehensive Guidebook (PDF & EPUB)',
      'Personal Balance Sheet Worksheet (Excel & Sheets)',
      'Debt Payoff Priority Planner'
    ],
    whatYoullLearn: [
      'The foundational mechanics of cash flow and savings rate',
      'How to build an initial 3 to 6-month emergency reserve',
      'Strategies for systematically eliminating high-interest debt',
      'Understanding the mathematics of compound growth'
    ],
    whoItsFor: [
      'Early-career professionals setting up their first financial systems',
      'Anyone wanting an organized, non-intimidating overview of personal money',
      'Individuals looking to eliminate financial stress through order'
    ],
    chapters: [
      { title: 'Chapter 1: Demystifying Your Cash Flow', description: 'Where money actually goes each month.' },
      { title: 'Chapter 2: The Emergency Reserve Safety Net', description: 'Calculating, storing, and protecting your reserve fund.' },
      { title: 'Chapter 3: Dismantling Debt Efficiently', description: 'Snowball vs Avalanche payoff mathematics.' },
      { title: 'Chapter 4: The Psychology of Consistency', description: 'Building rules that survive unexpected expenses.' }
    ],
    features: [
      'No complex mathematical formulas required',
      'Practical worksheets and tracking templates',
      'Clear, accessible language throughout'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-personal-finance-beginners.pdf'
  },
  {
    id: 'budget-your-salary',
    title: 'How to Budget Your Salary',
    category: 'finance',
    shortDescription: 'A practical system for allocating your monthly paycheck without feeling deprived or constantly checking spreadsheets.',
    fullDescription: 'Tired of restrictive budgets that fail by the 15th of the month? This guide introduces allocation-based budgeting: categorizing fixed necessities, discretionary lifestyle, and automated savings the moment your paycheck arrives. It provides realistic budgeting percentages, methods for managing irregular expenses, and rules for guilt-free personal spending.',
    price: 699,
    originalPrice: 1199,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Guide & Spreadsheet System',
    whatsIncluded: [
      'Salary Allocation Guide (PDF & EPUB)',
      'Automated Paycheck Splitter Template (Sheets & Excel)',
      'Annual Recurring Expense Forecast Canvas'
    ],
    whatYoullLearn: [
      'How to implement the Pay-Yourself-First allocation framework',
      'Handling semi-annual and annual expenses smoothly',
      'Separating fixed commitments from flexible lifestyle choices',
      'Automating transfers so budgeting requires less than 15 minutes a month'
    ],
    whoItsFor: [
      'Salaried employees looking for an organized paycheck routine',
      'Couples wanting a unified, peaceful budgeting framework',
      'Anyone experiencing the paycheck-to-paycheck cycle'
    ],
    chapters: [
      { title: 'Chapter 1: The Anatomy of a Healthy Paycheck', description: 'Understanding real net income versus gross figures.' },
      { title: 'Chapter 2: The Allocation Percentage Model', description: 'Adapting fixed, savings, and discretionary buckets.' },
      { title: 'Chapter 3: Taming Irregular & Sinking Funds', description: 'Preparing for car repairs, festivals, and insurance.' },
      { title: 'Chapter 4: The 15-Minute Monthly Maintenance', description: 'Keeping the system on autopilot without stress.' }
    ],
    features: [
      'Pre-built automated spreadsheet formulas',
      'Universal PDF and spreadsheet files',
      'Real-world case studies with different income levels'
    ],
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-budget-your-salary.pdf'
  },
  {
    id: 'saving-investing-basics',
    title: 'Saving & Investing Basics',
    category: 'finance',
    shortDescription: 'Understanding the difference between capital preservation and capital growth, index funds, asset allocation, and long-term discipline.',
    fullDescription: 'An objective, educational overview of long-term wealth building. Explains index investing, diversified mutual funds, fixed-income instruments, inflation risks, and asset allocation across life stages. Emphasizes evidence-based investing principles rather than speculative day trading or market timing.',
    price: 999,
    originalPrice: 1699,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Educational Monograph (PDF & EPUB)',
    whatsIncluded: [
      'Educational Monograph (PDF & EPUB)',
      'Asset Allocation Decision Canvas',
      'Cost & Expense Ratio Impact Calculator'
    ],
    whatYoullLearn: [
      'The critical difference between saving cash and investing capital',
      'How broad-market index funds function and why low fees matter',
      'Understanding volatility versus permanent risk of loss',
      'Designing a long-term investment schedule based on your timeline'
    ],
    whoItsFor: [
      'Individuals ready to begin investing beyond standard savings accounts',
      'Long-term savers seeking disciplined, low-stress methodologies',
      'Anyone overwhelmed by confusing financial market commentary'
    ],
    chapters: [
      { title: 'Chapter 1: The Dual Enemies: Inflation and Inaction', description: 'Why cash in a drawer loses purchasing power.' },
      { title: 'Chapter 2: The Major Asset Classes Explained', description: 'Equities, debt, real estate, and government bonds.' },
      { title: 'Chapter 3: Index Funds and Passive Investing', description: 'The mathematical logic of owning the whole market.' },
      { title: 'Chapter 4: Asset Allocation Across Life Stages', description: 'Balancing risk tolerance with time horizon.' }
    ],
    features: [
      'Grounded in empirical financial science',
      'Zero stock-picking or get-rich schemes',
      'Readable, beautiful typography'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-saving-investing-basics.pdf'
  },
  {
    id: 'building-multiple-income-sources',
    title: 'Building Multiple Income Sources',
    category: 'finance',
    shortDescription: 'Strategic frameworks for developing secondary revenue streams without jeopardizing your primary career or burning out.',
    fullDescription: 'Relying on a single employer or single client carries inherent concentration risk. This publication provides an analytical framework for identifying your existing intellectual skills, packaging them into secondary consulting, freelancing, or digital products, and managing time so your primary career remains strong. Grounded in time-budgeting and gradual compounding.',
    price: 1299,
    originalPrice: 2199,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Strategy Playbook (PDF)',
    whatsIncluded: [
      'Strategic Playbook (PDF & EPUB)',
      'Skill Monetization Audit Canvas',
      'Time-Blocking & Energy Management Worksheet'
    ],
    whatYoullLearn: [
      'How to audit your current professional skills for secondary demand',
      'Different models: service-based vs product-based secondary income',
      'Managing energy and boundaries to avoid severe burnout',
      'Legal, ethical, and tax considerations for multiple revenue streams'
    ],
    whoItsFor: [
      'Professionals seeking greater financial resilience and autonomy',
      'Individuals wanting to diversify their income beyond one salary',
      'Entrepreneurs planning a gradual, risk-controlled career pivot'
    ],
    chapters: [
      { title: 'Chapter 1: The Concentration Risk of Single Income', description: 'Why diversified revenue creates mental peace.' },
      { title: 'Chapter 2: Auditing Your Monetizable Assets', description: 'Skills, connections, knowledge, and tools.' },
      { title: 'Chapter 3: Designing Your Second Stream', description: 'Choosing between consulting, teaching, or building.' },
      { title: 'Chapter 4: Time Management & Burnout Prevention', description: 'Protecting your health and primary commitments.' }
    ],
    features: [
      'Realistic timelines and expectations',
      'Actionable self-audit questions',
      'Universal format access'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-building-multiple-income-sources.pdf'
  },
  {
    id: 'money-habits-keep-you-poor',
    title: 'Money Habits That Keep You Poor',
    category: 'finance',
    shortDescription: 'An honest, psychological deconstruction of the subtle lifestyle traps, ego expenses, and subconscious habits that quietly drain wealth.',
    fullDescription: 'Wealth is rarely lost through massive disasters; it is usually drained through dozens of tiny, unnoticed habits. This candid book examines lifestyle inflation, status signaling, emotional retail therapy, ignoring recurring subscriptions, and letting short-term impulses sabotage long-term financial freedom. Offers practical replacement habits that build discipline effortlessly.',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Book (PDF & EPUB)',
    whatsIncluded: [
      'Full Digital Book (PDF & EPUB)',
      'Subconscious Spending Audit Checklist',
      'The 72-Hour Rule Implementation Guide'
    ],
    whatYoullLearn: [
      'Recognizing status spending that does not bring genuine satisfaction',
      'How lifestyle inflation quietly swallows every salary raise',
      'The psychological mechanisms of impulse purchasing online',
      'How to replace wasteful financial habits with empowering routines'
    ],
    whoItsFor: [
      'Anyone whose expenses seem to rise whenever their income increases',
      'Individuals wanting to cultivate mindful, deliberate spending',
      'Readers seeking an honest, non-judgmental look at financial behavior'
    ],
    chapters: [
      { title: 'Chapter 1: The Invisible Leaks', description: 'Small recurring drains that add up over years.' },
      { title: 'Chapter 2: The Trap of Impressing Strangers', description: 'Separating genuine personal joy from social signaling.' },
      { title: 'Chapter 3: Lifestyle Inflation Deconstructed', description: 'Why earning more doesn’t automatically make you wealthier.' },
      { title: 'Chapter 4: Behavioral Countermeasures', description: 'Systematic friction that stops impulsive spending.' }
    ],
    features: [
      'Psychologically grounded and empathetic',
      'Direct, scannable actionable advice',
      'Instant download in PDF and EPUB'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-money-habits-keep-you-poor.pdf'
  },
  {
    id: 'novora-money-mastery-bundle',
    title: 'NOVORA Money Mastery Bundle',
    category: 'finance',
    shortDescription: 'The core personal finance compendium containing all 5 foundational NOVORA finance publications and financial management worksheets.',
    fullDescription: 'The definitive financial education suite from NOVORA. Combines Personal Finance for Beginners, How to Budget Your Salary, Saving & Investing Basics, Building Multiple Income Sources, and Money Habits That Keep You Poor into one cohesive curriculum. Provides a complete roadmap from organizing your first paycheck to long-term asset building and revenue diversification.',
    price: 2499,
    originalPrice: 4595,
    discount: 45,
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Comprehensive Bundle (All 5 Finance Publications)',
    whatsIncluded: [
      '1. Personal Finance for Beginners (Full Edition + Worksheets)',
      '2. How to Budget Your Salary (Guide + Paycheck Splitter Template)',
      '3. Saving & Investing Basics (Monograph + Asset Allocation Canvas)',
      '4. Building Multiple Income Sources (Playbook + Audit Worksheet)',
      '5. Money Habits That Keep You Poor (Full Edition + Checklists)',
      'Consolidated Financial Health Dashboard (Sheets/Excel)'
    ],
    whatYoullLearn: [
      'A unified, structured system for every rupee earned, spent, and saved',
      'Budgeting, emergency fund construction, and debt elimination',
      'The fundamentals of index investing and risk management',
      'How to build sustainable secondary revenue without burnout'
    ],
    whoItsFor: [
      'Anyone seeking a complete, comprehensive overhaul of their finances',
      'Working professionals wanting an organized, non-hype financial system',
      'Families looking for a reliable, shared financial framework'
    ],
    chapters: [
      { title: 'Module 1: Foundational Financial Health', description: 'Cash flows, reserves, and debt management.' },
      { title: 'Module 2: The Salary Allocation System', description: 'Paycheck management and automated budgeting.' },
      { title: 'Module 3: Long-Term Wealth Principles', description: 'Asset classes, index funds, and compound growth.' },
      { title: 'Module 4: Revenue Diversification', description: 'Building second income streams with intention.' },
      { title: 'Module 5: Behavioral & Psychological Discipline', description: 'Mastering habits and eliminating lifestyle traps.' }
    ],
    features: [
      'All 5 complete finance publications included',
      '45% savings compared to individual prices',
      'Includes all calculation templates and worksheets'
    ],
    isBundle: true,
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-money-mastery-bundle.zip',
    badge: 'CORE FINANCE BUNDLE'
  },

  // ==========================================
  // CATEGORY 3: COMMUNICATION
  // ==========================================
  {
    id: 'speak-with-confidence',
    title: 'Speak With Confidence: A Practical Guide',
    category: 'communication',
    shortDescription: 'A direct, step-by-step handbook on overcoming speaking anxiety, finding your natural vocal authority, and delivering compelling messages.',
    fullDescription: 'Speaking with confidence is a learnable physical and psychological skill, not an innate personality trait. This practical guide deconstructs the physiological causes of speech anxiety, provides proven breathing and vocal exercises, and offers structured frameworks for answering impromptu questions, speaking up in meetings, and delivering persuasive presentations without nervous filler words.',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Handbook (PDF & EPUB)',
    whatsIncluded: [
      'Comprehensive Practical Guide (PDF & EPUB)',
      'Pre-Speaking Physical Warmup Routine (Quick Reference Card)',
      'The 3-Step Impromptu Speech Framework Template'
    ],
    whatYoullLearn: [
      'How to manage physiological symptoms of adrenaline and speech anxiety',
      'Eliminating filler sounds ("um", "like", "you know") using intentional pauses',
      'Structuring your thoughts rapidly under conversational pressure',
      'Developing natural vocal depth, cadence, and comfortable eye contact'
    ],
    whoItsFor: [
      'Professionals who feel nervous speaking in meetings or on stage',
      'Leaders looking to refine their presence and vocal gravitas',
      'Anyone wanting to express their ideas with clarity and composure'
    ],
    chapters: [
      { title: 'Chapter 1: The Physiology of Speaking Anxiety', description: 'Why your body reacts to public speaking and how to soothe it.' },
      { title: 'Chapter 2: Vocal Mechanics & Breath Support', description: 'Diaphragmatic breathing and resonant vocal tone.' },
      { title: 'Chapter 3: The Power of Intentional Silence', description: 'Replacing filler words with authoritative pauses.' },
      { title: 'Chapter 4: The Impromptu Structuring System', description: 'Point-Reason-Example-Point framework for instant answers.' }
    ],
    features: [
      'Actionable daily vocal exercises',
      'Realistic real-life scenarios and scripts',
      'Accessible across all digital reading devices'
    ],
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-speak-with-confidence.pdf'
  },
  {
    id: 'communication-skills',
    title: 'Communication Skills',
    category: 'communication',
    shortDescription: 'A comprehensive manual covering interpersonal dynamics, active listening, conflict de-escalation, and written message precision.',
    fullDescription: 'Every professional achievement hinges on your ability to transmit ideas, align expectations, and navigate friction. This manual covers the four pillars of interpersonal effectiveness: empathetic active listening, non-defensive conflict resolution, concise executive writing, and subtle nonverbal signaling. Provides real-world scripts for challenging workplace conversations.',
    price: 999,
    originalPrice: 1699,
    discount: 41,
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Digital Manual (PDF & EPUB)',
    whatsIncluded: [
      'Comprehensive Manual (PDF & EPUB)',
      'Difficult Conversation Preparation Worksheet',
      'Executive Email Writing & Brevity Cheatsheet'
    ],
    whatYoullLearn: [
      'The art of active listening that makes counterparts feel genuinely understood',
      'How to de-escalate workplace disagreements without being passive or aggressive',
      'Writing emails and messages that prompt immediate, decisive action',
      'Decoding nonverbal cues and body language dynamics in group meetings'
    ],
    whoItsFor: [
      'Managers, team leads, and project directors',
      'Individual contributors collaborating across cross-functional teams',
      'Anyone seeking smoother, more effective personal and professional relationships'
    ],
    chapters: [
      { title: 'Chapter 1: Active Listening as a Superpower', description: 'Hearing the unsaid subtext and validating viewpoints.' },
      { title: 'Chapter 2: De-escalating Friction and Conflict', description: 'Nonviolent communication frameworks for tense meetings.' },
      { title: 'Chapter 3: Written Precision for Busy People', description: 'Structuring memos, emails, and briefs that get read.' },
      { title: 'Chapter 4: Nonverbal Presence & Space Command', description: 'Open posture, physical alignment, and meeting room dynamics.' }
    ],
    features: [
      'Ready-to-use conversation scripts',
      'Clear workplace case studies',
      'DRM-free digital delivery'
    ],
    isFeatured: false,
    isPublished: true,
    digitalFile: 'novora-communication-skills.pdf'
  },
  {
    id: 'master-communication',
    title: 'MASTER COMMUNICATION',
    category: 'communication',
    shortDescription: 'The definitive masterwork on high-stakes persuasion, executive presence, strategic framing, and commanding attention in pivotal moments.',
    fullDescription: 'The capstone publication in the NOVORA communication library. Written for senior leaders, founders, and professionals who operate in high-stakes environments where decisions involve significant resources and consequences. Examines the architecture of persuasion, framing complex narratives, handling hostile interrogations, and radiating calm authority under intense pressure.',
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    coverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop',
    productFormat: 'Executive Monograph (PDF & EPUB)',
    whatsIncluded: [
      'Master Monograph (PDF & EPUB)',
      'Closed-Door Negotiation Preparation Blueprint',
      'High-Stakes Presentation Architecture Canvas',
      'Q&A Defensive Framing Playbook'
    ],
    whatYoullLearn: [
      'How to frame issues so your perspective becomes the natural reference point',
      'Answering aggressive questions without defensiveness or appeasement',
      'The psychology of gravitas: vocal pitch, stillness, and deliberate pacing',
      'Structuring keynote talks and board-level presentations that move capital'
    ],
    whoItsFor: [
      'C-suite executives, founders, and senior directors',
      'Lawyers, negotiators, and corporate strategists',
      'Professionals stepping into high-visibility leadership roles'
    ],
    chapters: [
      { title: 'Chapter 1: The Physics of Strategic Gravitas', description: 'Stillness, deliberate pacing, and vocal resonance.' },
      { title: 'Chapter 2: Narrative Architecture & Framing', description: 'Structuring arguments that withstand scrutiny.' },
      { title: 'Chapter 3: Navigating Hostile Interrogations', description: 'Bridge techniques and maintaining emotional sovereignty.' },
      { title: 'Chapter 4: The Closed-Door Negotiation Protocol', description: 'Concessions, leverage, and sealing mutual commitment.' }
    ],
    features: [
      'In-depth strategic leadership frameworks',
      'Applied rhetoric and persuasion models',
      'Premium typography and editorial design'
    ],
    isFeatured: true,
    isPublished: true,
    digitalFile: 'novora-master-communication.pdf'
  }
];

// Helper to load and save to localStorage for Admin editable features
const STORAGE_KEY = 'novora_catalog_products_v2';

export const loadStoredProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading stored products:', err);
  }
  return INITIAL_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving stored products:', err);
  }
};

export const resetStoredProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error resetting stored products:', err);
    }
  }
  return INITIAL_PRODUCTS;
};

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How are digital products delivered after purchase?',
    a: 'Immediately upon completing your checkout, you will receive instant on-screen access to download your digital archives. You will also receive a confirmation email containing direct access links and your sovereign acquisition license key.',
  },
  {
    q: 'What formats are the eBooks and blueprints provided in?',
    a: 'All NOVORA publications are provided in DRM-free, universal PDF and EPUB formats. Accompanying worksheets and frameworks are provided in clean, universally editable spreadsheets (Excel & Google Sheets compatible) and Markdown documents.',
  },
  {
    q: 'What are the three primary disciplines covered by NOVORA?',
    a: 'NOVORA focuses strictly on three fundamental leverage pillars: AI (generative workflows, tools, and income models), FINANCE (personal budgeting, capital preservation, and income diversification), and COMMUNICATION (vocal confidence, interpersonal clarity, and executive persuasion).',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We support all major Indian and international payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, MasterCard, NetBanking across 50+ banks, and international cards.',
  },
  {
    q: 'Can I read these publications on any device?',
    a: 'Yes. Because all files are delivered DRM-free, you can read them effortlessly across iOS (Apple Books), Android, Kindle, iPad, Remarkable, Mac, Windows, and Linux without needing proprietary reader apps or recurring subscriptions.',
  },
];

