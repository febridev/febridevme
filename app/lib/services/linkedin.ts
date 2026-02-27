import axios from 'axios';
import { LinkedInProfile, LinkedInPost } from '@/app/types';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

const linkedinApi = axios.create({
  baseURL: LINKEDIN_API_BASE,
  headers: {
    Authorization: `Bearer ${LINKEDIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const getLinkedInProfile = async (): Promise<LinkedInProfile> => {
  try {
    const response = await linkedinApi.get('/me?projection=(id,localizedFirstName,localizedLastName,localizedHeadline,profilePicture(displayImage))');
    const { id, localizedFirstName, localizedLastName, localizedHeadline, profilePicture } = response.data;

    return {
      id,
      name: `${localizedFirstName} ${localizedLastName}`,
      headline: localizedHeadline,
      profilePicture: profilePicture?.displayImage || '',
    };
  } catch (error) {
    throw new Error(`Failed to fetch LinkedIn profile: ${error}`);
  }
};

export const getLinkedInPosts = async (limit: number = 10): Promise<LinkedInPost[]> => {
  try {
    const response = await linkedinApi.get('/ugcPosts?q=authors&authors=List(urn:li:person:PERSON_ID)&count=' + limit);
    const posts: LinkedInPost[] = response.data.elements.map((post: any) => ({
      id: post.id,
      content: post.content?.text || '',
      createdAt: new Date(post.created.time).toISOString(),
      likes: post.likesSummary?.totalLikes || 0,
      comments: post.commentsSummary?.totalComments || 0,
    }));
    return posts;
  } catch (error) {
    throw new Error(`Failed to fetch LinkedIn posts: ${error}`);
  }
};

export const getLatestLinkedInPosts = async (limit: number = 10): Promise<LinkedInPost[]> => {
  try {
    return await getLinkedInPosts(limit);
  } catch (error) {
    throw new Error(`Failed to fetch latest LinkedIn posts: ${error}`);
  }
};

// Fallback experience data for when API is not available
const fallbackExperience = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechNova Inc.',
    duration: '2021 - Present',
    description: 'Spearheaded the migration of the legacy dashboard to React 18, improving load times by 40%. Mentored junior developers and established code quality standards using ESLint and Prettier.',
    skills: ['React', 'Redux', 'AWS'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Creative Solutions Ltd.',
    duration: '2019 - 2021',
    description: 'Developed and maintained multiple client e-commerce sites. Integrated payment gateways (Stripe, PayPal) and built custom CMS solutions using Node.js and MongoDB.',
    skills: ['Node.js', 'MongoDB', 'Vue.js'],
  },
];

export const getLinkedInExperience = async (limit: number = 10) => {
  try {
    // TODO: Implement actual LinkedIn API call for work experience
    // For now, return fallback data
    return fallbackExperience.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch LinkedIn experience:', error);
    return fallbackExperience.slice(0, limit);
  }
};

// Note: LinkedIn's official API requires proper authentication and may have limitations
// Consider using LinkedIn Feed API or a third-party service for production
