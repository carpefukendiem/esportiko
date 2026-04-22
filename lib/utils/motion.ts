export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/**
 * whileInView defaults: negative rootMargin shrinks the IO root and can leave
 * sections stuck at initial (opacity 0) on some viewports. A modest positive
 * bottom inset fires animations slightly before elements enter the fold.
 */
export const homePageInView = {
  once: true,
  amount: 0.12,
  margin: "0px 0px 200px 0px",
} as const;

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
