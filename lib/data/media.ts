/**
 * Production image assets in /public/images/ (WebP).
 * Update paths here when filenames change.
 */
export const brandLogo = {
  src: "/images/logo/esportiko-modern-logo.webp",
  width: 1536,
  height: 1024,
} as const;

export const media = {
  hero: {
    /** Wide hero composition — use no-text variant to avoid duplicating page headline */
    gear: "/images/hero-bg-right-gear-no-text.webp",
    /** Product stack — right column hero (WebP) */
    apparelStack: "/images/hero-apparel-stack.webp",
  },
  pathCards: {
    /** Large PNGs for full-bleed path cards */
    team: "/images/team-uniform-order-image.png",
    business: "/images/branded-shirt.png",
  },
  services: {
    screenPrinting: "/images/screen-printing-service.webp",
    embroidery: "/images/embroidery-service.webp",
    teamUniforms: "/images/team-uniforms-service.webp",
    brandedApparel: "/images/branded-apparel-service.webp",
  },
  portfolio: {
    hat: "/images/portfolio-hat.webp",
    jerseyBack: "/images/portfolio-jersey-back.webp",
    hoodieDark: "/images/portfolio-hoodie-dark.webp",
    polo: "/images/portfolio-polo.webp",
    hoodieBlue: "/images/portfolio-hoodie-blue.webp",
    businessHat: "/images/business-brand-hat-isolated.webp",
    businessCard: "/images/business-brand-cta-card-clean.webp",
    screenPrint: "/images/screen-printing-service.webp",
    embroidery: "/images/embroidery-service.webp",
    teamUniformsGraphic: "/images/team-uniforms-service.webp",
    brandedGraphic: "/images/branded-apparel-service.webp",
  },
  teamOrderingUi: "/images/team-ordering-ui.webp",
  /** Team orders landing page — above-the-fold hero */
  teamOrdersHeroBg: "/images/team-orders-bg2.webp",
  /** Browse apparel catalog — page hero */
  apparelBrowseHeroBg: "/images/apparel-bg.webp",
} as const;
