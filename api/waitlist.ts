import type { VercelRequest, VercelResponse } from '@vercel/node'

const OWNER_EMAIL = 'rilwanayorinde@gmail.com'

async function sendEmails(entry: { name: string; email: string; role: string }) {
  const KEY = process.env.RESEND_API_KEY
  if (!KEY) { console.warn('RESEND_API_KEY not set'); return }

  const send = (body: object) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const time = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', dateStyle: 'full', timeStyle: 'short' })

  // ── Notify YOU ──────────────────────────────────────────────────────────────
  await send({
    from: 'COVR Waitlist <waitlist@covr-waitlist.vercel.app>',
    to: [OWNER_EMAIL],
    subject: `🎨 New ${entry.role === 'artist' ? 'Artist' : 'Collector'} signup — ${entry.name}`,
    html: `
      <div style="font-family:'Courier New',monospace;max-width:480px;margin:0 auto;background:#0E0D0B;color:#F4F3EE;padding:32px;border:1px solid #2E2C28;">
        <div style="border-bottom:1px solid #2E2C28;padding-bottom:14px;margin-bottom:22px;">
          <span style="color:#C49A28;font-size:10px;letter-spacing:3px;">C O V R — WAITLIST</span>
        </div>
        <h2 style="color:#F4F3EE;font-family:Georgia,serif;font-weight:300;font-size:20px;margin:0 0 20px;">New ${entry.role === 'artist' ? 'Artist' : 'Collector'} Signup</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #1A1916;">
            <td style="padding:10px 0;color:#6B6860;font-size:9px;letter-spacing:1px;text-transform:uppercase;width:90px;">Name</td>
            <td style="padding:10px 0;color:#F4F3EE;font-size:14px;">${entry.name}</td>
          </tr>
          <tr style="border-bottom:1px solid #1A1916;">
            <td style="padding:10px 0;color:#6B6860;font-size:9px;letter-spacing:1px;text-transform:uppercase;">Email</td>
            <td style="padding:10px 0;color:#C49A28;font-size:14px;">${entry.email}</td>
          </tr>
          <tr style="border-bottom:1px solid #1A1916;">
            <td style="padding:10px 0;color:#6B6860;font-size:9px;letter-spacing:1px;text-transform:uppercase;">Role</td>
            <td style="padding:10px 0;">
              <span style="background:${entry.role === 'artist' ? '#8B6914' : '#2D6A4F'};color:white;padding:3px 10px;font-size:9px;letter-spacing:1px;">${entry.role.toUpperCase()}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6B6860;font-size:9px;letter-spacing:1px;text-transform:uppercase;">Time</td>
            <td style="padding:10px 0;color:#4A4740;font-size:12px;">${time} (Lagos)</td>
          </tr>
        </table>
        <div style="margin-top:22px;padding-top:14px;border-top:1px solid #2E2C28;">
          <p style="color:#4A4740;font-size:9px;letter-spacing:1px;margin:0;">COVR — covr-waitlist.vercel.app</p>
        </div>
      </div>
    `,
  })

  // ── Welcome the subscriber ──────────────────────────────────────────────────
  const isArtist = entry.role === 'artist'
  await send({
    from: 'Yusuf at COVR <yusuf@covr-waitlist.vercel.app>',
    to: [entry.email],
    reply_to: OWNER_EMAIL,
    subject: isArtist ? 'COVR — Your artist application is received.' : 'COVR — You are on the list.',
    html: `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:520px;margin:0 auto;background:#FAFAF7;color:#1A1916;padding:0;">
        <div style="background:#0E0D0B;padding:22px 32px;border-left:3px solid #C49A28;">
          <span style="font-family:'Courier New',monospace;color:#C49A28;font-size:9px;letter-spacing:3px;">C O V R</span>
        </div>
        <div style="padding:40px 32px;">
          <h1 style="font-weight:300;font-size:30px;line-height:1.1;color:#1A1916;margin:0 0 18px;">
            ${isArtist ? 'Application received.' : `Welcome, ${entry.name.split(' ')[0]}.`}
          </h1>
          <p style="font-size:15px;color:#6B6860;line-height:1.8;font-family:'Helvetica Neue',sans-serif;font-weight:300;margin:0 0 22px;">
            ${isArtist
              ? `Thank you for applying to list your cover art on COVR. We review every application personally and will be in touch at this address when artist submissions open.`
              : `You are on the COVR waitlist. Before any auction goes live, you will receive a 48-hour early notice — giving you first bid rights on original music cover art, before the public.`
            }
          </p>
          <div style="background:#F4F3EE;border:1px solid #E2E0D8;padding:18px 22px;margin:20px 0;">
            <p style="font-family:'Courier New',monospace;font-size:9px;color:#8B6914;letter-spacing:1px;margin:0 0 8px;text-transform:uppercase;">
              ${isArtist ? 'What to prepare' : 'What to expect'}
            </p>
            <p style="font-size:14px;color:#3D3B35;line-height:1.7;font-family:'Helvetica Neue',sans-serif;font-weight:300;margin:0;">
              ${isArtist
                ? 'Your best original cover art — minimum 3000×3000px, PNG or TIFF. Have your Spotify URL and monthly listener count ready. We will walk you through the rest.'
                : 'Real bidding. Real art. A museum-grade frame delivered to your door. Every piece is authenticated by the artist and permanently registered in your name when you win.'
              }
            </p>
          </div>
          <p style="font-size:14px;color:#6B6860;line-height:1.8;font-family:'Helvetica Neue',sans-serif;font-weight:300;margin:0 0 6px;">Explore the platform at:</p>
          <a href="https://covr-art.vercel.app" style="font-family:'Courier New',monospace;font-size:13px;color:#8B6914;text-decoration:none;">covr-art.vercel.app →</a>
          <div style="margin-top:36px;padding-top:20px;border-top:1px solid #E2E0D8;">
            <p style="font-size:14px;color:#1A1916;margin:0 0 3px;">Yusuf Ayorinde Rilwa</p>
            <p style="font-family:'Courier New',monospace;font-size:9px;color:#6B6860;margin:0;letter-spacing:1px;">FOUNDER, COVR</p>
          </div>
        </div>
        <div style="background:#F4F3EE;border-top:1px solid #E2E0D8;padding:14px 32px;display:flex;justify-content:space-between;">
          <span style="font-family:'Courier New',monospace;font-size:8px;color:#9B9890;letter-spacing:1px;">COVR — MUSIC ART OWNERSHIP</span>
          <span style="font-family:'Courier New',monospace;font-size:8px;color:#9B9890;">rilwanayorinde@gmail.com</span>
        </div>
      </div>
    `,
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, role } = req.body as { name?: string; email?: string; role?: string }

  if (!name?.trim() || !email?.trim() || !role) return res.status(400).json({ error: 'All fields are required.' })
  if (!email.includes('@') || !email.includes('.')) return res.status(400).json({ error: 'Invalid email address.' })
  if (!['collector', 'artist'].includes(role)) return res.status(400).json({ error: 'Invalid role.' })
  if (name.trim().length < 2) return res.status(400).json({ error: 'Name is too short.' })

  try {
    await sendEmails({ name: name.trim(), email: email.trim().toLowerCase(), role })
    return res.status(200).json({ success: true, message: 'You are on the list.' })
  } catch (err) {
    console.error('Waitlist error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
