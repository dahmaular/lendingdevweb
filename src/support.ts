/**
 * Who we are and how to reach us, in one place.
 *
 * The help panel and the footer both read from here, so a detail is filled in
 * once and appears everywhere it is shown.
 *
 * Values still in [brackets] have not been supplied yet. They render as plain
 * text rather than as mailto:/tel: links, so a placeholder is never something
 * an applicant can tap. Replace each one with the real value — do not guess:
 * the registration and licence details are regulated statements.
 */
export const COMPANY = {
  name: "Devtage Financial Services Limited",
  rcNumber: "[RC number]",
  licence: "[Licence: regulator and licence number]",
  address: "[Registered address]",
};

export const SUPPORT = {
  email: "[support email]",
  /** Nigerian local format, e.g. 0803 123 4567. Also used for WhatsApp. */
  phone: "[phone number]",
  hours: "[Hours, e.g. Monday–Friday, 9am–5pm WAT]",
};

/** True while a detail is still an unfilled [placeholder]. */
export const isPlaceholder = (value: string): boolean => /^\[.*\]$/.test(value.trim());

/** tel: href for a Nigerian local number, as +234 without the leading 0. */
export const telHref = (phone: string): string =>
  `tel:+234${phone.replace(/\D/g, "").replace(/^0/, "")}`;
