import { Link } from "react-router-dom";
import { MapPin, Calendar, Package } from "lucide-react";
import { type Listing, formatAr } from "@/store/app";

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  return (
    <Link
      to={`/produits/${listing.id}`}
      className="group block rounded-2xl bg-surface border border-border overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-[transform,box-shadow] duration-250 ease-settle hover:-translate-y-1 animate-settle-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
        <img
          src={listing.imageUrl}
          alt={listing.productName}
          loading="lazy"
          className="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-90"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-pill bg-surface/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground shadow-soft-sm">
          {listing.category}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{listing.productName}</h3>
          <p className="font-display text-lg text-primary tabular-nums whitespace-nowrap">
            {formatAr(listing.pricePerUnit)}
            <span className="text-xs text-muted-foreground font-sans font-normal">/{listing.unit}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{listing.region}</span>
          <span className="inline-flex items-center gap-1.5"><Package className="h-3.5 w-3.5" />{listing.quantity} {listing.unit}</span>
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{listing.availableOn}</span>
        </div>
        <p className="text-xs text-muted-foreground pt-1 border-t border-border">
          Par <span className="font-semibold text-foreground">{listing.producer}</span>
        </p>
      </div>
    </Link>
  );
}
