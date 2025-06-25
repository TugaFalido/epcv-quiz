// import { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";

// // pages/api/debug/lti-params.ts (Development only)
// export function debugLtiParamsHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
// //   if (process.env.NODE_ENV !== "development") {
// //     return res.status(404).json({ message: "Not found" });
// //   }

//   // Return the last stored LTI parameters
//   res.json({
//     params: (global as any).lastLtiParams || {},
//     note: "These parameters are from the last LTI launch",
//   });
// }
