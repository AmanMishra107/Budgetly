import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: name
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 flex items-center justify-center p-4">
      {/* Main Container */}
      <Card className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">

        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex relative h-[600px]">
          {/* Left Panel */}
          <motion.div
            initial={false}
            animate={{
              x: isSignUp ? 0 : '100%',
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center text-white z-10 rounded-l-3xl border-r border-white/10"
          >
            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full"></div>

            <div className="text-center p-6">
              {/* Logo */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">Budgetly</p>
              </div>

              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.div
                    key="welcome-back"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Welcome Back!</h2>
                    <p className="text-base mb-8 text-white/80 max-w-xs leading-relaxed">
                      To keep connected with us please login with your personal info
                    </p>
                    <Button
                      variant="outline"
                      onClick={toggleMode}
                      className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300"
                    >
                      SIGN IN
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hello-friend"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Hello, Friend!</h2>
                    <p className="text-base mb-8 text-white/80 max-w-xs leading-relaxed">
                      Enter your personal details and start journey with us
                    </p>
                    <Button
                      variant="outline"
                      onClick={toggleMode}
                      className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300"
                    >
                      SIGN UP
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={false}
            animate={{
              x: isSignUp ? 0 : '-100%',
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
            className="absolute inset-y-0 right-0 w-1/2 bg-white/5 backdrop-blur-xl flex items-center justify-center p-6 rounded-r-3xl"
          >
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {isSignUp ? (
                  <motion.div
                    key="signup-form"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>

                      {/* Social Login Buttons */}
                      <div className="flex justify-center gap-3 mb-4">
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">f</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">G+</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">in</span>
                        </Button>
                      </div>

                      <p className="text-white/60 text-xs mb-4">or use your email for registration:</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                        <User className="w-4 h-4 text-white/60 flex-shrink-0" />
                        <Input
                          placeholder="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-white text-sm placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                        <Mail className="w-4 h-4 text-white/60 flex-shrink-0" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-white text-sm placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                        <Lock className="w-4 h-4 text-white/60 flex-shrink-0" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-white text-sm placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                          required
                          minLength={6}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl font-semibold shadow-xl border-0 transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'SIGN UP'}
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin-form"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Sign in to Budgetly</h2>

                      <div className="flex justify-center gap-3 mb-4">
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">f</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">G+</span>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                          <span className="text-xs font-bold">in</span>
                        </Button>
                      </div>

                      <p className="text-white/60 text-xs mb-4">or use your email account:</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                        <Mail className="w-4 h-4 text-white/60 flex-shrink-0" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-white text-sm placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
                        <Lock className="w-4 h-4 text-white/60 flex-shrink-0" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-white text-sm placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                          required
                        />
                      </div>
                      <div className="text-center">
                        <a href="#" className="text-xs text-white/60 hover:text-purple-400 transition-colors">
                          Forgot your password?
                        </a>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl font-semibold shadow-xl border-0 transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'SIGN IN'}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 text-white p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-2xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-semibold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">Budgetly</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup-mobile' : 'signin-mobile'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {isSignUp ? 'Create Account' : 'Welcome Back!'}
                </h2>
                <p className="text-sm text-white/80 mb-4">
                  {isSignUp
                    ? 'Join us and start your journey'
                    : 'Sign in to continue your journey'
                  }
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Form */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup-form-mobile' : 'signin-form-mobile'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Social Login Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                    <span className="text-sm font-bold">f</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                    <span className="text-sm font-bold">G+</span>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-white/20 hover:border-purple-400 hover:text-purple-400 bg-white/5 backdrop-blur-sm text-white/80">
                    <span className="text-sm font-bold">in</span>
                  </Button>
                </div>

                <p className="text-center text-white/60 text-sm mb-6">
                  {isSignUp ? 'or use your email for registration:' : 'or use your email account:'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4">
                      <User className="w-5 h-5 text-white/60 flex-shrink-0" />
                      <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                        required
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4">
                    <Mail className="w-5 h-5 text-white/60 flex-shrink-0" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-4">
                    <Lock className="w-5 h-5 text-white/60 flex-shrink-0" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 focus:ring-0 focus:outline-none p-0"
                      required
                      minLength={6}
                    />
                  </div>

                  {!isSignUp && (
                    <div className="text-center">
                      <a href="#" className="text-sm text-white/60 hover:text-purple-400 transition-colors">
                        Forgot your password?
                      </a>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-2xl font-semibold shadow-xl border-0 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
                  </Button>
                </form>

                {/* Toggle Button */}
                <div className="text-center mt-6">
                  <p className="text-white/60 text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <Button
                    variant="link"
                    onClick={toggleMode}
                    className="text-purple-400 hover:text-purple-300 font-semibold p-0 mt-1"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
