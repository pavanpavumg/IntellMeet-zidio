'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Video,
  MessageSquare,
  Brain,
  BarChart3,
  Users,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
  Play,
  Star
} from 'lucide-react'
import { useTheme } from 'next-themes'

const features = [
  {
    icon: Video,
    title: 'HD Video Meetings',
    description: 'Crystal-clear video conferencing with up to 500 participants and advanced noise cancellation.'
  },
  {
    icon: Brain,
    title: 'AI Meeting Summary',
    description: 'Get intelligent meeting summaries, action items, and key decisions automatically extracted.'
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description: 'Seamless messaging with channels, threads, and file sharing for your entire team.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track meeting productivity, engagement metrics, and team collaboration insights.'
  },
  {
    icon: Users,
    title: 'Team Workspace',
    description: 'Organize teams, manage projects, and collaborate on tasks all in one place.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, SSO integration, and compliance with SOC 2 and GDPR.'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechFlow Inc.',
    content: 'IntellMeet has transformed how our engineering teams collaborate. The AI summaries save us hours every week.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'InnovateCo',
    content: 'The Kanban integration and meeting recordings have made our sprint planning incredibly efficient.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'CEO',
    company: 'StartupXYZ',
    content: 'Finally, a platform that combines Zoom, Slack, and Notion into one seamless experience.',
    rating: 5
  }
]

const pricingPlans = [
  {
    name: 'Basic',
    price: '$0',
    period: '/month',
    description: 'For individuals and small teams getting started.',
    features: [
      '40-minute meeting limit',
      'Up to 10 participants',
      'Basic chat features',
      '5GB cloud storage',
      'Email support'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/user/month',
    description: 'For growing teams that need more power.',
    features: [
      'Unlimited meeting duration',
      'Up to 100 participants',
      'AI meeting summaries',
      '100GB cloud storage',
      'Priority support',
      'Custom branding'
    ],
    cta: 'Start Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with advanced needs.',
    features: [
      'Unlimited everything',
      'Up to 500 participants',
      'Advanced AI features',
      'Unlimited storage',
      'Dedicated support',
      'SSO & SAML',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">IntellMeet</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <div className="flex flex-col gap-4">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
                  Testimonials
                </Link>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
                <Button asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="mr-1 h-3 w-3" />
              Now with AI-Powered Features
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              The Complete Platform for
              <span className="block text-primary">Enterprise Collaboration</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Transform your meetings with AI-powered summaries, real-time chat, and seamless team collaboration. 
              One platform for video calls, messaging, tasks, and analytics.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/meeting/lobby">
                  <Play className="mr-2 h-4 w-4" />
                  Start Meeting
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/meeting/join">
                  Join Meeting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free forever for small teams. No credit card required.
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border bg-card p-2 shadow-2xl">
              <div className="rounded-lg bg-muted/50 aspect-video flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-2 p-4 w-full max-w-4xl">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Collaborate
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              From video meetings to project management, IntellMeet brings all your collaboration tools into one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card hover:shadow-lg transition-shadow border-border">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Trusted by Leading Teams
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our customers have to say about IntellMeet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Plans and Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started immediately for free. Upgrade for more features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`bg-card border-border relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Recommended
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-foreground">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">IntellMeet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The complete platform for enterprise collaboration and AI-powered meetings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} IntellMeet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
