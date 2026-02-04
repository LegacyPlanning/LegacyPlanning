import Link from "next/link";
import {
  Shield,
  Lock,
  Users,
  Clock,
  Key,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  FileText,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                Legacy Planning
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/claim"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Claim Access
              </Link>
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Digital Legacy Protection
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Secure Your
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}Digital Legacy
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Protect your digital assets with our intelligent Dead Man&apos;s Switch.
              Ensure your loved ones can access important information when they need it most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all group"
              >
                Start Protecting Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/claim"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg hover:border-indigo-500 hover:text-indigo-500 transition-all"
              >
                <Key className="w-5 h-5 mr-2" />
                I Have an Access Key
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-24 h-24 text-indigo-500 mx-auto mb-4 animate-pulse" />
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Your Digital Vault Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Problem We Solve
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              In today&apos;s digital world, your loved ones face significant challenges
              accessing your important digital assets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Password Protected",
                description:
                  "2FA, encryption, and complex passwords keep your assets secure - but also inaccessible to family.",
              },
              {
                icon: FileText,
                title: "Scattered Information",
                description:
                  "Subscriptions, investments, crypto, and legal docs spread across dozens of platforms.",
              },
              {
                icon: Clock,
                title: "Time Sensitive",
                description:
                  "Family needs quick access during emergencies, but recovery processes take weeks or months.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/30"
              >
                <item.icon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution/Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our intelligent system ensures your digital legacy is protected and
              accessible when needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: "Encrypt & Store",
                description: "Add your assets with client-side encryption. Only you hold the keys.",
                color: "from-purple-500 to-indigo-600",
              },
              {
                icon: Users,
                title: "Add Beneficiaries",
                description: "Designate trusted people who should receive access.",
                color: "from-indigo-500 to-blue-600",
              },
              {
                icon: Heart,
                title: "Stay Active",
                description: "Regular check-ins keep the Dead Man's Switch from triggering.",
                color: "from-pink-500 to-rose-600",
              },
              {
                icon: Key,
                title: "Secure Transfer",
                description: "If inactive, beneficiaries are notified and verified before access.",
                color: "from-green-500 to-emerald-600",
              },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-lg text-indigo-100">
              Your data is protected with the latest security standards
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "AES-256 Client-Side Encryption",
              "Zero-Knowledge Architecture",
              "Stripe Identity Verification",
              "Configurable Dead Man's Switch",
              "AI-Powered Beneficiary Guide",
              "Automated Email Notifications",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Protecting Your Digital Legacy Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of professionals who trust Legacy Planning to secure their
            digital future.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all group"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              <span className="font-bold text-gray-900 dark:text-white">
                Legacy Planning
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 Legacy Planning. Secure your digital future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
