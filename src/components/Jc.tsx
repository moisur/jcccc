'use client'

import React, { useState, useEffect,ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Star, Menu, X, Phone, Mail, MapPin, ArrowUpRight, Lightbulb, Target, Users, Zap, Brain, Heart, Rocket } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useInView } from 'react-intersection-observer'
import ShineBorder from "@/components/magicui/shine-border";
import { AnimatedBeamDemo } from './AnimatedBeamDemo'
import Meteors from "@/components/magicui/meteors";
import Image from 'next/image'
import imaaa from '../../public/1.jpg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface NavItemProps {
  href: string;
  children: ReactNode;
}
const NavItem: React.FC<NavItemProps> = ({ href, children }) => (
  <a href={href} className="relative group">
    <span className="text-gray-800 group-hover:text-purple-600 transition-colors duration-300">{children}</span>
    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
  </a>
)

const MovingBlobs = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <motion.div
      className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute top-3/4 right-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      animate={{
        x: [0, -100, 0],
        y: [0, -50, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      animate={{
        x: [0, 50, 0],
        y: [0, 100, 0],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </div>
)
interface FadeInSectionProps {
  children: ReactNode;
}
const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  )
}

const PopularBadge = () => (
  <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
    Populaire
  </div>
)

const RotatingBorder = () => (
  <div className="absolute inset-0 rounded-lg">
    <div className="absolute inset-0 rounded-lg border-2 border-purple-500 opacity-75"></div>
    <div className="absolute inset-0 rounded-lg border-2 border-transparent border-t-purple-500 animate-spin-slow"></div>
  </div>
)

export default function Jc() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMenuOpen(false)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <MovingBlobs />

      <header className={`py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-md' : ''}`}>
        <nav className={`flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}
          >
            JC
          </motion.div>
          <div className="hidden md:flex space-x-8">
            <NavItem href="#about">À propos</NavItem>
            <NavItem href="#services">Services</NavItem>
            <NavItem href="#process">Processus</NavItem>
            <NavItem href="#testimonials">Témoignages</NavItem>
            <NavItem href="#contact">Contact</NavItem>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white bg-opacity-90 backdrop-blur-md p-4 fixed top-16 left-0 right-0 z-40"
          >
            <div className="flex flex-col space-y-4">
              <NavItem href="#about">À propos</NavItem>
              <NavItem href="#services">Services</NavItem>
              <NavItem href="#process">Processus</NavItem>
              <NavItem href="#testimonials">Témoignages</NavItem>
              <NavItem href="#contact">Contact</NavItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-20">
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
          >

            <Meteors number={7} />
            <span className="pointer-events-none whitespace-pre-wrap bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            JC le catalyseur de clarté
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl mb-12 text-gray-600"
          >
            Devenez un multi potentiel assumé
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <a href="#contact">
                Commencez votre transformation <ArrowRight className="ml-2" />
              </a>
            </Button>
          </motion.div>
          </div>


        </section>

        <div className="mx-auto">

        </div>
        <FadeInSection>
          <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Êtes-vous un entrepreneur multi passionné ?</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg mb-6 text-gray-700">
                    Êtes-vous <span className="text-purple-600 font-semibold">tiraillé entre vos nombreux talents</span>, mais freiné par des <span className="italic">doutes profonds</span> et des <span className="italic">schémas autodestructeurs</span> ?
                  </p>
                  <p className="text-lg mb-6 text-gray-700">
                    Avez-vous l&apos;impression de <span className="text-purple-600 font-semibold">courir dans tous les sens sans vraiment avancer</span> ?
                  </p>
                  <p className="text-lg mb-6 text-gray-700">
                    Il est temps de <span className="text-purple-600 font-semibold">transformer cette tempête intérieure</span> en une <span className="text-purple-600 font-semibold">force motrice pour votre succès</span>.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src={imaaa}
                    alt="JC le catalyseur de clarté"
                    width={400}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50 backdrop-blur-md"></div>
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Mon approche unique</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Identification des causes profondes", description: "Découvrez et traitez les racines de votre auto-sabotage pour libérer votre potentiel.", icon: <ArrowUpRight className="w-6 h-6 text-purple-600" /> },
                  { title: "Développement de la conscience de soi", description: "Affinez votre compréhension de vous-même pour prendre des décisions éclairées.", icon: <Lightbulb className="w-6 h-6 text-purple-600" /> },
                  { title: "Stratégies concrètes", description: "Adoptez des habitudes efficaces pour atteindre vos objectifs personnels et professionnels.", icon: <Target className="w-6 h-6 text-purple-600" /> },
                  { title: "Soutien continu", description: "Bénéficiez d'un accompagnement personnalisé pour assurer votre progression constante.", icon: <Users className="w-6 h-6 text-purple-600" /> }
                ].  map((service, index) => (
                  <ShineBorder   
                  key={index}
                  className="bg-white border-purple-200 hover:border-pink-200 transition-colors duration-300"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  >
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        {service.icon}
                      </div>
                      <CardTitle className="text-purple-600 text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{service.description}</p>
                    </CardContent>
                  </ShineBorder>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="focus-boost" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Votre Tremplin vers le Succès</h2>
              <p className="text-lg mb-8 text-gray-700">
                La vérité, c&apos;est que votre multipotentialité est votre super pouvoir... une fois que vous avez appris à la maîtriser.
              </p>
              <p className="text-lg mb-8 text-gray-700">
                Imaginez-vous vous réveiller chaque matin avec une vision claire de votre voie idéale, ressentir une vague de motivation imparable et atteindre vos objectifs sans effort – tout en embrassant la richesse de vos passions.
              </p>
              <p className="text-lg mb-8 text-gray-700">
                Mon accompagnement est votre feuille de route personnalisée vers la maîtrise de votre multipotentialité. Oubliez les affirmations creuses et les méthodes miracles. Mon processus, c&apos;est bien plus qu&apos;un simple accompagnement, c&apos;est un véritable tremplin vers la vie qui vous ressemble.
              </p>
              <h3 className="text-2xl font-bold mb-6 text-purple-600">Ce que vous obtiendrez</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Silence intérieur", description: "Domptez le flot incessant de pensées et la fatigue décisionnelle. Découvrez votre \"Zone de Génie\", ce point de convergence unique entre vos passions et vos talents.", icon: <Brain className="w-6 h-6 text-purple-600" /> },
                  { title: "Concentration laser", description: "Développez une capacité de concentration inébranlable grâce à des techniques de priorisation et de gestion du temps conçues pour les esprits multipotentiels.", icon: <Zap className="w-6 h-6 text-purple-600" /> },
                  { title: "Confiance inébranlable", description: "Brisez les chaînes du syndrome de l'imposteur et libérez le leader multipassionné qui sommeille en vous.", icon: <Heart className="w-6 h-6 text-purple-600" /> },
                  { title: "Vie riche de sens", description: "Transformez vos passions en une carrière épanouissante et donnez vie à vos projets les plus audacieux.", icon: <Rocket className="w-6 h-6 text-purple-600" /> }
                ].map((benefit, index) => (
                  <ShineBorder
                  key={index}
                  className="bg-white border-purple-200 hover:border-pink-200 transition-colors duration-300"
                  color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                  >                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-purple-600 text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </ShineBorder>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="process" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Comment se déroulent les 4 appels</h2>
              <div className="space-y-8">
                {[
                  { title: "Appel 1 : Découverte et Diagnostic", description: "Nous explorons en profondeur vos défis, vos aspirations et vos blocages. C'est le moment de poser les bases de votre transformation." },
                  { title: "Appel 2 : Élaboration de la Stratégie", description: "Ensemble, nous concevons un plan d'action personnalisé, aligné sur vos objectifs et adapté à votre style de multipotentialité." },
                  { title: "Appel 3 : Mise en Œuvre et Ajustements", description: "Nous passons en revue vos premiers pas, célébrons vos victoires et affinons votre stratégie en fonction des premiers résultats." },
                  { title: "Appel 4 : Consolidation et Projection", description: "Nous ancrons vos nouvelles habitudes, anticipons les défis futurs et traçons la voie pour votre succès continu en tant que multipotentiel épanoui." }
                ].map((step, index) => (
                  <Card key={index} className="bg-white border-purple-200 hover:border-pink-200 transition-colors duration-300">
                    <CardHeader>
                      <CardTitle className="text-purple-600 text-xl">{`${index + 1}/ ${step.title}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="my-story" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Mon Parcours et Ma Mission</h2>
              <div className="space-y-6 text-gray-700">
                <p>
                  Je suis JC, le Catalyseur de Clarté, et ma mission est de vous aider à capitaliser sur votre nature multi-passionnée tout en trouvant la clarté et la direction qui vous ont toujours échappé.
                </p>
                <p>
                  J&apos;ai vécu les mêmes défis que vous. J&apos;ai jonglé avec mes passions, lutté contre mes envies divergentes et ressenti la paralysie face à la pression de &rdquo;choisir une seule chose&rdquo;. Ces expériences m&apos;ont conduit à développer une approche unique pour aider les multipotentiels comme vous à s&apos;apos;épanouir.
                </p>
                <p>
                  Ma motivation pour vous aider vient de mon propre parcours. J&apos;ai transformé mes luttes en force, et je veux partager ce chemin avec vous. Je crois profondément que votre multipotentialité est un don, pas un fardeau, et je suis déterminé à vous montrer comment en faire votre plus grand atout.
                </p>
                <p>
                  Avec mon programme, je m&apos;engage à vous guider vers une vie declarté absolue, de concentration efficace et de sens profond. Ensemble, nous allons débloquer votre potentiel et créer la vie épanouissante que vous méritez.
                </p>
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Ce que disent mes clients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { content: "Travailler avec JC a été une véritable transformation. J'ai enfin l'impression d'avoir la permission d'être moi-même et de poursuivre toutes mes passions sans m'épuiser. Je suis plus productif, plus rentable et, surtout, plus heureux que jamais.", author: "Marc, entrepreneur" },
                  { content: "JC m'a aidé à découvrir la racine de mes comportements autodestructeurs et m'a fourni des stratégies pratiques pour les surmonter. J'ai maintenant une vision claire et un plan solide pour atteindre mes objectifs.", author: "Sophie, multi-potentielle" }
                ].map((testimonial, index) => (
                  <Card key={index} className="bg-white border-purple-200 hover:border-pink-200 transition-colors duration-300">
                    <CardContent className="pt-6">
                      <p className="mb-4 text-gray-600">{testimonial.content}</p>
                      <p className="font-semibold text-purple-600">{testimonial.author}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Mes offres exclusives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "L'Appel Déclic", price: "100€", features: ["60 minutes d'échange", "Identification des blocages", "Plan d'action"] },
                  { title: "Pack Clarté", price: "240€", features: ["4 appels de 60 minutes", "Suivi quotidien", "Transformation en profondeur"], popular: true },
                  { title: "All Inclusive", price: "Sur devis", features: ["Programme sur mesure", "Accompagnement illimité", "Ressources exclusives"] }
                ].map((offer, index) => (
                  <div key={index} className="relative">
                    {offer.popular && <PopularBadge />}
                    <ShineBorder
                    key={`shine-${index}`} 
                    className="bg-white border-purple-200 hover:border-pink-200 transition-colors duration-300"
                    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    >                      {offer.popular && <RotatingBorder />}
                      <CardHeader>
                        <CardTitle className="text-purple-600">{offer.title}</CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold text-gray-800">{offer.price}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {offer.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-gray-600">
                              <Check className="mr-2 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          {offer.price === "Sur devis" ? "Demander un devis" : "Choisir"}
                        </Button>
                      </CardFooter>
                    </ShineBorder>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="video" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Ce que disent les anciens clients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-w-16 aspect-h-9">
                  <video src="https://d1yei2z3i6k35z.cloudfront.net/4371535/65a7efaa2188a_charlesantoine.mp4" controls className="rounded-lg shadow-lg w-full h-full object-cover" playsInline />
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  <video src="https://d1yei2z3i6k35z.cloudfront.net/4371535/65a7efc34af51_video_2023-12-20_19-02-51.mp4" controls className="rounded-lg shadow-lg w-full h-full object-cover" playsInline />
                </div>
              </div>
              <div className="mt-8 aspect-w-16 aspect-h-9">
                <video src="https://d1yei2z3i6k35z.cloudfront.net/4371535/65a7efd3c2ec8_Studio_Project_V1.mp4" controls className="rounded-lg shadow-lg w-full h-full object-cover" playsInline />
              </div>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Questions fréquentes</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Qu&apos;est-ce qu&apos;un multi-potentiel ?</AccordionTrigger>
                  <AccordionContent>
                    Un multi-potentiel est une personne qui possède de nombreux intérêts, talents et domaines d&apos;expertise. Ces individus excellent souvent dans plusieurs domaines et ont du mal à se concentrer sur une seule carrière ou passion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Comment votre coaching peut-il m&apos;aider ?</AccordionTrigger>
                  <AccordionContent>
                    Notre coaching vous aide à identifier vos forces uniques, à surmonter les obstacles internes, et à développer des stratégies pour harmoniser vos multiples passions. Nous vous guidons pour transformer votre polyvalence en un atout puissant pour votre réussite personnelle et professionnelle.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Combien de temps dure généralement le processus de coaching ?</AccordionTrigger>
                  <AccordionContent>
                    La durée du coaching varie selon les besoins individuels. Typiquement, nos clients voient des résultats significatifs en 3 à 6 mois. Cependant, certains choisissent de poursuivre plus longtemps pour un soutien continu dans leur développement.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Prêt à commencer votre transformation ?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Nom</label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" id="email" name="email" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <Textarea id="message" name="message" rows={4} required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Envoyer
                  </Button>
                </form>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-purple-600" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <span>contact@jc-catalyseur.com</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <span>123 Rue de la Clarté, 75001 Paris</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      </main>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 JC le catalyseur de clarté. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}