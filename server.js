const express    = require('express');
const Anthropic  = require('@anthropic-ai/sdk');
const path       = require('path');

const app  = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/check', async (req, res) => {
  const { imageBase64, problem } = req.body;

  if (!imageBase64 || !problem) {
    return res.status(400).json({ error: 'Missing imageBase64 or problem' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: imageBase64 }
          },
          {
            type: 'text',
            text: `The student is solving: ${problem}
Look at the handwritten answer on the canvas (light background, dark ink).
Reply with ONLY the integer the student wrote — no words, no punctuation.
If nothing is written or the canvas is blank, reply: blank
If the writing is unreadable, reply: unclear`
          }
        ]
      }]
    });

    const recognized = message.content[0].text.trim().toLowerCase();
    res.json({ recognized });
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(502).json({ error: 'AI service error: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Math Canvas running on port ${port}`);
});
