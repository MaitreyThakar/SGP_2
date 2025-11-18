/**
 * Next.js API Route: /api/predictions
 * Proxy to Flask backend predictions endpoint
 */

// Use absolute URL - Flask is accessible at http://127.0.0.1:5000 from Node.js server
const FLASK_URL = 'http://127.0.0.1:5000';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.symbol || !body.market) {
      return Response.json(
        { error: 'symbol and market are required' },
        { status: 400 }
      );
    }

    console.log(`[API Route] POST - Calling ${FLASK_URL}/api/predictions`);

    // Call Flask backend
    const response = await fetch(`${FLASK_URL}/api/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: body.symbol.toUpperCase(),
        market: body.market.toLowerCase(),
        period: body.period || '7d',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { error: error.error || 'Failed to get prediction' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('[API Route POST] Error:', error.message);
    return Response.json(
      { error: `Connection failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') || 'us';
    const period = searchParams.get('period') || '7d';

    console.log(`[API Route] GET - Calling ${FLASK_URL}/api/predictions/${market}`);

    // Call Flask backend
    const response = await fetch(
      `${FLASK_URL}/api/predictions/${market}?period=${period}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { error: error.error || 'Failed to get predictions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('[API Route GET] Error:', error.message);
    return Response.json(
      { error: `Connection failed: ${error.message}` },
      { status: 500 }
    );
  }
}
