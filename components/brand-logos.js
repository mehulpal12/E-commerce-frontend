export default function BrandLogos() {
  const brands = [
    { name: "VERSACE", logo: "VERSACE" },
    { name: "ZARA", logo: "ZARA" },
    { name: "GUCCI", logo: "GUCCI" },
    { name: "PRADA", logo: "PRADA" },
    { name: "Calvin Klein", logo: "Calvin Klein" },
  ]

  return (
    <section className="py-8 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <div key={brand.name} className="text-xl md:text-2xl font-bold">
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
