export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

/** Flat links (footer columns); every entry has `href`. */
export type FlatNavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Screen Printing", href: "/screen-printing" },
  { label: "Embroidery", href: "/embroidery" },
  {
    label: "Apparel",
    children: [
      { label: "Browse Apparel", href: "/apparel" },
      { label: "Team Orders", href: "/team-orders" },
      { label: "Business Apparel", href: "/business-apparel" },
      { label: "Customize", href: "/customize" },
      { label: "Our Work", href: "/our-work" },
    ],
  },
  { label: "FAQ", href: "/faq" },
];

export const footerServices: FlatNavItem[] = [
  { label: "Screen Printing", href: "/screen-printing" },
  { label: "Embroidery", href: "/embroidery" },
  { label: "Team Orders", href: "/team-orders" },
  { label: "Business Apparel", href: "/business-apparel" },
  { label: "Our Work", href: "/our-work" },
  { label: "Browse Apparel", href: "/apparel" },
  { label: "Preview Your Logo", href: "/customize" },
];

export const footerCompany: FlatNavItem[] = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "Submit team roster", href: "/submit-team-roster" },
];
