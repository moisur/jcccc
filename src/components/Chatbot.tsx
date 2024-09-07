/* eslint-disable react/no-unescaped-entities */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Calendar, Mail, Maximize2, Minimize2 } from 'lucide-react'

type Message = {
  id: number
  type: 'bot' | 'user'
  content: string
  options?: string[]
  timestamp: Date
}

const introMessages = [
  "👋",
  " Bonjour ! Je suis l'assistant virtuel de JC, le catalyseur de clarté pour multipotentiels.",
]

const initialOptions = [
  "En savoir plus sur le coaching",
  "Découvrir les offres",
  "Passer un appel découverte gratuit",
  "Témoignages clients"
]

const coachingOptions = [
  "Identifier vos forces uniques",
  "Surmonter le syndrome de l'imposteur",
  "Développer une stratégie de carrière",
  "Gérer votre temps efficacement"
]

const botResponses = {
  "en savoir plus sur le coaching": {
    content: "Notre coaching est spécialement conçu pour les multipotentiels comme vous. Nous vous aidons à :",
    options: coachingOptions
  },
  "identifier vos forces uniques": {
    content: "Nous vous aidons à identifier et valoriser vos compétences uniques en tant que multipotentiel. Cela vous permettra de mieux vous positionner sur le marché du travail et de trouver des opportunités qui correspondent à vos talents variés.",
    options: ["Découvrir les autres coaching", "Découvrir les offres", "Passer un appel découverte gratuit", "Retour au menu principal"]
  },
  "surmonter le syndrome de l'imposteur": {
    content: "Beaucoup de multipotentiels souffrent du syndrome de l'imposteur. Nous travaillons ensemble pour renforcer votre confiance en vous et valoriser votre polyvalence comme un atout plutôt qu'une faiblesse.",
    options: ["Découvrir les autres coaching", "Découvrir les offres", "Passer un appel découverte gratuit", "Retour au menu principal"]
  },
  "développer une stratégie de carrière": {
    content: "Nous élaborons ensemble une stratégie de carrière qui tire parti de votre polyvalence. Que vous souhaitiez combiner plusieurs activités ou trouver un rôle qui exploite vos multiples compétences, nous vous guidons vers vos objectifs professionnels.",
    options: ["Découvrir les autres coaching", "Découvrir les offres", "Passer un appel découverte gratuit", "Retour au menu principal"]
  },
  "gérer votre temps efficacement": {
    content: "La gestion du temps est cruciale pour les multipotentiels. Nous vous aidons à structurer vos journées pour équilibrer vos différentes passions et projets, tout en restant productif et épanoui.",
    options: ["Découvrir les autres coaching", "Découvrir les offres", "Passer un appel découverte gratuit", "Retour au menu principal"]
  },
  "découvrir les autres coaching": {
    content: "Voici les autres aspects sur lesquels nous pouvons vous aider :",
    options: [] // This will be dynamically filled
  },
  "découvrir les offres": {
    content: "Voici nos offres adaptées aux besoins des multipotentiels :",
    options: [
      "L'Appel Déclic (100€)",
      "Pack Clarté (240€)",
      "Programme All Inclusive",
      "Retour au menu principal"
    ]
  },
  "l'appel déclic (100€)": {
    content: "L'Appel Déclic est parfait pour commencer votre parcours. Il comprend 60 minutes d'échange, l'identification des blocages et un plan d'action personnalisé.",
    options: ["Réserver l'Appel Déclic", "Découvrir les autres offres", "Retour au menu principal"]
  },
  "pack clarté (240€)": {
    content: "Le Pack Clarté offre un accompagnement plus approfondi avec 4 appels de 60 minutes, un suivi quotidien et une transformation en profondeur de votre approche multipotentielle.",
    options: ["Réserver le Pack Clarté", "Découvrir les autres offres", "Retour au menu principal"]
  },
  "programme all inclusive": {
    content: "Le Programme All Inclusive est notre offre la plus complète, entièrement sur mesure. Il comprend un accompagnement illimité et des ressources exclusives pour maximiser votre potentiel.",
    options: ["En savoir plus sur All Inclusive", "Découvrir les autres offres", "Retour au menu principal"]
  },
  "passer un appel découverte gratuit": {
    content: "Excellent choix ! Je vais vous rediriger vers le calendrier Calendly de JC pour que vous puissiez choisir un créneau qui vous convient pour votre appel découverte gratuit.",
    options: ["Voir les disponibilités", "En savoir plus sur les séances", "Retour au menu principal"]
  },
  "témoignages clients": {
    content: "Voici ce que disent nos clients satisfaits :",
    options: [
      "Voir les témoignages vidéo",
      "Lire les avis écrits",
      "Contacter un ancien client"
    ]
  },
  "voir les disponibilités": {
    content: "J'ai ouvert le calendrier Calendly de JC dans un nouvel onglet. Vous pouvez y choisir le créneau qui vous convient le mieux pour votre appel découverte gratuit. Avez-vous besoin d'autre chose ?",
    options: [
      "En savoir plus sur les séances",
      "Découvrir les offres",
      "Retour au menu principal"
    ]
  },
  "retour au menu principal": {
    content: "Bien sûr ! Comment puis-je vous aider ?",
    options: initialOptions
  },
  "s'inscrire à la newsletter": {
    content: "Merci de votre inscription ! Vous recevrez bientôt des informations exclusives. En attendant, avez-vous d'autres questions ?",
    options: initialOptions
  }
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [lastBotMessageId, setLastBotMessageId] = useState<number | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [currentCoaching, setCurrentCoaching] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const allMessages = [
        ...introMessages.map((content, index) => ({
          id: index + 1,
          type: 'bot' as const,
          content,
          timestamp: new Date()
        }))
      ]
      setMessages(allMessages)
      setLastBotMessageId(allMessages.length)
      
      setTimeout(() => {
        setMessages(prev => [...prev!, {
            id: (prev?.length ?? 0) + 1,
            type: 'bot',
            content: "Je suis là pour vous guider et répondre à vos questions.",
            options: initialOptions,
            timestamp: new Date()
          }]);         
        setLastBotMessageId(prev => (prev ?? 0) + 1)
      }, 1000)
    }
  }, [isOpen, messages])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }

  const handleSendMessage = (message: string, isOption = false) => {
    const newUserMessage: Message = { id: messages.length + 1, type: 'user', content: message, timestamp: new Date() }
    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')
    setIsThinking(true)
    scrollToBottom()

    setTimeout(() => {
      setIsThinking(false)
      let botResponse: Message = { id: messages.length + 2, type: 'bot', content: '', timestamp: new Date() }

      const responseKey = message.toLowerCase() as keyof typeof botResponses;
      if (responseKey in botResponses) {
        botResponse = { ...botResponses[responseKey], id: messages.length + 2, type: 'bot', timestamp: new Date() };
        
        if (coachingOptions.includes(message)) {
          setCurrentCoaching(message)
        }

        if (responseKey === 'découvrir les autres coaching') {
          botResponse.options = coachingOptions.filter(option => option !== currentCoaching)
        }
      } else {
        botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: "Je suis désolé, je n'ai pas compris votre demande. Puis-je vous aider avec l'un de ces sujets ?",
          options: initialOptions,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, botResponse])
      setLastBotMessageId(botResponse.id)
      scrollToBottom()
    }, 1000)
  }

  const handleOptionClick = (option: string) => {
    handleSendMessage(option, true)
    
    // Handle redirects for specific options
    switch(option.toLowerCase()) {
      case "réserver l'appel déclic":
        window.open('https://buy.stripe.com/fZeaFz7Bx0HzaoUcMU', '_blank', 'noopener,noreferrer')
        break
      case "réserver le pack clarté":
        window.open('https://buy.stripe.com/28o293095ai9gNieV3', '_blank', 'noopener,noreferrer')
        break
      case "en savoir plus sur all inclusive":
        window.open('https://calendly.com/yervantj', '_blank', 'noopener,noreferrer')
        break
      case "voir les disponibilités":
        window.open('https://calendly.com/yervantj', '_blank', 'noopener,noreferrer')
        break
      case "contacter un ancien client":
        window.open('https://twitter.com/messages/compose?recipient_id=1789652592076689408', '_blank', 'noopener,noreferrer')
        break
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCalendlyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.open('https://calendly.com/yervantj', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              <MessageCircle className="w-8 h-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`flex flex-col shadow-xl transition-all duration-300 ease-in-out rounded-3xl overflow-hidden ${
              isExpanded ? 'w-[32rem] h-[32rem]' : 'w-96 h-[32rem]'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <h3 className="font-semibold">Chat avec l'assistant de JC</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={toggleExpand}>
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden p-4">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="relative group">
                        <span
                          className={`inline-block p-2 rounded-s-full ${
                            message.type === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.content}
                        </span>
                        <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {message.options && message.id === lastBotMessageId && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="mt-2 space-y-2"
                        >
                          {message.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptionClick(option)}
                              className="mr-2 mb-2 rounded-full border-purple-600 text-purple-600 hover:border-purple-800 hover:text-purple-800 transition-colors duration-300"
                            >
                              {option}
                            </Button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2 text-gray-500"
                    >
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </motion.div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (inputValue.trim()) handleSendMessage(inputValue)
                  }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    placeholder="Tapez votre message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="rounded-full"
                  />
                  <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 rounded-full">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
              <div className="p-2 bg-gray-100 flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCalendlyClick}
                  className="rounded-full border-purple-600 text-purple-600 hover:border-purple-800 hover:text-purple-800 transition-colors duration-300"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Appel découverte gratuit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOptionClick("S'inscrire à la newsletter")}
                  className="rounded-full border-purple-600 text-purple-600 hover:border-purple-800 hover:text-purple-800 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Newsletter
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}