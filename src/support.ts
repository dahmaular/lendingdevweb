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
  address: "Ademola Adetokunbo, Victoria Island, Lagos, Nigeria",
};

export const SUPPORT = {
  email: "info@devtagefs.com",
  /** Local (0803 123 4567) or international (+234 803 123 4567) format. */
  phone: "+234 803 123 4567",
  hours: "[Hours, e.g. Monday–Friday, 9am–5pm WAT]",
};

/** True while a detail is still an unfilled [placeholder]. */
export const isPlaceholder = (value: string): boolean => /^\[.*\]$/.test(value.trim());

/**
 * A Nigerian number as bare international digits (2348031234567), whether it
 * was written locally (0803…) or internationally (+234 803…).
 */
const internationalDigits = (phone: string): string =>
  `234${phone.replace(/\D/g, "").replace(/^234/, "").replace(/^0/, "")}`;

export const telHref = (phone: string): string => `tel:+${internationalDigits(phone)}`;

export const whatsappHref = (phone: string): string => `https://wa.me/${internationalDigits(phone)}`;
