// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter } from 'next/navigation'
// // import Image from 'next/image'
// // import { DM_Sans } from 'next/font/google'
// // // X icon import kiya gaya hai
// // import { Loader, AlertCircle, Eye, EyeOff, Mail, CheckCircle, X } from 'lucide-react'
// // // Social Icons Import
// // import { FaWhatsapp, FaYoutube, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

// // const dmSans = DM_Sans({
// //   weight: ['400', '500', '700'],
// //   subsets: ['latin'],
// //   display: 'swap',
// // })

// // export default function EmployeeLoginPage() {
// //   const router = useRouter()
// //   const [username, setUsername] = useState('')
// //   const [password, setPassword] = useState('')
// //   const [error, setError] = useState('')
// //   const [isLoading, setIsLoading] = useState(false)
// //   const [showPassword, setShowPassword] = useState(false)
  
// //   // Forgot Password Modal States
// //   const [showForgotModal, setShowForgotModal] = useState(false)
// //   const [forgotEmail, setForgotEmail] = useState('')
// //   const [forgotError, setForgotError] = useState('')
// //   const [forgotSuccess, setForgotSuccess] = useState('')
// //   const [isForgotLoading, setIsForgotLoading] = useState(false)

// //   // Check if already logged in
// //   useEffect(() => {
// //     const employeeData = localStorage.getItem('employeeData')
// //     if (employeeData) {
// //       try {
// //         const data = JSON.parse(employeeData)
// //         if (data.employeeId) {
// //           router.push(`/dashboard/${data.employeeId}`)
// //         }
// //       } catch (e) {
// //         console.error('Error parsing employee data:', e)
// //       }
// //     }
// //   }, [router])

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError('')
// //     setIsLoading(true)

// //     try {
// //       const response = await fetch('/api/auth/employee-login', {
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

// //       localStorage.setItem('employeeData', JSON.stringify({
// //         employeeId: data.employeeId,
// //         fullName: data.fullName,
// //         department: data.department,
// //         position: data.position,
// //         username: data.username,
// //         role: 'employee',
// //         loginTime: new Date().toISOString()
// //       }))

// //       localStorage.setItem('employeeId', data.employeeId)
// //       localStorage.setItem('employeeUsername', data.username)

// //       router.push(`/dashboard/${data.employeeId}`)
      
// //     } catch (err) {
// //       setError('An error occurred. Please try again.')
// //       console.error('Login error:', err)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleForgotPassword = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setForgotError('')
// //     setForgotSuccess('')
// //     setIsForgotLoading(true)

// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// //     if (!emailRegex.test(forgotEmail.trim())) {
// //       setForgotError('Please enter a valid email address.')
// //       setIsForgotLoading(false)
// //       return
// //     }

// //     try {
// //       const response = await fetch('/api/auth/employee-forgot-password', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ email: forgotEmail.trim() }),
// //       })

// //       const data = await response.json()

// //       if (!response.ok || !data.success) {
// //         setForgotError(data.message || data.error || 'Email not found. Please contact HR admin.')
// //         setIsForgotLoading(false)
// //         return
// //       }

// //       setForgotSuccess(
// //         data.message || 'Password reset link has been sent to your email.'
// //       )
      
// //       setForgotEmail('')
      
// //     } catch (err) {
// //       setForgotError('An error occurred. Please try again.')
// //       console.error('Forgot password error:', err)
// //     } finally {
// //       setIsForgotLoading(false)
// //     }
// //   }

// //   const closeForgotModal = () => {
// //     setShowForgotModal(false)
// //     setForgotEmail('')
// //     setForgotError('')
// //     setForgotSuccess('')
// //     setIsForgotLoading(false)
// //   }

// //   return (
// //     <div className={`min-h-screen bg-white p-4 md:p-8 flex items-center justify-center tracking-wider ${dmSans.className}`}>
      
// //       {/* Main Card Container - No rounded corners, sharp edges */}
// //       <div className="w-full max-w-4xl bg-white shadow-xl border border-gray-200 overflow-hidden flex">
        
