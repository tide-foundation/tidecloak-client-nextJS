// This is an example for an API endpoint that serves sensitive information for an authenticated user's session
import { AddDOB, GetDOB } from '../../../lib/db';
import { verifyTideCloakToken } from '/lib/tideJWT';

// This endpoint is validating that only a specific role will be authorised to access the data
const AllowedRole = '_tide_dob.selfencrypt';
 
export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({error: 'Unauthorized: Missing or invalid token'}), {status: 401});
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyTideCloakToken(token, AllowedRole);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Forbidden: Invalid token or role'}), {status: 403});
    }

    try{
      const dob = await GetDOB(user.vuid);
      return new Response(JSON.stringify({dob: dob}), {status: 200});
    }catch{
      return new Response(JSON.stringify({dob: null}), {status: 200}) 
    }

  } catch (error) {
    console.error('Token verification failed:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
}
