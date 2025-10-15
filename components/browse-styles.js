import Image from "next/image"

const styles = [
  {
    name: "Casual",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759925719/shop-products/rq6geyec1iaisprat9sp.avif",
  },
  {
    name: "Formal",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-5.jpg",
  },
  {
    name: "Party",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-3.jpg",
  },
  {
    name: "Gym",
    image: "https://res.cloudinary.com/datsq9ufg/image/upload/v1759922397/cld-sample-2.jpg",
  },
]

export default function BrowseStyles() {
  return (
    <section className="container px-4">
      <div className="bg-muted/30 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">BROWSE BY DRESS STYLE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Casual - spans 1 column */}
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] md:aspect-square">
            <Image width={250} height={350}
              src={styles[0].image || "/placeholder.svg"}
              alt={styles[0].name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{styles[0].name}</h3>
            </div>
          </div>

          {/* Formal - spans 2 columns */}
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[2/1]">
            <Image width={250} height={350}
              src={styles[1].image || "/placeholder.svg"}
              alt={styles[1].name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{styles[1].name}</h3>
            </div>
          </div>

          {/* Party - spans 2 columns */}
          <div className="md:col-span-2 relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[2/1]">
            <Image width={250} height={350}
              src={styles[2].image || "/placeholder.svg"}
              alt={styles[2].name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{styles[2].name}</h3>
            </div>
          </div>

          {/* Gym - spans 1 column */}
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] md:aspect-square">
            <Image width={250} height={350}
              src={styles[3].image || "/placeholder.svg"}
              alt={styles[3].name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute top-6 left-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">{styles[3].name}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
