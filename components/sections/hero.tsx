'use client';

import { Monitor, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import RetroButton from '../ui/retro-button';
import { AnimatedText } from '../ui/animated-text';
import { Spotlight } from '../ui/spotlight';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-cream-100 min-h-screen flex items-center">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 h-full">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-orange-500/20" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Spotlight className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full text-orange-400 font-mono">
                <Sparkles size={20} className="animate-pulse" />
                <span>AI-Powered Interview Preparation</span>
              </div>
            </motion.div>

            <AnimatedText
              text="CVision_ The Future of Interview Prep"
              className="text-6xl font-bold font-mono mb-6 text-orange-500"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl mb-8 font-mono text-cream-200 text-white"
            >
              Level up your interview game with AI-powered practice sessions.
              Get real-time feedback and improve your chances of landing your dream job.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex gap-4 justify-center"
            >
              <Link href="/dashboard">
                <RetroButton>Start Practicing</RetroButton>
              </Link>
              <RetroButton variant="secondary">Watch Demo</RetroButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
            >
              {[
                { icon: <Monitor />, title: "Real-time Analysis" },
                { icon: <Zap />, title: "Instant Feedback" },
                { icon: <Sparkles />, title: "AI-Powered" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 mx-auto mb-4 text-orange-400 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-mono font-bold">{item.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Spotlight>
      </div>
    </div>
  );
}
