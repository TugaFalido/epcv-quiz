"use server";

// import { cookies } from "next/headers";
// import OAuth from "oauth-1.0a";
// import crypto from "crypto";

// export async function submitScore(score: number, totalPoints: number) {
//   const cookieStore = cookies();
//   const ltiDataCookie = cookieStore.get("lti_data");

//   if (!ltiDataCookie) {
//     throw new Error("No LTI data found. Please launch from Moodle.");
//   }

//   const ltiData = JSON.parse(ltiDataCookie.value);
//   const { sourcedId, outcomeUrl } = ltiData;

//   if (!sourcedId || !outcomeUrl) {
//     throw new Error("Missing required LTI parameters for grading.");
//   }

//   // Create normalized score (LTI requires scores between 0-1)
//   const normalizedScore = Math.max(0, Math.min(score / totalPoints, 1));

//   // Create OAuth signature
//   const oauth = new OAuth({
//     consumer: {
//       key: process.env.NEXT_PUBLIC_LTI_CONSUMER_KEY!,
//       secret: process.env.NEXT_PUBLIC_LTI_CONSUMER_SECRET!,
//     },
//     signature_method: "HMAC-SHA1",
//     hash_function(baseString: string, key: string) {
//       return crypto.createHmac("sha1", key).update(baseString).digest("base64");
//     },
//   });

//   const requestData = {
//     url: outcomeUrl,
//     method: "POST",
//   };

//   const headers = oauth.toHeader(oauth.authorize(requestData));

//   // Create XML payload
//   const xml = `
//     <?xml version="1.0" encoding="UTF-8"?>
//     <imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
//       <imsx_POXHeader>
//         <imsx_POXRequestHeaderInfo>
//           <imsx_version>V1.0</imsx_version>
//           <imsx_messageIdentifier>${Date.now()}</imsx_messageIdentifier>
//         </imsx_POXRequestHeaderInfo>
//       </imsx_POXHeader>
//       <imsx_POXBody>
//         <replaceResultRequest>
//           <resultRecord>
//             <sourcedGUID>
//               <sourcedId>${sourcedId}</sourcedId>
//             </sourcedGUID>
//             <result>
//               <resultScore>
//                 <language>en</language>
//                 <textString>${normalizedScore}</textString>
//               </resultScore>
//             </result>
//           </resultRecord>
//         </replaceResultRequest>
//       </imsx_POXBody>
//     </imsx_POXEnvelopeRequest>
//   `.trim();

//   try {
//     const response = await fetch(outcomeUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/xml",
//         ...headers,
//       },
//       body: xml,
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to submit score: ${response.statusText}`);
//     }

//     return { success: true, score: normalizedScore };
//   } catch (error) {
//     console.error("Score submission error:", error);
//     throw error;
//   }
// }