// //         {/* Left Side - Form Section */}
// //         <div className="flex-1 flex flex-col justify-center py-8 px-6 sm:px-10 lg:px-12">
// //           <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            
// //             {/* Logo - Size Bara Kiya Gaya Hai */}
// //             <div className="mb-8 flex items-center">
// //               <div className="relative w-64 h-16">
// //                 <Image
// //                   src="/logo.png"
// //                   alt="TheCubeFactory Logo"
// //                   fill
// //                   className="object-contain object-left"
// //                   priority
// //                 />
// //               </div>
// //             </div>

// //             {/* Header */}
// //             <div>
// //               <h2 className="text-2xl font-bold text-gray-900 tracking-wider">
// //                 Employee Login
// //               </h2>
// //             </div>

// //             <div className="mt-6">
// //               <form onSubmit={handleSubmit} className="space-y-4">
                
// //                 {/* Username Field - Text Black */}
// //                 <div>
// //                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 tracking-wide">
// //                     Username
// //                   </label>
// //                   <div className="mt-1">
// //                     <input
// //                       id="username"
// //                       name="username"
// //                       type="text"
// //                       autoComplete="username"
// //                       required
// //                       value={username}
// //                       onChange={(e) => setUsername(e.target.value)}
// //                       className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm transition-colors tracking-wide"
// //                       placeholder="Enter your username"
// //                       disabled={isLoading}
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Password Field - Text Black */}
// //                 <div>
// //                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 tracking-wide">
// //                     Password
// //                   </label>
// //                   <div className="mt-1 relative">
// //                     <input
// //                       id="password"
// //                       name="password"
// //                       type={showPassword ? 'text' : 'password'}
// //                       autoComplete="current-password"
// //                       required
// //                       value={password}
// //                       onChange={(e) => setPassword(e.target.value)}
// //                       className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm pr-10 transition-colors tracking-wide"
// //                       placeholder="••••••••"
// //                       disabled={isLoading}
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowPassword(!showPassword)}
// //                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
// //                       disabled={isLoading}
// //                     >
// //                       {showPassword ? (
// //                         <EyeOff className="h-4 w-4" aria-hidden="true" />
// //                       ) : (
// //                         <Eye className="h-4 w-4" aria-hidden="true" />
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Forgot Password */}
// //                 <div className="flex justify-start">
// //                   <div className="text-xs">
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowForgotModal(true)}
// //                       className="font-medium text-[#0071BD] hover:text-[#005a96] hover:underline tracking-wide"
// //                       disabled={isLoading}
// //                     >
// //                       Forgot your password?
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Error Message */}
// //                 {error && (
// //                   <div className="bg-red-50 p-2.5 flex items-start gap-2 border border-red-200">
// //                     <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
// //                     <p className="text-xs text-red-700 tracking-wide">{error}</p>
// //                   </div>
// //                 )}

// //                 {/* Sign In Button */}
// //                 <div className="pt-6">
// //                   <button
// //                     type="submit"
// //                     disabled={isLoading}
// //                     className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#0071BD] hover:bg-[#005a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071BD] transition-colors disabled:opacity-70 disabled:cursor-not-allowed tracking-wider"
// //                   >
// //                     {isLoading ? (
// //                       <>
// //                         <Loader className="w-4 h-4 animate-spin mr-2" />
// //                         Signing in...
// //                       </>
// //                     ) : (
// //                       'Sign in'
// //                     )}
// //                   </button>
// //                 </div>
// //               </form>

// //               {/* Social Media Icons - Lines ke saath, Fixed Brand Colors */}
// //               <div className="mt-8 flex justify-center items-center gap-4">
// //                 {/* Left Line */}
// //                 <div className="h-[1px] bg-gray-300 flex-1"></div>
                
// //                 {/* Icons (Fixed Colors, No Hover, No Links) */}
// //                 <div className="flex items-center gap-4">
// //                   <div className="text-[#25D366] text-xl cursor-default">
// //                     <FaWhatsapp />
// //                   </div>
// //                   <div className="text-[#FF0000] text-xl cursor-default">
// //                     <FaYoutube />
// //                   </div>
// //                   <div className="text-[#1877F2] text-xl cursor-default">
// //                     <FaFacebook />
// //                   </div>
// //                   <div className="text-[#E4405F] text-xl cursor-default">
// //                     <FaInstagram />
// //                   </div>
// //                   <div className="text-[#0A66C2] text-xl cursor-default">
// //                     <FaLinkedin />
// //                   </div>
// //                 </div>
                
