// // // 'use client'

// // // import { useState } from 'react'
// // // import { useRouter } from 'next/navigation'
// // // import { useAuth } from '@/context/AuthContext'
// // // import Image from 'next/image'
// // // import { Roboto } from 'next/font/google'
// // // import { Loader, AlertCircle, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

// // // const roboto = Roboto({
// // //   weight: ['100', '300', '400', '500', '700', '900'],
// // //   style: ['normal', 'italic'],
// // //   subsets: ['latin'],
// // //   display: 'swap',
// // // })

// // // export default function LoginPage() {
// // //   const router = useRouter()
// // //   const { login } = useAuth()
// // //   const [username, setUsername] = useState('')
// // //   const [password, setPassword] = useState('')
// // //   const [error, setError] = useState('')
// // //   const [isLoading, setIsLoading] = useState(false)
// // //   const [showPassword, setShowPassword] = useState(false)

// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()
// // //     setError('')
// // //     setIsLoading(true)

// // //     try {
// // //       const success = await login(username, password)
      
// // //       if (success) {
// // //         router.push('/hr/dashboard')
// // //       } else {
// // //         setError('Invalid username or password')
// // //       }
// // //     } catch (err) {
// // //       setError('An error occurred. Please try again.')
// // //       console.error('Login error:', err)
// // //     } finally {
// // //       setIsLoading(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// // //       <div className="max-w-md w-full">
// // //         {/* Logo & Header */}
// // //         <div className="text-center mb-8">
// // //           <div className="flex justify-center mb-4">
// // //             <div className="relative w-56 h-28">
// // //               <Image
// // //                 src="/logo.png"
// // //                 alt="Company Logo"
// // //                 fill
// // //                 className="object-contain"
// // //                 priority
// // //               />
// // //             </div>
// // //           </div>
// // //           <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
// // //             HR Login
// // //           </h1>
// // //         </div>

// // //         {/* Login Card */}
// // //         <div className="bg-white shadow-sm p-6 md:p-8">
// // //           <form onSubmit={handleSubmit} className="space-y-6">
// // //             {/* Username Field */}
// // //             <div>
// // //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// // //                 Username
// // //               </label>
// // //               <div className="relative">
// // //                 <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //                 <input
// // //                   type="text"
// // //                   value={username}
// // //                   onChange={(e) => setUsername(e.target.value)}
// // //                   className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// // //                   placeholder="Enter your username"
// // //                   required
// // //                   disabled={isLoading}
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Password Field with Eye Button */}
// // //             <div>
// // //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// // //                 Password
// // //               </label>
// // //               <div className="relative">
// // //                 <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //                 <input
// // //                   type={showPassword ? 'text' : 'password'}
// // //                   value={password}
// // //                   onChange={(e) => setPassword(e.target.value)}
// // //                   className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// // //                   placeholder="Enter your password"
// // //                   required
// // //                   disabled={isLoading}
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowPassword(!showPassword)}
// // //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
// // //                   disabled={isLoading}
// // //                 >
// // //                   {showPassword ? (
// // //                     <EyeOff className="w-5 h-5" />
// // //                   ) : (
// // //                     <Eye className="w-5 h-5" />
// // //                   )}
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {/* Error Message */}
// // //             {error && (
// // //               <div className={`bg-red-50 border border-red-200 p-3 flex items-start gap-2 ${roboto.className}`}>
// // //                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
// // //                 <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
// // //               </div>
// // //             )}

// // //             {/* Submit Button */}
// // //             <button
// // //               type="submit"
// // //               disabled={isLoading}
// // //               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
// // //             >
// // //               {isLoading ? (
// // //                 <>
// // //                   <Loader className="w-5 h-5 animate-spin" />
// // //                   <span className={roboto.className}>Signing in...</span>
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <span className={roboto.className}>Sign in</span>
// // //                   <ArrowRight className="w-4 h-4" />
// // //                 </>
// // //               )}
// // //             </button>

