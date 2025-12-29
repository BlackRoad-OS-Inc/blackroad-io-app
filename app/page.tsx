import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-br-orange via-br-red to-br-purple bg-clip-text text-transparent">
            BlackRoad OS
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Composable agent orchestration platform. Build, deploy, and manage AI agents across your infrastructure.
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
            Start free. Scale with confidence. From hobbyists to enterprises.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Link
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-br-purple to-br-blue hover:opacity-80 rounded-lg font-semibold transition shadow-lg shadow-br-purple/50"
            >
              Start Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
            >
              View Pricing
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            No credit card required · Deploy in seconds
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why BlackRoad?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Deploy Instantly</h3>
              <p className="text-gray-400">
                Launch AI agents in seconds. No complex setup, no DevOps headaches.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Monitor Everything</h3>
              <p className="text-gray-400">
                Real-time dashboards show agent health, usage, and performance metrics.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Scale Infinitely</h3>
              <p className="text-gray-400">
                From 1 to 10,000 agents. Built on Cloudflare's global network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div className="border-t border-gray-800 py-20 bg-gradient-to-b from-transparent to-br-purple/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join developers deploying AI agents at scale.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-10 py-4 bg-gradient-to-r from-br-purple to-br-blue hover:opacity-80 rounded-lg font-semibold transition text-lg shadow-lg shadow-br-purple/50"
            >
              Start Free Today
            </Link>
            <Link
              href="/pricing"
              className="px-10 py-4 bg-transparent border-2 border-gray-700 hover:border-gray-600 rounded-lg font-semibold transition text-lg"
            >
              See Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">© 2025 BlackRoad OS. All rights reserved.</p>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
            <Link href="/metaverse" className="text-gray-400 hover:text-white transition">Metaverse</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
