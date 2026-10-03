// // // app/reset-password/page.tsx
// // 'use client'

// // import { useState, useEffect, Suspense } from 'react'
// // import { useRouter, useSearchParams } from 'next/navigation'
// // import Image from 'next/image'
// // import { Roboto } from 'next/font/google'
// // import {
// //   Loader,
// //   AlertCircle,
// //   CheckCircle,
// //   Lock,
// //   ArrowRight,
// //   Eye,
// //   EyeOff,
// //   ShieldCheck,
// // } from 'lucide-react'

// // const roboto = Roboto({
// //   weight: ['100', '300', '400', '500', '700', '900'],
// //   style: ['normal', 'italic'],
// //   subsets: ['latin'],
// //   display: 'swap',
// // })

// // function ResetPasswordContent() {
// //   const router = useRouter()
// //   const searchParams = useSearchParams()

// //   const token = searchParams.get('token') || ''

// //   const [password, setPassword] = useState('')
// //   const [confirmPassword, setConfirmPassword] = useState('')
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

// //   const [error, setError] = useState('')
// //   const [success, setSuccess] = useState('')
// //   const [isLoading, setIsLoading] = useState(false)

// //   const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
// //   const [isValidating, setIsValidating] = useState(true)
// //   const [userName, setUserName] = useState('')

// //   // ============================================================
// //   // ✅ VALIDATE TOKEN ON MOUNT
// //   // ============================================================

// //   useEffect(() => {
// //     const validateToken = async () => {
// //       if (!token) {
// //         setIsValidToken(false)
// //         setError('No reset token provided.')
// //         setIsValidating(false)
// //         return
// //       }

// //       try {
// //         const response = await fetch(
// //           `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
// //           { method: 'GET' }
// //         )

// //         const data = await response.json()

// //         if (!response.ok || !data.success) {
// //           setIsValidToken(false)
// //           setError(data.message || 'Invalid or expired reset link.')
// //         } else {
// //           setIsValidToken(true)
// //           setUserName(data.fullName || '')
// //         }
// //       } catch (err) {
// //         console.error('Token validation error:', err)
// //         setIsValidToken(false)
// //         setError('Unable to verify reset link. Please try again.')
// //       } finally {
// //         setIsValidating(false)
// //       }
// //     }

// //     validateToken()
// //   }, [token])

// //   // ============================================================
// //   // ✅ HANDLE SUBMIT
// //   // ============================================================

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError('')
// //     setSuccess('')

// //     if (password.length < 6) {
// //       setError('Password must be at least 6 characters long.')
// //       return
// //     }

// //     if (password !== confirmPassword) {
// //       setError('Passwords do not match.')
// //       return
// //     }

// //     setIsLoading(true)

// //     try {
// //       const response = await fetch('/api/auth/reset-password', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ token, password }),
// //       })

// //       const data = await response.json()

// //       if (!response.ok || !data.success) {
// //         setError(data.message || 'Failed to reset password.')
// //         setIsLoading(false)
// //         return
// //       }

// //       setSuccess('Password reset successfully!')

// //       // ✅ Redirect to HOME page (http://localhost:3000/) after 2 seconds
// //       setTimeout(() => {
// //         window.location.replace('/')
// //       }, 2000)
// //     } catch (err) {
// //       console.error('Reset password error:', err)
// //       setError('An error occurred. Please try again.')
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   // ============================================================
// //   // RENDER — Token Validating
// //   // ============================================================

// //   if (isValidating) {
// //     return (
// //       <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //         <div className="text-center">
// //           <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
// //         </div>
// //       </div>
// //     )
// //   }

// //   // ============================================================
// //   // RENDER — Invalid Token
// //   // ============================================================

// //   if (!isValidToken) {
// //     return (
// //       <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //         <div className="max-w-md w-full">
// //           <div className="bg-white shadow-sm p-8 text-center">
// //             <div className="flex justify-center mb-4">
// //               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
// //                 <AlertCircle className="w-8 h-8 text-red-500" />
// //               </div>
// //             </div>

// //             <h2 className={`text-xl font-bold text-gray-800 mb-2 tracking-wide ${roboto.className}`}>
// //               Invalid or Expired Link
// //             </h2>

// //             <p className={`text-sm text-gray-600 mb-6 tracking-wide ${roboto.className}`}>
// //               {error || 'This password reset link is invalid or has expired. Please request a new one.'}
// //             </p>

