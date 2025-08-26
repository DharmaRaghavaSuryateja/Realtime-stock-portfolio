'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, User, Mail, Lock, Eye, EyeOff, Check, X as XIcon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface LoginFormData {
  user_identifier: string
  password: string
}

interface RegisterFormData {
  username: string
  email: string
  password: string
  local_currency?: string
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()

  const loginForm = useForm<LoginFormData>()
  const registerForm = useForm<RegisterFormData>()

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.user_identifier, data.password)
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      await register(data.username, data.email, data.password, data.local_currency)
      onClose()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    loginForm.reset()
    registerForm.reset()
  }

  const validatePassword = (password: string) => {
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasDigit = /\d/.test(password)
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    
    return { hasLowercase, hasUppercase, hasDigit, isValid }
  }

  const currentPassword = registerForm.watch('password') || ''
  const passwordValidation = validatePassword(currentPassword)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label htmlFor="login-identifier" className="block text-sm font-medium text-gray-300 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="login-identifier"
                  {...loginForm.register('user_identifier', { 
                    required: 'Email or username is required'
                  })}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email or username"
                />
              </div>
              {loginForm.formState.errors.user_identifier && (
                <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.user_identifier.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  {...loginForm.register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="register-username"
                  {...registerForm.register('username', { required: 'Username is required' })}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>
              {registerForm.formState.errors.username && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="register-email"
                  {...registerForm.register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                  })}
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                                      {...registerForm.register('password', { 
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      validate: {
                        passwordStrength: (value) => {
                          const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
                          return isValid || 'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
                        }
                      }
                    })}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {currentPassword && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400 font-medium">Password requirements:</p>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasLowercase ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <XIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn("text-xs", passwordValidation.hasLowercase ? "text-green-400" : "text-red-400")}>
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasUppercase ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <XIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn("text-xs", passwordValidation.hasUppercase ? "text-green-400" : "text-red-400")}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordValidation.hasDigit ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <XIcon className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn("text-xs", passwordValidation.hasDigit ? "text-green-400" : "text-red-400")}>
                      At least one digit
                    </span>
                  </div>
                </div>
              )}
              
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="register-currency" className="block text-sm font-medium text-gray-300 mb-2">
                Local Currency (Optional)
              </label>
              <select
                id="register-currency"
                {...registerForm.register('local_currency')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-primary-500 hover:text-primary-400 font-medium transition-colors duration-200"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
} 