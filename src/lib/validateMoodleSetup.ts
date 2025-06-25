// // utils/validateMoodleSetup.ts
// export async function validateMoodleSetup() {
//   if (process.env.NODE_ENV !== "development") {
//     return;
//   }

//   const response = await fetch("/api/debug/lti-params");
//   const { params } = await response.json();

//   const issues: string[] = [];

//   if (!params.lis_result_sourcedid) {
//     issues.push(
//       'Missing lis_result_sourcedid. Ensure "Accept grades from the tool" is enabled in Moodle.'
//     );
//   }

//   if (!params.lis_outcome_service_url) {
//     issues.push(
//       "Missing lis_outcome_service_url. Check that grading is properly configured."
//     );
//   }

//   if (issues.length > 0) {
//     console.warn("Moodle LTI Setup Issues:");
//     issues.forEach((issue) => console.warn("- " + issue));
//     console.warn("Full LTI params:", params);
//   }
// }
