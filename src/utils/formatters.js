export function formatType(type) {
  const specialMappings = {
    'ai-application': 'AI Application',
    'ai-agent': 'AI Agent',
    'onlinedemo': 'Demo (Online)',
    'deployabledemo': 'Demo (Deployable)'
  };

  if (specialMappings[type]) {
    return specialMappings[type];
  }

  return type
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function normalize(value) {
  return (value || '').toLowerCase().trim();
}

export function splitList(raw) {
  return normalize(raw)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}
