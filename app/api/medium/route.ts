import { NextRequest, NextResponse } from 'next/server';
import { getLatestMediumArticles, getTopMediumArticles } from '@/app/lib/services/medium';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'latest'; // latest or top
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let data;

    if (type === 'top') {
      data = await getTopMediumArticles(limit);
    } else {
      data = await getLatestMediumArticles(limit);
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Medium articles',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
