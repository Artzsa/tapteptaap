const validateUsername = (value) => typeof value === 'string' && /^[a-zA-Z0-9_]{3,30}$/.test(value);
const validateName = (value) => typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 80;
const validatePassword = (value) => typeof value === 'string' && value.length >= 8 && value.length <= 128;
const validateEmail = (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validatePhone = (value) => value === '' || /^[0-9+\-\s()]{6,30}$/.test(value);

const sanitizeText = (value, maxLen = 500) => (typeof value === 'string' ? value.trim().slice(0, maxLen) : '');

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((t) => sanitizeText(t, 30)).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags.split(',').map((t) => sanitizeText(t, 30)).filter(Boolean);
  }
  return [];
};

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const normalizeUsername = (value) => sanitizeText(value, 30).toLowerCase();
const normalizeName = (value) => sanitizeText(value, 80);

const normalizeProfilePayload = (body = {}) => ({
  name: normalizeName(body.name),
  bio: sanitizeText(body.bio, 300),
  location: sanitizeText(body.location, 80),
  email: sanitizeText(body.email, 120).toLowerCase(),
  phone: sanitizeText(body.phone, 30),
  tags: normalizeTags(body.tags),
  theme: sanitizeText(body.theme, 20) || 'cyan',
  bg_type: sanitizeText(body.bg_type, 20) || 'animation',
  bg_value: sanitizeText(body.bg_value, 500) || 'neural'
});

const normalizeLinksPayload = (links) => links.map((link) => ({
  platform: sanitizeText(link?.platform, 30),
  url: sanitizeText(link?.url, 500)
}));

const ALLOWED_PLATFORMS = new Set([
  'LinkedIn', 'X', 'Instagram', 'Threads', 'GitHub',
  'YouTube', 'TikTok', 'WhatsApp', 'Discord',
  'Facebook', 'Telegram', 'Portfolio'
]);

const MAX_LINKS = 20;

module.exports = {
  validateUsername,
  validateName,
  validatePassword,
  validateEmail,
  validatePhone,
  sanitizeText,
  normalizeTags,
  isValidHttpUrl,
  normalizeUsername,
  normalizeName,
  normalizeProfilePayload,
  normalizeLinksPayload,
  ALLOWED_PLATFORMS,
  MAX_LINKS
};