// //                 {/* Right Line */}
// //                 <div className="h-[1px] bg-gray-300 flex-1"></div>
// //               </div>
              
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Side - Full Illustration Image (PNG) */}
// //         <div className="hidden lg:block relative w-0 flex-1">
// //           <Image
// //             src="/login.png"
// //             alt="Login Illustration"
// //             fill
// //             className="object-cover"
// //             priority
// //           />
// //         </div>

// //       </div>

// //       {/* Forgot Password Modal */}
// //       {showForgotModal && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //           <div
// //             className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
// //             onClick={closeForgotModal}
// //           />

// //           <div className={`relative bg-white shadow-xl max-w-sm w-full p-6 transform transition-all tracking-wide ${dmSans.className}`}>
            
// //             {/* Top-Right Cross (X) Button */}
// //             <button
// //               onClick={closeForgotModal}
// //               className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
// //               aria-label="Close"
// //             >
// //               <X className="w-5 h-5" />
// //             </button>

// //             {/* Agar success ho gaya hai to Tick mark show karo */}
// //             {forgotSuccess ? (
// //               <div className="text-center py-4 mt-2">
// //                 <div className="flex justify-center mb-4">
// //                   <CheckCircle className="w-16 h-16 text-green-500" />
// //                 </div>
// //                 <h2 className="text-xl font-bold text-gray-900 tracking-wider mb-2">
// //                   Email Sent!
// //                 </h2>
// //                 <p className="text-sm text-gray-600 tracking-wide mb-6">
// //                   {forgotSuccess}
// //                 </p>
// //                 <button
// //                   type="button"
// //                   onClick={closeForgotModal}
// //                   className="w-full py-2.5 bg-[#0071BD] text-white hover:bg-[#005a96] transition text-sm font-medium tracking-wider"
// //                 >
// //                   Back to Login
// //                 </button>
// //               </div>
// //             ) : (
// //               // Agar success nahi hua to normal form show karo
// //               <>
// //                 <div className="mb-4 mt-2">
// //                   <h2 className="text-xl font-bold text-gray-900 tracking-wider">
// //                     Forgot your password?
// //                   </h2>
// //                   <p className="text-xs text-gray-500 mt-1 tracking-wide">
// //                     Enter your registered email address and we&apos;ll send you a password reset link.
// //                   </p>
// //                 </div>

// //                 <form onSubmit={handleForgotPassword} className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
// //                       Email Address
// //                     </label>
// //                     <div className="relative">
// //                       <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                       <input
// //                         type="email"
// //                         value={forgotEmail}
// //                         onChange={(e) => setForgotEmail(e.target.value)}
// //                         className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] outline-none shadow-sm bg-white text-black placeholder-gray-400 sm:text-sm tracking-wide"
// //                         placeholder="Enter your email address"
// //                         required
// //                         disabled={isForgotLoading}
// //                       />
// //                     </div>
// //                   </div>

// //                   {forgotError && (
// //                     <div className="bg-red-50 border border-red-200 p-2.5 flex items-start gap-2">
// //                       <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
// //                       <p className="text-xs text-red-700 tracking-wide">{forgotError}</p>
// //                     </div>
// //                   )}

// //                   <div className="flex gap-2 pt-1">
// //                     <button
// //                       type="button"
// //                       onClick={closeForgotModal}
// //                       disabled={isForgotLoading}
// //                       className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-xs font-medium disabled:opacity-50 tracking-wide"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       disabled={isForgotLoading}
// //                       className="flex-1 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-1 text-xs font-medium disabled:opacity-50 tracking-wider"
// //                     >
// //                       {isForgotLoading ? (
// //                         <>
// //                           <Loader className="w-3 h-3 animate-spin" />
// //                           <span>Sending...</span>
// //                         </>
// //                       ) : (
// //                         <span>Send Reset Link</span>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </form>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'
// import { DM_Sans } from 'next/font/google'
// // X icon import kiya gaya hai
// import { Loader, AlertCircle, Eye, EyeOff, Mail, CheckCircle, X } from 'lucide-react'
// // Social Icons Import
// import { FaWhatsapp, FaYoutube, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