// //             <button
// //               onClick={() => {
// //                 window.location.replace('/')
// //               }}
// //               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider ${roboto.className}`}
// //             >
// //               <span className={roboto.className}>Back to Home</span>
// //               <ArrowRight className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   // ============================================================
// //   // ✅ RENDER — SUCCESS (Small message only)
// //   // ============================================================

// //   if (success) {
// //     return (
// //       <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //         <div className="max-w-md w-full">
// //           <div className="bg-white shadow-sm p-8 text-center">
// //             <div className="flex justify-center mb-4">
// //               <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
// //                 <CheckCircle className="w-10 h-10 text-green-500" />
// //               </div>
// //             </div>

// //             <h2 className={`text-xl font-bold text-gray-800 mb-2 tracking-wide ${roboto.className}`}>
// //               Password Reset Successfully!
// //             </h2>

// //             <p className={`text-sm text-gray-500 tracking-wide ${roboto.className}`}>
// //               Redirecting to home page...
// //             </p>

// //             <div className="mt-6 flex justify-center">
// //               <Loader className="w-5 h-5 animate-spin text-[#0071BD]" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   // ============================================================
// //   // RENDER — Valid Token (Form)
// //   // ============================================================

// //   return (
// //     <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //       <div className="max-w-md w-full">
// //         <div className="text-center mb-8">
// //           <div className="flex justify-center mb-4">
// //             <div className="relative w-56 h-28">
// //               <Image src="/logo.png" alt="Company Logo" fill className="object-contain" priority />
// //             </div>
// //           </div>
// //           <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
// //             Reset Password
// //           </h1>
// //         </div>

