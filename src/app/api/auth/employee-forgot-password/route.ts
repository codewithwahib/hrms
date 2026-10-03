// // // app/api/auth/employee-forgot-password/route.ts

// // import { NextResponse } from 'next/server'
// // import { supabaseAdmin } from '@/utils/supabase/admin'
// // import nodemailer from 'nodemailer'

// // // ============================================================
// // // GMAIL SMTP
// // // ============================================================

// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.GMAIL_USER,
// //     pass: process.env.GMAIL_APP_PASSWORD,
// //   },
// // })

// // // ============================================================
// // // ERROR HELPER
// // // ============================================================

// // const getErrorMessage = (
// //   err: unknown,
// //   fallback: string
// // ): string => {
// //   if (err instanceof Error) return err.message
// //   if (typeof err === 'string') return err
// //   return fallback
// // }

// // // ============================================================
// // // SITE URL
// // // ============================================================

// // function getSiteUrl(req: Request): string {
// //   // 1. NEXT_PUBLIC_SITE_URL
// //   const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

// //   if (
// //     envUrl &&
// //     !envUrl.includes('localhost') &&
// //     !envUrl.includes('127.0.0.1')
// //   ) {
// //     return envUrl.replace(/\/+$/, '')
// //   }

// //   // 2. Vercel production URL
// //   const vercelProdUrl =
// //     process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

// //   if (
// //     vercelProdUrl &&
// //     !vercelProdUrl.includes('localhost') &&
// //     !vercelProdUrl.includes('127.0.0.1')
// //   ) {
// //     return `https://${vercelProdUrl.replace(
// //       /^https?:\/\//,
// //       ''
// //     )}`
// //   }

// //   // 3. Vercel deployment URL
// //   const vercelUrl = process.env.VERCEL_URL?.trim()

// //   if (
// //     vercelUrl &&
// //     !vercelUrl.includes('localhost') &&
// //     !vercelUrl.includes('127.0.0.1')
// //   ) {
// //     return `https://${vercelUrl.replace(
// //       /^https?:\/\//,
// //       ''
// //     )}`
// //   }

// //   // 4. Request host
// //   try {
// //     const proto =
// //       req.headers.get('x-forwarded-proto') || 'https'

// //     const host =
// //       req.headers.get('x-forwarded-host') ||
// //       req.headers.get('host')

// //     if (
// //       host &&
// //       !host.includes('localhost') &&
// //       !host.includes('127.0.0.1')
// //     ) {
// //       return `${proto}://${host}`
// //     }
// //   } catch {
// //     // Ignore
// //   }

// //   return 'http://localhost:3000'
// // }

// // // ============================================================
// // // LOGO URL
// // // ============================================================

// // function getLogoUrl(
// //   siteUrl: string,
// //   logoFromDb: string
// // ): string {
// //   // If database contains a full HTTPS logo URL
// //   if (
// //     logoFromDb &&
// //     /^https:\/\//i.test(logoFromDb)
// //   ) {
// //     return logoFromDb
// //   }

// //   // Default public logo
// //   return `${siteUrl}/logo.png`
// // }

// // // ============================================================
// // // POST
// // // ============================================================

// // export async function POST(req: Request) {
// //   try {
// //     // ========================================================
// //     // REQUEST BODY
// //     // ========================================================

// //     const body = await req.json()

// //     const { email } = body

// //     console.log('======================================')
// //     console.log('EMPLOYEE FORGOT PASSWORD')
// //     console.log('Requested email:', email)
// //     console.log('======================================')

// //     // ========================================================
// //     // VALIDATE EMAIL
// //     // ========================================================

// //     if (
// //       !email ||
// //       typeof email !== 'string'
// //     ) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: 'Email is required.',
// //         },
// //         { status: 400 }
// //       )
// //     }

// //     const normalizedEmail = email
// //       .toLowerCase()
// //       .trim()

// //     const emailRegex =
// //       /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// //     if (!emailRegex.test(normalizedEmail)) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message:
// //             'Please enter a valid email address.',
// //         },
// //         { status: 400 }
// //       )
// //     }

// //     // ========================================================
// //     // FIND EMPLOYEE
// //     // ========================================================

// //     const {
// //       data: employee,
// //       error: employeeError,
// //     } = await supabaseAdmin
// //       .from('employees')
// //       .select(
// //         'id, employee_id, username, full_name, email'
// //       )
// //       .ilike('email', normalizedEmail)
// //       .maybeSingle()

// //     if (employeeError) {
// //       console.error(
// //         'Employee lookup error:',
// //         employeeError
// //       )

// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: 'Unable to check account.',
// //         },
// //         { status: 500 }
// //       )
// //     }

// //     if (!employee) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message:
// //             'No account found with this email.',
// //         },
// //         { status: 404 }
// //       )
// //     }

// //     if (!employee.email) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message:
// //             'No email linked to this account. Please contact HR admin.',
// //         },
// //         { status: 400 }
// //       )
// //     }

// //     // ========================================================
// //     // GET LOGO FROM DATABASE
// //     // ========================================================

// //     const {
// //       data: logoRow,
// //       error: logoError,
// //     } = await supabaseAdmin
// //       .from('logo1')
// //       .select('logo')
// //       .limit(1)
// //       .maybeSingle()

// //     if (logoError) {
// //       console.log(
// //         'Logo DB lookup skipped:',
// //         logoError.message
// //       )
// //     }

// //     const logoFromDb =
// //       typeof logoRow?.logo === 'string'
// //         ? logoRow.logo.trim()
// //         : ''

// //     // ========================================================
// //     // SITE URL
// //     // ========================================================

// //     const siteUrl = getSiteUrl(req)

// //     // ========================================================
// //     // LOGO URL
// //     // ========================================================

// //     const logoUrl = getLogoUrl(
// //       siteUrl,
// //       logoFromDb
// //     )

// //     console.log('======================================')
// //     console.log('SITE URL:', siteUrl)
// //     console.log('LOGO URL:', logoUrl)
// //     console.log('======================================')

// //     // ========================================================
// //     // RESET TOKEN
// //     // ========================================================

