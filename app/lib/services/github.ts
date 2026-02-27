import axios from 'axios';
import { GitHubRepo, GitHubUser } from '@/app/types';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
});

export const getGitHubUser = async (): Promise<GitHubUser> => {
  try {
    const response = await githubApi.get(`/users/${GITHUB_USERNAME}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub user: ${error}`);
  }
};

export const getGitHubRepos = async (limit: number = 10): Promise<GitHubRepo[]> => {
  try {
    const response = await githubApi.get(`/users/${GITHUB_USERNAME}/repos`, {
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: limit,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch GitHub repos: ${error}`);
  }
};

export const getGitHubTopRepos = async (limit: number = 10): Promise<GitHubRepo[]> => {
  try {
    const repos = await getGitHubRepos(100);
    return repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  } catch (error) {
    throw new Error(`Failed to fetch top GitHub repos: ${error}`);
  }
};

export const getGitHubLatestRepos = async (limit: number = 10): Promise<GitHubRepo[]> => {
  try {
    return await getGitHubRepos(limit);
  } catch (error) {
    throw new Error(`Failed to fetch latest GitHub repos: ${error}`);
  }
};