// //         <div className="bg-white shadow-sm p-6 md:p-8">
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {userName && (
// //               <div className="bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
// //                 <ShieldCheck className="w-5 h-5 text-[#0071BD] flex-shrink-0 mt-0.5" />
// //                 <p className={`text-sm text-[#005a96] tracking-wide ${roboto.className}`}>
// //                   Hello <strong>{userName}</strong>, please enter your new password below.
// //                 </p>
// //               </div>
// //             )}

// //             {/* New Password */}
// //             <div>
// //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// //                 New Password
// //               </label>
// //               <div className="relative">
// //                 <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                 <input
// //                   type={showPassword ? 'text' : 'password'}
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// //                   placeholder="Enter new password"
// //                   required
// //                   disabled={isLoading}
// //                   minLength={6}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
// //                   disabled={isLoading}
// //                 >
// //                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                 </button>
// //               </div>
// //               <p className={`text-xs text-gray-400 mt-1 tracking-wide ${roboto.className}`}>
// //                 Minimum 6 characters
// //               </p>
// //             </div>

// //             {/* Confirm Password */}
// //             <div>
// //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// //                 Confirm Password
// //               </label>
// //               <div className="relative">
// //                 <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                 <input
// //                   type={showConfirmPassword ? 'text' : 'password'}
// //                   value={confirmPassword}
// //                   onChange={(e) => setConfirmPassword(e.target.value)}
// //                   className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// //                   placeholder="Confirm new password"
// //                   required
// //                   disabled={isLoading}
// //                   minLength={6}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
// //                   disabled={isLoading}
// //                 >
// //                   {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                 </button>
// //               </div>
// //             </div>

// //             {error && (
// //               <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
// //                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
// //                 <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
// //               </div>
// //             )}

// //             <button
// //               type="submit"
// //               disabled={isLoading}
// //               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
// //             >
// //               {isLoading ? (
// //                 <>
// //                   <Loader className="w-5 h-5 animate-spin" />
// //                   <span className={roboto.className}>Resetting...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <span className={roboto.className}>Reset Password</span>
// //                   <ArrowRight className="w-4 h-4" />
// //                 </>
// //               )}
// //             </button>

// //             <div className="mt-6 text-center space-y-2">
// //               <p className={`text-xs text-gray-400 tracking-wide ${roboto.className}`}>
// //                 © 2026 All rights reserved
// //               </p>
// //               <p className={`text-[11px] text-gray-400 tracking-widest ${roboto.className}`}>
// //                 System and Software generated by{' '}
// //                 <span className={`font-medium text-[#0071BD] tracking-widest ${roboto.className}`}>
// //                   Muhammad Hassan Jaffer
// //                 </span>
// //               </p>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default function ResetPasswordPage() {
// //   return (
// //     <Suspense
// //       fallback={
// //         <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //           <div className="text-center">
// //             <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
// //           </div>
// //         </div>
// //       }
// //     >
// //       <ResetPasswordContent />
// //     </Suspense>
// //   )
// // }


// // app/reset-password/page.tsx
// 'use client'

// import { useState, useEffect, Suspense } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import Image from 'next/image'
// import { Roboto } from 'next/font/google'
// import {
//   Loader,
//   AlertCircle,
//   CheckCircle,
//   Lock,
//   ArrowRight,
//   Eye,
//   EyeOff,
//   ShieldCheck,
// } from 'lucide-react'

// const roboto = Roboto({
//   weight: ['100', '300', '400', '500', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// function ResetPasswordContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   const token = searchParams.get('token') || ''

//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
//   const [isValidating, setIsValidating] = useState(true)
//   const [userName, setUserName] = useState('')

//   // ============================================================
//   // ✅ VALIDATE TOKEN ON MOUNT
//   // ============================================================

//   useEffect(() => {
//     const validateToken = async () => {
//       if (!token) {
//         setIsValidToken(false)
//         setError('No reset token provided.')
//         setIsValidating(false)
//         return
//       }

//       try {
//         const response = await fetch(
//           `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
//           { method: 'GET' }
//         )

//         const data = await response.json()

//         if (!response.ok || !data.success) {
//           setIsValidToken(false)
//           setError(data.message || 'Invalid or expired reset link.')
//         } else {
//           setIsValidToken(true)
//           setUserName(data.fullName || '')
//         }
//       } catch (err) {
//         console.error('Token validation error:', err)
//         setIsValidToken(false)
//         setError('Unable to verify reset link. Please try again.')
//       } finally {
//         setIsValidating(false)
//       }
//     }

//     validateToken()
//   }, [token])

//   // ============================================================
//   // ✅ HANDLE SUBMIT
//   // ============================================================

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.')
//       return
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match.')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/auth/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, password }),
//       })

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setError(data.message || 'Failed to reset password.')
//         setIsLoading(false)
//         return
//       }

//       setSuccess('Password reset successfully!')

//       // ✅ Redirect to home page after 2 seconds
//       setTimeout(() => {
//         window.location.replace('/')
//       }, 2000)
//     } catch (err) {
//       console.error('Reset password error:', err)
//       setError('An error occurred. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // ============================================================
//   // RENDER — Token Validating
//   // ============================================================

//   if (isValidating) {
//     return (
//       <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
//         </div>
//       </div>
//     )
//   }

//   // ============================================================
//   // RENDER — Invalid Token
//   // ============================================================

//   if (!isValidToken) {
//     return (
//       <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
//         <div className="max-w-md w-full">
//           <div className="bg-white shadow-sm p-8 text-center">
//             <div className="flex justify-center mb-4">
//               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
//                 <AlertCircle className="w-8 h-8 text-red-500" />
//               </div>
//             </div>

//             <h2 className={`text-xl font-bold text-gray-800 mb-2 tracking-wide ${roboto.className}`}>
//               Invalid or Expired Link
//             </h2>

//             <p className={`text-sm text-gray-600 mb-6 tracking-wide ${roboto.className}`}>
//               {error || 'This password reset link is invalid or has expired. Please request a new one.'}
//             </p>

//             <button
//               onClick={() => {
//                 window.location.replace('/')
//               }}
//               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider ${roboto.className}`}
//             >
//               <span className={roboto.className}>Back to Home</span>
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ============================================================
//   // RENDER — Valid Token (Form) — Success shows inline message
//   // ============================================================

//   return (
//     <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
//       <div className="max-w-md w-full">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="relative w-56 h-28">
//               <Image src="/logo.png" alt="Company Logo" fill className="object-contain" priority />
//             </div>
//           </div>
//           <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
//             Reset Password
//           </h1>
//         </div>

//         <div className="bg-white shadow-sm p-6 md:p-8">
//           {/* ✅ SUCCESS — Ek line ka message (form ki jagah) */}
//           {success ? (
//             <div className="py-6 text-center">
//               <p className={`text-base font-medium text-green-600 tracking-wide ${roboto.className}`}>
//                 {success} Redirecting...
//               </p>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {userName && (
//                 <div className="bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
//                   <ShieldCheck className="w-5 h-5 text-[#0071BD] flex-shrink-0 mt-0.5" />
//                   <p className={`text-sm text-[#005a96] tracking-wide ${roboto.className}`}>
//                     Hello <strong>{userName}</strong>, please enter your new password below.
//                   </p>
//                 </div>
//               )}

//               {/* New Password */}
//               <div>
//                 <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
//                     placeholder="Enter new password"
//                     required
//                     disabled={isLoading}
//                     minLength={6}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                     disabled={isLoading}
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 <p className={`text-xs text-gray-400 mt-1 tracking-wide ${roboto.className}`}>
//                   Minimum 6 characters
//                 </p>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
//                     placeholder="Confirm new password"
//                     required
//                     disabled={isLoading}
//                     minLength={6}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                     disabled={isLoading}
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
//                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                   <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader className="w-5 h-5 animate-spin" />
//                     <span className={roboto.className}>Resetting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className={roboto.className}>Reset Password</span>
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>

//               <div className="mt-6 text-center space-y-2">
//                 <p className={`text-xs text-gray-400 tracking-wide ${roboto.className}`}>
//                   © 2026 All rights reserved
//                 </p>
//                 <p className={`text-[11px] text-gray-400 tracking-widest ${roboto.className}`}>
//                   System and Software generated by{' '}
//                   <span className={`font-medium text-[#0071BD] tracking-widest ${roboto.className}`}>
//                     Muhammad Hassan Jaffer
//                   </span>
//                 </p>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function ResetPasswordPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
//           <div className="text-center">
//             <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
//           </div>
//         </div>
//       }
//     >
//       <ResetPasswordContent />
//     </Suspense>
//   )
// }


// app/reset-password/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Roboto } from 'next/font/google'
import {
  Loader,
  AlertCircle,
  CheckCircle,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react'

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isValidating, setIsValidating] = useState(true)

  // ============================================================
  // ✅ VALIDATE TOKEN ON MOUNT
  // ============================================================

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false)
        setError('No reset token provided.')
        setIsValidating(false)
        return
      }

      try {
        const response = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
          { method: 'GET' }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          setIsValidToken(false)
          setError(data.message || 'Invalid or expired reset link.')
        } else {
          setIsValidToken(true)
        }
      } catch (err) {
        console.error('Token validation error:', err)
        setIsValidToken(false)
        setError('Unable to verify reset link. Please try again.')
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  // ============================================================
  // ✅ HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to reset password.')
        setIsLoading(false)
        return
      }

      setSuccess('Password reset successfully!')

      // ✅ Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.replace('/')
      }, 2000)
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================
  // RENDER — Token Validating
  // ============================================================

  if (isValidating) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER — Invalid Token
  // ============================================================

  if (!isValidToken) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
        <div className="max-w-md w-full">
          <div className="bg-white shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h2 className={`text-xl font-bold text-gray-800 mb-2 tracking-wide ${roboto.className}`}>
              Invalid or Expired Link
            </h2>

            <p className={`text-sm text-gray-600 mb-6 tracking-wide ${roboto.className}`}>
              {error || 'This password reset link is invalid or has expired. Please request a new one.'}
            </p>

            <button
              onClick={() => {
                window.location.replace('/')
              }}
              className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider ${roboto.className}`}
            >
              <span className={roboto.className}>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER — Valid Token (Form) — Success shows inline message
  // ============================================================

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-56 h-28">
              <Image src="/logo.png" alt="Company Logo" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
            Reset Password
          </h1>
        </div>

        <div className="bg-white shadow-sm p-6 md:p-8">
          {/* ✅ SUCCESS — Ek line ka message (form ki jagah) */}
          {success ? (
            <div className="py-6 text-center">
              <p className={`text-base font-medium text-green-600 tracking-wide ${roboto.className}`}>
                {success} Redirecting...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className={`text-xs text-gray-400 mt-1 tracking-wide ${roboto.className}`}>
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className={roboto.className}>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span className={roboto.className}>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 text-center space-y-2">
                <p className={`text-xs text-gray-400 tracking-wide ${roboto.className}`}>
                  © 2026 All rights reserved
                </p>
                <p className={`text-[11px] text-gray-400 tracking-widest ${roboto.className}`}>
                  System and Software generated by{' '}
                  <span className={`font-medium text-[#0071BD] tracking-widest ${roboto.className}`}>
                    Muhammad Hassan Jaffer
                  </span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-[#0071BD] mx-auto mb-4" />
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}