// //     const resetToken = crypto.randomUUID()

// //     const expiresAt = new Date(
// //       Date.now() + 30 * 60 * 1000
// //     ).toISOString()

// //     // ========================================================
// //     // SAVE RESET TOKEN
// //     // ========================================================

// //     const {
// //       error: updateError,
// //     } = await supabaseAdmin
// //       .from('employees')
// //       .update({
// //         reset_token: resetToken,
// //         reset_token_expires_at: expiresAt,
// //       })
// //       .eq('id', employee.id)

// //     if (updateError) {
// //       console.error(
// //         'Token save error:',
// //         updateError
// //       )

// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message:
// //             `Unable to create reset link: ${updateError.message}`,
// //         },
// //         { status: 500 }
// //       )
// //     }

// //     // ========================================================
// //     // RESET URL
// //     // ========================================================

// //     const resetUrl =
// //       `${siteUrl}/reset-password?token=${encodeURIComponent(
// //         resetToken
// //       )}`

// //     console.log('RESET URL:', resetUrl)
// //     console.log('EMAIL:', employee.email)

// //     // ========================================================
// //     // GREETING
// //     // ========================================================

// //     const greetingName =
// //       employee.full_name?.trim() ||
// //       employee.username ||
// //       'there'

// //     // ========================================================
// //     // PLAIN TEXT EMAIL
// //     // ========================================================

// //     const textVersion = `
// // Hello ${greetingName},

// // We received a request to reset your employee account password for A to Zee Switchgear Engineering (SMC) Pvt. Ltd.

// // To reset your password, please open the link below:

// // ${resetUrl}

// // If you did not request this password reset, you can safely ignore this email.

// // © 2026 A to Zee Switchgear Engineering (SMC) Pvt. Ltd. All rights reserved.
// //     `.trim()

// //     // ========================================================
// //     // HTML EMAIL
// //     // ========================================================

// //     const htmlVersion = `
// // <!DOCTYPE html>

// // <html lang="en">

// // <head>

// //   <meta charset="UTF-8">

// //   <meta
// //     name="viewport"
// //     content="width=device-width, initial-scale=1.0"
// //   >

// //   <meta
// //     name="color-scheme"
// //     content="light"
// //   >

// //   <meta
// //     name="supported-color-schemes"
// //     content="light"
// //   >

// //   <title>Password Reset</title>

// //   <style>

// //     body {
// //       margin: 0;
// //       padding: 0;
// //       background-color: #ffffff;
// //       font-family: Arial, Helvetica, sans-serif;
// //     }

// //     table {
// //       border-collapse: collapse;
// //     }

// //     img {
// //       border: 0;
// //       outline: none;
// //       text-decoration: none;
// //       display: block;
// //     }

// //     .email-container {
// //       width: 100%;
// //       max-width: 600px;
// //       margin: 0 auto;
// //       background: #ffffff;
// //     }

// //     .email-wrapper {
// //       padding: 40px;
// //     }

// //     .logo {
// //       width: 220px;
// //       max-width: 220px;
// //       height: auto;
// //       margin: 0 auto;
// //     }

// //     .heading {
// //       color: #0071BD;
// //       font-size: 26px;
// //       font-weight: 700;
// //       margin: 0 0 22px;
// //     }

// //     .text {
// //       color: #555555;
// //       font-size: 15px;
// //       line-height: 1.6;
// //       margin: 0 0 14px;
// //     }

// //     .button {
// //       display: inline-block;
// //       padding: 14px 36px;
// //       background-color: #0071BD;
// //       color: #ffffff !important;
// //       text-decoration: none;
// //       border-radius: 8px;
// //       font-weight: 700;
// //       font-size: 14px;
// //       letter-spacing: 1px;
// //     }

// //     .footer {
// //       color: #999999;
// //       font-size: 12px;
// //       text-align: center;
// //     }

// //     @media only screen and (max-width: 480px) {

// //       .email-wrapper {
// //         padding: 20px !important;
// //       }

// //       .logo {
// //         width: 180px !important;
// //         max-width: 180px !important;
// //       }

// //       .heading {
// //         font-size: 22px !important;
// //       }

// //       .button {
// //         padding: 12px 24px !important;
// //         font-size: 13px !important;
// //       }

// //     }

// //   </style>

// // </head>

// // <body
// //   style="
// //     margin:0;
// //     padding:0;
// //     background:#ffffff;
// //   "
// // >

// //   <table
// //     width="100%"
// //     cellpadding="0"
// //     cellspacing="0"
// //     border="0"
// //     style="background:#ffffff;"
// //   >

// //     <tr>

// //       <td align="center">

// //         <table
// //           class="email-container"
// //           width="600"
// //           cellpadding="0"
// //           cellspacing="0"
// //           border="0"
// //           style="
// //             width:100%;
// //             max-width:600px;
// //             background:#ffffff;
// //           "
// //         >

// //           <tr>

// //             <td
// //               class="email-wrapper"
// //               style="
// //                 padding:40px;
// //                 background:#ffffff;
// //               "
// //             >

// //               <!-- ================================================= -->
// //               <!-- LOGO -->
// //               <!-- ================================================= -->

// //               <table
// //                 width="100%"
// //                 cellpadding="0"
// //                 cellspacing="0"
// //                 border="0"
// //               >

// //                 <tr>

// //                   <td
// //                     align="center"
// //                     style="padding-bottom:32px;"
// //                   >

// //                     <a
// //                       href="${siteUrl}"
// //                       target="_blank"
// //                       style="
// //                         text-decoration:none;
// //                       "
// //                     >

// //                       <!--
// //                         IMPORTANT:
// //                         Logo is embedded using CID.
// //                       -->

// //                       <img
// //                         src="cid:atozee-logo@atozee"
// //                         alt="A to Zee Switchgear Engineering"
// //                         width="220"
// //                         class="logo"
// //                         style="
// //                           display:block;
// //                           width:220px;
// //                           max-width:220px;
// //                           height:auto;
// //                           margin:0 auto;
// //                           border:0;
// //                           outline:none;
// //                           text-decoration:none;
// //                         "
// //                       >

