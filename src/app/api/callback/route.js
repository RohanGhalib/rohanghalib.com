
import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response("Error: No code provided", { status: 400 });
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    body: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    })
  });

  const data = await response.json();

  if (data.error) {
    const errorMessage = `
      <h1>Error from Spotify</h1>
      <p><b>Error:</b> ${data.error}</p>
      <p><b>Description:</b> ${data.error_description}</p>
      <hr>
      <h2>Debugging Info</h2>
      <p>The redirect URI sent from our server to Spotify was:</p>
      <pre><code>${redirect_uri}</code></pre>
      <p>Please ensure this value is not "undefined" and exactly matches the Redirect URI in your Spotify Dashboard and your Vercel Environment Variables.</p>
    `;
    return new Response(errorMessage, { status: 500, headers: { 'Content-Type': 'text/html' } });
  }

  const refresh_token = data.refresh_token;

  return new Response(`
    <html>
      <body>
        <h1>Your Spotify Refresh Token</h1>
        <p>Copy the token below and add it to your .env.local file as SPOTIFY_REFRESH_TOKEN</p>
        <pre><code>${refresh_token}</code></pre>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}
