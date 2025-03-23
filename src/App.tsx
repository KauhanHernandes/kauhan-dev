import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { Github, Linkedin, Mail, Home, User, FolderGit2, MessageSquare, AlignJustify, ExternalLink, Globe, Link2, Terminal, ChevronDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import 'keen-slider/keen-slider.min.css';




const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'Sobre Mim', icon: User },
  { id: 'projects', label: 'Projetos', icon: FolderGit2 },
  { id: 'contact', label: 'Contato', icon: MessageSquare },
];

const projects = [
  {
    title: 'Meu Portfílio',
    description: 'Meu portfólio pessoal.',
    image: '/imgs/home/porflio.png',
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'HTML/CSS/JavaScript', 'EmailJs'],
    link: 'https://kauhan-dev.vercel.app/',
    github: '#',
    preview: 'https://kauhan-dev.vercel.app/'
  },
  {
    title: 'Portfólio Nutricionista',
    description: 'Este é um projeto de site pessoal para a nutricionista Maria Evellyn, destacando suas especializações em nutrição materno-infantil, terapia alimentar e nutrição escolar.',
    image: '/imgs/home/nutri1.png',
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'HTML/CSS/JavaScript', 'Aos'],
    link: 'https://nutrievellyn.vercel.app/',
    github: '#',
    preview: 'https://nutrievellyn.vercel.app/'
  },
  {
    title: 'Sistema de cadastramento',
    description: 'Aplicação Web para cadastramento de empresas com todas as informações possíveis.',
    image: '/imgs/home/cadastr.png',
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'HTML/CSS/JavaScript'],
    link: 'https://sistema-cadastramento.vercel.app/',
    github: '#',
    preview: 'https://sistema-cadastramento.vercel.app/'
  },
];

