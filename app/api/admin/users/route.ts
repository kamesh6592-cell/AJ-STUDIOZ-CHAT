import { NextRequest, NextResponse } from 'next/server';
import { getComprehensiveUserData } from '@/lib/user-data-server';
import { db } from '@/lib/db';
import { user, subscription, payment, adminGrant } from '@/lib/db/schema';
import { desc, sql, eq, and, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getComprehensiveUserData();
    
    // Check if user is admin
    if (!adminUser || adminUser.email !== 'kamesh6592@gmail.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    // Build query with optional search filter
    const baseQuery = db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }).from(user);

    // Execute query with pagination and optional search
    const allUsers = search 
      ? await baseQuery
          .where(
            sql`lower(${user.name}) like ${`%${search.toLowerCase()}%`} OR lower(${user.email}) like ${`%${search.toLowerCase()}%`}`
          )
          .orderBy(desc(user.createdAt))
          .limit(limit)
          .offset(offset)
      : await baseQuery
          .orderBy(desc(user.createdAt))
          .limit(limit)
          .offset(offset);

    // Get total count for pagination (with search filter if applicable)
    const totalCountResult = search
      ? await db.select({ count: sql`count(*)` }).from(user)
          .where(
            sql`lower(${user.name}) like ${`%${search.toLowerCase()}%`} OR lower(${user.email}) like ${`%${search.toLowerCase()}%`}`
          )
      : await db.select({ count: sql`count(*)` }).from(user);
    const totalUsers = Number(totalCountResult[0]?.count || 0);

    // Get comprehensive data for each user (includes Pro status)
    const usersWithProStatus = await Promise.all(
      allUsers.map(async (u) => {
        try {
          // Check admin grants
          const activeGrants = await db
            .select()
            .from(adminGrant)
            .where(and(eq(adminGrant.userId, u.id), eq(adminGrant.status, 'active')))
            .limit(1);

          let hasAdminGrant = false;
          if (activeGrants.length > 0) {
            const grant = activeGrants[0];
            if (!grant.expiresAt || new Date(grant.expiresAt) > new Date()) {
              hasAdminGrant = true;
            }
          }

          // Check Polar subscriptions
          const polarSubs = await db
            .select()
            .from(subscription)
            .where(
              and(
                eq(subscription.userId, u.id),
                eq(subscription.status, 'active')
              )
            )
            .limit(1);

          const hasPolarSub = polarSubs.length > 0;

          // Check DodoPayments
          const dodoPayments = await db
            .select()
            .from(payment)
            .where(
              and(
                eq(payment.userId, u.id),
                eq(payment.status, 'successful')
              )
            )
            .orderBy(desc(payment.createdAt))
            .limit(1);

          let hasDodoPayment = false;
          let dodoExpiresAt = null;
          if (dodoPayments.length > 0) {
            const mostRecent = dodoPayments[0];
            const paymentDate = new Date(mostRecent.createdAt);
            const expirationDate = new Date(paymentDate);
            expirationDate.setDate(expirationDate.getDate() + 30);
            
            if (expirationDate > new Date()) {
              hasDodoPayment = true;
              dodoExpiresAt = expirationDate;
            }
          }

          // Determine Pro status and source
          let isProUser = false;
          let proSource: string | null = null;
          let proExpiresAt = null;

          if (hasPolarSub) {
            isProUser = true;
            proSource = 'polar';
          } else if (hasDodoPayment) {
            isProUser = true;
            proSource = 'dodo';
            proExpiresAt = dodoExpiresAt;
          } else if (hasAdminGrant) {
            isProUser = true;
            proSource = 'admin';
          }

          return {
            ...u,
            isProUser,
            proSource,
            proExpiresAt,
            lastSignIn: u.updatedAt,
            isPro: isProUser, // Add legacy field
          };
        } catch (error) {
          console.error(`Error checking Pro status for user ${u.id}:`, error);
          return {
            ...u,
            isProUser: false,
            proSource: null,
            proExpiresAt: null,
            lastSignIn: u.updatedAt,
            isPro: false,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithProStatus,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1,
      },
      search,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}