// // //             {/* Footer */}
// // //             <div className="mt-6 text-center space-y-2">
// // //               <p className={`text-xs text-gray-400 tracking-wide ${roboto.className}`}>
// // //                 © 2026 All rights reserved
// // //               </p>
// // //               <p className={`text-[11px] text-gray-400 tracking-widest ${roboto.className}`}>
// // //                 System and Software generated by{' '}
// // //                 <span className={`font-medium text-[#0071BD] tracking-widest ${roboto.className}`}>
// // //                   Muhammad Hassan Jaffer
// // //                 </span>
// // //               </p>
// // //             </div>
// // //           </form>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }


// // // app/hr/login/page.tsx
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter } from 'next/navigation'
// // import Image from 'next/image'
// // import { Roboto } from 'next/font/google'
// // import { Loader, AlertCircle, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

// // const roboto = Roboto({
// //   weight: ['100', '300', '400', '500', '700', '900'],
// //   style: ['normal', 'italic'],
// //   subsets: ['latin'],
// //   display: 'swap',
// // })

// // export default function HRLoginPage() {
// //   const router = useRouter()
// //   const [username, setUsername] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [error, setError] = useState('')
// //   const [isLoading, setIsLoading] = useState(false)
// //   const [showPassword, setShowPassword] = useState(false)

// //   // Check if already logged in
// //   useEffect(() => {
// //     const userData = localStorage.getItem('hrms_user')
// //     if (userData) {
// //       try {
// //         const data = JSON.parse(userData)
// //         if (data.username && data.role === 'hr') {
// //           router.replace('/hr/dashboard')
// //         }
// //       } catch (e) {
// //         console.error('Error parsing user data:', e)
// //         localStorage.removeItem('hrms_user')
// //       }
// //     }
// //   }, [router])

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError('')
// //     setIsLoading(true)

// //     try {
// //       const response = await fetch('/api/auth/hr-login', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ username, password }),
// //       })

// //       const data = await response.json()

// //       if (!response.ok || !data.success) {
// //         setError(data.message || 'Invalid username or password')
// //         setIsLoading(false)
// //         return
// //       }

// //       // ✅ Save user data to localStorage with correct role
// //       localStorage.setItem('hrms_user', JSON.stringify({
// //         username: data.username,
// //         role: 'hr',
// //         loginTime: new Date().toISOString()
// //       }))

// //       // ✅ Redirect to HR dashboard
// //       router.replace('/hr/dashboard')
      
// //     } catch (err) {
// //       setError('An error occurred. Please try again.')
// //       console.error('Login error:', err)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
// //       <div className="max-w-md w-full">
// //         {/* Logo & Header */}
// //         <div className="text-center mb-8">
// //           <div className="flex justify-center mb-4">
// //             <div className="relative w-56 h-28">
// //               <Image
// //                 src="/logo.png"
// //                 alt="Company Logo"
// //                 fill
// //                 className="object-contain"
// //                 priority
// //               />
// //             </div>
// //           </div>
// //           <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
// //             HR Login
// //           </h1>
// //         </div>

// //         {/* Login Card */}
// //         <div className="bg-white shadow-sm p-6 md:p-8">
// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Username Field */}
// //             <div>
// //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// //                 Username
// //               </label>
// //               <div className="relative">
// //                 <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                 <input
// //                   type="text"
// //                   value={username}
// //                   onChange={(e) => setUsername(e.target.value)}
// //                   className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// //                   placeholder="Enter your username"
// //                   required
// //                   disabled={isLoading}
// //                 />
// //               </div>
// //             </div>

// //             {/* Password Field with Eye Button */}
// //             <div>
// //               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                 <input
// //                   type={showPassword ? 'text' : 'password'}
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
// //                   placeholder="Enter your password"
// //                   required
// //                   disabled={isLoading}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
// //                   disabled={isLoading}
// //                 >
// //                   {showPassword ? (
// //                     <EyeOff className="w-5 h-5" />
// //                   ) : (
// //                     <Eye className="w-5 h-5" />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Error Message */}
// //             {error && (
// //               <div className={`bg-red-50 border border-red-200 p-3 flex items-start gap-2 ${roboto.className}`}>
// //                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
// //                 <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
// //               </div>
// //             )}

