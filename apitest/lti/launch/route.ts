// // app/api/lti/launch/route.ts
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     // Get parameters from URL search params instead of form data
//     const searchParams = request.nextUrl.searchParams;
    
//     // Log all received parameters for debugging
//     const receivedParams = Object.fromEntries(searchParams.entries());
//     console.log("Received LTI parameters:", receivedParams);

//     // Validate required parameters
//     const requiredParams = [
//       "lis_result_sourcedid",
//       "lis_outcome_service_url",
//       "user_id",
//       "context_id",
//     ];

//     const missingParams = requiredParams.filter(
//       (param) => !searchParams.get(param)
//     );
//     if (missingParams.length > 0) {
//       throw new Error(
//         `Missing required LTI parameters: ${missingParams.join(", ")}`
//       );
//     }

//     const ltiData = {
//       sourcedId: searchParams.get("lis_result_sourcedid"),
//       outcomeUrl: searchParams.get("lis_outcome_service_url"),
//       userId: searchParams.get("user_id"),
//       contextId: searchParams.get("context_id"),
//       roles: searchParams.get("roles"),
//       contextTitle: searchParams.get("context_title"),
//       resourceLinkId: searchParams.get("resource_link_id"),
//       timestamp: new Date().toISOString(),
//       launchPresentation: {
//         returnUrl: searchParams.get("launch_presentation_return_url"),
//         locale: searchParams.get("launch_presentation_locale"),
//         documentTarget: searchParams.get("launch_presentation_document_target"),
//       },
//     };

//     // Store in cookies with verbose error handling
//     const cookieStore = cookies();
//     try {
//       const cookieValue = JSON.stringify(ltiData);
//       cookieStore.set("lti_data", cookieValue, {
//         httpOnly: false, // Allow client-side access for debugging
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 3600, // 1 hour
//       });

//       // Verify cookie was set
//       const verificationCookie = cookieStore.get("lti_data");
//       if (!verificationCookie) {
//         throw new Error(
//           "Cookie verification failed - cookie not present after setting"
//         );
//       }

//       console.log("LTI cookie set successfully:", {
//         name: "lti_data",
//         value: cookieValue.substring(0, 100) + "...", // Log first 100 chars for debugging
//       });
//     } catch (cookieError: any) {
//       console.error("Cookie setting error:", cookieError);
//       throw new Error(
//         `Failed to store LTI data in cookie: ${cookieError.message}`
//       );
//     }

//     const id = searchParams.get("quizId");

//     // Redirect with debug parameters
//     const redirectUrl = new URL(`/quiz/${id}`, request.url);
//     redirectUrl.searchParams.set("lti_launch", "true");
//     redirectUrl.searchParams.set("ts", Date.now().toString());

//     console.log("Redirecting to:", redirectUrl.toString());

//     return NextResponse.redirect(redirectUrl);
//   } catch (error: any) {
//     console.error("LTI Launch Error:", error);
//     // Redirect to error page with detailed information
//     const errorUrl = new URL("/error", request.url);
//     errorUrl.searchParams.set("type", "lti_launch_error");
//     errorUrl.searchParams.set("message", error?.message);
//     errorUrl.searchParams.set("ts", Date.now().toString());

//     return NextResponse.redirect(errorUrl);
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();

//     // Log all received parameters for debugging
//     const receivedParams = Array.from(formData.entries()).reduce(
//       (acc, [key, value]) => {
//         acc[key] = value;
//         return acc;
//       },
//       {} as Record<string, any>
//     );

//     console.log("Received LTI parameters:", receivedParams);

//     // Validate required parameters
//     const requiredParams = [
//       "lis_result_sourcedid",
//       "lis_outcome_service_url",
//       "user_id",
//       "context_id",
//     ];

//     const missingParams = requiredParams.filter(
//       (param) => !formData.get(param)
//     );
//     if (missingParams.length > 0) {
//       throw new Error(
//         `Missing required LTI parameters: ${missingParams.join(", ")}`
//       );
//     }

//     const ltiData = {
//       sourcedId: formData.get("lis_result_sourcedid"),
//       outcomeUrl: formData.get("lis_outcome_service_url"),
//       userId: formData.get("user_id"),
//       contextId: formData.get("context_id"),
//       roles: formData.get("roles"),
//       contextTitle: formData.get("context_title"),
//       resourceLinkId: formData.get("resource_link_id"),
//       timestamp: new Date().toISOString(),
//       // Add additional debugging info
//       launchPresentation: {
//         returnUrl: formData.get("launch_presentation_return_url"),
//         locale: formData.get("launch_presentation_locale"),
//         documentTarget: formData.get("launch_presentation_document_target"),
//       },
//     };

//     // Store in cookies with verbose error handling
//     const cookieStore = cookies();
//     try {
//       const cookieValue = JSON.stringify(ltiData);
//       cookieStore.set("lti_data", cookieValue, {
//         httpOnly: false, // Allow client-side access for debugging
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "lax",
//         path: "/",
//         maxAge: 3600, // 1 hour
//       });

//       // Verify cookie was set
//       const verificationCookie = cookieStore.get("lti_data");
//       if (!verificationCookie) {
//         throw new Error(
//           "Cookie verification failed - cookie not present after setting"
//         );
//       }

//       console.log("LTI cookie set successfully:", {
//         name: "lti_data",
//         value: cookieValue.substring(0, 100) + "...", // Log first 100 chars for debugging
//       });
//     } catch (cookieError: any) {
//       console.error("Cookie setting error:", cookieError);
//       throw new Error(
//         `Failed to store LTI data in cookie: ${cookieError.message}`
//       );
//     }

//     const id = request.nextUrl.searchParams.get("quizId");

//     // Redirect with debug parameters
//     const redirectUrl = new URL(`/quiz/${id}`, request.url);
//     redirectUrl.searchParams.set("lti_launch", "true");
//     redirectUrl.searchParams.set("ts", Date.now().toString());

//     console.log("Redirecting to:", redirectUrl.toString());

//     return NextResponse.redirect(redirectUrl);
//   } catch (error: any) {
//     console.error("LTI Launch Error:", error);
//     // Redirect to error page with detailed information
//     const errorUrl = new URL("/error", request.url);
//     errorUrl.searchParams.set("type", "lti_launch_error");
//     errorUrl.searchParams.set("message", error?.message);
//     errorUrl.searchParams.set("ts", Date.now().toString());

//     return NextResponse.redirect(errorUrl);
//   }
// }
