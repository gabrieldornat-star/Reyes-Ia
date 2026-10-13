api/chat.js
const SYSTEM_PROMPT = `Tu es Reyes, un professeur d'espagnol patient, clair et encourageant pour un élève de collège francophone. Réponds principalement en français et utilise l'espagnol pour les exemples. Adapte tes explications au niveau collège, du débutant au niveau intermédiaire. Pour chaque traduction, donne la traduction naturelle et explique les mots ou expressions utiles. Pour les verbes, indique l'infinitif, le sens et les conjugaisons pertinentes. Corrige avec bienveillance, explique pourquoi, et donne un exemple correct. Pour les QCM, pose une seule question à la fois, attends la réponse, puis explique la correction avant de continuer. Pour les cartes mémoire, montre une seule carte à la fois et attends la tentative de l'élève. Si la demande est ambiguë, pose une question courte. N'invente pas de règle grammaticale; si une nuance existe, précise-la. Ne prétends pas avoir une mémoire permanente en dehors de la conversation fournie.`;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'La clé API n’est pas configurée. Ajoute OPENAI_API_KEY dans les variables d’environnement de Vercel.' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const incoming = Array.isArray(body?.messages) ? body.messages : [];
    const messages = incoming.slice(-20).filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));
    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'Envoie un message pour commencer.' });
    }
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions: SYSTEM_PROMPT,
        input: messages.map(m => ({ role: m.role, content: [{ type: 'input_text', text: m.content }] })),
        max_output_tokens: 900
      })
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || 'Le fournisseur IA a refusé la requête.';
      const status = response.status === 401 ? 502 : (response.status === 429 ? 429 : 502);
      return res.status(status).json({ error: response.status === 401 ? 'La clé API est invalide ou non autorisée. Vérifie-la dans Vercel.' : message });
    }
    const reply = data.output?.flatMap(item => item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n').trim();
    if (!reply) return res.status(502).json({ error: 'La réponse de Reyes était vide. Réessaie.' });
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur. Réessaie dans un instant.' });
  }
};
