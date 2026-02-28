"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. Hoist static data outside the component.
// This ensures the object reference never changes, preventing re-renders.
const FOOTER_SECTIONS = [
  {
    title: "COMPANY",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "HELP",
    links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  },
  {
    title: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    title: "RESOURCES",
    links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
  },
];

// 2. Memoized Sub-component for individual columns
const FooterColumn = memo(({ section }) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-sm tracking-tight">{section.title}</h4>
    <ul className="space-y-3">
      {section.links.map((link) => (
        <li key={link}>
          <Link 
            href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} 
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            {link}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));
FooterColumn.displayName = "FooterColumn";

function Footer() {
  // 3. useMemo for static UI blocks
  // This calculates the list once and caches it.
  const renderedSections = useMemo(() => {
    return FOOTER_SECTIONS.map((section) => (
      <FooterColumn key={section.title} section={section} />
    ));
  }, []);

  // 4. Dynamic year logic memoized to prevent hydration mismatch
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-muted/30 pt-16 pb-8 px-4 md:px-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">SHOP.CO</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              We have clothes that suits your style and which you are proud to wear. From women to men.
            </p>
            <div className="flex space-x-4">
              {['f', 't', 'in'].map((social) => (
                <div 
                  key={social} 
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:opacity-80 cursor-pointer transition-opacity"
                >
                  <span className="text-primary-foreground text-xs font-bold">{social}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimized Footer Links */}
          {renderedSections}
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            Shop.co © 2000-{currentYear}, All Rights Reserved
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Payment Methods:
            </div>
            <div className="flex space-x-2">
              {/* Note: In a real app, replace emojis with optimized SVGs via next/image */}
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="w-10 h-6 bg-white rounded border flex items-center justify-center shadow-sm"
                >
                  <span className="text-xs">💳</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// 5. Wrap the entire export in React.memo
// Since Footer takes no props, it will now only render once for the entire session.
export default memo(Footer);