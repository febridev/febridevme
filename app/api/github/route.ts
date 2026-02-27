import { NextRequest, NextResponse } from 'next/server';
import { getGitHubLatestRepos, getGitHubTopRepos } from '@/app/lib/services/github';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'latest'; // latest or top
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let data;

    if (type === 'top') {
      data = await getGitHubTopRepos(limit);
    } else {
      data = await getGitHubLatestRepos(limit);
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch GitHub repos',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
