

// import { NextApiRequest, NextApiResponse } from 'next';
// import { LTI } from 'pylti1p3';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const lti = new LTI({
//     consumer_key: process.env.LTI_CONSUMER_KEY!,
//     secret: process.env.LTI_SECRET!,
//     launch_url: '/api/auth',
//   });

//   try {
//     await lti.validate_request(req);
//     const { score } = req.body;

//     // Store the score in your database
//     // For simplicity, we'll just log it here
//     console.log(`Score submitted: ${score}`);

//     // Send the score back to the LMS
//     await lti.outcome_service().post_replace_result(score);

//     res.status(200).json({ message: 'Score submitted successfully' });
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid LTI request' });
//   }
// }


