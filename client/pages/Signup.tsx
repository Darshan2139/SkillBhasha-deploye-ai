import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  ArrowRight, 
  BookOpen, 
  Users, 
  Brain, 
  Globe, 
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Lightbulb,
  Target,
  Star,
  Zap
} from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"learner" | "trainer">("learner");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
    await signup(email, password, role, name);
    if (role === "trainer") navigate("/trainer");
    else navigate("/learner");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const roleFeatures = {
    learner: [
      { icon: Brain, title: "AI-Powered Learning", desc: "Personalized content in your language" },
      { icon: Globe, title: "Multilingual Support", desc: "Learn in Hindi, Tamil, Bengali & more" },
      { icon: Users, title: "Collaborative Learning", desc: "Connect with trainers and learners" }
    ],
    trainer: [
      { icon: Users, title: "Create Content", desc: "Upload and manage training materials" },
      { icon: Zap, title: "AI Translation", desc: "Automatically translate content" },
      { icon: Target, title: "Analytics", desc: "Track learner progress and engagement" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">SKILLBHASHA</div>
            <div className="text-lg font-semibold text-gray-900">SkillBhasha</div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
          <Shield className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">UX4G Compliant</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-start px-16 pt-16 pb-8 text-white">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <div>
                  <h1 className="text-5xl font-bold tracking-tight text-white">SkillBhasha</h1>
                  <p className="text-white text-xl font-medium">Multilingual Learning Platform</p>
                </div>
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight tracking-tight text-white">Welcome Back!</h2>
              <p className="text-2xl text-white leading-relaxed font-light">
                Continue your learning journey with AI-powered multilingual education
              </p>
            </div>

            <div className="space-y-8">
              {roleFeatures[role].map((feature, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <feature.icon className="h-7 w-7 text-blue-600" />
          </div>
          <div>
                    <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                    <p className="text-white text-lg leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">SkillBhasha</h1>
                  <p className="text-gray-600 text-sm">Multilingual Learning</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-2 text-center pb-6 px-6 pt-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Join thousands of learners and trainers worldwide
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 px-6 pb-8">
              {error && (
                <Alert variant="destructive" className="mb-4 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">I want to join as a:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("learner")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        role === "learner"
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        <span className="font-semibold text-sm">Learner</span>
                        <span className="text-xs text-center text-gray-600">Learn new skills</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("trainer")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        role === "trainer"
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="font-semibold text-sm">Trainer</span>
                        <span className="text-xs text-center text-gray-600">Create content</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button variant="outline" className="h-10 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium">Facebook</span>
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Shield className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-semibold text-blue-900">Secure</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Zap className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-semibold text-blue-900">Fast Setup</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Star className="h-5 w-5 text-blue-600 mx-auto mb-2" />
              <div className="text-xs font-semibold text-blue-900">Free</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
