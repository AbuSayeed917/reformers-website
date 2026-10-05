/** Pure URL construction: opening a draft never implies an email was sent. */
export function createMailto(
  email: string,
  subject?: string,
  body?: string,
): string {
  const address = `mailto:${email}`;
  const query = [
    subject ? `subject=${encodeURIComponent(subject)}` : null,
    body ? `body=${encodeURIComponent(body)}` : null,
  ]
    .filter(Boolean)
    .join("&");
  return query ? `${address}?${query}` : address;
}
