import React from 'react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { motion } from 'framer-motion';
import { 
  Users, Target, Book, Heart, Award, 
  Lightbulb, CheckCircle, TrendingUp, Star, 
  Quote, ChevronRight, Mail, Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const AboutUs = () => {
  const navigate = useNavigate();

  // Team members
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Ex-Google hiring manager with a passion for connecting talent with opportunity.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      socialLinks: ["twitter", "linkedin"]
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Previously led engineering teams at top tech companies with a focus on AI-powered recruiting.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      socialLinks: ["twitter", "linkedin", "github"]
    },
    {
      name: "Aisha Patel",
      role: "Head of Product",
      bio: "Product visionary with experience building platforms that connect people and opportunities.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      socialLinks: ["linkedin"]
    },
    {
      name: "David Wilson",
      role: "Head of Partnerships",
      bio: "Built relationships with over 500 companies to create job opportunities for our users.",
      image: "https://randomuser.me/api/portraits/men/86.jpg",
      socialLinks: ["twitter", "linkedin"]
    },
    {
      name: "Emily Rodriguez",
      role: "Chief Marketing Officer",
      bio: "Digital marketing strategist with expertise in building brands that resonate with global audiences.",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      socialLinks: ["twitter", "linkedin"]
    },
  ];

  // Company values
  const values = [
    {
      icon: <Target className="w-12 h-12 text-purple-500" />,
      title: "Mission-Driven",
      description: "We're committed to transforming how people find meaningful careers and how companies discover talent."
    },
    {
      icon: <Heart className="w-12 h-12 text-purple-500" />,
      title: "People First",
      description: "We believe in putting the needs of job seekers and employers at the center of everything we do."
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-purple-500" />,
      title: "Innovation",
      description: "We continuously push boundaries to create smarter, more effective ways to connect talent with opportunity."
    },
    {
      icon: <Award className="w-12 h-12 text-purple-500" />,
      title: "Excellence",
      description: "We hold ourselves to the highest standards in every aspect of our service and user experience."
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
      title: "Growth Mindset",
      description: "We embrace challenges and view them as opportunities to learn, adapt, and improve our platform."
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500" />,
      title: "Community",
      description: "We foster a supportive ecosystem where professionals can connect, share insights, and grow together."
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Carevo completely transformed our hiring process. We've found incredible talent that we wouldn't have discovered through traditional channels.",
      author: "Emily Rodriguez",
      position: "HR Director at TechGrowth Inc.",
      image: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    {
      quote: "I landed my dream job within two weeks of using Carevo. The personalized job recommendations were spot-on for my skills and career goals.",
      author: "James Liu",
      position: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/54.jpg"
    },
    {
      quote: "As someone transitioning careers, Carevo was invaluable. The platform helped me showcase my transferable skills to potential employers.",
      author: "Sophia Martinez",
      position: "Marketing Specialist",
      image: "https://randomuser.me/api/portraits/women/19.jpg"
    },
  ];

  // Stats 
  const stats = [
    { value: "10M+", label: "Job Seekers" },
    { value: "150K+", label: "Companies" },
    { value: "5M+", label: "Job Matches" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-40 h-40 bg-pink-600/10 rounded-full blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:60px_60px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 inline-block"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-purple-300">
                About Carevo
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400"
            >
              Transforming How the World Works
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-8"
            >
              At Carevo, we're building the future of talent acquisition and career development, 
              connecting the right people with the right opportunities through technology and human insight.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                onClick={() => navigate('/jobs')} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full shadow-lg shadow-purple-500/20"
              >
                Explore Jobs 
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/contact')} 
                variant="outline" 
                className="border-purple-500/30 text-white hover:bg-purple-500/20 px-8 py-6 rounded-full"
              >
                Contact Us
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={pulseAnimation}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                  {stat.value}
                </h3>
                <p className="text-slate-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Book className="mr-3 text-purple-500" />
              Our Story
            </h2>
            <p className="text-slate-300 mb-6">
              Carevo was born from a simple observation: the traditional hiring process wasn't working for either side of the equation. 
              Job seekers were struggling to find roles that matched their skills and aspirations, while companies were missing out on 
              exceptional talent due to outdated recruitment methods.
            </p>
            <p className="text-slate-300 mb-6">
              Founded in 2025, we set out to build a platform that would transform this broken system. 
              We leveraged cutting-edge technology and deep industry expertise to create a more intelligent, 
              efficient, and human-centered approach to connecting talent with opportunity.
            </p>
            <p className="text-slate-300">
              Today, Carevo serves millions of users worldwide, from recent graduates to seasoned professionals, 
              and partners with organizations ranging from startups to Fortune 500 companies. But we're just getting started 
              on our mission to revolutionize how the world works.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Team working together" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-sm font-medium bg-purple-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  Founded in 2025
                </span>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-5 -right-5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Users className="h-6 w-6 text-white" />
            </motion.div>
            <motion.div 
              className="absolute -bottom-5 -left-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-4 shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              These principles guide everything we do, from how we build our product to how we interact with our community.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 inline-block rounded-lg mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Meet Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              The passionate people behind Carevo who are dedicated to our mission of transforming how people find work.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden group hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="h-52 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-purple-400 text-xs mb-1">{member.role}</p>
                  <p className="text-slate-400 text-xs mb-3">{member.bio}</p>
                  <div className="flex gap-1">
                    {member.socialLinks.includes('twitter') && (
                      <a href="#" className="text-slate-400 hover:text-[#1DA1F2]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.includes('linkedin') && (
                      <a href="#" className="text-slate-400 hover:text-[#0077B5]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"></path>
                        </svg>
                      </a>
                    )}
                    {member.socialLinks.includes('github') && (
                      <a href="#" className="text-slate-400 hover:text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-slate-800/30 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">What People Say</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Hear from the people and organizations who have experienced the Carevo difference.
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 relative hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-purple-500/30" />
                </div>
                <p className="text-slate-300 mb-8 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-purple-500/30">
                    <AvatarImage src={testimonial.image} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-slate-400">{testimonial.position}</p>
                  </div>
                </div>
                <div className="absolute top-6 right-8 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Join Us CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-10 border border-white/10 text-center relative overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px]"></div>
            
            <h2 className="text-3xl font-bold mb-4 relative z-10">Join Our Mission</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto relative z-10">
              Whether you're looking for your next career move or aiming to attract top talent to your organization, 
              Carevo is here to help you succeed in the evolving world of work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Button 
                onClick={() => navigate('/signup')} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full shadow-lg shadow-purple-500/20"
              >
                Sign Up Now
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/contact')} 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full"
              >
                Contact Sales
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs; 