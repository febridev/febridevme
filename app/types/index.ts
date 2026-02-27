// GitHub Types
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

// LinkedIn Types
export interface LinkedInProfile {
  id: string;
  name: string;
  headline: string;
  profilePicture: string;
  about?: string;
}

export interface LinkedInPost {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

// Medium Types
export interface MediumArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
