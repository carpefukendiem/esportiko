/** Public business phone — use everywhere for display and tel: links. */
export const sitePhone = {
  /** Human-readable, e.g. success copy and errors */
  display: "+1 805-335-2239",
  /** E.164 for <a href="..."> */
  telHref: "tel:+18053352239",
} as const;

export const formSubmitErrorMessage = `Something went wrong. Please try again or call us at ${sitePhone.display}.`;
