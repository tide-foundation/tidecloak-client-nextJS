// This is an example for an API endpoint that serves sensitive information for an authenticated user's session
import { AddDOB } from '../../../lib/db';
import { verifyTideCloakToken } from '/lib/tideJWT';

// This endpoint is validating that only a specific role will be authorised to access the data
const AllowedRole = '_tide_dob.selfencrypt';
 
export async function POST(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }), {status: 401});
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyTideCloakToken(token, AllowedRole);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Forbidden: Invalid token or role' }), {status: 403});
    }

    const data = await request.text();

    await AddDOB(user.vuid, data);
    return new Response(JSON.stringify({ ok: 200 }), {status: 200});

  } catch (error) {
    console.error('Token verification failed:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
}
