const statuses = new Set(['requested','assigned','rider_to_pickup','picked_up','rider_to_dropoff','delivered','cancelled','failed']);

// Service-role reads bypass row permissions. Explicitly enforce the owner's read
// permission before exposing a minimal timeline; never return notes or actor IDs.
export function customerTimeline(rows: any[], deliveryId: string, customerId: string) {
  const permission = `read("user:${customerId}")`;
  return rows.filter(row => row.delivery_id === deliveryId &&
    Array.isArray(row.$permissions) && row.$permissions.includes(permission) &&
    statuses.has(row.status) && Number.isFinite(Date.parse(row.created_at)))
    .map(row => ({ id: row.$id, status: row.status, createdAt: row.created_at }))
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}
