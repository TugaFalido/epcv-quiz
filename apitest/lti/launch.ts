// // pages/api/lti/launch.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";

// declare global {
//   var lastLtiParams: MoodleLTIParams | undefined;
// }

// // Define Moodle-specific LTI parameters
// interface MoodleLTIParams {
//   // Basic LTI parameters
//   lti_message_type: string;
//   lti_version: string;
//   resource_link_id: string;

//   // User information
//   user_id: string;
//   roles: string;
//   lis_person_name_full: string;
//   lis_person_name_family: string;
//   lis_person_name_given: string;
//   lis_person_contact_email_primary: string;

//   // Context information
//   context_id: string;
//   context_title: string;

//   // Grading parameters
//   lis_result_sourcedid: string;
//   lis_outcome_service_url: string;

//   // Moodle-specific parameters
//   tool_consumer_instance_guid: string;
//   tool_consumer_instance_name: string;
//   launch_presentation_locale: string;
// }

// // Debug function to log important LTI parameters
// function debugLTIParams(params: Partial<MoodleLTIParams>) {
//   console.log("LTI Launch Parameters:");
//   console.log("----------------------");
//   console.log("Source ID:", params.lis_result_sourcedid);
//   console.log("Outcome URL:", params.lis_outcome_service_url);
//   console.log("User ID:", params.user_id);
//   console.log("Context ID:", params.context_id);
//   console.log("Resource Link ID:", params.resource_link_id);
// }

// export async function ltiLaunchHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     // Cast the body to our Moodle LTI params interface
//     const ltiParams = req.body as MoodleLTIParams;

//     // In development, log the parameters
//     if (process.env.NODE_ENV === "development") {
//       debugLTIParams(ltiParams);
//     }

//     // Verify this is a valid LTI launch
//     if (
//       ltiParams.lti_message_type !== "basic-lti-launch-request" ||
//       ltiParams.lti_version !== "LTI-1p0"
//     ) {
//       console.error("Invalid LTI launch parameters");
//       return res.status(400).json({ message: "Invalid LTI launch" });
//     }

//     // Verify we have the required grading parameters
//     if (!ltiParams.lis_result_sourcedid || !ltiParams.lis_outcome_service_url) {
//       console.error(
//         "Missing grading parameters. Check Moodle activity settings."
//       );
//       return res.status(400).json({
//         message:
//           "Missing required grading parameters. Please ensure grades are enabled for this tool in Moodle.",
//       });
//     }

//     // Get or create session
//     // const session = await getServerSession(req, res);

//     // if (!session) {
//     //   throw new Error('No session found');
//     // }

//     // Store LTI parameters in session
//     // Object.assign(session, {
//     //   lti: {
//     //     sourcedId: ltiParams.lis_result_sourcedid,
//     //     outcomeUrl: ltiParams.lis_outcome_service_url,
//     //     userId: ltiParams.user_id,
//     //     contextId: ltiParams.context_id,
//     //     contextTitle: ltiParams.context_title,
//     //     userFullName: ltiParams.lis_person_name_full,
//     //     userEmail: ltiParams.lis_person_contact_email_primary,
//     //     launchTime: new Date().toISOString(),
//     //     isMoodle: true
//     //   }
//     // });

//     // Create debug endpoint for development
//     if (process.env.NODE_ENV === "development") {
//       // Store parameters temporarily for debugging
//       global.lastLtiParams = ltiParams;
//     }

//     // Redirect to the quiz
//     res.redirect(307, "/quiz");
//   } catch (error) {
//     console.error("LTI Launch Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
