import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <section className="container px-4 py-16">
      <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="bg-background text-foreground border-0 h-12"
            />
          </div>
          <Button size="lg" className="w-full bg-background text-foreground hover:bg-background/90 h-12">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </section>
  )
}
