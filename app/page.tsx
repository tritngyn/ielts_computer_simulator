"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Mic,
  Headphones,
  PenTool,
  ArrowRight,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const skills = [
  {
    id: "reading",
    title: "Reading",
    icon: BookOpen,
    description: "Test your reading comprehension with various passage types",
    paperColor: "bg-blue-50",
    accentColor: "bg-accent-blue",
    textColor: "text-blue-700",
    tagColor: "bg-blue-100 text-blue-700",
    image:
      "https://images.unsplash.com/photo-1740102075575-247d391eafd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMHRlc3R8ZW58MXx8fHwxNzcwMDg5NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    path: "/reading",
    rotation: "rotate-[-1.5deg]",
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: Mic,
    description: "Practice your speaking skills with simulated interviews",
    paperColor: "bg-green-50",
    accentColor: "bg-accent-green",
    textColor: "text-green-700",
    tagColor: "bg-green-100 text-green-700",
    image:
      "https://images.unsplash.com/photo-1668608322390-46344f213ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzcGVha2luZyUyMG1pY3JvcGhvbmV8ZW58MXx8fHwxNzcwMDg5NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    path: "/speaking",
    rotation: "rotate-[1deg]",
  },
  {
    id: "listening",
    title: "Listening",
    icon: Headphones,
    description: "Improve your listening comprehension with audio exercises",
    paperColor: "bg-purple-50",
    accentColor: "bg-accent-purple",
    textColor: "text-purple-700",
    tagColor: "bg-purple-100 text-purple-700",
    image:
      "https://images.unsplash.com/photo-1617803021651-8df9d37672a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3ZWFyaW5nJTIwaGVhZHBob25lcyUyMGxpc3RlbmluZ3xlbnwxfHx8fDE3NzAwODk0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    path: "/listening",
    rotation: "rotate-[-0.5deg]",
  },
  {
    id: "writing",
    title: "Writing",
    icon: PenTool,
    description: "Enhance your writing skills with task-based exercises",
    paperColor: "bg-orange-50",
    accentColor: "bg-accent-orange",
    textColor: "text-orange-700",
    tagColor: "bg-orange-100 text-orange-700",
    image:
      "https://images.unsplash.com/photo-1758876203754-1bc9d3ed514c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3cml0aW5nJTIwbm90ZXMlMjBkZXNrfGVufDF8fHx8MTc3MDA4OTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    path: "/writing",
    rotation: "rotate-[2deg]",
  },
];

const features = [
  {
    icon: Sparkles,
    text: "AI-powered feedback & scoring",
    paper: "bg-yellow-100",
    rotation: "rotate-[-1deg]",
  },
  {
    icon: Target,
    text: "Realistic exam simulations",
    paper: "bg-pink-100",
    rotation: "rotate-[1.5deg]",
  },
  {
    icon: TrendingUp,
    text: "Track your progress over time",
    paper: "bg-blue-100",
    rotation: "rotate-[-0.5deg]",
  },
  {
    icon: Zap,
    text: "Expert tips and strategies",
    paper: "bg-green-100",
    rotation: "rotate-[1deg]",
  },
  {
    icon: Star,
    text: "Comprehensive 4-skill practice",
    paper: "bg-orange-100",
    rotation: "rotate-[-1.5deg]",
  },
  {
    icon: MessageCircle,
    text: "24/7 AI assistant for guidance",
    paper: "bg-purple-100",
    rotation: "rotate-[0.5deg]",
  },
];

