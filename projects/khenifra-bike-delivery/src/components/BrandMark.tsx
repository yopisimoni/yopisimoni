import { Bike, MapPin } from "lucide-react";

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brandMark compact" : "brandMark"}>
      <div className="brandIcon" aria-hidden="true">
        <MapPin size={compact ? 18 : 22} strokeWidth={2.5} />
        <Bike size={compact ? 14 : 17} strokeWidth={2.4} />
      </div>
      {!compact ? (
        <div>
          <strong>توصيل خنيفرة</strong>
          <span>Khenifra Delivery</span>
        </div>
      ) : null}
    </div>
  );
}