// const dmSans = DM_Sans({
//   weight: ['400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// })

// export default function EmployeeLoginPage() {
//   const router = useRouter()
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
  
//   // Forgot Password Modal States
//   const [showForgotModal, setShowForgotModal] = useState(false)
//   const [forgotEmail, setForgotEmail] = useState('')
//   const [forgotError, setForgotError] = useState('')
//   const [forgotSuccess, setForgotSuccess] = useState('')
//   const [isForgotLoading, setIsForgotLoading] = useState(false)

//   // Check if already logged in
//   useEffect(() => {
//     const employeeData = localStorage.getItem('employeeData')
//     if (employeeData) {
//       try {
//         const data = JSON.parse(employeeData)
//         if (data.employeeId) {
//           router.push(`/dashboard/${data.employeeId}`)
//         }
//       } catch (e) {
//         console.error('Error parsing employee data:', e)
//       }
//     }
//   }, [router])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       const response = await fetch('/api/auth/employee-login', {
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

//       localStorage.setItem('employeeData', JSON.stringify({
//         employeeId: data.employeeId,
//         fullName: data.fullName,
//         department: data.department,
//         position: data.position,
//         username: data.username,
//         role: 'employee',
//         loginTime: new Date().toISOString()
//       }))

//       localStorage.setItem('employeeId', data.employeeId)
//       localStorage.setItem('employeeUsername', data.username)

//       router.push(`/dashboard/${data.employeeId}`)
      
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

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(forgotEmail.trim())) {
//       setForgotError('Please enter a valid email address.')
//       setIsForgotLoading(false)
//       return
//     }

//     try {
//       const response = await fetch('/api/auth/employee-forgot-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: forgotEmail.trim() }),
//       })

//       const data = await response.json()

//       if (!response.ok || !data.success) {
//         setForgotError(data.message || data.error || 'Email not found. Please contact HR admin.')
//         setIsForgotLoading(false)
//         return
//       }

//       setForgotSuccess(
//         data.message || 'Password reset link has been sent to your email.'
//       )
      
//       setForgotEmail('')
      
//     } catch (err) {
//       setForgotError('An error occurred. Please try again.')
//       console.error('Forgot password error:', err)
//     } finally {
//       setIsForgotLoading(false)
//     }
//   }

//   const closeForgotModal = () => {
//     setShowForgotModal(false)
//     setForgotEmail('')
//     setForgotError('')
//     setForgotSuccess('')
//     setIsForgotLoading(false)
//   }

//   return (
//     <div className={`min-h-screen bg-white p-4 md:p-8 flex items-center justify-center tracking-wider ${dmSans.className}`}>
      
//       {/* Main Card Container */}
//       <div className="w-full max-w-4xl bg-white shadow-xl border border-gray-200 overflow-hidden flex">
        
//         {/* Left Side - Form Section (Zyaada jagah di gayi hai) */}
//         <div className="flex-[1.2] flex flex-col justify-center py-8 px-6 sm:px-10 lg:px-12">
//           <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            
//             {/* Logo */}
//             <div className="mb-8 flex items-center">
//               <div className="relative w-64 h-16">
//                 <Image
//                   src="/logo.png"
//                   alt="TheCubeFactory Logo"
//                   fill
//                   className="object-contain object-left"
//                   priority
//                 />
//               </div>
//             </div>

//             {/* Header */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 tracking-wider">
//                 Employee Login
//               </h2>
//             </div>

//             <div className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
                
//                 {/* Username Field */}
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 tracking-wide">
//                     Username
//                   </label>
//                   <div className="mt-1">
//                     <input
//                       id="username"
//                       name="username"
//                       type="text"
//                       autoComplete="username"
//                       required
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm transition-colors tracking-wide"
//                       placeholder="Enter your username"
//                       disabled={isLoading}
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 tracking-wide">
//                     Password
//                   </label>
//                   <div className="mt-1 relative">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? 'text' : 'password'}
//                       autoComplete="current-password"
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm pr-10 transition-colors tracking-wide"
//                       placeholder="••••••••"
//                       disabled={isLoading}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                       disabled={isLoading}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" aria-hidden="true" />
//                       ) : (
//                         <Eye className="h-4 w-4" aria-hidden="true" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Forgot Password */}
//                 <div className="flex justify-start">
//                   <div className="text-xs">
//                     <button
//                       type="button"
//                       onClick={() => setShowForgotModal(true)}
//                       className="font-medium text-[#0071BD] hover:text-[#005a96] hover:underline tracking-wide"
//                       disabled={isLoading}
//                     >
//                       Forgot your password?
//                     </button>
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                   <div className="bg-red-50 p-2.5 flex items-start gap-2 border border-red-200">
//                     <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
//                     <p className="text-xs text-red-700 tracking-wide">{error}</p>
//                   </div>
//                 )}

//                 {/* Sign In Button */}
//                 <div className="pt-6">
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#0071BD] hover:bg-[#005a96] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071BD] transition-colors disabled:opacity-70 disabled:cursor-not-allowed tracking-wider"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader className="w-4 h-4 animate-spin mr-2" />
//                         Signing in...
//                       </>
//                     ) : (
//                       'Sign in'
//                     )}
//                   </button>
//                 </div>
//               </form>

//               {/* Social Media Icons */}
//               <div className="mt-8 flex justify-center items-center gap-4">
//                 <div className="h-[1px] bg-gray-300 flex-1"></div>
                
//                 <div className="flex items-center gap-4">
//                   <div className="text-[#25D366] text-xl cursor-default">
//                     <FaWhatsapp />
//                   </div>
//                   <div className="text-[#FF0000] text-xl cursor-default">
//                     <FaYoutube />
//                   </div>
//                   <div className="text-[#1877F2] text-xl cursor-default">
//                     <FaFacebook />
//                   </div>
//                   <div className="text-[#E4405F] text-xl cursor-default">
//                     <FaInstagram />
//                   </div>
//                   <div className="text-[#0A66C2] text-xl cursor-default">
//                     <FaLinkedin />
//                   </div>
//                 </div>
                
//                 <div className="h-[1px] bg-gray-300 flex-1"></div>
//               </div>
              
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Image Section (Choti aur fix width ki gayi hai) */}
//         <div className="hidden lg:block relative lg:w-[350px] border-l border-gray-200">
//           <Image
//             src="/login.png"
//             alt="Login Illustration"
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>