// //             {/* Submit Button */}
// //             <button
// //               type="submit"
// //               disabled={isLoading}
// //               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
// //             >
// //               {isLoading ? (
// //                 <>
// //                   <Loader className="w-5 h-5 animate-spin" />
// //                   <span className={roboto.className}>Signing in...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <span className={roboto.className}>Sign in</span>
// //                   <ArrowRight className="w-4 h-4" />
// //                 </>
// //               )}
// //             </button>

// //             {/* Footer */}
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


// // app/hr/login/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { Roboto } from 'next/font/google'
// import { Loader, AlertCircle, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

// const roboto = Roboto({
//   weight: ['100', '300', '400', '500', '700', '900'],
//   style: ['normal', 'italic'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// export default function HRLoginPage() {
//   const router = useRouter()
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
  
//   // ✅ Forgot Password Modal States
//   const [showForgotModal, setShowForgotModal] = useState(false)
//   const [forgotUsername, setForgotUsername] = useState('')
//   const [forgotError, setForgotError] = useState('')
//   const [forgotSuccess, setForgotSuccess] = useState('')
//   const [isForgotLoading, setIsForgotLoading] = useState(false)

//   // Check if already logged in
//   useEffect(() => {
//     const userData = localStorage.getItem('hrms_user')
//     if (userData) {
//       try {
//         const data = JSON.parse(userData)
//         if (data.username && data.role === 'hr') {
//           router.replace('/hr/dashboard')
//         }
//       } catch (e) {
//         console.error('Error parsing user data:', e)
//         localStorage.removeItem('hrms_user')
//       }
//     }
//   }, [router])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/auth/hr-login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setError(data.message || 'Invalid username or password')
//         setIsLoading(false)
//         return
//       }

//       localStorage.setItem('hrms_user', JSON.stringify({
//         username: data.username,
//         role: 'hr',
//         loginTime: new Date().toISOString()
//       }))

//       router.replace('/hr/dashboard')
      
//     } catch (err) {
//       setError('An error occurred. Please try again.')
//       console.error('Login error:', err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setForgotError('')
//     setForgotSuccess('')
//     setIsForgotLoading(true)

//     try {
//       const response = await fetch('/api/auth/hr-forgot-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username: forgotUsername }),
//       })

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setForgotError(data.message || 'Username not found. Please contact admin.')
//         setIsForgotLoading(false)
//         return
//       }

//       setForgotSuccess(
//         data.message || 'Password reset request sent. Please contact HR admin to get your new password.'
//       )
      
//       setForgotUsername('')
      
//     } catch (err) {
//       setForgotError('An error occurred. Please try again.')
//       console.error('Forgot password error:', err)
//     } finally {
//       setIsForgotLoading(false)
//     }
//   }

//   const closeForgotModal = () => {
//     setShowForgotModal(false)
//     setForgotUsername('')
//     setForgotError('')
//     setForgotSuccess('')
//     setIsForgotLoading(false)
//   }

//   return (
//     <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${roboto.className}`}>
//       <div className="max-w-md w-full">
//         {/* Logo & Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="relative w-56 h-28">
//               <Image
//                 src="/logo.png"
//                 alt="Company Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//           </div>
//           <h1 className={`text-3xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
//             HR Login
//           </h1>
//         </div>

//         {/* Login Card */}
//         <div className="bg-white shadow-sm p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
//                   placeholder="Enter your username"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             {/* Password Field with Eye Button */}
//             <div>
//               <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={`w-full pl-10 pr-12 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
//                   placeholder="Enter your password"
//                   required
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* ✅ Forgot Your Password Link — LEFT SIDE */}
//             <div className="flex justify-start">
//               <button
//                 type="button"
//                 onClick={() => setShowForgotModal(true)}
//                 className={`text-sm text-[#0071BD] hover:text-[#005a96] hover:underline transition tracking-wide ${roboto.className}`}
//                 disabled={isLoading}
//               >
//                 Forgot your password?
//               </button>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className={`bg-red-50 border border-red-200 p-3 flex items-start gap-2 ${roboto.className}`}>
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{error}</p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" />
//                   <span className={roboto.className}>Signing in...</span>
//                 </>
//               ) : (
//                 <>
//                   <span className={roboto.className}>Sign in</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>