const skills = {
  frontend: [
    { name: 'HTML', icon: '🌐' },
    { name: 'CSS', icon: '🎨' },
    { name: 'JavaScript', icon: '📜' },
    { name: 'TypeScript', icon: '💪' },
    { name: 'Bootstrap', icon: '🅱️' },
    { name: 'Tailwind CSS', icon: '🌊' }
  ],
  backend: [
    { name: 'Node.js', icon: '🟢' },
    { name: 'PHP', icon: '🐘' },
    { name: 'SQL', icon: '📊' },
    { name: 'PostgreSQL', icon: '🗄️' }
  ],
  frameworks: [
    { name: 'React.js', icon: '⚛️' },
    { name: 'Next.js', icon: '▲' },
    { name: 'Laravel', icon: '🔥' },
    { name: 'Vite', icon: '⚡' }
  ],
  others: [
    { name: 'Git', icon: '📚' },
    { name: 'Docker Básico', icon: '🐳' },
    { name: 'UI/UX', icon: '🎨' }
  ]
};

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 'auto',
      spacing: 20,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 20 }
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 20 }
      }
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      toast.error('Por favor, complete o captcha');
      return;
    }

    setLoading(true);

    try {
      const result = await emailjs.send(
        'service_auvjtef',
        'template_ih36ho8',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'kauhanhernandes@gmail.com',
          'g-recaptcha-response': recaptchaValue,
        },
        'el4ZwZ0FP5UayapwI'
      );

      if (result.status === 200) {
        toast.success('Mensagem enviada com sucesso!');
        setFormData({ name: '', email: '', message: '' });
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-cyan-400 font-mono text-xl"
            >
              {'<'} Kauhan Hernandes {'>'}
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      activeTab === tab.id 
                        ? 'text-cyan-400 bg-gray-800 scale-105 shadow-lg shadow-cyan-500/20' 
                        : 'text-gray-300 hover:text-cyan-400 hover:scale-105'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-cyan-400 hover:text-cyan"
              >
                <AlignJustify size={22} /> 
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-sm"
            >
              <div className="px-4 py-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id ? 'text-cyan-400 bg-gray-800' : 'text-gray-300 hover:text-cyan-400'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && (
              <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-12 relative">
                <motion.div 
                  className="flex-1 space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-block px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-medium"
                    >
                      <Terminal size={16} className="inline mr-2" />
                      Desenvolvedor Full Stack
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-bold">
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        <TypewriterText text="Kauhan Hernandes" />
                      </span>
                    </h1>
                    <p className="text-xl text-gray-400 mt-4 max-w-lg">
                      Transformando ideias em código e criando experiências digitais memoráveis.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <motion.a
                      href="https://github.com/kauhanhernandes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={20} />
                      <span>GitHub</span>
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/kauhanhernandes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                    </motion.a>
                  </div>

                  <motion.div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="flex-1 relative"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative w-full aspect-square max-w-lg mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <img
                      src={PLACEHOLDER_IMAGE}
                      alt="Coding illustration"
                      className="relative rounded-2xl shadow-2xl shadow-cyan-500/20 border-2 border-gray-800"
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <img
                      src="/imgs/home/avatar.jpg"
                      alt="Profile"
                      className="relative rounded-full w-full h-full object-cover border-4 border-cyan-400"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                      <h2 className="text-4xl font-bold">Olá!</h2>
                      <motion.span 
                        className="text-4xl"
                        animate={{ rotate: [0, 20, -20, 20, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        👋
                      </motion.span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                    Experiência acadêmicas referente a listas de exercícios mas, e estou constantemente buscando novas formas de expandir meu conhecimento e me desafiar. Estou pronto para contribuir, dedicação e criatividade para projetos que exijam soluções inovadoras e focadas em resultados.
                    Estou em busca de oportunidades que me permitam crescer profissionalmente, ganhando experiência prática e desenvolvendo minhas habilidades. Se você precisa de alguém motivado e comprometido, estou à disposição para colaborar em seu projeto.
                    </p>
                    <motion.a 
                      href="/imgs/curriculum/Curriculo Kauhan Hernandes.pdf" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg inline-flex items-center gap-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Abrir CV
                      <ExternalLink size={20} />
                    </motion.a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                  {Object.entries(skills).map(([category, skillList], idx) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h3>
                      <div className="space-y-3">
                        {skillList.map((skill, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-2 text-gray-300"
                            whileHover={{ x: 10, color: '#22d3ee' }}
                          >
                            <span>{skill.icon}</span>
                            <span>{skill.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">Projetos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-cyan-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github size={20} />
                            <span>Código</span>
                          </motion.a>
                          <motion.a
                            href={project.preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Globe size={20} />
                            <span>Preview</span>
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto space-y-8">
                <Toaster position="top-right" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4"
                >
                  <h2 className="text-3xl font-bold">Entre em Contato</h2>
                  <p className="text-gray-400">Vamos conversar sobre seu próximo projeto!</p>
                </motion.div>
                <motion.form 
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="block text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      placeholder="Seu nome completo"
                      required
                      pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}"
                      title="Por favor, insira um nome válido (apenas letras e espaços)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      placeholder="seu@email.com"
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Por favor, insira um email válido"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Mensagem</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                      placeholder="Sua mensagem aqui..."
                      required
                      minLength={10}
                      maxLength={1000}
                    ></textarea>
                  </div>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LfdOP0qAAAAAMhwOC6fpILAFlEy1Ji1lncgsjnf"
                      theme="dark"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? 'Enviando...' : 'Enviar mensagem'}
                  </motion.button>
                </motion.form>
                <motion.div 
                  className="flex justify-center space-x-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a 
                    href="mailto:kauhanhernandes@gmail.com" 
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail size={24} />
                  </motion.a>
                  <motion.a 
                    href="https://github.com/kauhanhernandes" 
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github size={24} />
                  </motion.a>
                  <motion.a 
                    href="https://www.linkedin.com/in/kauhanhernandes/" 
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin size={24} />
                  </motion.a>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;