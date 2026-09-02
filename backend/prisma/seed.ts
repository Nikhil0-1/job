import { PrismaClient, JobType, WorkMode, ExperienceLevel, SalaryPeriod, JobStatus, Role, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.employerProfile.deleteMany();
  await prisma.jobSeekerProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.user.deleteMany();

  // Create job categories
  const categories = await Promise.all([
    prisma.jobCategory.create({ data: { name: 'Technology', slug: 'technology', icon: 'Monitor' } }),
    prisma.jobCategory.create({ data: { name: 'Design', slug: 'design', icon: 'Palette' } }),
    prisma.jobCategory.create({ data: { name: 'Marketing', slug: 'marketing', icon: 'TrendingUp' } }),
    prisma.jobCategory.create({ data: { name: 'Finance', slug: 'finance', icon: 'DollarSign' } }),
    prisma.jobCategory.create({ data: { name: 'Sales', slug: 'sales', icon: 'ShoppingBag' } }),
    prisma.jobCategory.create({ data: { name: 'Human Resources', slug: 'human-resources', icon: 'Users' } }),
    prisma.jobCategory.create({ data: { name: 'Customer Support', slug: 'customer-support', icon: 'Headphones' } }),
    prisma.jobCategory.create({ data: { name: 'Data & Analytics', slug: 'data-analytics', icon: 'BarChart2' } }),
    prisma.jobCategory.create({ data: { name: 'Operations', slug: 'operations', icon: 'Settings' } }),
    prisma.jobCategory.create({ data: { name: 'Healthcare', slug: 'healthcare', icon: 'Heart' } }),
  ]);

  const [techCat, designCat, marketingCat, financeCat, salesCat, hrCat, supportCat, dataCat] = categories;

  // Create employer users
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // Employer 1 - TechCorp
  const employer1User = await prisma.user.create({
    data: {
      email: 'hiring@techcorp.com',
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });
  const employer1Profile = await prisma.employerProfile.create({
    data: {
      userId: employer1User.id,
      companyName: 'TechCorp Solutions',
      phone: '+91 98765 43210',
      industry: 'Information Technology',
      companyType: 'Private Limited',
      isProfileComplete: true,
    },
  });
  const company1 = await prisma.company.create({
    data: {
      employerProfileId: employer1Profile.id,
      name: 'TechCorp Solutions',
      about: 'TechCorp Solutions is a leading IT services company specializing in software development, cloud computing, and digital transformation. We help businesses innovate through technology.',
      industry: 'Information Technology',
      companySize: '500-1000',
      website: 'https://techcorp.example.com',
      email: 'contact@techcorp.com',
      phone: '+91 98765 43210',
      address: '12th Floor, Cyber Tower',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
  });

  // Employer 2 - DesignHub
  const employer2User = await prisma.user.create({
    data: {
      email: 'hr@designhub.com',
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });
  const employer2Profile = await prisma.employerProfile.create({
    data: {
      userId: employer2User.id,
      companyName: 'DesignHub Creative',
      phone: '+91 87654 32109',
      industry: 'Design & Creative',
      companyType: 'Startup',
      isProfileComplete: true,
    },
  });
  const company2 = await prisma.company.create({
    data: {
      employerProfileId: employer2Profile.id,
      name: 'DesignHub Creative',
      about: 'DesignHub Creative is a design-first agency crafting exceptional digital experiences. We work with brands to create compelling visual identities and user interfaces.',
      industry: 'Design & Creative',
      companySize: '50-200',
      website: 'https://designhub.example.com',
      email: 'hello@designhub.com',
      phone: '+91 87654 32109',
      address: '3rd Floor, Innovate Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
    },
  });

  // Employer 3 - FinanceFirst
  const employer3User = await prisma.user.create({
    data: {
      email: 'careers@financefirst.com',
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });
  const employer3Profile = await prisma.employerProfile.create({
    data: {
      userId: employer3User.id,
      companyName: 'FinanceFirst',
      phone: '+91 76543 21098',
      industry: 'Banking & Finance',
      companyType: 'Public Limited',
      isProfileComplete: true,
    },
  });
  const company3 = await prisma.company.create({
    data: {
      employerProfileId: employer3Profile.id,
      name: 'FinanceFirst',
      about: 'FinanceFirst is a leading financial services company offering investment, insurance, and wealth management solutions to individuals and businesses across India.',
      industry: 'Banking & Finance',
      companySize: '1000-5000',
      website: 'https://financefirst.example.com',
      email: 'info@financefirst.com',
      phone: '+91 76543 21098',
      address: 'Finance Plaza, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
  });

  // Employer 4 - GrowthMart
  const employer4User = await prisma.user.create({
    data: {
      email: 'talent@growthmart.com',
      password: hashedPassword,
      role: Role.EMPLOYER,
    },
  });
  const employer4Profile = await prisma.employerProfile.create({
    data: {
      userId: employer4User.id,
      companyName: 'GrowthMart',
      phone: '+91 65432 10987',
      industry: 'E-Commerce',
      companyType: 'Startup',
      isProfileComplete: true,
    },
  });
  const company4 = await prisma.company.create({
    data: {
      employerProfileId: employer4Profile.id,
      name: 'GrowthMart',
      about: 'GrowthMart is a fast-growing e-commerce startup disrupting the online retail space with AI-powered personalization and lightning-fast delivery.',
      industry: 'E-Commerce',
      companySize: '200-500',
      website: 'https://growthmart.example.com',
      email: 'careers@growthmart.com',
      phone: '+91 65432 10987',
      address: 'StartupHub, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
    },
  });

  // Create jobs
  const jobs = [
    // TechCorp jobs
    {
      companyId: company1.id,
      categoryId: techCat.id,
      title: 'Senior Software Developer',
      department: 'Engineering',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      minSalary: 1200000,
      maxSalary: 2000000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.SENIOR,
      education: "Bachelor's in Computer Science or equivalent",
      skills: ['Node.js', 'TypeScript', 'React', 'PostgreSQL', 'AWS'],
      vacancies: 3,
      description: 'We are looking for a Senior Software Developer to join our growing engineering team at TechCorp Solutions. You will be responsible for designing, developing, and maintaining scalable web applications that power our core products.\n\nAs a senior member of the team, you will mentor junior developers, participate in architectural decisions, and drive technical excellence across the organization.',
      responsibilities: '• Design and develop scalable backend services using Node.js and TypeScript\n• Collaborate with frontend teams on API design and integration\n• Lead code reviews and mentor junior developers\n• Participate in architectural discussions and technical planning\n• Optimize application performance and database queries\n• Write comprehensive tests and documentation',
      requirements: '• 5+ years of professional software development experience\n• Strong proficiency in Node.js, TypeScript, and React\n• Experience with PostgreSQL or other relational databases\n• Familiarity with cloud platforms (AWS/GCP/Azure)\n• Excellent communication and collaboration skills\n• Strong understanding of software design patterns',
      benefits: '• Competitive salary with annual increments\n• Health and dental insurance for you and family\n• Flexible work-from-home policy\n• Learning & development budget\n• Annual performance bonus\n• 5-day work week',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company1.id,
      categoryId: dataCat.id,
      title: 'Data Analyst',
      department: 'Analytics',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      minSalary: 700000,
      maxSalary: 1200000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.MID,
      education: "Bachelor's in Statistics, Mathematics, or Computer Science",
      skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Tableau'],
      vacancies: 2,
      description: 'TechCorp Solutions is seeking a skilled Data Analyst to transform raw data into actionable insights. You will work closely with business stakeholders to understand their data needs and deliver reports, dashboards, and analyses that drive strategic decisions.',
      responsibilities: '• Collect, process, and analyze large datasets from multiple sources\n• Build interactive dashboards and reports using Power BI/Tableau\n• Identify trends and patterns to support business decisions\n• Collaborate with engineering teams on data pipeline improvements\n• Present findings to stakeholders in clear, non-technical language',
      requirements: '• 2-4 years of experience in data analysis\n• Strong SQL skills and experience with relational databases\n• Proficiency in Python or R for data manipulation\n• Experience with BI tools (Power BI, Tableau, or similar)\n• Excellent analytical and problem-solving skills\n• Good presentation and communication skills',
      benefits: '• Competitive salary package\n• Medical insurance\n• Hybrid work model\n• Professional development opportunities\n• Team outings and company events',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company1.id,
      categoryId: techCat.id,
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      country: 'India',
      state: 'Telangana',
      city: 'Hyderabad',
      minSalary: 1000000,
      maxSalary: 1800000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.MID,
      education: "Bachelor's in Computer Science or equivalent",
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
      vacancies: 1,
      description: 'We are hiring a DevOps Engineer to build and maintain our cloud infrastructure and CI/CD pipelines. You will play a critical role in ensuring our systems are reliable, scalable, and secure.',
      responsibilities: '• Design and maintain AWS cloud infrastructure\n• Build and optimize CI/CD pipelines using Jenkins/GitHub Actions\n• Manage containerized workloads using Docker and Kubernetes\n• Monitor system performance and respond to incidents\n• Implement security best practices across infrastructure\n• Automate operational processes to improve efficiency',
      requirements: '• 3-5 years of DevOps or cloud engineering experience\n• Strong knowledge of AWS services (EC2, ECS, RDS, S3, etc.)\n• Experience with Kubernetes and Docker\n• Proficiency in Infrastructure as Code (Terraform/CloudFormation)\n• Linux/Unix system administration skills\n• Experience with monitoring tools (Grafana, Prometheus, CloudWatch)',
      benefits: '• 100% remote work\n• Flexible working hours\n• Home office setup allowance\n• Health insurance\n• Annual bonus\n• Conference and certification budget',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    // DesignHub jobs
    {
      companyId: company2.id,
      categoryId: designCat.id,
      title: 'UI/UX Designer',
      department: 'Design',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      minSalary: 800000,
      maxSalary: 1400000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.MID,
      education: "Bachelor's in Design or equivalent",
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
      vacancies: 2,
      description: 'DesignHub Creative is looking for a talented UI/UX Designer who is passionate about creating beautiful, intuitive user experiences. You will work on a diverse range of projects for our clients, from mobile apps to enterprise platforms.',
      responsibilities: '• Create wireframes, prototypes, and high-fidelity designs\n• Conduct user research and usability testing\n• Develop and maintain design systems\n• Collaborate with development teams on implementation\n• Present design concepts to clients and stakeholders\n• Stay current with design trends and best practices',
      requirements: '• 3+ years of UI/UX design experience\n• Expert proficiency in Figma\n• Strong portfolio demonstrating product design work\n• Understanding of user-centered design principles\n• Basic knowledge of HTML/CSS is a plus\n• Excellent visual design sense and attention to detail',
      benefits: '• Creative and collaborative work environment\n• Hybrid work policy\n• Design tools and resources budget\n• Health insurance\n• Team retreats\n• Portfolio-worthy projects',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company2.id,
      categoryId: marketingCat.id,
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      minSalary: 900000,
      maxSalary: 1500000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.SENIOR,
      education: "Bachelor's in Marketing, Business, or Communication",
      skills: ['SEO', 'SEM', 'Social Media Marketing', 'Google Analytics', 'Content Strategy'],
      vacancies: 1,
      description: 'DesignHub Creative is searching for an experienced Digital Marketing Manager to lead our marketing initiatives and drive brand awareness. You will create and execute comprehensive digital marketing strategies that attract and retain clients.',
      responsibilities: '• Develop and execute digital marketing campaigns across channels\n• Manage SEO/SEM, social media, email, and content marketing\n• Analyze campaign performance and optimize for ROI\n• Manage marketing budgets and vendor relationships\n• Collaborate with design team on creative materials\n• Generate and present marketing reports to leadership',
      requirements: '• 5+ years of digital marketing experience\n• Proven track record of managing successful campaigns\n• Strong analytical skills with Google Analytics, SEMrush\n• Experience with marketing automation tools\n• Excellent written and verbal communication\n• Creative thinking with attention to data-driven decisions',
      benefits: '• Competitive salary + performance bonus\n• Health and dental coverage\n• Remote work flexibility\n• Annual training budget\n• Company events and team building',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    // FinanceFirst jobs
    {
      companyId: company3.id,
      categoryId: financeCat.id,
      title: 'Senior Accountant',
      department: 'Finance',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      minSalary: 800000,
      maxSalary: 1300000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.SENIOR,
      education: "CA / CMA / MBA Finance",
      skills: ['Accounting', 'Financial Reporting', 'Tally', 'SAP', 'Tax Compliance'],
      vacancies: 2,
      description: 'FinanceFirst is looking for a qualified Senior Accountant to oversee financial operations and ensure accurate financial reporting. You will manage accounts, prepare financial statements, and ensure compliance with regulatory requirements.',
      responsibilities: '• Prepare and review financial statements and reports\n• Manage month-end and year-end close processes\n• Ensure compliance with tax regulations and reporting requirements\n• Reconcile bank statements and manage accounts payable/receivable\n• Coordinate with auditors for annual audits\n• Identify opportunities for cost optimization',
      requirements: '• CA, CMA, or MBA in Finance\n• 5+ years of accounting experience in a corporate setting\n• Strong knowledge of Indian accounting standards and tax laws\n• Proficiency in SAP, Tally, or similar ERP systems\n• Excellent analytical and problem-solving skills\n• High attention to detail and accuracy',
      benefits: '• Competitive compensation package\n• Medical insurance for family\n• Provident fund and gratuity\n• Annual performance bonus\n• Professional development support',
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company3.id,
      categoryId: salesCat.id,
      title: 'Sales Executive – Financial Products',
      department: 'Sales',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      minSalary: 500000,
      maxSalary: 900000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.JUNIOR,
      education: "Bachelor's in any discipline",
      skills: ['Sales', 'Communication', 'Customer Relationship', 'Financial Products', 'Target Achievement'],
      vacancies: 5,
      description: 'FinanceFirst is hiring motivated Sales Executives to promote and sell our range of financial products including mutual funds, insurance, and investment plans. You will build strong client relationships and help customers achieve their financial goals.',
      responsibilities: '• Generate leads and identify potential clients\n• Present and explain financial products to prospects\n• Meet monthly and quarterly sales targets\n• Build and maintain long-term client relationships\n• Stay updated on market trends and product knowledge\n• Coordinate with operations team for smooth onboarding',
      requirements: '• 1-3 years of sales experience, preferably in financial services\n• Strong communication and interpersonal skills\n• Target-oriented with a positive attitude\n• AMFI/IRDA certification is a plus\n• Willingness to travel within the city\n• Good negotiation and persuasion skills',
      benefits: '• Base salary + attractive incentives\n• Medical insurance\n• Sales training and certification support\n• Career advancement opportunities\n• Annual awards and recognition',
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    // GrowthMart jobs
    {
      companyId: company4.id,
      categoryId: hrCat.id,
      title: 'HR Executive',
      department: 'Human Resources',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Noida',
      minSalary: 450000,
      maxSalary: 750000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.JUNIOR,
      education: "MBA in HR or equivalent",
      skills: ['Recruitment', 'Payroll', 'Employee Relations', 'HR Policies', 'HRIS'],
      vacancies: 1,
      description: 'GrowthMart is looking for a dynamic HR Executive to support our people operations as we scale rapidly. You will handle recruitment, onboarding, employee engagement, and HR administration for our growing team.',
      responsibilities: '• Manage end-to-end recruitment process\n• Coordinate onboarding and orientation for new hires\n• Maintain employee records and HRIS data\n• Process payroll and handle HR administration\n• Support employee engagement initiatives\n• Assist in policy development and compliance',
      requirements: '• 1-3 years of HR experience in a fast-paced environment\n• MBA in Human Resources preferred\n• Knowledge of HR policies and labor laws\n• Experience with HRIS systems\n• Strong organizational and communication skills\n• Ability to maintain confidentiality',
      benefits: '• Competitive salary\n• ESOP eligibility after 1 year\n• Hybrid work model\n• Health insurance\n• Fast-track growth opportunities',
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company4.id,
      categoryId: supportCat.id,
      title: 'Customer Support Executive',
      department: 'Customer Experience',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Noida',
      minSalary: 300000,
      maxSalary: 500000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.FRESHER,
      education: "Bachelor's in any discipline",
      skills: ['Customer Service', 'Communication', 'Problem Solving', 'Chat Support', 'CRM'],
      vacancies: 10,
      description: "GrowthMart is expanding its Customer Support team and looking for enthusiastic Customer Support Executives who are passionate about delivering exceptional customer experiences. You'll handle customer queries across email, chat, and phone channels.",
      responsibilities: '• Handle customer queries via phone, email, and live chat\n• Resolve customer complaints efficiently and professionally\n• Maintain accurate records of customer interactions in CRM\n• Escalate complex issues to appropriate teams\n• Follow up on open tickets to ensure resolution\n• Meet daily/weekly customer satisfaction targets',
      requirements: '• Excellent verbal and written communication in English and Hindi\n• Strong customer service orientation\n• Basic computer proficiency\n• Ability to multitask in a fast-paced environment\n• Freshers with good communication skills are welcome\n• Prior customer service experience is a plus',
      benefits: '• Structured training program\n• Performance incentives\n• Health insurance\n• Career growth opportunities\n• Provident fund',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
    {
      companyId: company4.id,
      categoryId: marketingCat.id,
      title: 'Marketing Manager',
      department: 'Growth',
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Noida',
      minSalary: 1000000,
      maxSalary: 1600000,
      salaryPeriod: SalaryPeriod.YEARLY,
      experience: ExperienceLevel.SENIOR,
      education: "MBA in Marketing or equivalent",
      skills: ['Growth Marketing', 'Performance Marketing', 'Brand Management', 'Analytics', 'Team Leadership'],
      vacancies: 1,
      description: 'GrowthMart is seeking a strategic Marketing Manager to lead our growth marketing efforts. You will own the marketing roadmap, drive customer acquisition, and build the GrowthMart brand in a competitive e-commerce landscape.',
      responsibilities: '• Develop and execute comprehensive marketing strategy\n• Lead a team of 5 marketing professionals\n• Manage performance marketing campaigns (Google, Meta, etc.)\n• Drive brand awareness and customer acquisition\n• Analyze marketing metrics and optimize campaigns\n• Coordinate product launches and seasonal campaigns',
      requirements: '• 6+ years of marketing experience, with 2+ in management\n• MBA in Marketing preferred\n• Proven experience in performance/growth marketing\n• Strong analytical skills with data-driven approach\n• Experience in e-commerce marketing is a significant plus\n• Excellent leadership and communication skills',
      benefits: '• Equity/ESOP after 1 year\n• Annual performance bonus\n• Health insurance for family\n• Flexible working hours\n• Learning & development budget\n• High-growth startup environment',
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      status: JobStatus.ACTIVE,
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  // Create a demo job seeker
  const seekerUser = await prisma.user.create({
    data: {
      email: 'rahul.sharma@email.com',
      password: hashedPassword,
      role: Role.JOB_SEEKER,
    },
  });
  await prisma.jobSeekerProfile.create({
    data: {
      userId: seekerUser.id,
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '+91 99887 76655',
      location: 'Bangalore, India',
      headline: 'Full Stack Developer | Node.js | React | TypeScript',
      about: 'Passionate software developer with 4 years of experience building scalable web applications.',
      skills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS'],
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Demo Employer Accounts:');
  console.log('   Email: hiring@techcorp.com | Password: Password123!');
  console.log('   Email: hr@designhub.com | Password: Password123!');
  console.log('   Email: careers@financefirst.com | Password: Password123!');
  console.log('   Email: talent@growthmart.com | Password: Password123!');
  console.log('\n👤 Demo Job Seeker:');
  console.log('   Email: rahul.sharma@email.com | Password: Password123!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
