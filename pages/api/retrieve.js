// This is an example for an API endpoint that serves sensitive information for an authenticated user's session
import { AddDOB, GetDOB } from '../../lib/db';
import { verifyTideCloakToken } from '/lib/tideJWT';

// This endpoint is validating that only a specific role will be authorised to access the data
const AllowedRole = '_tide_dob.selfencrypt';
 
export default async function handler(req, res) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await verifyTideCloakToken(token, AllowedRole);

    if (!user) {
      return res.status(403).json({ error: 'Forbidden: Invalid token or role' });
    }

    try{
      const dob = await GetDOB(user.vuid, req.body);
      res.status(200).json({dob: dob});
    }catch{
      res.status(200).json({dob:null})
    }

  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