// //                     </a>

// //                   </td>

// //                 </tr>

// //               </table>

// //               <!-- ================================================= -->
// //               <!-- DIVIDER -->
// //               <!-- ================================================= -->

// //               <div
// //                 style="
// //                   border-top:3px solid #0071BD;
// //                   margin-bottom:32px;
// //                   height:1px;
// //                   line-height:1px;
// //                 "
// //               ></div>

// //               <!-- ================================================= -->
// //               <!-- HEADING -->
// //               <!-- ================================================= -->

// //               <h2
// //                 class="heading"
// //                 style="
// //                   margin:0 0 22px;
// //                   color:#0071BD;
// //                   font-size:26px;
// //                   line-height:1.3;
// //                   font-weight:700;
// //                 "
// //               >
// //                 Password Reset
// //               </h2>

// //               <!-- ================================================= -->
// //               <!-- GREETING -->
// //               <!-- ================================================= -->

// //               <p
// //                 class="text"
// //                 style="
// //                   color:#333333;
// //                   font-size:15px;
// //                   line-height:1.6;
// //                   margin:0 0 14px;
// //                 "
// //               >

// //                 Hello
// //                 <strong>${greetingName}</strong>,

// //               </p>

// //               <!-- ================================================= -->
// //               <!-- BODY -->
// //               <!-- ================================================= -->

// //               <p
// //                 class="text"
// //                 style="
// //                   color:#555555;
// //                   font-size:15px;
// //                   line-height:1.6;
// //                   margin:0 0 14px;
// //                 "
// //               >

// //                 We received a request to reset your employee
// //                 account password for

// //                 <strong style="color:#0071BD;">
// //                   A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
// //                 </strong>

// //               </p>

// //               <p
// //                 class="text"
// //                 style="
// //                   color:#555555;
// //                   font-size:15px;
// //                   line-height:1.6;
// //                   margin:0 0 14px;
// //                 "
// //               >

// //                 Click the button below to reset your password:

// //               </p>

// //               <!-- ================================================= -->
// //               <!-- BUTTON -->
// //               <!-- ================================================= -->

// //               <table
// //                 width="100%"
// //                 cellpadding="0"
// //                 cellspacing="0"
// //                 border="0"
// //               >

// //                 <tr>

// //                   <td
// //                     align="center"
// //                     style="padding:32px 0;"
// //                   >

// //                     <a
// //                       href="${resetUrl}"
// //                       target="_blank"
// //                       class="button"
// //                       style="
// //                         display:inline-block;
// //                         padding:14px 36px;
// //                         background:#0071BD;
// //                         color:#ffffff !important;
// //                         text-decoration:none;
// //                         border-radius:8px;
// //                         font-weight:700;
// //                         font-size:14px;
// //                         letter-spacing:1px;
// //                       "
// //                     >

// //                       RESET PASSWORD

// //                     </a>

// //                   </td>

// //                 </tr>

// //               </table>

// //               <!-- ================================================= -->
// //               <!-- WARNING -->
// //               <!-- ================================================= -->

// //               <p
// //                 style="
// //                   color:#777777;
// //                   font-size:14px;
// //                   line-height:1.6;
// //                   margin:0 0 14px;
// //                 "
// //               >

// //                 If you did not request this password reset,
// //                 you can safely ignore this email.

// //               </p>

// //               <!-- ================================================= -->
// //               <!-- FOOTER DIVIDER -->
// //               <!-- ================================================= -->

// //               <div
// //                 style="
// //                   border-top:1px solid #E6F2FA;
// //                   margin:32px 0 20px;
// //                   height:1px;
// //                   line-height:1px;
// //                 "
// //               ></div>

// //               <!-- ================================================= -->
// //               <!-- FOOTER -->
// //               <!-- ================================================= -->

// //               <p
// //                 class="footer"
// //                 style="
// //                   color:#999999;
// //                   font-size:12px;
// //                   line-height:1.5;
// //                   margin:0;
// //                   text-align:center;
// //                 "
// //               >

// //                 © 2026 A to Zee Switchgear Engineering
// //                 (SMC) Pvt. Ltd. All rights reserved.

// //               </p>

// //             </td>

// //           </tr>

// //         </table>

// //       </td>

// //     </tr>

// //   </table>

// // </body>

// // </html>
// //     `.trim()

// //     // ========================================================
// //     // SEND EMAIL
// //     // ========================================================

// //     await transporter.sendMail({

// //       from:
// //         `"A to Zee Switchgear" <${process.env.GMAIL_USER}>`,

// //       to: employee.email,

// //       replyTo: process.env.GMAIL_USER,

// //       subject:
// //         'Password Reset Request - A to Zee Switchgear',

// //       text: textVersion,

// //       html: htmlVersion,

// //       // ======================================================
// //       // EMBED LOGO INSIDE EMAIL
// //       // ======================================================

// //       attachments: [
// //         {
// //           filename: 'logo.png',

// //           href: logoUrl,

// //           cid: 'atozee-logo@atozee',

// //           contentType: 'image/png',

// //         },
// //       ],

// //       headers: {
// //         'X-Entity-Ref-ID': resetToken,

// //         'X-Priority': '3',

// //         'X-MSMail-Priority': 'Normal',

// //         Importance: 'Normal',

// //         'List-Unsubscribe':
// //           `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
// //       },

// //     })

// //     console.log(
// //       '======================================'
// //     )

// //     console.log(
// //       'Email sent successfully to:',
// //       employee.email
// //     )

// //     console.log(
// //       'Logo embedded with CID successfully'
// //     )

// //     console.log(
// //       '======================================'
// //     )

// //     // ========================================================
// //     // SUCCESS
// //     // ========================================================

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         message:
// //           'Password reset link has been sent to your email.',
// //       },
// //       { status: 200 }
// //     )

// //   } catch (error: unknown) {

