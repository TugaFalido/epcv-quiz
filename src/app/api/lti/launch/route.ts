import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { ltiDataState } from '@/store/data';
import { LTIData } from '@/lib/types';

export async function POST(request: NextRequest) {
  // const [_, setLtiDataStore] = useRecoilState(ltiDataState)
  try {
    const formData = await request.formData();
    
    // Ensure all properties are strings or provide default values
    const ltiData: LTIData = {
      user_id: formData.get('user_id') as string || '',
      context_id: formData.get('context_id') as string || '',
      roles: formData.get('roles') as string || '',
      lis_person_name_full: formData.get('lis_person_name_full') as string || '',
      lis_outcome_service_url: formData.get('lis_outcome_service_url') as string || '',
      lis_result_sourcedid: formData.get('lis_result_sourcedid') as string || '',
      custom_params: Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => key.startsWith('custom_')).map(([key, value]) => [key, String(value)])
      )
    };
    // setLtiDataStore(ltiData)

    // Extract quiz ID and type from the request URL
    const url = new URL(request.url);
    const quizId = url.searchParams.get('quizId');
    const type = url.searchParams.get('type');

    if (!quizId) {
      throw new Error('Quiz ID is missing');
    }

    if (!type || (type !== 'quiz' && type !== 'game')) {
      throw new Error('Type is missing or invalid');
    }

    // Redirect to the appropriate page based on type and quiz ID, including outcomeUrl and sourceId
    const redirectUrl = new URL(`/${type}/${quizId}?outcomeUrl=${ltiData.lis_outcome_service_url}&sourceId=${ltiData.lis_result_sourcedid}`, request.url);

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
      },
    });
  } catch (error: any) {
    console.error('LTI Launch Error:', error);
    return Response.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}

// Handling OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}