//             {/* Footer */}
//             <div className="mt-6 text-center space-y-2">
//               <p className={`text-xs text-gray-400 tracking-wide ${roboto.className}`}>
//                 © 2026 All rights reserved
//               </p>
//               <p className={`text-[11px] text-gray-400 tracking-widest ${roboto.className}`}>
//                 System and Software generated by{' '}
//                 <span className={`font-medium text-[#0071BD] tracking-widest ${roboto.className}`}>
//                   Muhammad Hassan Jaffer
//                 </span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* ✅ Forgot Password Modal */}
//       {showForgotModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={closeForgotModal}
//           />

//           <div className={`relative bg-white shadow-lg max-w-md w-full p-6 md:p-8 ${roboto.className}`}>
//             <div className="mb-6">
//               <h2 className={`text-2xl font-bold text-[#0071BD] tracking-wider ${roboto.className}`}>
//                 Forgot your password?
//               </h2>
//               <p className={`text-sm text-gray-500 mt-2 tracking-wide ${roboto.className}`}>
//                 Enter your username and we&apos;ll send a reset request to the HR admin.
//               </p>
//             </div>

//             <form onSubmit={handleForgotPassword} className="space-y-5">
//               <div>
//                 <label className={`block text-sm font-medium text-gray-700 tracking-wide mb-2 ${roboto.className}`}>
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     value={forgotUsername}
//                     onChange={(e) => setForgotUsername(e.target.value)}
//                     className={`w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-[#0071BD] focus:border-transparent outline-none shadow-sm bg-white text-gray-900 placeholder-gray-400 ${roboto.className}`}
//                     placeholder="Enter your username"
//                     required
//                     disabled={isForgotLoading}
//                   />
//                 </div>
//               </div>

//               {forgotError && (
//                 <div className={`bg-red-50 border border-red-200 p-3 flex items-start gap-2 ${roboto.className}`}>
//                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                   <p className={`text-sm text-red-700 tracking-wide ${roboto.className}`}>{forgotError}</p>
//                 </div>
//               )}

