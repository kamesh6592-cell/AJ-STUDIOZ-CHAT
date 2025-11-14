import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData, clearUserDataCache } from '@/lib/user-data-server';
import { db } from '@/lib/db';
import { user, adminGrant } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from 'ai';

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check if user is admin
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userEmail, action, reason } = body; // action: 'grant' or 'revoke'

    if (!userEmail || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userEmail, action' },
        { status: 400 }
      );
    }

    // Find the target user
    const targetUsers = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (targetUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const targetUser = targetUsers[0];

    if (action === 'grant') {
      // Grant premium access
      await db.insert(adminGrant).values({
        id: generateId(),
        userId: targetUser.id,
        grantedBy: adminUser.email,
        reason: reason || 'Manual grant by admin',
        status: 'active',
        expiresAt: null, // Permanent until revoked
      });
    } else if (action === 'revoke') {
      // Revoke all active grants for this user
      await db
        .update(adminGrant)
        .set({
          status: 'revoked',
          revokedAt: new Date(),
          revokedBy: adminUser.email,
          revokeReason: reason || 'Manual revoke by admin',
        })
        .where(
          and(
            eq(adminGrant.userId, targetUser.id),
            eq(adminGrant.status, 'active')
          )
        );
    }

    // Clear user data cache to immediately reflect the change
    clearUserDataCache(targetUser.id);

    const result = {
      success: true,
      action,
      userEmail,
      userId: targetUser.id,
      reason: reason || `${action === 'grant' ? 'Granted' : 'Revoked'} by admin`,
      timestamp: new Date().toISOString(),
      adminEmail: adminUser.email,
      cacheCleared: true,
    };

    console.log('Admin Premium Access Action:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin premium access error:', error);
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check admin access
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return admin panel info
    return NextResponse.json({
      message: 'Admin Premium Access Panel',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
      },
      actions: ['grant', 'revoke'],
      usage: {
        grant: 'POST with { userEmail, action: "grant", reason: "Student access" }',
        revoke: 'POST with { userEmail, action: "revoke", reason: "Expired" }',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load admin panel' },
      { status: 500 }
    );
  }
}
