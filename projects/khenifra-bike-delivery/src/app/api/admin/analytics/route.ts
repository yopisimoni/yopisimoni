import { NextRequest, NextResponse } from "next/server";
import { adminDatabaseId, adminTablesDB, listAllRows } from "@/lib/appwrite/admin-server";
import { getAuthorizedAdmin } from "@/lib/appwrite/admin-auth-server";

const deliveriesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_DELIVERIES_TABLE_ID || "deliveries";
const ridersTableId =
  process.env.NEXT_PUBLIC_APPWRITE_RIDERS_TABLE_ID || "riders";
const profilesTableId =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILES_TABLE_ID || "profiles";
const feedbackTableId = "delivery_feedback";

function minutesBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return null;
  const value = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}

export async function GET(request: NextRequest) {
  const admin = await getAuthorizedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [deliveriesResult, ridersResult, profilesResult, feedbackResult] =
      await Promise.all([
        listAllRows({
          databaseId: adminDatabaseId,
          tableId: deliveriesTableId,
        }),
        listAllRows({
          databaseId: adminDatabaseId,
          tableId: ridersTableId,
        }),
        listAllRows({
          databaseId: adminDatabaseId,
          tableId: profilesTableId,
        }),
        listAllRows({
          databaseId: adminDatabaseId,
          tableId: feedbackTableId,
        }).catch(() => ({ rows: [] as any[] })),
      ]);

    const profiles = new Map(
      profilesResult.rows.map((profile: any) => [profile.user_id, profile])
    );
    const riders = new Map(
      ridersResult.rows.map((rider: any) => [rider.user_id, rider])
    );

    const feedbackByRider = new Map<string, any[]>();
    for (const feedback of feedbackResult.rows as any[]) {
      const list = feedbackByRider.get(feedback.rider_id) || [];
      list.push(feedback);
      feedbackByRider.set(feedback.rider_id, list);
    }

    const deliveries = deliveriesResult.rows.map((delivery: any) => {
      const price =
        typeof delivery.final_price_mad === "number"
          ? delivery.final_price_mad
          : typeof delivery.quoted_price_mad === "number"
            ? delivery.quoted_price_mad
            : 0;

      return {
        id: delivery.$id,
        orderCode: delivery.order_code,
        status: delivery.status,
        riderId: delivery.rider_id || null,
        riderName: delivery.rider_id
          ? (profiles.get(delivery.rider_id) as any)?.full_name || ""
          : "",
        category: delivery.category,
        priceMad: price,
        requestedAt: delivery.requested_at,
        assignedAt: delivery.assigned_at || null,
        pickedUpAt: delivery.picked_up_at || null,
        deliveredAt: delivery.delivered_at || null,
        totalMinutes: minutesBetween(
          delivery.requested_at,
          delivery.delivered_at
        ),
        deliveryMinutes: minutesBetween(
          delivery.picked_up_at,
          delivery.delivered_at
        ),
      };
    });

    const completed = deliveries.filter((delivery) => delivery.status === "delivered");
    const totalRevenueMad = completed.reduce(
      (sum, delivery) => sum + delivery.priceMad,
      0
    );
    const timedCompleted = completed.filter(
      (delivery) => typeof delivery.totalMinutes === "number"
    );
    const averageDeliveryMinutes = timedCompleted.length
      ? Math.round(
          timedCompleted.reduce(
            (sum, delivery) => sum + (delivery.totalMinutes || 0),
            0
          ) / timedCompleted.length
        )
      : null;

    const riderStats = Array.from(riders.entries()).map(([userId, rider]: any) => {
      const jobs = completed.filter((delivery) => delivery.riderId === userId);
      const timedJobs = jobs.filter(
        (delivery) => typeof delivery.totalMinutes === "number"
      );
      const feedback = feedbackByRider.get(userId) || [];
      const ratings = feedback
        .map((row: any) => Number(row.rating))
        .filter((value: number) => Number.isFinite(value));

      return {
        userId,
        fullName: (profiles.get(userId) as any)?.full_name || "بدون اسم",
        phone: (profiles.get(userId) as any)?.phone || "",
        vehicleType: rider.vehicle_type,
        status: rider.status,
        completedCount: jobs.length,
        revenueMad: jobs.reduce((sum, job) => sum + job.priceMad, 0),
        averageMinutes: timedJobs.length
          ? Math.round(
              timedJobs.reduce(
                (sum, job) => sum + (job.totalMinutes || 0),
                0
              ) / timedJobs.length
            )
          : null,
        averageRating: ratings.length
          ? Number(
              (
                ratings.reduce((sum: number, value: number) => sum + value, 0) /
                ratings.length
              ).toFixed(1)
            )
          : null,
        ratingCount: ratings.length,
        favoriteCount: feedback.filter((row: any) => row.favorite).length,
      };
    });

    riderStats.sort((a, b) => {
      if (b.favoriteCount !== a.favoriteCount) {
        return b.favoriteCount - a.favoriteCount;
      }
      if ((b.averageRating || 0) !== (a.averageRating || 0)) {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      if (b.completedCount !== a.completedCount) {
        return b.completedCount - a.completedCount;
      }
      return (a.averageMinutes || Number.MAX_SAFE_INTEGER) -
        (b.averageMinutes || Number.MAX_SAFE_INTEGER);
    });

    return NextResponse.json({
      summary: {
        totalDeliveries: deliveries.length,
        completedDeliveries: completed.length,
        totalRevenueMad,
        averageDeliveryMinutes,
        cancelledOrFailed: deliveries.filter((delivery) =>
          ["cancelled", "failed"].includes(delivery.status)
        ).length,
      },
      riderStats,
      deliveries: [...deliveries].reverse(),
    });
  } catch (error: any) {
    console.error("Analytics GET failed:", error);
    return NextResponse.json(
      {
        error: "Failed to load analytics",
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error?.message || String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