// //     console.error(
// //       'Employee forgot password error:',
// //       error
// //     )

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         message: getErrorMessage(
// //           error,
// //           'Something went wrong.'
// //         ),
// //       },
// //       { status: 500 }
// //     )
// //   }
// // }


// // app/api/auth/employee-forgot-password/route.ts

// import { NextResponse } from 'next/server'
// import { supabaseAdmin } from '@/utils/supabase/admin'
// import nodemailer from 'nodemailer'
// import fs from 'fs'
// import path from 'path'

// // ============================================================
// // GMAIL SMTP
// // ============================================================

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// })

// // ============================================================
// // ERROR HELPER
// // ============================================================

// const getErrorMessage = (err: unknown, fallback: string): string => {
//   if (err instanceof Error) return err.message
//   if (typeof err === 'string') return err
//   return fallback
// }

// // ============================================================
// // SITE URL
// // ============================================================

// function getSiteUrl(req: Request): string {
//   // 1. NEXT_PUBLIC_SITE_URL
//   const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

//   if (
//     envUrl &&
//     !envUrl.includes('localhost') &&
//     !envUrl.includes('127.0.0.1')
//   ) {
//     return envUrl.replace(/\/+$/, '')
//   }

//   // 2. Vercel production URL
//   const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

//   if (
//     vercelProdUrl &&
//     !vercelProdUrl.includes('localhost') &&
//     !vercelProdUrl.includes('127.0.0.1')
//   ) {
//     return `https://${vercelProdUrl.replace(/^https?:\/\//, '')}`
//   }

//   // 3. Vercel deployment URL
//   const vercelUrl = process.env.VERCEL_URL?.trim()

//   if (
//     vercelUrl &&
//     !vercelUrl.includes('localhost') &&
//     !vercelUrl.includes('127.0.0.1')
//   ) {
//     return `https://${vercelUrl.replace(/^https?:\/\//, '')}`
//   }

//   // 4. Request host
//   try {
//     const proto = req.headers.get('x-forwarded-proto') || 'https'

//     const host =
//       req.headers.get('x-forwarded-host') || req.headers.get('host')

//     if (
//       host &&
//       !host.includes('localhost') &&
//       !host.includes('127.0.0.1')
//     ) {
//       return `${proto}://${host}`
//     }
//   } catch {
//     // Ignore
//   }

//   return 'http://localhost:3000'
// }

// // ============================================================
// // GET LOGO BUFFER (FOR CID EMBEDDING)
// // ============================================================
// //
// // Priority:
// //   1. Local file  →  public/logo.png   (fast, no network)
// //   2. Remote URL  →  fetch from DB     (fallback)
// //
// // Returns null if logo could not be loaded.
// // ============================================================

// async function getLogoBuffer(
//   logoFromDb: string
// ): Promise<{ buffer: Buffer; contentType: string } | null> {
//   // 1. Try local public/logo.png
//   try {
//     const localPath = path.join(process.cwd(), 'public', 'logo.png')

//     if (fs.existsSync(localPath)) {
//       const buffer = fs.readFileSync(localPath)

//       console.log('✅ Logo loaded from local file:', localPath)

//       return {
//         buffer,
//         contentType: 'image/png',
//       }
//     }

//     console.log('⚠️ Local logo not found at:', localPath)
//   } catch (err) {
//     console.error('Failed to read local logo:', err)
//   }

//   // 2. Try remote URL from DB
//   if (logoFromDb && /^https?:\/\//i.test(logoFromDb)) {
//     try {
//       const res = await fetch(logoFromDb)

//       if (res.ok) {
//         const arrayBuffer = await res.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)

//         const contentType =
//           res.headers.get('content-type') || 'image/png'

//         console.log('✅ Logo loaded from DB URL:', logoFromDb)

//         return { buffer, contentType }
//       }

//       console.log('⚠️ Failed to fetch DB logo:', res.status)
//     } catch (err) {
//       console.error('Failed to fetch DB logo:', err)
//     }
//   }

//   console.log('❌ No logo could be loaded')

//   return null
// }

// // ============================================================
// // POST
// // ============================================================

// export async function POST(req: Request) {
//   try {
//     // ========================================================
//     // REQUEST BODY
//     // ========================================================

//     const body = await req.json()
//     const { email } = body

//     console.log('======================================')
//     console.log('EMPLOYEE FORGOT PASSWORD')
//     console.log('Requested email:', email)
//     console.log('======================================')

//     // ========================================================
//     // VALIDATE EMAIL
//     // ========================================================

//     if (!email || typeof email !== 'string') {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Email is required.',
//         },
//         { status: 400 }
//       )
//     }

//     const normalizedEmail = email.toLowerCase().trim()

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//     if (!emailRegex.test(normalizedEmail)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Please enter a valid email address.',
//         },
//         { status: 400 }
//       )
//     }

//     // ========================================================
//     // FIND EMPLOYEE
//     // ========================================================

//     const { data: employee, error: employeeError } = await supabaseAdmin
//       .from('employees')
//       .select('id, employee_id, username, full_name, email')
//       .ilike('email', normalizedEmail)
//       .maybeSingle()

//     if (employeeError) {
//       console.error('Employee lookup error:', employeeError)

//       return NextResponse.json(
//         {
//           success: false,
//           message: 'Unable to check account.',
//         },
//         { status: 500 }
//       )
//     }

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: 'No account found with this email.',
//         },
//         { status: 404 }
//       )
//     }

//     if (!employee.email) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             'No email linked to this account. Please contact HR admin.',
//         },
//         { status: 400 }
//       )
//     }

//     // ========================================================
//     // GET LOGO FROM DATABASE
//     // ========================================================

//     const { data: logoRow, error: logoError } = await supabaseAdmin
//       .from('logo1')
//       .select('logo')
//       .limit(1)
//       .maybeSingle()

//     if (logoError) {
//       console.log('Logo DB lookup skipped:', logoError.message)
//     }

//     const logoFromDb =
//       typeof logoRow?.logo === 'string' ? logoRow.logo.trim() : ''

//     // ========================================================
//     // SITE URL
//     // ========================================================

//     const siteUrl = getSiteUrl(req)

//     console.log('======================================')
//     console.log('SITE URL:', siteUrl)
//     console.log('======================================')

//     // ========================================================
//     // LOAD LOGO AS BUFFER FOR CID EMBEDDING
//     // ========================================================

//     const logoData = await getLogoBuffer(logoFromDb)

//     // ========================================================
//     // RESET TOKEN
//     // ========================================================

//     const resetToken = crypto.randomUUID()

//     const expiresAt = new Date(
//       Date.now() + 30 * 60 * 1000
//     ).toISOString()

//     // ========================================================
//     // SAVE RESET TOKEN
//     // ========================================================

//     const { error: updateError } = await supabaseAdmin
//       .from('employees')
//       .update({
//         reset_token: resetToken,
//         reset_token_expires_at: expiresAt,
//       })
//       .eq('id', employee.id)

//     if (updateError) {
//       console.error('Token save error:', updateError)

//       return NextResponse.json(
//         {
//           success: false,
//           message: `Unable to create reset link: ${updateError.message}`,
//         },
//         { status: 500 }
//       )
//     }

//     // ========================================================
//     // RESET URL
//     // ========================================================

//     const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(
//       resetToken
//     )}`

//     console.log('RESET URL:', resetUrl)
//     console.log('EMAIL:', employee.email)

//     // ========================================================
//     // GREETING
//     // ========================================================

//     const greetingName =
//       employee.full_name?.trim() || employee.username || 'there'

//     // ========================================================
//     // PLAIN TEXT EMAIL
//     // ========================================================

//     const textVersion = `
// Hello ${greetingName},

// We received a request to reset your employee account password for A to Zee Switchgear Engineering (SMC) Pvt. Ltd.

// To reset your password, please open the link below:

// ${resetUrl}

// If you did not request this password reset, you can safely ignore this email.

// © 2026 A to Zee Switchgear Engineering (SMC) Pvt. Ltd. All rights reserved.
//     `.trim()

//     // ========================================================
//     // HTML EMAIL
//     // ========================================================

//     const htmlVersion = `
// <!DOCTYPE html>

// <html lang="en">

// <head>

//   <meta charset="UTF-8">

//   <meta
//     name="viewport"
//     content="width=device-width, initial-scale=1.0"
//   >

//   <meta
//     name="color-scheme"
//     content="light"
//   >

//   <meta
//     name="supported-color-schemes"
//     content="light"
//   >

//   <title>Password Reset</title>

//   <style>

//     body {
//       margin: 0;
//       padding: 0;
//       background-color: #ffffff;
//       font-family: Arial, Helvetica, sans-serif;
//     }

//     table {
//       border-collapse: collapse;
//     }

//     img {
//       border: 0;
//       outline: none;
//       text-decoration: none;
//       display: block;
//     }

//     .email-container {
//       width: 100%;
//       max-width: 600px;
//       margin: 0 auto;
//       background: #ffffff;
//     }

//     .email-wrapper {
//       padding: 40px;
//     }

//     .logo {
//       width: 220px;
//       max-width: 220px;
//       height: auto;
//       margin: 0 auto;
//     }

//     .heading {
//       color: #0071BD;
//       font-size: 26px;
//       font-weight: 700;
//       margin: 0 0 22px;
//     }

//     .text {
//       color: #555555;
//       font-size: 15px;
//       line-height: 1.6;
//       margin: 0 0 14px;
//     }

//     .button {
//       display: inline-block;
//       padding: 14px 36px;
//       background-color: #0071BD;
//       color: #ffffff !important;
//       text-decoration: none;
//       border-radius: 8px;
//       font-weight: 700;
//       font-size: 14px;
//       letter-spacing: 1px;
//     }

//     .footer {
//       color: #999999;
//       font-size: 12px;
//       text-align: center;
//     }

//     @media only screen and (max-width: 480px) {

//       .email-wrapper {
//         padding: 20px !important;
//       }

//       .logo {
//         width: 180px !important;
//         max-width: 180px !important;
//       }

//       .heading {
//         font-size: 22px !important;
//       }

//       .button {
//         padding: 12px 24px !important;
//         font-size: 13px !important;
//       }

//     }

//   </style>

// </head>

// <body
//   style="
//     margin:0;
//     padding:0;
//     background:#ffffff;
//   "
// >

//   <table
//     width="100%"
//     cellpadding="0"
//     cellspacing="0"
//     border="0"
//     style="background:#ffffff;"
//   >

//     <tr>

//       <td align="center">

//         <table
//           class="email-container"
//           width="600"
//           cellpadding="0"
//           cellspacing="0"
//           border="0"
//           style="
//             width:100%;
//             max-width:600px;
//             background:#ffffff;
//           "
//         >

//           <tr>

//             <td
//               class="email-wrapper"
//               style="
//                 padding:40px;
//                 background:#ffffff;
//               "
//             >

//               <!-- ================================================= -->
//               <!-- LOGO (CID EMBEDDED) -->
//               <!-- ================================================= -->

//               <table
//                 width="100%"
//                 cellpadding="0"
//                 cellspacing="0"
//                 border="0"
//               >

//                 <tr>

//                   <td
//                     align="center"
//                     style="padding-bottom:32px;"
//                   >

//                     <a
//                       href="${siteUrl}"
//                       target="_blank"
//                       style="
//                         text-decoration:none;
//                       "
//                     >

//                       <img
//                         src="cid:atozee-logo@atozee"
//                         alt="A to Zee Switchgear Engineering"
//                         width="220"
//                         class="logo"
//                         style="
//                           display:block;
//                           width:220px;
//                           max-width:220px;
//                           height:auto;
//                           margin:0 auto;
//                           border:0;
//                           outline:none;
//                           text-decoration:none;
//                         "
//                       >

//                     </a>

//                   </td>

//                 </tr>

//               </table>

//               <!-- ================================================= -->
//               <!-- DIVIDER -->
//               <!-- ================================================= -->

//               <div
//                 style="
//                   border-top:3px solid #0071BD;
//                   margin-bottom:32px;
//                   height:1px;
//                   line-height:1px;
//                 "
//               ></div>

//               <!-- ================================================= -->
//               <!-- HEADING -->
//               <!-- ================================================= -->

//               <h2
//                 class="heading"
//                 style="
//                   margin:0 0 22px;
//                   color:#0071BD;
//                   font-size:26px;
//                   line-height:1.3;
//                   font-weight:700;
//                 "
//               >
//                 Password Reset
//               </h2>

//               <!-- ================================================= -->
//               <!-- GREETING -->
//               <!-- ================================================= -->

//               <p
//                 class="text"
//                 style="
//                   color:#333333;
//                   font-size:15px;
//                   line-height:1.6;
//                   margin:0 0 14px;
//                 "
//               >

//                 Hello
//                 <strong>${greetingName}</strong>,

//               </p>

//               <!-- ================================================= -->
//               <!-- BODY -->
//               <!-- ================================================= -->

//               <p
//                 class="text"
//                 style="
//                   color:#555555;
//                   font-size:15px;
//                   line-height:1.6;
//                   margin:0 0 14px;
//                 "
//               >

//                 We received a request to reset your employee
//                 account password for

//                 <strong style="color:#0071BD;">
//                   A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
//                 </strong>

//               </p>

//               <p
//                 class="text"
//                 style="
//                   color:#555555;
//                   font-size:15px;
//                   line-height:1.6;
//                   margin:0 0 14px;
//                 "
//               >

//                 Click the button below to reset your password:

//               </p>

//               <!-- ================================================= -->
//               <!-- BUTTON -->
//               <!-- ================================================= -->

//               <table
//                 width="100%"
//                 cellpadding="0"
//                 cellspacing="0"
//                 border="0"
//               >

//                 <tr>

//                   <td
//                     align="center"
//                     style="padding:32px 0;"
//                   >

//                     <a
//                       href="${resetUrl}"
//                       target="_blank"
//                       class="button"
//                       style="
//                         display:inline-block;
//                         padding:14px 36px;
//                         background:#0071BD;
//                         color:#ffffff !important;
//                         text-decoration:none;
//                         border-radius:8px;
//                         font-weight:700;
//                         font-size:14px;
//                         letter-spacing:1px;
//                       "
//                     >

//                       RESET PASSWORD

//                     </a>

//                   </td>

//                 </tr>

//               </table>

//               <!-- ================================================= -->
//               <!-- WARNING -->
//               <!-- ================================================= -->

//               <p
//                 style="
//                   color:#777777;
//                   font-size:14px;
//                   line-height:1.6;
//                   margin:0 0 14px;
//                 "
//               >

//                 If you did not request this password reset,
//                 you can safely ignore this email.

//               </p>

//               <!-- ================================================= -->
//               <!-- FOOTER DIVIDER -->
//               <!-- ================================================= -->

//               <div
//                 style="
//                   border-top:1px solid #E6F2FA;
//                   margin:32px 0 20px;
//                   height:1px;
//                   line-height:1px;
//                 "
//               ></div>

//               <!-- ================================================= -->
//               <!-- FOOTER -->
//               <!-- ================================================= -->

//               <p
//                 class="footer"
//                 style="
//                   color:#999999;
//                   font-size:12px;
//                   line-height:1.5;
//                   margin:0;
//                   text-align:center;
//                 "
//               >

//                 © 2026 A to Zee Switchgear Engineering
//                 (SMC) Pvt. Ltd. All rights reserved.

//               </p>

//             </td>

//           </tr>

//         </table>

//       </td>

//     </tr>

//   </table>

// </body>

// </html>
//     `.trim()

//     // ========================================================
//     // BUILD ATTACHMENTS (only if logo available)
//     // ========================================================

//     const attachments = logoData
//       ? [
//           {
//             filename: 'logo.png',
//             content: logoData.buffer, // ✅ Buffer (not href)
//             contentType: logoData.contentType,
//             cid: 'atozee-logo@atozee', // ✅ Must match <img src="cid:...">
//           },
//         ]
//       : []

//     // ========================================================
//     // SEND EMAIL
//     // ========================================================

//     await transporter.sendMail({
//       from: `"A to Zee Switchgear" <${process.env.GMAIL_USER}>`,

//       to: employee.email,

//       replyTo: process.env.GMAIL_USER,

//       subject: 'Password Reset Request - A to Zee Switchgear',

//       text: textVersion,

//       html: htmlVersion,

//       attachments, // ✅ CID embedded logo

//       headers: {
//         'X-Entity-Ref-ID': resetToken,

//         'X-Priority': '3',

//         'X-MSMail-Priority': 'Normal',

//         Importance: 'Normal',

//         'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
//       },
//     })

//     console.log('======================================')
//     console.log('Email sent successfully to:', employee.email)

//     if (logoData) {
//       console.log('✅ Logo embedded with CID successfully')
//     } else {
//       console.log('⚠️ Email sent WITHOUT logo (logo not found)')
//     }

//     console.log('======================================')

//     // ========================================================
//     // SUCCESS
//     // ========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Password reset link has been sent to your email.',
//       },
//       { status: 200 }
//     )
//   } catch (error: unknown) {
//     console.error('Employee forgot password error:', error)

//     return NextResponse.json(
//       {
//         success: false,
//         message: getErrorMessage(error, 'Something went wrong.'),
//       },
//       { status: 500 }
//     )
//   }
// }


// app/api/auth/employee-forgot-password/route.ts

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// ============================================================
// GMAIL SMTP
// ============================================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// ============================================================
// ERROR HELPER
// ============================================================

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return fallback
}

