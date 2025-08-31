import { motion } from 'framer-motion';
import {
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Github,
  Heart
} from 'lucide-react';

export const PremiumFooter = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/aman.mishra__107/", name: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/amanmishra107/", name: "LinkedIn" },
    { icon: Github, href: "https://github.com/AmanMishra107", name: "GitHub" },
  ];
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Budgetly
              </span>
            </motion.div>

            <motion.p
              className="text-white/70 text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              The most trusted budget planning platform. Helping to manage their finances with the technology.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 text-white/70 hover:text-purple-400 transition-colors duration-300">
                <Mail className="w-5 h-5 text-purple-400" />
                <a
                  href="mailto:amanpavanmishra10@gmail.com"
                  className="hover:underline"
                >
                  amanpavanmishra10@gmail.com
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 text-white/70 hover:text-purple-400 transition-colors duration-300">
                <Phone className="w-5 h-5 text-purple-400" />
                <a
                  href="tel:+919834248447"
                  className="hover:underline"
                >
                  +91 9834248447
                </a>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 text-white/70 hover:text-purple-400 transition-colors duration-300">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Navi Mumbai, Maharashtra, India</span>
              </div>
            </motion.div>
          </div>

          {/* Social Links Section */}
          <div className="text-center lg:text-right">
            <motion.h4
              className="text-xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Connect With Me
            </motion.h4>

            <motion.div
              className="flex justify-center lg:justify-end gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-white/20 hover:border-purple-400 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </motion.div>

            {/* Security Badges */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-4 text-sm text-white/60"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>256-bit SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>RBI Compliant</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span>© 2025 Budgetly • Made in India</span>
              <span className="text-white/40">•</span>
              <span>Developed by Aman Mishra</span>
            </div>

            <div className="flex items-center gap-6">
              <span>All rights reserved</span>
              <span className="text-white/40">•</span>
              <span>Version 1.0.0</span>
            </div>
          </div>

        </motion.div>
      </div>
    </footer>
  );
};
