// Content migrated from febridev.me (see existing-content/).
// - "FB-02" is the design's unit code, not from the old site.
// - Project role tags are inferred from each description; the old site had none.
// - Bank Aladin end year (2025) is inferred from the Neuralt start date.

export type Project = {
  slug: string;
  code: string;
  title: string;
  year?: number;
  role: string[];
  summary: string;
  repo: string;
  seed: number; // seeds the generated technical plate
};

export const site = {
  name: 'Febriyant',
  unit: 'FB-02',
  role: 'Senior Database Administrator',
  url: 'https://febridev.me',
  description:
    'Febriyant, Senior Database Administrator at Neuralt Technologies. In IT since 2012, working across database administration, data engineering and web development.',
  email: 'febriyantabidin@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/febridev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/febriyant/' },
    { label: 'Medium', href: 'https://medium.com/@febriyant_' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/febriyantabidin/' },
    { label: 'Instagram', href: 'https://www.instagram.com/febriyant_/' },
    { label: 'X', href: 'https://x.com/embebidin' },
  ],
  hero: {
    line: 'DBA, Data Engineer, Web Dev.',
    statement: 'In the world of databases and beyond: crafting web brilliance.',
  },
  statement:
    'Surf with data. I keep the databases underneath the product fast, backed up and available, and build the data pipelines and web tools around them.',
  stages: [
    {
      key: 'frame',
      title: 'Design',
      text: 'The data is drawn first: an ERD for the product and an infrastructure architecture built for availability.',
      readout: 'Schema drafted',
    },
    {
      key: 'armor',
      title: 'Protect',
      text: 'Backup and restore are planned before anything goes live, so every database has a way back.',
      readout: 'Backups in place',
    },
    {
      key: 'wiring',
      title: 'Tune',
      text: 'Reports, queries and clusters get performance tuning, so the system answers fast under real load.',
      readout: 'Performance tuned',
    },
    {
      key: 'launch',
      title: 'Run',
      text: 'Database clusters stay up for the people who depend on them, from HR SaaS across Southeast Asia to core banking.',
      readout: 'Cluster online',
    },
  ],
  spec: [
    { label: '2025 – now', value: 'Senior Database Administrator, Neuralt Technologies' },
    { label: '2023 – 2025', value: 'Senior Database Administrator, PT Bank Aladin Syariah' },
    { label: '2019 – 2023', value: 'Senior Database Administrator, PT Indodev Niaga Internet' },
    { label: '2018 – 2019', value: 'Database Engineer, PT Indonesia Commodity & Derivatives Exchange' },
    { label: '2014 – 2018', value: 'Junior Database Administrator, PT Namasindo Plas' },
    { label: '2012 – 2014', value: 'IT Support, PT Namasindo Plas' },
  ],
  pilot: {
    bio: 'I am Febriyant, a database administrator moving into data engineering, with web development on the side. I started in IT support in 2012, then worked as a DBA on Oracle EBS reports, backup and restore, and performance tuning. Since then I have designed database architecture for a commodity exchange and run database clusters for an HR SaaS across Southeast Asia and for core mobile and corporate internet banking.',
    now: 'Senior Database Administrator at Neuralt Technologies since June 2025.',
  },
  colophon: 'Set in Archivo and Martian Mono. The cockpit view is drawn live with Three.js: a catapult of plain boxes and a canyon of lines.',
};

export const projects: Project[] = [
  {
    slug: 'berapanih',
    code: 'S-01',
    title: 'Berapanih',
    role: ['ETL', 'Web scraping'],
    summary: 'An ETL project that scrapes fuel prices from Shell Indonesia and MyPertamina, the Indonesian oil and gas company.',
    repo: 'https://github.com/febridev/berapanih',
    seed: 3.1,
  },
  {
    slug: 'dba-cli-tools',
    code: 'S-02',
    title: 'DBA CLI Tools',
    role: ['CLI', 'Database administration'],
    summary: 'Command line tools for the day-to-day work of a database administrator.',
    repo: 'https://github.com/febridev/DBA-Tools-Cli',
    seed: 7.2,
  },
  {
    slug: 'zoomcamp',
    code: 'S-03',
    title: 'Data Talks Club ZoomCamp',
    year: 2022,
    role: ['Data engineering'],
    summary: 'My final project for the 2022 Data Talks Club ZoomCamp, built on a Kaggle Spotify dataset: favourite genres, popular tracks and more.',
    repo: 'https://github.com/febridev/DBA-Tools-Cli', // as on the old site; owner confirmed keeping it
    seed: 11.6,
  },
];