// ============================================================
// SITE URL
// ============================================================

function getSiteUrl(req: Request): string {
  // 1. NEXT_PUBLIC_SITE_URL
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (
    envUrl &&
    !envUrl.includes('localhost') &&
    !envUrl.includes('127.0.0.1')
  ) {
    return envUrl.replace(/\/+$/, '')
  }

  // 2. Vercel production URL
  const vercelProdUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

  if (
    vercelProdUrl &&
    !vercelProdUrl.includes('localhost') &&
    !vercelProdUrl.includes('127.0.0.1')
  ) {
    return `https://${vercelProdUrl.replace(/^https?:\/\//, '')}`
  }

  // 3. Vercel deployment URL
  const vercelUrl = process.env.VERCEL_URL?.trim()

  if (
    vercelUrl &&
    !vercelUrl.includes('localhost') &&
    !vercelUrl.includes('127.0.0.1')
  ) {
    return `https://${vercelUrl.replace(/^https?:\/\//, '')}`
  }

  // 4. Request host
  try {
    const proto = req.headers.get('x-forwarded-proto') || 'https'

    const host =
      req.headers.get('x-forwarded-host') || req.headers.get('host')

    if (
      host &&
      !host.includes('localhost') &&
      !host.includes('127.0.0.1')
    ) {
      return `${proto}://${host}`
    }
  } catch {
    // Ignore
  }

  return 'http://localhost:3000'
}

