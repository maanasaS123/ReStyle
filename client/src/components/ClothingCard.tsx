
// You can move this type to a shared types.ts file later
export type Item = {
  _id?: string;
  imageUrl?: string;
  name?: string;
  category?: string;
  color?: string;
  style?: string;
  analysisStatus?: "pending" | "done" | "failed";
};

type Props = {
  item: Item;
  label?: string; // e.g. "Top" or "Shoes" for the generator view
};

export default function ClothingCard({ item, label }: Props) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#D9CFC7]">
      {/* Optional Label (for Generator) */}
      {label && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-1 text-xs font-bold tracking-wide text-white uppercase bg-[#C9B59C] rounded-md shadow-sm">
            {label}
          </span>
        </div>
      )}

      {/* Image Area */}
      <div className="
            w-full
            h-24
            sm:h-28
            md:h-32
            lg:h-36
            overflow-hidden
            bg-[#F9F8F6]
            rounded-t-lg
            relative
        ">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name || "Clothing item"}
            className="
            w-full
            h-full
            object-cover
            object-center
            transition-transform
            duration-500
            group-hover:scale-105
        "
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#D9CFC7] text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[#4A403A] capitalize truncate">
            {item.name || item.category || "Untitled Item"}
          </h3>
        </div>

        {/* Tags / Pills */}
        <div className="flex flex-wrap gap-2">
          {item.style && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
              {item.style}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {item.color && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
              {item.color}
            </span>
          )}
        </div>
        
        {/* Status indicator (only for closet view) */}
        {item.analysisStatus && (
            <p className="text-xs text-gray-400 mt-2">
               Analysis: {item.analysisStatus}
            </p>
        )}
      </div>
    </div>
  );
}