/**
 * Next.js API Route: /api/test
 * Simple test endpoint to verify backend connectivity
 */

export async function GET() {
  const FLASK_URL = 'http://127.0.0.1:5000';
  
  try {
    console.log(`[Test] Attempting to connect to ${FLASK_URL}/health`);
    
    const response = await fetch(`${FLASK_URL}/health`, {
      method: 'GET',
    });

    const data = await response.json();
    
    return Response.json({
      success: true,
      flaskUrl: FLASK_URL,
      flaskResponse: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Test] Connection error:', error.message);
    return Response.json({
      success: false,
      flaskUrl: FLASK_URL,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
