"use client"
import React, { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

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

export default function Header() {
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
    <>
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
            <NavItem href="/#about">À propos</NavItem>
            <NavItem href="/#services">Services</NavItem>
            <NavItem href="/#process">Processus</NavItem>
            <NavItem href="/#testimonials">Témoignages</NavItem>
            <NavItem href="/#contact">Contact</NavItem>
            <NavItem href="/onboard">Onboard</NavItem>
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
              <NavItem href="/#about">À propos</NavItem>
              <NavItem href="/#services">Services</NavItem>
              <NavItem href="/#process">Processus</NavItem>
              <NavItem href="/#testimonials">Témoignages</NavItem>
              <NavItem href="/#contact">Contact</NavItem>
              <NavItem href="/onboard">Onboard</NavItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}