import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const scope = 'user-read-private user-read-email user-top-read user-read-currently-playing';

  return NextResponse.redirect(
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
    })
  );
}