//       </div>

//       {/* Forgot Password Modal */}
//       {showForgotModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
//             onClick={closeForgotModal}
//           />

//           <div className={`relative bg-white shadow-xl max-w-sm w-full p-6 transform transition-all tracking-wide ${dmSans.className}`}>
            
//             {/* Top-Right Cross (X) Button */}
//             <button
//               onClick={closeForgotModal}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
//               aria-label="Close"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Success State */}
//             {forgotSuccess ? (
//               <div className="text-center py-4 mt-2">
//                 <div className="flex justify-center mb-4">
//                   <CheckCircle className="w-16 h-16 text-green-500" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 tracking-wider mb-2">
//                   Email Sent!
//                 </h2>
//                 <p className="text-sm text-gray-600 tracking-wide mb-6">
//                   {forgotSuccess}
//                 </p>
//                 <button
//                   type="button"
//                   onClick={closeForgotModal}
//                   className="w-full py-2.5 bg-[#0071BD] text-white hover:bg-[#005a96] transition text-sm font-medium tracking-wider"
//                 >
//                   Back to Login
//                 </button>
//               </div>
//             ) : (
//               // Form State
//               <>
//                 <div className="mb-4 mt-2">
//                   <h2 className="text-xl font-bold text-gray-900 tracking-wider">
//                     Forgot your password?
//                   </h2>
//                   <p className="text-xs text-gray-500 mt-1 tracking-wide">
//                     Enter your registered email address and we&apos;ll send you a password reset link.
//                   </p>
//                 </div>

