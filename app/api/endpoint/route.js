// This is an example for an API endpoint that serves sensitive information for an authenticated user's session
import { verifyTideCloakToken } from '@tidecloak/nextjs/server';
import tcConfig from '../../../tidecloak.json'

// This endpoint is validating that only a specific role will be authorised to access the data
const AllowedRole = 'offline_access';


export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({error: 'Unauthorized: Missing or invalid token'}), {status: 401});
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyTideCloakToken(tcConfig, token, [AllowedRole]);

    if (!user) {
      return new Response(JSON.stringify({ error: 'Forbidden: Invalid token or role'}), {status: 403}) 
    }

    return new Response(JSON.stringify({ vuid: user.vuid, userkey: user.tideuserkey }), {status:200});

  } catch (error) {
    console.error('Token verification failed:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
}
