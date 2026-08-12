# Design System Specification: Liquid Glass & High-Tech Editorial

## 1. Overview & Creative North Star

### The Creative North Star: "The Ethereal Engine"
This design system is not a static set of components; it is a high-performance, immersive environment. The North Star—**The Ethereal Engine**—represents a fusion between raw computational power and organic fluidity. We move beyond "Standard Dark Mode" by treating the interface as a deep, pressurized space where light and glass define form rather than lines and grids.

### Breaking the Template
To achieve a signature premium feel, we reject the rigid, boxy layouts of traditional SaaS platforms. 
- **Intentional Asymmetry:** Use large-scale display typography to anchor layouts off-center, allowing for dynamic negative space.
- **Overlapping Elements:** Components should "float" and overlap across different surface tiers, creating a sense of three-dimensional depth.
- **Tonal Submersion:** UI elements should feel submerged in the `background` (#060e20), appearing only through luminous gradients and refracted glass.

---

## 2. Colors & Surface Philosophy

### Color Palette Role Definition
*   **Primary (`#8cacff`) & Primary Container (`#769dff`):** Our "Core Light." Used for high-action touchpoints.
*   **Tertiary (`#9bddff`):** Our "Accent Glow." Used for secondary data points or subtle interactive feedback.
*   **Surface Tiers:** We utilize a 5-tier system from `surface-container-lowest` (#000000) to `surface-bright` (#1f2b49) to manage cognitive load without using lines.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background is sufficient to communicate a change in context.

### The Glass & Gradient Rule
Main CTAs and Hero backgrounds must utilize **Signature Textures**. Instead of a flat primary color, apply a linear gradient transitioning from `primary` to `primary-container` at a 135-degree angle. This provides a "liquid" soul to the UI.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. 
1.  **Base:** `surface` (#060e20).
2.  **Sectioning:** `surface-container-low` (#091328).
3.  **Floating Elements:** `surface-container-high` (#141f38) with 60% opacity and a 40px backdrop-blur.

---

## 3. Typography: The Editorial Voice

Our typography is a dialogue between precision and personality.

*   **The Display Voice (Plus Jakarta Sans):** Used for `display` and `headline` scales. This font brings a technical yet approachable futuristic aesthetic. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements to command authority.
*   **The Narrative Voice (Manrope):** Used for `title` and `body` scales. Manrope provides the functional clarity required for high-tech data environments. 
*   **The Utility Voice (Inter):** Reserved strictly for `label` scales. Inter’s neutrality ensures that micro-copy and metadata do not distract from the editorial flow.

**Hierarchy Strategy:** 
Maintain a high contrast between scales. If a headline is `headline-lg`, the supporting body text should skip a level down to `body-md` to create a "Big/Small" dynamic typical of premium editorial design.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. 
- To "lift" a component, move one step up the surface container scale. 
- **Example:** A card using `surface-container-highest` placed on a `surface-container-low` background creates a natural, soft elevation without the need for heavy shadows.

### Ambient Shadows
Traditional black shadows are forbidden. If a "floating" effect is required (e.g., for a modal or dropdown):
- **Shadow Color:** Use a tinted version of `on-surface` at 4-8% opacity.
- **Blur:** Minimum 32px to 64px for a soft, atmospheric glow.

### The "Ghost Border" Fallback
If accessibility requirements demand a container boundary, use a **Ghost Border**:
- **Token:** `outline-variant` (#40485d).
- **Opacity:** 10% to 20% max. 
- **Style:** Never use 100% opaque borders for decorative containment.

### Glassmorphism
Apply to all "Floating" UI elements:
- **Fill:** `surface-container-high` at 40-70% opacity.
- **Backdrop Blur:** 20px to 40px.
- **Top Edge Highlight:** A 1px "Ghost Border" applied *only* to the top and left strokes can simulate light hitting a glass edge.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `full` roundedness, `plusJakartaSans` medium weight.
*   **Secondary:** `surface-container-highest` background with a `primary` text label. No border.
*   **Tertiary:** Transparent background, `primary` text, underlined on hover only.

### Cards & Lists
*   **No Dividers:** Forbid the use of divider lines. Separate list items using vertical white space (use `spacing-4` or `spacing-6`) or a 2% shift in surface color on hover.
*   **Card Styling:** Use `xl` (1.5rem) roundedness for large layout cards and `lg` (1rem) for nested items.

### Input Fields
*   **Resting State:** `surface-container-low` background, no border, `sm` (0.25rem) roundedness.
*   **Focused State:** `surface-container-high` background, `primary` 1px ghost border (20% opacity), and a subtle `primary` outer glow (4px blur).

### Signature Component: The Liquid Chip
*   Used for status or tags. Background: `primary` at 10% opacity. Text: `primary`. Border: none. This creates a "glow" effect that feels integrated into the dark background.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins to create a high-end editorial feel.
*   **Do** lean into the `primary` and `tertiary` gradients to draw attention to high-value actions.
*   **Do** use the `full` roundedness scale for small interactive elements like chips and buttons to contrast with the `lg` cards.
*   **Do** ensure text on glass containers meets AA contrast ratios by adjusting the opacity of the glass fill.

### Don't
*   **Don't** use 1px solid dividers or borders to separate sections.
*   **Don't** use pure black (#000000) for backgrounds unless it is the `surface-container-lowest` for deep nesting.
*   **Don't** use standard "drop shadows." Only use diffuse ambient glows.
*   **Don't** mix more than two font families in a single component.