//               {forgotSuccess && (
//                 <div className={`bg-green-50 border border-green-200 p-3 flex items-start gap-2 ${roboto.className}`}>
//                   <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                   <p className={`text-sm text-green-700 tracking-wide ${roboto.className}`}>{forgotSuccess}</p>
//                 </div>
//               )}

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeForgotModal}
//                   disabled={isForgotLoading}
//                   className={`flex-1 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isForgotLoading}
//                   className={`flex-1 py-3 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-2 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${roboto.className}`}
//                 >
//                   {isForgotLoading ? (
//                     <>
//                       <Loader className="w-4 h-4 animate-spin" />
//                       <span className={roboto.className}>Sending...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span className={roboto.className}>Send Request</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { DM_Sans } from 'next/font/google'
import { Loader, AlertCircle, User, Lock, Eye, EyeOff, CheckCircle, X } from 'lucide-react'
import { FaWhatsapp, FaYoutube, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function HRLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotUsername, setForgotUsername] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('hrms_user')
    if (userData) {
      try {
        const data = JSON.parse(userData)
        if (data.username && data.role === 'hr') {
          router.replace('/hr/dashboard')
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('hrms_user')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/hr-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid username or password')
        setIsLoading(false)
        return
      }

      localStorage.setItem('hrms_user', JSON.stringify({
        username: data.username,
        role: 'hr',
        loginTime: new Date().toISOString()
      }))

      router.replace('/hr/dashboard')
      
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')
    setIsForgotLoading(true)

    try {
      const response = await fetch('/api/auth/hr-forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: forgotUsername }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setForgotError(data.message || 'Username not found. Please contact admin.')
        setIsForgotLoading(false)
        return
      }

      setForgotSuccess(
        data.message || 'Password reset request sent. Please contact HR admin to get your new password.'
      )
      
      setForgotUsername('')
      
    } catch (err) {
      setForgotError('An error occurred. Please try again.')
      console.error('Forgot password error:', err)
    } finally {
      setIsForgotLoading(false)
    }
  }

  const closeForgotModal = () => {
    setShowForgotModal(false)
    setForgotUsername('')
    setForgotError('')
    setForgotSuccess('')
    setIsForgotLoading(false)
  }

  return (
    <div className={`min-h-screen bg-white p-4 md:p-8 flex items-center justify-center tracking-wider ${dmSans.className}`}>
      
      {/* Main Card Container - No rounded corners, sharp edges */}
      <div className="w-full max-w-4xl bg-white shadow-xl border border-gray-200 overflow-hidden flex">
        
        {/* Left Side - Form Section (Zyaada jagah di gayi hai) */}
        <div className="flex-[1.2] flex flex-col justify-center py-8 px-6 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            
            {/* Logo */}
            <div className="mb-8 flex items-center">
              <div className="relative w-64 h-16">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-wider">
                HR Login
              </h2>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 tracking-wide">
                    Username
                  </label>
                  <div className="mt-1 relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm transition-colors tracking-wide"
                      placeholder="Enter your username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 tracking-wide">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-10 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm transition-colors tracking-wide"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-start">
                  <div className="text-xs">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="font-medium text-[#0071BD] hover:text-[#005a96] hover:underline tracking-wide"
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 p-2.5 flex items-start gap-2 border border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 tracking-wide">{error}</p>
                  </div>
                )}

                {/* Sign In Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#0071BD] hover:bg-[#005a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071BD] transition-colors disabled:opacity-70 disabled:cursor-not-allowed tracking-wider"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>

              {/* Social Media Icons */}
              <div className="mt-8 flex justify-center items-center gap-4">
                <div className="h-[1px] bg-gray-300 flex-1"></div>
                
                <div className="flex items-center gap-4">
                  <div className="text-[#25D366] text-xl cursor-default">
                    <FaWhatsapp />
                  </div>
                  <div className="text-[#FF0000] text-xl cursor-default">
                    <FaYoutube />
                  </div>
                  <div className="text-[#1877F2] text-xl cursor-default">
                    <FaFacebook />
                  </div>
                  <div className="text-[#E4405F] text-xl cursor-default">
                    <FaInstagram />
                  </div>
                  <div className="text-[#0A66C2] text-xl cursor-default">
                    <FaLinkedin />
                  </div>
                </div>
                
                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Right Side - Image Section (Choti aur fix width ki gayi hai) */}
        <div className="hidden lg:block relative lg:w-[350px] border-l border-gray-200">
          <Image
            src="/login.png"
            alt="Login Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeForgotModal}
          />

          <div className={`relative bg-white shadow-xl max-w-sm w-full p-6 transform transition-all tracking-wide ${dmSans.className}`}>
            
            {/* Top-Right Cross (X) Button */}
            <button
              onClick={closeForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success State */}
            {forgotSuccess ? (
              <div className="text-center py-4 mt-2">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-wider mb-2">
                  Request Sent!
                </h2>
                <p className="text-sm text-gray-600 tracking-wide mb-6">
                  {forgotSuccess}
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full py-2.5 bg-[#0071BD] text-white hover:bg-[#005a96] transition text-sm font-medium tracking-wider"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              // Form State
              <>
                <div className="mb-4 mt-2">
                  <h2 className="text-xl font-bold text-gray-900 tracking-wider">
                    Forgot your password?
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 tracking-wide">
                    Enter your username and we&apos;ll send a reset request to the HR admin.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={forgotUsername}
                        onChange={(e) => setForgotUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] outline-none shadow-sm bg-white text-black placeholder-gray-400 sm:text-sm tracking-wide"
                        placeholder="Enter your username"
                        required
                        disabled={isForgotLoading}
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 p-2.5 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 tracking-wide">{forgotError}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      disabled={isForgotLoading}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-xs font-medium disabled:opacity-50 tracking-wide"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="flex-1 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-1 text-xs font-medium disabled:opacity-50 tracking-wider"
                    >
                      {isForgotLoading ? (
                        <>
                          <Loader className="w-3 h-3 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Request</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}