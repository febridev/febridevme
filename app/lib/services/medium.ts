import axios from 'axios';
import { MediumArticle } from '@/app/types';

const MEDIUM_API_BASE = 'https://api.rss2json.com/v1/api.json';
const MEDIUM_USERNAME = process.env.NEXT_PUBLIC_MEDIUM_USERNAME;

const mediumApi = axios.create({
  baseURL: MEDIUM_API_BASE,
});

export const getMediumArticles = async (limit: number = 10): Promise<MediumArticle[]> => {
  try {
    const response = await mediumApi.get('', {
      params: {
        rss_url: `https://medium.com/feed/@${MEDIUM_USERNAME}`,
        count: limit,
      },
    });

    const articles: MediumArticle[] = response.data.items.map((item: any) => ({
      id: item.guid,
      title: item.title,
      description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
      link: item.link,
      pubDate: item.pubDate,
      author: item.author || MEDIUM_USERNAME,
      thumbnail: item.thumbnail || extractImageFromContent(item.content),
    }));

    return articles;
  } catch (error) {
    throw new Error(`Failed to fetch Medium articles: ${error}`);
  }
};

export const getLatestMediumArticles = async (limit: number = 10): Promise<MediumArticle[]> => {
  try {
    const articles = await getMediumArticles(limit);
    return articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  } catch (error) {
    throw new Error(`Failed to fetch latest Medium articles: ${error}`);
  }
};

export const getTopMediumArticles = async (limit: number = 10): Promise<MediumArticle[]> => {
  try {
    // Medium RSS doesn't provide engagement metrics, so we return latest articles
    return await getLatestMediumArticles(limit);
  } catch (error) {
    throw new Error(`Failed to fetch top Medium articles: ${error}`);
  }
};

// Helper function to extract image from content
function extractImageFromContent(content: string): string | undefined {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}
