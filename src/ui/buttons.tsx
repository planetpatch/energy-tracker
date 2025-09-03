// --- Button Styles ---

// Base classes for modern minimalistic buttons
// Includes padding, font, rounding, custom green glow, transform for animation, transition properties,
// hover effects (scale, glow enhancement), and focus-visible states for accessibility.
// Green-400 RGB: (52, 211, 153)


export const modernButtonBase = `
  px-5 py-2 text-xl font-bold rounded-md 
  shadow-[0_0_8px_rgba(52,211,153,0.3)] 
  transition-all duration-200 ease-in-out hover:shadow-[0_0_12px_rgba(52,211,153,0.5)] 
  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  dark:hover:shadow-[0_0_12px_rgba(52,211,153,0.8)] 
`;

export const donateButtonStyles = `
  bg-green-600 border border-green-600 text-white
  hover:text-green-600 hover:bg-white
  focus-visible:ring-green-500
`;
// --- End Button Styles ---




// Specific styles for the Donate button (from your modifications)


// Specific styles for the Contact button (from your modifications)
export const contactButtonStyles = 
`bg-white text-green-600 
border border-green-600
hover:border-green-600
focus-visible:ring-green-500`;