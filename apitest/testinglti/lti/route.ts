// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET() {
//   if (process.env.NODE_ENV !== "development") {
//     return NextResponse.json(
//       { error: "Not available in production" },
//       { status: 404 }
//     );
//   }

//   const cookieStore = cookies();
//   const ltiData = cookieStore.get("lti_data");
  
//   console.log("GET /api/testinglti/lti - Cookie found:", !!ltiData);
//   if (ltiData) {
//     console.log("Cookie value:", ltiData.value.substring(0, 100) + "...");
//   }

//   return NextResponse.json({
//     ltiData: ltiData ? JSON.parse(ltiData.value) : null,
//     timestamp: new Date().toISOString(),
//   });
// }
