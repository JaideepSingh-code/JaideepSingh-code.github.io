/* ============================================================
   Project data for the detail pages (project.html?p=<slug>).
   Real GitHub screenshots are used where they exist; otherwise the
   gallery renders generated concept panels from this data.
   ============================================================ */
window.PROJECTS = {
  salonai: {
    title: 'SalonAI',
    tagline: 'AI-powered salon management system',
    category: 'AI / Full-Stack',
    icon: '🤖',
    accent: ['#6d5efc', '#c850c0'],
    repo: 'https://github.com/JaideepSingh-code/SalonAI',
    demo: null,
    overview: 'An AI-powered salon platform built with a 7-person team. It pairs a clean booking experience with a fine-tuned language model that recommends hairstyles across six face-shape profiles and estimates pricing. A three-tier architecture ties a React/React Native client, a Django REST backend, and a dedicated LLaMA AI module together over REST and gRPC — all containerized and orchestrated for horizontal scale.',
    highlights: [
      '15 REST API endpoints across 4 route modules for booking, price estimation, and personalized recommendations.',
      'LLaMA 7B/13B fine-tuned with LoRA on 2× NVIDIA V100 GPUs, served as a dedicated AI microservice.',
      'Role-based access control across 3 roles (client, stylist, admin) with JWT auth, bcrypt, and 12 Pydantic schemas.',
      '3 microservices containerized with Docker Compose and orchestrated on Kubernetes for scalability.'
    ],
    tech: ['React', 'React Native', 'Django REST', 'LLaMA', 'LoRA', 'PostgreSQL', 'Docker', 'Kubernetes', 'gRPC', 'JWT'],
    metrics: [{ v: '15', l: 'REST endpoints' }, { v: '7', l: 'person team' }, { v: '6', l: 'face-shape models' }, { v: '3', l: 'microservices' }],
    shots: []
  },

  auction: {
    title: 'Auction Bidding Platform',
    tagline: 'Real-time auction e-commerce',
    category: 'Full-Stack',
    icon: '🛒',
    accent: ['#ff6a3d', '#f9a826'],
    repo: 'https://github.com/JaideepSingh-code/Auction-Ecommerce-Platform',
    demo: null,
    overview: 'A full-stack auction marketplace with real-time bidding, time-bound auctions, and validated payments. Built API-first on FastAPI with a typed React front-end, secured with JWT + bcrypt, and developed test-first with a clean Docker Compose deployment.',
    highlights: [
      '15 API endpoints across 5 routers (auth, items, auctions, bids, users) with real-time bid tracking.',
      'Luhn-validated payment processing and full time-bound auction lifecycle management.',
      'PostgreSQL data model (4 models, 30 columns, 3 FK relationships) with bcrypt + JWT (HS256).',
      '12 pytest TDD suites via FastAPI TestClient; 11 React + TS + Tailwind components; one-command Docker deploy.'
    ],
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Tailwind', 'Docker', 'pytest', 'JWT'],
    metrics: [{ v: '15', l: 'endpoints' }, { v: '5', l: 'routers' }, { v: '12', l: 'TDD suites' }, { v: '11', l: 'UI components' }],
    shots: []
  },

  'farmers-hub': {
    title: "Farmer's Hub",
    tagline: 'Agricultural marketplace app',
    category: 'Full-Stack',
    icon: '🌾',
    accent: ['#11998e', '#38ef7d'],
    repo: 'https://github.com/JaideepSingh-code/Farmers-Hub',
    demo: null,
    overview: 'A 2,888-line Java marketplace connecting farmers directly with buyers — dual roles, shopping cart, orders, and reviews. Architected with MVC plus Repository and Strategy patterns so the entire database backend can be swapped with zero code changes via a single config flag.',
    highlights: [
      '51 source files: 9 domain models, 10 JavaFX views, 5 controllers, and 4 PostgreSQL tables.',
      'Repository + Strategy patterns (12 repo files: interfaces, mocks, Postgres impls) → zero-code DB swap.',
      '30 JUnit 5 tests (25 unit + 5 integration) with 40+ assertions and Gradle build automation.',
      'Inheritance hierarchy: User → Farmer/Customer, Item → Produce/Machine.'
    ],
    tech: ['Java', 'JavaFX', 'PostgreSQL', 'Gradle', 'JUnit'],
    metrics: [{ v: '2,888', l: 'lines of code' }, { v: '51', l: 'source files' }, { v: '30', l: 'JUnit tests' }, { v: '4', l: 'DB tables' }],
    shots: [
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/LoginAndRegistrationPage.png', label: 'Login & Registration' },
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/FarmerAndCustomerPage.png', label: 'Farmer & Customer marketplace' },
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/LocalDatabase.png', label: 'PostgreSQL backend' },
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/MockDatabase.png', label: 'Mock DB (Strategy pattern)' },
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/JunitTestsReport.png', label: 'JUnit test report' },
      { src: 'https://raw.githubusercontent.com/JaideepSingh-code/Farmers-Hub/main/app/src/main/resources/images/IntegrationTestsReport.png', label: 'Integration test report' }
    ]
  },

  'vga-controller': {
    title: 'Accelerometer → VGA Controller',
    tagline: 'Real-time graphics, pure hardware',
    category: 'Hardware / FPGA',
    icon: '🎛️',
    accent: ['#2193b0', '#6dd5ed'],
    repo: 'https://github.com/JaideepSingh-code/VGA-Graphics-Controller-FPGA',
    demo: null,
    overview: 'A real-time sensor-visualization system on an Intel MAX10 FPGA that bridges an ADXL345 accelerometer to a 640×480 @ 60 Hz VGA display — entirely in hardware, with no soft-core processor. Tilt the board and the on-screen graphics and colors respond live.',
    highlights: [
      '11-module design across 4 subsystems with 58 top-level port signals.',
      'Custom SPI Master controller + FSM in SystemVerilog reading X-axis tilt continuously.',
      '3 clock domains (50 MHz system / 2 MHz SPI / 25 MHz VGA) via 2 PLLs with safe clock-domain crossing.',
      'Tilt-driven feedback loop: extreme tilt drives dynamic RGB changes plus a 7-segment readout.'
    ],
    tech: ['SystemVerilog', 'Intel MAX10', 'DE10-Lite', 'SPI', 'VGA', 'PLL'],
    metrics: [{ v: '11', l: 'HW modules' }, { v: '3', l: 'clock domains' }, { v: '640×480', l: '@ 60 Hz' }, { v: '0', l: 'soft-core CPUs' }],
    shots: []
  },

  'morse-code': {
    title: 'Morse Code Display System',
    tagline: 'FSM-driven multi-output translator',
    category: 'Hardware / FPGA',
    icon: '📡',
    accent: ['#f12711', '#f5af19'],
    repo: 'https://github.com/JaideepSingh-code/Morse-Code-FPGA',
    demo: null,
    overview: 'A 4-module FPGA design that translates all 26 letters into Morse code with three simultaneous outputs — a 7-segment display, LED blink patterns, and audible mechanical relay clicks — all driven by a finite-state machine and verified in simulation.',
    highlights: [
      'Supports A–Z with 3 simultaneous output modalities (display, LED, relay).',
      '5-state Moore FSM with 7 transitions for dot/dash timing (0.5 s / 1.5 s).',
      '25-bit clock divider reducing 50 MHz → 2 Hz; shift-register MSB-first transmission.',
      'External transistor amplifier driving LED + relay; timing verified in ModelSim.'
    ],
    tech: ['Verilog', 'DE10-Lite', 'FSM', 'ModelSim'],
    metrics: [{ v: '26', l: 'letters' }, { v: '3', l: 'output modes' }, { v: '5', l: 'FSM states' }, { v: '2 Hz', l: 'symbol clock' }],
    shots: []
  },

  'db-testing': {
    title: 'Database Testing Suite — Pagila',
    tagline: '767-assertion PostgreSQL test bed',
    category: 'Testing & QA',
    icon: '🗄️',
    accent: ['#4e54c8', '#8f94fb'],
    repo: 'https://github.com/JaideepSingh-code/Database-Testing-Suite-Pagila',
    demo: null,
    overview: 'A rigorous SQL testing suite for the Pagila PostgreSQL database. After evaluating ten frameworks, it standardizes on pgTAP + pg_prove and builds thousands of assertions — then extends with AI-assisted cases covering business rules, regressions, and edge cases.',
    highlights: [
      '6,864 lines of test SQL across 90 files with 767 pgTAP assertions — 100% pass rate.',
      '259 manual tests (15 files) validating 46+ database objects across 13 categories.',
      'Extended to 508 AI-assisted cases (75 files) with 42 reusable pg_temp helper functions.',
      'Assertion mix: 474 is(), 244 ok(), 35 throws_ok().'
    ],
    tech: ['PostgreSQL', 'pgTAP', 'pg_prove', 'SQL'],
    metrics: [{ v: '767', l: 'assertions' }, { v: '100%', l: 'pass rate' }, { v: '90', l: 'test files' }, { v: '46+', l: 'DB objects' }],
    shots: []
  },

  'test-analysis': {
    title: 'Test Suite Analysis & LLM Improvement',
    tagline: 'LLM-assisted coverage uplift',
    category: 'Testing & QA / AI',
    icon: '📊',
    accent: ['#0cebeb', '#20e3b2'],
    repo: 'https://github.com/JaideepSingh-code/Test-Suite-Analysis-LLM',
    demo: null,
    overview: 'A study in pushing test quality with LLMs. Across 50 algorithm implementations it measures coverage and mutation score, then uses targeted LLM-generated tests to close the gaps — and documents where branch coverage diverges from condition/decision coverage due to short-circuit evaluation.',
    highlights: [
      'Line coverage 72.4% → 89.2% (+16.8 pp); branch 58.1% → 78.5% (+20.4 pp).',
      'Mutation score 61% → 79% (+18 pp) measured with PIT.',
      '5-step methodology: baseline, gap categorization, targeted LLM generation, validation, before/after.',
      'Documented short-circuit divergence in AhoCorasick, SuffixArray, and MinCostMaxFlow.'
    ],
    tech: ['Java', 'JUnit', 'JaCoCo', 'PIT', 'EvoSuite', 'LLM'],
    metrics: [{ v: '89%', l: 'line coverage' }, { v: '79%', l: 'mutation score' }, { v: '50', l: 'algorithms' }, { v: '+20pp', l: 'branch gain' }],
    shots: []
  },

  'apache-cli': {
    title: 'Apache Commons CLI — Testing',
    tagline: 'Open-source test hardening',
    category: 'Testing & QA',
    icon: '✅',
    accent: ['#ee0979', '#ff6a00'],
    repo: 'https://github.com/JaideepSingh-code/Apache-Commons-CLI-Testing',
    demo: null,
    overview: 'A comprehensive test-engineering effort on Apache Commons CLI — nearly 2,000 test methods, build-enforced coverage gates, and a full quality pipeline with mutation testing, static analysis, and security scanning validated across six JDK versions.',
    highlights: [
      '1,938 test methods producing 3,965+ assertions across 36 production classes.',
      '98% line/instruction and 95% branch coverage with build-enforced JaCoCo thresholds.',
      '36 parameterized tests, 11 CVE-adjacent regression classes, 31 EvoSuite suites; validated on JDK 8–26.',
      '6-tool pipeline (JaCoCo, PIT, SpotBugs, Checkstyle, PMD, RAT) + 4 GitHub Actions incl. CodeQL & OpenSSF Scorecard.'
    ],
    tech: ['Java', 'JUnit', 'PIT', 'JaCoCo', 'EvoSuite', 'GitHub Actions'],
    metrics: [{ v: '1,938', l: 'test methods' }, { v: '98%', l: 'line coverage' }, { v: '6', l: 'JDK versions' }, { v: '6', l: 'quality tools' }],
    shots: []
  },

  security: {
    title: 'Computer Security Lab Portfolio',
    tagline: 'Offensive & defensive security',
    category: 'Security',
    icon: '🔐',
    accent: ['#cb2d3e', '#ef473a'],
    repo: 'https://github.com/JaideepSingh-code/Computer-Security',
    demo: null,
    overview: 'A hands-on security portfolio spanning offense and defense: malware analysis, real CVE exploitation, cryptography, password cracking, and intrusion detection — six labs using 18+ industry tools.',
    highlights: [
      'Static analysis of AgentTesla malware (PE32/.NET) with custom YARA rules (3 signatures).',
      'Exploited 3 CVEs (ProFTPD mod_copy, UnrealIRCd backdoor, Slowloris) with 2 reverse shells on Metasploitable3.',
      'AES-256-CBC / RSA-2048 with OpenSSL; cracked passwords with John + Hydra (rockyou, 14M+ entries).',
      'Deployed Snort 3.x IDS with custom rules; demonstrated 4 web attacks (3× XSS, CSRF).'
    ],
    tech: ['OpenSSL', 'YARA', 'Snort', 'Kali Linux', 'Metasploit', 'Python'],
    metrics: [{ v: '6', l: 'hands-on labs' }, { v: '18+', l: 'tools used' }, { v: '3', l: 'CVEs exploited' }, { v: '4', l: 'web attacks' }],
    shots: []
  },

  'smart-health': {
    title: 'Smart Health — Requirements Verification',
    tagline: 'NLP extraction + formal model checking',
    category: 'Research / AI',
    icon: '🩺',
    accent: ['#00b09b', '#96c93d'],
    repo: 'https://github.com/JaideepSingh-code/Smart-Health-Formal-Verification',
    demo: null,
    overview: 'Requirements engineering meets formal methods: extract requirements from natural language with NLP, then prove safety and liveness properties with a model checker — catching real concurrency bugs before a line of implementation is written.',
    highlights: [
      'Extracted 15 functional + 9 non-functional requirements with spaCy + GPT.',
      'Formally verified 25 LTL properties across 3 concurrent process models in SPIN — 21 passed, 4 found genuine concurrency bugs.',
      '4 Promela models + 3 property-spec files covering safety, liveness, and fairness.',
      'Classified across 5 HIPAA/GDPR-aware subsystems.'
    ],
    tech: ['spaCy', 'GPT', 'SPIN', 'Promela', 'LTL'],
    metrics: [{ v: '25', l: 'LTL properties' }, { v: '4', l: 'bugs found' }, { v: '24', l: 'requirements' }, { v: '3', l: 'process models' }],
    shots: []
  },

  'web-arch': {
    title: 'Web Architecture Scalability Research',
    tagline: 'MVC · Event Sourcing · Microservices',
    category: 'Research',
    icon: '📐',
    accent: ['#4568dc', '#b06ab3'],
    repo: 'https://github.com/JaideepSingh-code/Web-Architecture-Research',
    demo: null,
    overview: 'A research paper evaluating three architectural paradigms for scalable web systems against real industry case studies — then proposing a novel hybrid that combines their individual strengths into one coherent design.',
    highlights: [
      '5-page paper grounded in 9 academic references.',
      'Evaluated MVC, Event Sourcing (Kafka, CQRS), and Microservices across 4 criteria.',
      'Case studies drawn from Netflix, Amazon, and The Guardian.',
      'Proposes a combined architecture: MVC handles input, Event Sourcing logs immutably, Microservices consume events.'
    ],
    tech: ['MVC', 'Event Sourcing', 'Kafka', 'CQRS', 'Microservices'],
    metrics: [{ v: '3', l: 'paradigms' }, { v: '9', l: 'references' }, { v: '4', l: 'criteria' }, { v: '3', l: 'case studies' }],
    shots: []
  }
};