// ============================================================
// GET LOGO BUFFER (FOR CID EMBEDDING)
// ============================================================
//
// Priority:
//   1. Local file  →  public/logo.png   (fast, no network)
//   2. Remote URL  →  fetch from DB     (fallback)
//
// Returns null if logo could not be loaded.
// ============================================================

async function getLogoBuffer(
  logoFromDb: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  // 1. Try local public/logo.png
  try {
    const localPath = path.join(process.cwd(), 'public', 'logo.png')

    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath)

      console.log('✅ Logo loaded from local file:', localPath)

      return {
        buffer,
        contentType: 'image/png',
      }
    }

    console.log('⚠️ Local logo not found at:', localPath)
  } catch (err) {
    console.error('Failed to read local logo:', err)
  }

  // 2. Try remote URL from DB
  if (logoFromDb && /^https?:\/\//i.test(logoFromDb)) {
    try {
      const res = await fetch(logoFromDb)

      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const contentType =
          res.headers.get('content-type') || 'image/png'

        console.log('✅ Logo loaded from DB URL:', logoFromDb)

        return { buffer, contentType }
      }

      console.log('⚠️ Failed to fetch DB logo:', res.status)
    } catch (err) {
      console.error('Failed to fetch DB logo:', err)
    }
  }

  console.log('❌ No logo could be loaded')

  return null
}