//                 <form onSubmit={handleForgotPassword} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                       <input
//                         type="email"
//                         value={forgotEmail}
//                         onChange={(e) => setForgotEmail(e.target.value)}
//                         className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] outline-none shadow-sm bg-white text-black placeholder-gray-400 sm:text-sm tracking-wide"
//                         placeholder="Enter your email address"
//                         required
//                         disabled={isForgotLoading}
//                       />
//                     </div>
//                   </div>

//                   {forgotError && (
//                     <div className="bg-red-50 border border-red-200 p-2.5 flex items-start gap-2">
//                       <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
//                       <p className="text-xs text-red-700 tracking-wide">{forgotError}</p>
//                     </div>
//                   )}

//                   <div className="flex gap-2 pt-1">
//                     <button
//                       type="button"
//                       onClick={closeForgotModal}
//                       disabled={isForgotLoading}
//                       className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-xs font-medium disabled:opacity-50 tracking-wide"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isForgotLoading}
//                       className="flex-1 py-2 bg-[#0071BD] text-white hover:bg-[#005a96] transition flex items-center justify-center gap-1 text-xs font-medium disabled:opacity-50 tracking-wider"
//                     >
//                       {isForgotLoading ? (
//                         <>
//                           <Loader className="w-3 h-3 animate-spin" />
//                           <span>Sending...</span>
//                         </>
//                       ) : (
//                         <span>Send Reset Link</span>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </>
//             )}
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
// X icon import kiya gaya hai
import { Loader, AlertCircle, Eye, EyeOff, Mail, CheckCircle, X } from 'lucide-react'
// Social Icons Import
import { FaWhatsapp, FaYoutube, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [isForgotLoading, setIsForgotLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData')
    if (employeeData) {
      try {
        const data = JSON.parse(employeeData)
        if (data.employeeId) {
          router.push(`/dashboard/${data.employeeId}`)
        }
      } catch (e) {
        console.error('Error parsing employee data:', e)
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/employee-login', {
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

      localStorage.setItem('employeeData', JSON.stringify({
        employeeId: data.employeeId,
        fullName: data.fullName,
        department: data.department,
        position: data.position,
        username: data.username,
        role: 'employee',
        loginTime: new Date().toISOString()
      }))

      localStorage.setItem('employeeId', data.employeeId)
      localStorage.setItem('employeeUsername', data.username)

      router.push(`/dashboard/${data.employeeId}`)
      
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail.trim())) {
      setForgotError('Please enter a valid email address.')
      setIsForgotLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/employee-forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setForgotError(data.message || data.error || 'Email not found. Please contact HR admin.')
        setIsForgotLoading(false)
        return
      }

      setForgotSuccess(
        data.message || 'Password reset link has been sent to your email.'
      )
      
      setForgotEmail('')
      
    } catch (err) {
      setForgotError('An error occurred. Please try again.')
      console.error('Forgot password error:', err)
    } finally {
      setIsForgotLoading(false)
    }
  }

  const closeForgotModal = () => {
    setShowForgotModal(false)
    setForgotEmail('')
    setForgotError('')
    setForgotSuccess('')
    setIsForgotLoading(false)
  }

  return (
    <div className={`min-h-screen bg-white p-4 md:p-8 flex items-center justify-center tracking-wider ${dmSans.className}`}>
      
      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-white shadow-xl border border-gray-200 overflow-hidden flex">
        
        {/* Left Side - Form Section */}
        <div className="flex-[1.2] flex flex-col justify-center py-8 px-6 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            
            {/* Logo - Centered */}
            <div className="mb-8 flex justify-center items-center">
              <div className="relative w-64 h-16">
                <Image
                  src="/logo.png"
                  alt="TheCubeFactory Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Header - Centered */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wider">
                Employee Login
              </h2>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 tracking-wide">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm transition-colors tracking-wide"
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
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3.5 py-2.5 border border-gray-300 shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] text-sm pr-10 transition-colors tracking-wide"
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

        {/* Right Side - Image Section */}
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
                  Email Sent!
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
                    Enter your registered email address and we&apos;ll send you a password reset link.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-1 focus:ring-[#0071BD] focus:border-[#0071BD] outline-none shadow-sm bg-white text-black placeholder-gray-400 sm:text-sm tracking-wide"
                        placeholder="Enter your email address"
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
                        <span>Send Reset Link</span>
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