"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  TreePine,
  Sparkles,
  Shield,
  Brain,
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AnimatedLandingPageProps {
  onGetStarted: () => void;
}

export function AnimatedLandingPage({
  onGetStarted,
}: AnimatedLandingPageProps) {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation controls
  const heroControls = useAnimation();
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true });

  // Auto-cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Start hero animation
  useEffect(() => {
    heroControls.start("visible");
  }, [heroControls]);

  const features = [
    {
      icon: Brain,
      title: t("features.askAnything.title"),
      description: t("features.askAnything.description"),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: TreePine,
      title: t("features.knowledgeBlossom.title"),
      description: t("features.knowledgeBlossom.description"),
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: t("features.safeLearning.title"),
      description: t("features.safeLearning.description"),
      color: "from-purple-500 to-violet-600",
    },
  ];

  const testimonials = [
    {
      text: t("testimonials.sarah.text"),
      author: t("testimonials.sarah.author"),
      role: t("testimonials.sarah.role"),
      rating: 5,
    },
    {
      text: t("testimonials.david.text"),
      author: t("testimonials.david.author"),
      role: t("testimonials.david.role"),
      rating: 5,
    },
    {
      text: t("testimonials.maria.text"),
      author: t("testimonials.maria.author"),
      role: t("testimonials.maria.role"),
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: t("stats.questionsAnswered") },
    { number: "99%", label: t("stats.parentSatisfaction") },
    { number: "5-15", label: t("stats.ageRange") },
    { number: "24/7", label: t("stats.learningAvailable") },
  ];

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const treeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        type: "spring",
        damping: 20,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate={heroControls}
            className="text-center"
          >
            {/* Animated Tree Hero */}
            <motion.div variants={treeVariants} className="relative mb-8">
              <div className="relative inline-block">
                <TreePine className="h-24 w-24 mx-auto text-primary" />

                {/* Floating sparkles around tree */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={sparkleVariants}
                    animate="animate"
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) 
                                 rotate(${i * 45}deg) 
                                 translateY(-40px) 
                                 rotate(-${i * 45}deg)`,
                    }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.h1
              variants={childVariants}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <Trans
                i18nKey="hero.title.line1"
                components={{
                  1: <span className="text-primary" />,
                }}
              />
              <br />
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              {t("hero.subtitle.line1")}
              <br />
              <span className="text-primary font-semibold">
                {t("hero.subtitle.line2")}
              </span>{" "}
              {t("hero.subtitle.line3")}
            </motion.p>

            <motion.div
              variants={childVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("hero.buttons.startLearning")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                {t("hero.buttons.watchDemo")}
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={childVariants}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>{t("hero.trustIndicators.coppa")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{t("hero.trustIndicators.parentApproved")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>{t("hero.trustIndicators.childSafe")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-10 left-10 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-blue-400" />
          </motion.div>
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="h-6 w-6 text-purple-400" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("testimonials.title")}
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="p-8 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="space-y-6">
                  <div className="flex justify-center space-x-1 mb-4">
                    {Array.from({
                      length: testimonials[currentTestimonial].rating,
                    }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg md:text-xl text-gray-700 italic">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {t("cta.subtitle")}
            </p>

            <div className="space-y-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("cta.buttons.startFree")}
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-white/80 text-sm">{t("cta.noCreditCard")}</p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{t("cta.trustIndicators.safe")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{t("cta.trustIndicators.parentControlled")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>{t("cta.trustIndicators.educational")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
