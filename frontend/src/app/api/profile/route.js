import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase server client for API routes with proper async cookie handling
 * @returns {Promise<Object>} Supabase server client
 */
async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

/**
 * GET user profile data from database
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} Profile data or error response
 */
export async function GET(request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Database error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile || null
    });

  } catch (error) {
    console.error('Profile API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST user profile data to database (create new profile)
 * @param {Request} request - The request object with profile data
 * @returns {Promise<NextResponse>} Success or error response
 */
export async function POST(request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name', 
      'phone', 
      'location', 
      'pan_card_number', 
      'trading_experience', 
      'risk_tolerance', 
      'investment_goals'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]?.trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate PAN card format (Indian standard)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(body.pan_card_number.trim())) {
      return NextResponse.json(
        { error: 'Invalid PAN card format. Expected: ABCDE1234F' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(body.phone.trim())) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Prepare profile data for database
    const profileData = {
      user_id: user.id,
      name: body.name.trim(),
      email: user.email,
      phone: body.phone.trim(),
      location: body.location.trim(),
      bio: body.bio?.trim() || '',
      pan_card_number: body.pan_card_number.toUpperCase().trim(),
      trading_experience: body.trading_experience,
      risk_tolerance: body.risk_tolerance,
      investment_goals: body.investment_goals,
      preferred_markets: body.preferred_markets || [],
      profile_completed: true,
      avatar_url: body.avatar_url || null
    };

    // Save to database
    const { data: profile, error: dbError } = await supabase
      .from('user_profiles')
      .upsert(profileData, { 
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error saving profile:', dbError);
      return NextResponse.json(
        { error: 'Failed to save profile to database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      data: profile
    });

  } catch (error) {
    console.error('Profile API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT user profile data in database (update existing)
 * @param {Request} request - The request object with profile updates
 * @returns {Promise<NextResponse>} Success or error response
 */
export async function PUT(request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate PAN card format if provided
    if (body.pan_card_number) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(body.pan_card_number.trim())) {
        return NextResponse.json(
          { error: 'Invalid PAN card format. Expected: ABCDE1234F' },
          { status: 400 }
        );
      }
      body.pan_card_number = body.pan_card_number.toUpperCase().trim();
    }

    // Validate phone number if provided
    if (body.phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(body.phone.trim())) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
      body.phone = body.phone.trim();
    }

    // Clean up string fields
    Object.keys(body).forEach(key => {
      if (typeof body[key] === 'string') {
        body[key] = body[key].trim();
      }
    });

    // Update profile in database
    const { data: profile, error: dbError } = await supabase
      .from('user_profiles')
      .update(body)
      .eq('user_id', user.id)
      .select()
      .single();

    if (dbError) {
      console.error('Database error updating profile:', dbError);
      return NextResponse.json(
        { error: 'Failed to update profile in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });

  } catch (error) {
    console.error('Profile API PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}