import { Star } from "lucide-react"
import Image from "next/image";

export default function ProductCard({ product }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }
    const getCloudinaryImage = (imageUrl) => {
    // If imageUrl is already a full Cloudinary URL, return it
    if (imageUrl?.startsWith("http")) {
      return imageUrl;
    }

    // If imageUrl is a Cloudinary public_id, construct the URL
    if (imageUrl) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      return `https://res.cloudinary.com/${cloudName}/image/upload/${imageUrl}`;
    }

    // Fallback placeholder image
    return "/placeholder-product.jpg";
  };

  return (
    <div className="group cursor-pointer">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
           <div className="relative h-64 bg-gray-100">
                  <Image
                    src={getCloudinaryImage(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                    height={650}
                    width={350}
                  />
                </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="text-sm text-muted-foreground">{product.rating}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${product.price}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-sm">${product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">-{product.discount}%</span>
          )}
        </div>
      </div>
    </div>
  )
}
