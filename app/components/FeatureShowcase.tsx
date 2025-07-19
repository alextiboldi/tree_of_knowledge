"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import {
  TreePine,
  Brain,
  Shield,
  Sparkles,
  Users,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";

interface FeatureShowcaseProps {
  className?: string;
}

export function FeatureShowcase({ className = "" }: FeatureShowcaseProps) {
  const { t } = useTranslation();

  const showcaseFeatures = [
    {
      icon: TreePine,
      title: t("featureShowcase.features.tree.title"),
      description: t("featureShowcase.features.tree.description"),
      highlight: t("featureShowcase.features.tree.highlight"),
      demo: t("featureShowcase.features.tree.demo"),
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Brain,
      title: t("featureShowcase.features.ai.title"),
      description: t("featureShowcase.features.ai.description"),
      highlight: t("featureShowcase.features.ai.highlight"),
      demo: t("featureShowcase.features.ai.demo"),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Shield,
      title: t("featureShowcase.features.safety.title"),
      description: t("featureShowcase.features.safety.description"),
      highlight: t("featureShowcase.features.safety.highlight"),
      demo: t("featureShowcase.features.safety.demo"),
      color: "from-purple-500 to-violet-600",
    },
  ];

  const trustFeatures = [
    { icon: CheckCircle, text: t("featureShowcase.trust.educational") },
    { icon: Shield, text: t("featureShowcase.trust.guardrails") },
    { icon: Users, text: t("featureShowcase.trust.dashboard") },
    { icon: Heart, text: t("featureShowcase.trust.childFriendly") },
    { icon: Star, text: t("featureShowcase.trust.educator") },
    { icon: Sparkles, text: t("featureShowcase.trust.engaging") },
  ];

  const differenceItems = [
    t("featureShowcase.difference.ageAppropriate"),
    t("featureShowcase.difference.visual"),
    t("featureShowcase.difference.progressive"),
    t("featureShowcase.difference.parental"),
    t("featureShowcase.difference.coppa"),
    t("featureShowcase.difference.content"),
  ];

  const learningDomains = [
    {
      domain: t("featureShowcase.domains.science.name"),
      icon: "🔬",
      desc: t("featureShowcase.domains.science.desc"),
    },
    {
      domain: t("featureShowcase.domains.nature.name"),
      icon: "🌱",
      desc: t("featureShowcase.domains.nature.desc"),
    },
    {
      domain: t("featureShowcase.domains.math.name"),
      icon: "🔢",
      desc: t("featureShowcase.domains.math.desc"),
    },
  ];

  return (
    <div className={`space-y-16 ${className}`}>
      {/* Main Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {showcaseFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div
                  className={`p-6 bg-gradient-to-r ${feature.color} text-white`}
                >
                  <feature.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {feature.highlight}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="text-sm text-gray-500 italic">
                    {t("featureShowcase.demo")}: {feature.demo}
                  </div>
                </div>

                {/* Animated bottom accent */}
                <div
                  className={`h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Indicators Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/50 backdrop-blur-sm rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("featureShowcase.trust.title")}
          </h3>
          <p className="text-gray-600">{t("featureShowcase.trust.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-gray-700 font-medium leading-tight">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("featureShowcase.comparison.title")}
          </h3>
          <p className="text-gray-600">
            {t("featureShowcase.comparison.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What Makes Us Different */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("featureShowcase.difference.title")}
            </h4>
            <div className="space-y-3">
              {differenceItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Domains */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TreePine className="h-5 w-5 text-primary" />
              {t("featureShowcase.domains.title")}
            </h4>
            <div className="space-y-3">
              {learningDomains.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.domain}
                    </div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
