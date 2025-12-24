import { getUserProfile } from '@/lib/spotify';

export async function GET() {
  try {
    const response = await getUserProfile();

    if (response.status === 204 || response.status > 400) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      });
    }

    const user = await response.json();
    const displayName = user.display_name;
    const avatarUrl = user.images[0]?.url || '/profile.jpg';

    return new Response(
      JSON.stringify({
        displayName,
        avatarUrl,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ message: 'An error occurred' }), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
