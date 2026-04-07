/**
 * Production image assets in /public/images/ (WebP).
 * Update paths here when filenames change.
 */
export const brandLogo = {
  src: "/images/logo/esportiko-logo.png",
  width: 554,
  height: 162,
} as const;

export const media = {
  hero: {
    background: "/images/background-blue.webp",
    whiteBackdrop: "/images/white-background-img.png",
    apparelStack: "/images/hero-apparel-stack.png",
    uiSnippet: "/images/ui-hero-snippet.png",
    /** legacy (unused) */
    gear: "/images/hero-bg-right-gear-no-text.webp",
    uploadWidget: "/images/upload-logo-widget.webp",
  },
  pathCards: {
    team: "/images/team-uniform-order-image.png",
    business: "/images/branded-shirt.png",
    businessAlt: "/images/isolated-basebal-cap.png",
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
} as const;
