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

// Note: LinkedIn's official API requires proper authentication and may have limitations
// Consider using LinkedIn Feed API or a third-party service for production
