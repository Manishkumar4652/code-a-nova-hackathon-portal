export default function useContactEmail() {
  return import.meta.env.VITE_CONTACT_EMAIL || 'support@codeanova.tech';
}