// ============================================================
// POST
// ============================================================

export async function POST(req: Request) {
  try {
    // ========================================================
    // REQUEST BODY
    // ========================================================

    const body = await req.json()
    const { email } = body

    console.log('======================================')
    console.log('EMPLOYEE FORGOT PASSWORD')
    console.log('Requested email:', email)
    console.log('======================================')

    // ========================================================
    // VALIDATE EMAIL
    // ========================================================

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required.',
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a valid email address.',
        },
        { status: 400 }
      )
    }

    // ========================================================
    // FIND EMPLOYEE
    // ========================================================

    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id, employee_id, username, full_name, email')
      .ilike('email', normalizedEmail)
      .maybeSingle()

    if (employeeError) {
      console.error('Employee lookup error:', employeeError)

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to check account.',
        },
        { status: 500 }
      )
    }

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found with this email.',
        },
        { status: 404 }
      )
    }

    if (!employee.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No email linked to this account. Please contact HR admin.',
        },
        { status: 400 }
      )
    }

    // ========================================================
    // GET LOGO FROM DATABASE
    // ========================================================

    const { data: logoRow, error: logoError } = await supabaseAdmin
      .from('logo1')
      .select('logo')
      .limit(1)
      .maybeSingle()

    if (logoError) {
      console.log('Logo DB lookup skipped:', logoError.message)
    }

    const logoFromDb =
      typeof logoRow?.logo === 'string' ? logoRow.logo.trim() : ''

    // ========================================================
    // SITE URL
    // ========================================================

    const siteUrl = getSiteUrl(req)

    console.log('======================================')
    console.log('SITE URL:', siteUrl)
    console.log('======================================')

    // ========================================================
    // LOAD LOGO AS BUFFER FOR CID EMBEDDING
    // ========================================================

    const logoData = await getLogoBuffer(logoFromDb)

    // ========================================================
    // RESET TOKEN
    // ========================================================

    const resetToken = crypto.randomUUID()

    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000
    ).toISOString()

    // ========================================================
    // SAVE RESET TOKEN
    // ========================================================

    const { error: updateError } = await supabaseAdmin
      .from('employees')
      .update({
        reset_token: resetToken,
        reset_token_expires_at: expiresAt,
      })
      .eq('id', employee.id)

    if (updateError) {
      console.error('Token save error:', updateError)

      return NextResponse.json(
        {
          success: false,
          message: `Unable to create reset link: ${updateError.message}`,
        },
        { status: 500 }
      )
    }

    // ========================================================
    // RESET URL
    // ========================================================

    const resetUrl = `${siteUrl}/reset-password?token=${encodeURIComponent(
      resetToken
    )}`

    console.log('RESET URL:', resetUrl)
    console.log('EMAIL:', employee.email)

    // ========================================================
    // GREETING
    // ========================================================

    const greetingName =
      employee.full_name?.trim() || employee.username || 'there'

    // ========================================================
    // PLAIN TEXT EMAIL
    // ========================================================

    const textVersion = `
Hello ${greetingName},

We received a request to reset your employee account password for A to Zee Switchgear Engineering (SMC) Pvt. Ltd.

To reset your password, please open the link below:

${resetUrl}

If you did not request this password reset, you can safely ignore this email.

© 2026 A to Zee Switchgear Engineering (SMC) Pvt. Ltd. All rights reserved.
    `.trim()

    // ========================================================
    // HTML EMAIL
    // ========================================================

    const htmlVersion = `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="color-scheme"
    content="light"
  >

  <meta
    name="supported-color-schemes"
    content="light"
  >

  <title>Password Reset</title>

  <style>

    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
    }

    table {
      border-collapse: collapse;
    }

    img {
      border: 0;
      outline: none;
      text-decoration: none;
      display: block;
    }

    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }

    .email-wrapper {
      padding: 40px;
    }

    .logo {
      width: 220px;
      max-width: 220px;
      height: auto;
      margin: 0 auto;
    }

    .heading {
      color: #0071BD;
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 22px;
    }

    .text {
      color: #555555;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 14px;
    }

    .button {
      display: inline-block;
      padding: 14px 36px;
      background-color: #0071BD;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1px;
    }

    .footer {
      color: #999999;
      font-size: 12px;
      text-align: center;
    }

    @media only screen and (max-width: 480px) {

      .email-wrapper {
        padding: 20px !important;
      }

      .logo {
        width: 180px !important;
        max-width: 180px !important;
      }

      .heading {
        font-size: 22px !important;
      }

      .button {
        padding: 12px 24px !important;
        font-size: 13px !important;
      }

    }

  </style>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#ffffff;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#ffffff;"
  >

    <tr>

      <td align="center">

        <table
          class="email-container"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:600px;
            background:#ffffff;
          "
        >

          <tr>

            <td
              class="email-wrapper"
              style="
                padding:40px;
                background:#ffffff;
              "
            >

              <!-- ================================================= -->
              <!-- LOGO (CID EMBEDDED) -->
              <!-- ================================================= -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    align="center"
                    style="padding-bottom:32px;"
                  >

                    <a
                      href="${siteUrl}"
                      target="_blank"
                      style="
                        text-decoration:none;
                      "
                    >

                      <img
                        src="cid:atozee-logo@atozee"
                        alt="A to Zee Switchgear Engineering (SMC) Pvt. Ltd."
                        width="220"
                        class="logo"
                        style="
                          display:block;
                          width:220px;
                          max-width:220px;
                          height:auto;
                          margin:0 auto;
                          border:0;
                          outline:none;
                          text-decoration:none;
                        "
                      >

                    </a>

                  </td>

                </tr>

              </table>

              <!-- ================================================= -->
              <!-- DIVIDER -->
              <!-- ================================================= -->

              <div
                style="
                  border-top:3px solid #0071BD;
                  margin-bottom:32px;
                  height:1px;
                  line-height:1px;
                "
              ></div>

              <!-- ================================================= -->
              <!-- HEADING -->
              <!-- ================================================= -->

              <h2
                class="heading"
                style="
                  margin:0 0 22px;
                  color:#0071BD;
                  font-size:26px;
                  line-height:1.3;
                  font-weight:700;
                "
              >
                Password Reset
              </h2>

              <!-- ================================================= -->
              <!-- GREETING -->
              <!-- ================================================= -->

              <p
                class="text"
                style="
                  color:#333333;
                  font-size:15px;
                  line-height:1.6;
                  margin:0 0 14px;
                "
              >

                Hello
                <strong>${greetingName}</strong>,

              </p>

              <!-- ================================================= -->
              <!-- BODY -->
              <!-- ================================================= -->

              <p
                class="text"
                style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.6;
                  margin:0 0 14px;
                "
              >

                We received a request to reset your employee
                account password for

                <strong style="color:#0071BD;">
                  A to Zee Switchgear Engineering (SMC) Pvt. Ltd.
                </strong>

              </p>

              <p
                class="text"
                style="
                  color:#555555;
                  font-size:15px;
                  line-height:1.6;
                  margin:0 0 14px;
                "
              >

                Click the button below to reset your password:

              </p>

              <!-- ================================================= -->
              <!-- BUTTON -->
              <!-- ================================================= -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    align="center"
                    style="padding:32px 0;"
                  >

                    <a
                      href="${resetUrl}"
                      target="_blank"
                      class="button"
                      style="
                        display:inline-block;
                        padding:14px 36px;
                        background:#0071BD;
                        color:#ffffff !important;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:700;
                        font-size:14px;
                        letter-spacing:1px;
                      "
                    >

                      RESET PASSWORD

                    </a>

                  </td>

                </tr>

              </table>

              <!-- ================================================= -->
              <!-- WARNING -->
              <!-- ================================================= -->

              <p
                style="
                  color:#777777;
                  font-size:14px;
                  line-height:1.6;
                  margin:0 0 14px;
                "
              >

                If you did not request this password reset,
                you can safely ignore this email.

              </p>

              <!-- ================================================= -->
              <!-- FOOTER DIVIDER -->
              <!-- ================================================= -->

              <div
                style="
                  border-top:1px solid #E6F2FA;
                  margin:32px 0 20px;
                  height:1px;
                  line-height:1px;
                "
              ></div>

              <!-- ================================================= -->
              <!-- FOOTER -->
              <!-- ================================================= -->

              <p
                class="footer"
                style="
                  color:#999999;
                  font-size:12px;
                  line-height:1.5;
                  margin:0;
                  text-align:center;
                "
              >

                © 2026 A to Zee Switchgear Engineering
                (SMC) Pvt. Ltd. All rights reserved.

              </p>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
    `.trim()

    // ========================================================
    // BUILD ATTACHMENTS (only if logo available)
    // ========================================================

    const attachments = logoData
      ? [
          {
            filename: 'logo.png',
            content: logoData.buffer, // ✅ Buffer (not href)
            contentType: logoData.contentType,
            cid: 'atozee-logo@atozee', // ✅ Must match <img src="cid:...">
          },
        ]
      : []

    // ========================================================
    // SEND EMAIL
    // ========================================================

    await transporter.sendMail({
      from: `"A to Zee Switchgear Engineering (SMC) Pvt. Ltd." <${process.env.GMAIL_USER}>`,

      to: employee.email,

      replyTo: process.env.GMAIL_USER,

      subject: 'Password Reset Request - A to Zee Switchgear Engineering (SMC) Pvt. Ltd.',

      text: textVersion,

      html: htmlVersion,

      attachments, // ✅ CID embedded logo

      headers: {
        'X-Entity-Ref-ID': resetToken,

        'X-Priority': '3',

        'X-MSMail-Priority': 'Normal',

        Importance: 'Normal',

        'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=unsubscribe>`,
      },
    })

    console.log('======================================')
    console.log('Email sent successfully to:', employee.email)

    if (logoData) {
      console.log('✅ Logo embedded with CID successfully')
    } else {
      console.log('⚠️ Email sent WITHOUT logo (logo not found)')
    }

    console.log('======================================')

    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset link has been sent to your email.',
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Employee forgot password error:', error)

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error, 'Something went wrong.'),
      },
      { status: 500 }
    )
  }
}