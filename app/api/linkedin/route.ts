import { NextRequest, NextResponse } from 'next/server';
import { getLatestLinkedInPosts } from '@/app/lib/services/linkedin';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const data = await getLatestLinkedInPosts(limit);

    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch LinkedIn posts',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
