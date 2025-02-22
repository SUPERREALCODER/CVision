'use client';

import { Brain, Camera, MessageSquare, Target, Users, Video } from 'lucide-react';

import { motion } from 'framer-motion';
import { AnimatedText } from '../ui/animated-text';
import { Spotlight } from '../ui/spotlight';

export default function Features() {
  const features = [
    {
      icon: <Video className="w-8 h-8 " />,
      title: "Mock Interviews",
      description: "AI-powered video simulations."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Feedback on body language, tone, and responses."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Focus",
      description: "Custom preparation based on CV and job role."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Response Training",
      description: "Improve structured answers using AI-driven feedback."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Visual Feedback",
      description: "Improve structured answers using AI-driven feedback."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Advice",
      description: "Get AI-generated suggestions and curated professional advice."
    }
  ];

  return (
    <div className="bg-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <AnimatedText
            text="Features_ Supercharge Your Interview Skills"
            className="text-4xl font-mono font-bold text-orange-500 mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-cream-200 font-mono max-w-2xl mx-auto text-white"
          >
            Prepare for your next interview with our comprehensive suite of AI-powered tools
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Spotlight className="h-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 h-full bg-slate-800/50 backdrop-blur-sm"
                >
                  <div className="mb-4 text-orange-400">{feature.icon}</div>
                  <h3 className="text-xl font-mono font-bold mb-2 text-orange-400">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-cream-200">{feature.description}</p>
                </motion.div>
              </Spotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}