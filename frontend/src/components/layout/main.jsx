import React from 'react';
import { cn } from '@/lib/utils'; // Utilitaire pour conditionner les classes CSS

export const Main = ({ fixed, ...props }) => {
  return (
    // L'élément <main> qui est rendu avec des classes conditionnelles et des props supplémentaires
    <main
      // Conditionne les classes CSS en fonction de la valeur de `fixed`
      className={cn(
        'peer-[.header-fixed]/header:mt-16', // Si un en-tête est fixé, on ajoute une marge en haut
        'px-4 py-6',  // Padding général pour le contenu
        fixed && 'fixed-main flex flex-grow flex-col overflow-hidden' // Si `fixed` est vrai, on ajoute des classes pour fixer l'élément
      )}
      {...props}  // Passe toutes les autres propriétés à l'élément `main` (comme `className`, `id`, etc.)
    />
  );
};

// Affecte un nom au composant pour une meilleure identification dans React DevTools
Main.displayName = 'Main';
