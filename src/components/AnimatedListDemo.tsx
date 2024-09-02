"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

// Définition des éléments de notification pour souligner chaque étape du parcours personnel
interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

// Notifications représentant les étapes de croissance et de transformation personnelle
let notifications = [
  {
    name: "Percée Émotionnelle",
    description: "Tu viens de te libérer d’un poids intérieur.",
    time: "Il y a 15 min",
    icon: "🕊️",
    color: "#00C9A7",
  },
  {
    name: "Reconnaissance de Soi",
    description: "Tu t’es reconnu(e) pour qui tu es réellement.",
    time: "Il y a 10 min",
    icon: "🌟",
    color: "#FFB800",
  },
  {
    name: "Puissance Intérieure",
    description: "Tu sens ta force intérieure se réveiller.",
    time: "Il y a 5 min",
    icon: "🔥",
    color: "#FF3D71",
  },
  {
    name: "Vision Claire",
    description: "Tout devient limpide, tu sais où aller.",
    time: "Il y a 2 min",
    icon: "🌈",
    color: "#1E86FF",
  },
  {
    name: "Créativité Débordante",
    description: "Des idées nouvelles et audacieuses émergent.",
    time: "Il y a 1 min",
    icon: "🎨",
    color: "#FF6F61",
  },
  {
    name: "Harmonie Établie",
    description: "Tu as trouvé un équilibre intérieur.",
    time: "Il y a 3 min",
    icon: "⚖️",
    color: "#7D4C92",
  },
  {
    name: "Énergie Régénérée",
    description: "Ton énergie est revitalisée et prête pour de nouveaux défis.",
    time: "Il y a 7 min",
    icon: "💪",
    color: "#00BFAE",
  },
  {
    name: "Connexion Profonde",
    description: "Tu te connectes profondément avec tes valeurs.",
    time: "Il y a 12 min",
    icon: "🌿",
    color: "#5EAE6F",
  },
];

// Répétition des notifications pour simuler un flux continu de transformation
notifications = Array.from({ length: 10 }, () => notifications).flat();

// Composant affichant chaque notification comme une étape marquante du voyage personnel
const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[600px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // Styles d'animation
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // Styles pour le mode clair
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

// Composant principal affichant la liste animée des notifications
export function AnimatedListDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg  bg-background",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
