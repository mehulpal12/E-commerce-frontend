import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30">
      <div className="container px-4 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-lg text-muted-foreground max-w-md text-pretty">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
              Shop Now
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">200+</div>
                <div className="text-sm text-muted-foreground">
                  International Brands
                </div>
              </div>
              <div className="text-center border-l border-r border-muted-foreground/20">
                <div className="text-2xl md:text-3xl font-bold">2,000+</div>
                <div className="text-sm text-muted-foreground">
                  High-Quality Products
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">30,000+</div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src="https://res.cloudinary.com/datsq9ufg/image/upload/v1760100137/fash_axu2rw.jpg"
                className="object-cover w-full h-full"
                alt={"Product Image"}
                fill
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-product.jpg";
                }}
              />
              {/* Decorative Stars */}
              <div className="absolute top-8 right-8">
                <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="absolute bottom-8 left-8">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
