export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: "Screen Printing", href: "/screen-printing" },
  { label: "Embroidery", href: "/embroidery" },
  { label: "Team Orders", href: "/team-orders" },
  { label: "Business Apparel", href: "/business-apparel" },
  { label: "Our Work", href: "/our-work" },
  { label: "FAQ", href: "/faq" },
];

export const footerServices: NavItem[] = [
  { label: "Screen Printing", href: "/screen-printing" },
  { label: "Embroidery", href: "/embroidery" },
  { label: "Team Orders", href: "/team-orders" },
  { label: "Business Apparel", href: "/business-apparel" },
  { label: "Our Work", href: "/our-work" },
];

export const footerCompany: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Request a Quote", href: "/request-a-quote" },
];
