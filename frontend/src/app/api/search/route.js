/**
 * Next.js API Route: /api/search
 * Proxy to Flask backend search endpoint
 */

const FLASK_URL = 'http://127.0.0.1:5000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const market = searchParams.get('market') || '';

    if (!symbol) {
      return Response.json(
        { error: 'symbol parameter is required' },
        { status: 400 }
      );
    }

    console.log(`[API Route] GET - Searching symbol: ${symbol} in market: ${market || 'all'}`);

    // Call Flask backend search endpoint
    const marketParam = market ? `?market=${market}` : '';
    const response = await fetch(
      `${FLASK_URL}/api/search/${encodeURIComponent(symbol.toUpperCase())}${marketParam}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error || 'Symbol not found' },
        { status: response.status }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('[API Route Search] Error:', error.message);
    return Response.json(
      { error: `Connection failed: ${error.message}` },
      { status: 500 }
    );
  }
}
