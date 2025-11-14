import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { db } from '@/lib/db';
import { adminGrant } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

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

    // Find duplicate grants (same userId with multiple active grants)
    const duplicates = await db.execute(sql`
      SELECT user_id, COUNT(*) as count
      FROM admin_grant
      WHERE status = 'active'
      GROUP BY user_id
      HAVING COUNT(*) > 1
    `);

    let cleaned = 0;
    
    for (const dup of duplicates.rows as any[]) {
      const userId = dup.user_id;
      
      // Get all active grants for this user, ordered by granted_at
      const userGrants = await db
        .select()
        .from(adminGrant)
        .where(and(eq(adminGrant.userId, userId), eq(adminGrant.status, 'active')))
        .orderBy(adminGrant.grantedAt);
      
      // Keep the first grant, revoke the rest
      if (userGrants.length > 1) {
        const grantsToRevoke = userGrants.slice(1);
        
        for (const grant of grantsToRevoke) {
          await db
            .update(adminGrant)
            .set({
              status: 'revoked',
              revokedAt: new Date(),
              revokedBy: adminUser.email,
              revokeReason: 'Duplicate grant - auto-cleanup',
            })
            .where(eq(adminGrant.id, grant.id));
          
          cleaned++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleaned} duplicate grants`,
      duplicatesFound: duplicates.rows.length,
      grantsRevoked: cleaned,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup duplicates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin grant cleanup endpoint',
    description: 'POST to remove duplicate active grants for users',
  });
}