const paperIn = {
  hidden: { opacity: 0, y: 20, rotate: -2 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* ====== HERO SECTION ====== */}
      <section className="relative bg-paper-kraft torn-bottom pb-28 pt-12 px-4 overflow-hidden">
        {/* Decorative paper shapes */}
        <div className="absolute top-8 right-[10%] w-28 h-28 bg-yellow-200 rounded-full opacity-40 rotate-12 shadow-md" />
        <div className="absolute top-32 right-[5%] w-16 h-16 bg-pink-200 rounded-full opacity-30 -rotate-6 shadow-sm" />
        <div className="absolute bottom-32 left-[3%] w-20 h-20 bg-blue-200 rounded-full opacity-30 rotate-[20deg] shadow-sm" />
        <div className="absolute top-16 left-[8%] w-12 h-12 bg-green-200 rotate-45 opacity-25 shadow-sm" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-block paper-tag bg-yellow-200 text-yellow-800 mb-6 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                ✨ AI-Powered IELTS Prep
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-text-heading"
                style={{ transform: "rotate(-1deg)" }}
              >
                BẠN MUỐN
                <span className="block text-accent-blue">9.0 OVERALL?</span>
              </h1>
              <p className="text-xl mb-8 text-text-secondary font-body leading-relaxed max-w-lg">
                Comprehensive online platform for all four IELTS skills.
                Practice with realistic tests, get instant feedback, and achieve
                your target band score.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/reading"
                  className="paper-btn bg-accent-blue text-white rounded-sm"
                >
                  Start Practice <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="paper-btn bg-paper-white text-text-heading rounded-sm border-2 border-gray-200"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right — Photo collage */}
            <motion.div
              className="hidden md:block relative"
              initial={{ opacity: 0, rotate: 3 }}
              animate={{ opacity: 1, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              {/* Background paper layer */}
              <div className="absolute inset-0 bg-paper-pink rounded-sm shadow-[6px_6px_16px_rgba(0,0,0,0.1)] rotate-[4deg] -translate-x-4 translate-y-4" />

              {/* Main photo */}
              <div className="relative photo-frame rounded-sm rotate-[1deg]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1719498828499-48b0086e5c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwZW5nbGlzaCUyMGV4YW18ZW58MXx8fHwxNzcwMDg5NDc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students studying"
                  className="w-full rounded-sm"
                />
              </div>

              {/* Tape on photo */}
              <div className="tape tape-yellow absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-5deg] w-20" />

              {/* Small decorative tag */}
              <div className="absolute -bottom-4 -right-4 paper-tag bg-green-200 text-green-800 rotate-[6deg] shadow-[3px_3px_0px_rgba(0,0,0,0.1)]">
                📚 Study Smart
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section id="features" className="relative py-20 px-4 bg-paper-cream">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-center mb-4 text-text-heading"
            style={{ transform: "rotate(-0.5deg)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us? ✂️
          </motion.h2>
          <p className="text-center text-text-secondary mb-14 text-lg font-body max-w-2xl mx-auto">
            Everything you need to ace the IELTS exam, all in one place
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={`relative p-6 ${feature.paper} shadow-[4px_4px_12px_rgba(0,0,0,0.08)] ${feature.rotation} transition-all duration-200 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.14)] hover:-translate-y-1`}
                  custom={index}
                  variants={paperIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {/* Pin decoration */}
                  <div
                    className="paper-pin bg-red-400 -top-2 left-1/2 -translate-x-1/2"
                    style={{ position: "absolute" }}
                  />

                  <div className="flex items-start gap-4 pt-2">
                    <div className="p-2 bg-white/70 rounded-sm shadow-sm flex-shrink-0">
                      <Icon className="w-6 h-6 text-text-heading" />
                    </div>
                    <p className="text-gray-800 font-body text-lg leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== SKILLS SECTION ====== */}
      <section className="relative py-20 px-4 bg-paper-warm-gray torn-top pt-28">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-center mb-4 text-text-heading"
            style={{ transform: "rotate(0.5deg)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Choose Your Test 📝
          </motion.h2>
          <p className="text-center text-text-secondary mb-14 text-lg font-body max-w-2xl mx-auto">
            Practice all four IELTS skills with our comprehensive testing
            platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.id}
                  custom={index}
                  variants={paperIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{
                    y: -6,
                    rotate: 0,
                    transition: { duration: 0.18 },
                  }}
                  className={`relative ${skill.paperColor} ${skill.rotation} shadow-[6px_6px_16px_rgba(0,0,0,0.1)] overflow-hidden group cursor-pointer`}
                >
                  <Link href={skill.path} className="block">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback
                        src={skill.image}
                        alt={skill.title}
                        className="w-full h-full object-cover"
                      />
                      {/* White border photo effect */}
                      <div className="absolute inset-2 border-4 border-white/50 pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`${skill.accentColor} p-2.5 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.1)]`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl text-text-heading">
                          {skill.title}
                        </h3>
                      </div>
                      <p className="text-text-secondary font-body mb-4 text-sm leading-relaxed">
                        {skill.description}
                      </p>

                      {/* Paper button */}
                      <div
                        className={`w-full text-center py-2.5 ${skill.accentColor} text-white font-hand text-lg shadow-[3px_3px_0px_rgba(0,0,0,0.12)] group-hover:shadow-[1px_1px_0px_rgba(0,0,0,0.12)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-150`}
                      >
                        Start Test →
                      </div>
                    </div>
                  </Link>

                  {/* Tape decoration */}
                  <div className="tape tape-yellow absolute -top-2 left-4 rotate-[-8deg] w-14" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="relative bg-paper-pink torn-top py-20 px-4 pt-28 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-[5%] w-24 h-24 bg-yellow-200 rounded-full opacity-30 rotate-12" />
        <div className="absolute bottom-12 right-[8%] w-16 h-16 bg-blue-200 rotate-45 opacity-25" />

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Stacked paper layers */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-paper-white shadow-[8px_8px_0px_rgba(0,0,0,0.08)] rotate-[2deg] rounded-sm" />
            <div className="absolute inset-0 bg-paper-kraft shadow-[4px_4px_0px_rgba(0,0,0,0.06)] -rotate-[1deg] rounded-sm" />

            <div className="relative bg-paper-white p-10 md:p-14 shadow-[6px_6px_16px_rgba(0,0,0,0.1)] rounded-sm">
              <h2
                className="text-4xl md:text-5xl mb-6 text-text-heading"
                style={{ transform: "rotate(-1deg)" }}
              >
                Ready to Achieve Your Target Score? 🎯
              </h2>
              <p className="text-xl mb-8 text-text-secondary font-body max-w-xl mx-auto">
                Join thousands of students who have improved their IELTS scores
                with our platform
              </p>
              <Link
                href="/reading"
                className="paper-btn bg-accent-blue text-white rounded-sm text-xl"
              >
                Begin Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-paper-kraft py-8 px-4 text-center border-t-2 border-dashed border-amber-300/50">
        <p className="font-hand text-text-secondary text-lg">
          ✂️ Crafted with care by{" "}
          <span className="text-text-heading">tritngyn</span> · IELTS Master ©
          2026
        </p>
      </footer>
    </div>
  );
};

export default Home;
