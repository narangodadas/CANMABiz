import { FiBarChart2, FiBriefcase, FiFilm, FiMonitor } from 'react-icons/fi';

export const services = [
  {
    number: '01',
    title: 'Business Solutions',
    path: '/business-solutions',
    icon: FiBriefcase,
    accent: 'emerald',
    description: 'We help businesses build a strong foundation through professional consulting and strategic support services.',
    items: [
      'Business Consultation', 'Marketing Strategy Development', 'Financial Guidance',
      'HR Support & Consultancy', 'Business Funding Guidance', 'IT Support & Solutions',
      'SOP (Standard Operating Procedure) System Development', 'Business Process Improvement',
    ],
  },
  {
    number: '02',
    title: 'Digital Marketing Solutions',
    path: '/digital-marketing',
    icon: FiBarChart2,
    accent: 'blue',
    description: 'Our Digital Marketing Department helps businesses establish a strong online presence and connect with the right audience through effective digital strategies.',
    items: [
      'Social Media Management', 'Facebook Page Creation & Management',
      'Instagram Page Creation & Management', 'LinkedIn Page Creation & Management',
      'TikTok Page Creation & Management', 'YouTube Channel Setup & Management',
      'Google Business Profile Setup & Management', 'Meta (Facebook & Instagram) Advertising',
      'Google Ads Campaign Management', 'LinkedIn Advertising Campaigns',
      'Lead Generation Campaigns', 'Brand Awareness Campaigns',
      'Campaign Performance Monitoring & Optimization',
    ],
    groups: [
      {
        title: 'Social Media Management',
        items: [
          'Facebook Page Creation & Management', 'Instagram Page Creation & Management',
          'LinkedIn Page Creation & Management', 'TikTok Page Creation & Management',
          'YouTube Channel Setup & Management', 'Google Business Profile Setup & Management',
        ],
      },
      {
        title: 'Digital Advertising',
        items: [
          'Meta (Facebook & Instagram) Advertising', 'Google Ads Campaign Management',
          'LinkedIn Advertising Campaigns', 'Lead Generation Campaigns',
          'Brand Awareness Campaigns', 'Campaign Performance Monitoring & Optimization',
        ],
      },
    ],
  },
  {
    number: '03',
    title: 'Website Solutions',
    path: '/website-solutions',
    icon: FiMonitor,
    accent: 'cyan',
    description: 'Website solutions designed to strengthen your online presence and support your business goals.',
    items: [
      'Corporate Website Development', 'Business Website Design', 'Landing Page Development',
      'Website Maintenance & Updates', 'Basic SEO Optimization',
    ],
  },
  {
    number: '04',
    title: 'CANMABiz Production',
    path: '/production',
    icon: FiFilm,
    accent: 'purple',
    description: 'Through CANMABiz Production, we provide professional creative services that help businesses communicate their brand with high-quality visual content.',
    items: [
      'Graphic Design', 'Social Media Post Design', 'Corporate Branding Materials', 'Video Editing',
      'Promotional Video Production', 'Corporate Videography', 'Professional Photography',
      'Product Photography', 'Product Videography', 'Corporate Event Coverage',
      'Commercial & Promotional Content Creation', 'Social Media Reel Production',
    ],
  },
];