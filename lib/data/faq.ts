export type FaqCategoryId =
  | "general"
  | "team-orders"
  | "screen-printing"
  | "embroidery"
  | "minimums-pricing"
  | "artwork-files"
  | "turnaround-rush";

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: FaqCategoryId;
  label: string;
  items: FaqEntry[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        question: "What areas do you serve?",
        answer:
          "We work with teams, schools, businesses, and events across Goleta, Santa Barbara, Isla Vista, Carpinteria, Ventura, and the broader Central Coast. Reach out to confirm timing for your location.",
      },
      {
        question: "Do you sell blank apparel without decoration?",
        answer:
          "Our focus is decorated apparel and organized team or business programs. If you need blanks for a specific reason, tell us what you are trying to accomplish and we will advise.",
      },
      {
        question: "Can I see samples before I commit?",
        answer:
          "For many projects we can discuss strike samples, pre-production proofs, or prior work references depending on scope, timeline, and garment selection. Ask during intake.",
      },
      {
        question: "Do you work with schools and youth programs?",
        answer:
          "Yes. We regularly support athletic programs, clubs, and school events with organized ordering, roster details, and clear communication for administrators and parents.",
      },
      {
        question: "How do I start a project?",
        answer:
          "Use Start Team Order, Start Business Order, or Contact — whichever matches your situation. The more detail you provide up front (garments, quantities, art, deadlines), the faster we can respond with next steps.",
      },
      {
        question: "Do you offer garment sourcing?",
        answer:
          "Yes. If you do not have preferred blanks, we can recommend styles and brands that match your budget, timeline, and decoration method.",
      },
      {
        question: "What is your revision policy on proofs?",
        answer:
          "We build reasonable proof rounds into the workflow. Major art changes after approval can affect schedule and cost — we call that out before you sign off.",
      },
    ],
  },
  {
    id: "team-orders",
    label: "Team Orders",
    items: [
      {
        question: "How do names and numbers work on team orders?",
        answer:
          "You can submit roster details through our team intake when ready. We align spelling, number assignments, and size breakdowns with your garment selection before production.",
      },
      {
        question: "What if our roster is not finalized yet?",
        answer:
          "You can still start the request. Mark roster as not ready, submit what you know, and we will follow up to collect finalized names, numbers, and sizes before production.",
      },
      {
        question: "Can parents order individually or is it one bulk order?",
        answer:
          "Most team programs run as an organized bulk order with a coordinator. If you need a hybrid approach, describe your situation and we will recommend a workflow.",
      },
      {
        question: "Do you handle multiple garment types in one team package?",
        answer:
          "Yes — jerseys, shorts, hoodies, hats, warmups, and more can be structured as a single program with consistent art and timelines where it makes sense.",
      },
      {
        question: "What sports do you support?",
        answer:
          "Football, baseball, softball, basketball, soccer, volleyball, wrestling, track, cheer, lacrosse, hockey, and many other programs. If your sport is niche, we still want the details.",
      },
      {
        question: "How should coaches prepare before contacting you?",
        answer:
          "Gather approximate headcount, desired garments, logo files if available, in-hands date, and any league uniform requirements. A rough roster helps even if it is not final.",
      },
    ],
  },
  {
    id: "screen-printing",
    label: "Screen Printing",
    items: [
      {
        question: "When is screen printing the right choice?",
        answer:
          "Screen printing excels for bold graphics, larger runs, event tees, and many team applications where durability and color saturation matter on cotton and cotton-blend bases.",
      },
      {
        question: "What garments screen print best?",
        answer:
          "Tees, hoodies, sweats, and many jerseys and bags print well when fabric and ink type are matched correctly. We steer garment selection based on your art and use case.",
      },
      {
        question: "Will the print crack or fade?",
        answer:
          "Proper curing, ink selection, and care instructions matter. Follow wash guidance and avoid aggressive dryers. We aim for commercial-grade durability appropriate to the garment and application.",
      },
      {
        question: "Can you match brand colors?",
        answer:
          "We work from Pantone references and physical samples when available. Exact matches depend on substrate and ink system — we will set expectations during review.",
      },
      {
        question: "Do you print on dark garments?",
        answer:
          "Yes. Dark garments often use an underbase or discharge-compatible setups depending on the art and fabric. We confirm the best path before production.",
      },
    ],
  },
  {
    id: "embroidery",
    label: "Embroidery",
    items: [
      {
        question: "When should I choose embroidery over print?",
        answer:
          "Embroidery reads premium on polos, structured hats, jackets, and workwear — especially for staff uniforms, restaurants, and brands that want tactile depth.",
      },
      {
        question: "What placements are common?",
        answer:
          "Left chest, cap front, sleeve, and back yoke are typical. Larger back pieces may require different sizing and backing — we advise per garment.",
      },
      {
        question: "Can you embroider complex logos?",
        answer:
          "Fine detail may need simplification for stitch clarity. Send vector or high-resolution art and we will recommend adjustments if needed.",
      },
      {
        question: "Is embroidery heavier than print?",
        answer:
          "Yes — thread has body. We choose backing and density appropriate to the fabric so the piece wears comfortably and holds shape.",
      },
    ],
  },
  {
    id: "minimums-pricing",
    label: "Minimums & Pricing",
    items: [
      {
        question: "What are your minimum order quantities?",
        answer:
          "Minimums depend on garment type, decoration method, color count, and timeline. Contact us with your project summary and we will respond with what is realistic.",
      },
      {
        question: "Why is pricing not listed on the website?",
        answer:
          "Custom apparel pricing is driven by garments, quantities, art complexity, and schedule. We quote in context so you are not comparing incompatible numbers.",
      },
      {
        question: "Do you charge setup or digitizing fees?",
        answer:
          "Some programs include setup in the quote; others list it separately when it applies (for example, embroidery digitizing or screen setups). You will see it itemized when relevant.",
      },
      {
        question: "Can we mix sizes freely?",
        answer:
          "Generally yes within a program, though extreme size curves can affect pricing if decoration scales. Tell us your size run early.",
      },
    ],
  },
  {
    id: "artwork-files",
    label: "Artwork & Files",
    items: [
      {
        question: "What file types do you accept?",
        answer:
          "Vector files (AI, EPS, PDF with vectors) are ideal. High-resolution PNG or JPG can work for some applications. SVG can be usable depending on construction.",
      },
      {
        question: "Will you edit or rebuild our logo?",
        answer:
          "Light cleanup is common. Major redraws may require design time — we will flag that before proceeding.",
      },
      {
        question: "What resolution is enough for raster art?",
        answer:
          "For print-sized graphics, 300 DPI at final print dimensions is a good target. For embroidery, clean vector is strongly preferred.",
      },
      {
        question: "Do you keep our files on file?",
        answer:
          "We retain project assets to support reorders when applicable. If you need specific handling, note it in your request.",
      },
      {
        question: "Can you match an existing garment we already have?",
        answer:
          "Yes — send a photo and the garment if possible. Physical references reduce guesswork on color and scale.",
      },
    ],
  },
  {
    id: "turnaround-rush",
    label: "Turnaround & Rush",
    items: [
      {
        question: "What is typical turnaround?",
        answer:
          "Turnaround varies by season, garment availability, and decoration complexity. Share your in-hands date early — we will confirm feasibility rather than promise a one-size-fits-all timeline.",
      },
      {
        question: "Do you offer rush service?",
        answer:
          "When capacity allows, yes. Rush may incur expedited fees or require garment substitutions. Tell us your hard deadline up front.",
      },
      {
        question: "What slows projects down most?",
        answer:
          "Delayed artwork approval, incomplete rosters, and backordered garments are common bottlenecks. The intake forms are designed to reduce that friction.",
      },
      {
        question: "Can you coordinate in-hand dates for events?",
        answer:
          "Yes — event merch and tournament deadlines are common. Build in proofing time if your date is fixed.",
      },
    ],
  },
];

export function getFaqsByCategoryId(id: FaqCategoryId): FaqEntry[] {
  return faqCategories.find((c) => c.id === id)?.items ?? [];
}

export function getHomeFaqPreview(): FaqEntry[] {
  const pick = (id: FaqCategoryId, index: number) =>
    faqCategories.find((c) => c.id === id)?.items[index];

  return [
    pick("general", 0),
    pick("team-orders", 0),
    pick("minimums-pricing", 0),
    pick("artwork-files", 0),
  ].filter(Boolean) as FaqEntry[];
}
