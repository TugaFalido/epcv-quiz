// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from "next-auth";
// import { LTILaunchParams } from '@/types/lti';
// //import { authOptions } from "@/lib/auth";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     // Validate LTI launch parameters
//     const launchParams = req.body as LTILaunchParams;
    
//     // Store LTI parameters in session
//     //const session = await getServerSession(req, res, authOptions);
    
//     // Add type safety for session
//     // if (!session) {
//     //   throw new Error('No session found');
//     // }

//     // Store LTI data in session
//     Object.assign(session, {
//       lti: {
//         sourcedId: launchParams.lis_result_sourcedid,
//         outcomeUrl: launchParams.lis_outcome_service_url,
//       },
//     });

//     // Redirect to quiz page
//     res.redirect(307, '/quiz');
//   } catch (error) {
//     console.error('LTI Launch Error:', error);
//     res.status(500).json({ error: 'Failed to process LTI launch' });
//   }
// }
