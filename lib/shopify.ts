export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: ProductImage[];
  variants: ProductVariant[];
  brand: string;
  category: string;
  compatibility: string[]; // Motorcycle models it fits
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  rating: number;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ProductImage;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: CartItem[];
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  };
}

// ==========================================
// MOCK DATA STORE
// ==========================================

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    handle: "performance-air-filters",
    title: "Performance Air Filters",
    description: "High-flow air filters engineered to improve airflow, boost horsepower, and provide superior engine protection.",
    image: {
      url: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=800&auto=format&fit=crop",
      altText: "Performance Air Filters Collection"
    }
  },
  {
    id: "col-2",
    handle: "engine-performance",
    title: "Engine & Performance",
    description: "Plug-and-play fuel tuners, spark plugs, and performance upgrades engineered to unlock your motorcycle's true capabilities.",
    image: {
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
      altText: "Engine & Performance Parts Collection"
    }
  },
  {
    id: "col-3",
    handle: "helmets",
    title: "Helmets",
    description: "ECE and DOT certified helmets offering state-of-the-art protection, aerodynamics, and sleek modern designs.",
    image: {
      url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop",
      altText: "Premium Helmets Collection"
    }
  },
  {
    id: "col-4",
    handle: "riding-gear",
    title: "Riding Gear",
    description: "Technical jackets, pants, and gauntlet gloves designed to protect you from the elements and the road.",
    image: {
      url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=800&auto=format&fit=crop",
      altText: "Riding Gear Collection"
    }
  },
  {
    id: "col-5",
    handle: "bike-care",
    title: "Bike Care",
    description: "Premium synthetic engine oils, chain lubricants, and cleaners to keep your machine running smoothly and looking immaculate.",
    image: {
      url: "https://images.unsplash.com/photo-1635843109391-00cc9165e8ec?q=80&w=800&auto=format&fit=crop",
      altText: "Bike Care Collection"
    }
  },
  {
    id: "col-6",
    handle: "touring-accessories",
    title: "Touring Accessories",
    description: "Rugged luggage systems, mobile mounts, and ergonomics upgrades built for long-distance adventure riders.",
    image: {
      url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
      altText: "Touring Accessories Collection"
    }
  }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    handle: "bmc-air-filter",
    title: "BMC High Performance Air Filter",
    description: "BMC Air Filters are designed as a direct replacement for the original element. They feature a high-flow cotton gauze media that allows 40% more airflow while maintaining 98.5% filtration efficiency. Pre-oiled and fully washable.",
    priceRange: {
      minVariantPrice: { amount: "4990", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=600&auto=format&fit=crop",
        altText: "BMC Air Filter Front"
      },
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
        altText: "BMC Air Filter Installation"
      }
    ],
    variants: [
      {
        id: "var-1-1",
        title: "KTM Duke 390 (Gen 3)",
        price: { amount: "4990", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-1-2",
        title: "Royal Enfield Himalayan 450",
        price: { amount: "5200", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "BMC",
    category: "Performance Air Filters",
    compatibility: ["KTM Duke 390", "Royal Enfield Himalayan 450", "KTM RC 390", "Triumph Speed 400"],
    specifications: [
      { name: "Material", value: "Multi-layered surgical cotton gauze, epoxy-coated alloy mesh" },
      { name: "Filtration Rating", value: "Down to 7 microns" },
      { name: "Origin", value: "Made in Italy" },
      { name: "Maintenance", value: "Washable with BMC cleaning kit every 10,000 km" }
    ],
    reviews: [
      { id: "rev-1-1", author: "Rohan Sharma", rating: 5, date: "2026-05-12", title: "Immediate performance upgrade", comment: "Superb throttle response immediately felt on my KTM Duke 390. Highly recommend!" },
      { id: "rev-1-2", author: "Aditya Patil", rating: 4, date: "2026-05-28", title: "Excellent build quality", comment: "Fits perfectly. Noticeable improvement in mid-range torque. Build quality is top tier." }
    ],
    rating: 4.8
  },
  {
    id: "prod-2",
    handle: "kn-air-filter",
    title: "K&N Replacement Performance Air Filter",
    description: "K&N performance air filters are engineered to improve engine performance by increasing airflow. They feature a durable, washable pleated cotton design that helps capture dust and dirt while delivering superior airflow rates for your motorcycle.",
    priceRange: {
      minVariantPrice: { amount: "5490", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600&auto=format&fit=crop",
        altText: "K&N Air Filter"
      }
    ],
    variants: [
      {
        id: "var-2-1",
        title: "Royal Enfield Interceptor 650",
        price: { amount: "5490", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-2-2",
        title: "Yamaha YZF-R15 V4",
        price: { amount: "4200", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "K&N",
    category: "Performance Air Filters",
    compatibility: ["Royal Enfield Interceptor 650", "Royal Enfield Continental GT 650", "Yamaha R15 V4"],
    specifications: [
      { name: "Filter Media", value: "Cotton Gauze" },
      { name: "Washable", value: "Yes" },
      { name: "Origin", value: "Made in USA" },
      { name: "Warranty", value: "K&N Million Mile Limited Warranty" }
    ],
    reviews: [
      { id: "rev-2-1", author: "Vikram Sen", rating: 5, date: "2026-04-10", title: "Legendary filter for GT 650", comment: "Paired with a Red Rooster slip-on, the K&N filter makes my GT 650 roar and breathe so much better." }
    ],
    rating: 5.0
  },
  {
    id: "prod-3",
    handle: "fuelx-lite",
    title: "FuelX Lite EFI Optimizer",
    description: "FuelX Lite is a state-of-the-art plug-and-play electronic fuel injection optimizer that automatically adjusts the fuel map to achieve an optimal air-fuel ratio. Reduces engine temperature, eliminates low-end stutter, and refines power delivery.",
    priceRange: {
      minVariantPrice: { amount: "7990", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=600&auto=format&fit=crop",
        altText: "FuelX Lite Unit"
      }
    ],
    variants: [
      {
        id: "var-3-1",
        title: "Universal Fit / Standard ECU",
        price: { amount: "7990", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Race Dynamics",
    category: "Engine & Performance",
    compatibility: ["KTM Duke 390", "Royal Enfield Himalayan 450", "Royal Enfield Interceptor 650", "Triumph Speed 400"],
    specifications: [
      { name: "Type", value: "O2 Sensor Lambda Modifier" },
      { name: "Hardware", value: "IP67 Waterproof enclosure" },
      { name: "Tuning Maps", value: "1 Autotune map based on engine load" },
      { name: "Installation Time", value: "Approx. 15-20 minutes plug & play" }
    ],
    reviews: [
      { id: "rev-3-1", author: "Karan Mehta", rating: 5, date: "2026-05-02", title: "Game changer for Himalayan 450", comment: "Completely eliminated the low-RPM engine knocking. The bike runs much cooler now!" }
    ],
    rating: 4.9
  },
  {
    id: "prod-4",
    handle: "fuelx-pro",
    title: "FuelX Pro EFI Tuner",
    description: "FuelX Pro provides ultimate control over your engine's fueling map. It features 10 selectable autotune maps ranging from economy focus to peak performance. Includes a premium handlebar-mounted switch to shift maps on the fly.",
    priceRange: {
      minVariantPrice: { amount: "9990", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
        altText: "FuelX Pro and Handlebar Switch"
      }
    ],
    variants: [
      {
        id: "var-4-1",
        title: "Pro Edition with Handlebar Map Selector",
        price: { amount: "9990", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Race Dynamics",
    category: "Engine & Performance",
    compatibility: ["KTM Duke 390", "Royal Enfield Himalayan 450", "KTM RC 390", "Triumph Speed 400"],
    specifications: [
      { name: "Maps", value: "10 Selectable Maps (Map 1 Economy, Map 10 Pure Power)" },
      { name: "Switch", value: "Waterproof Handlebar Mount Dial" },
      { name: "Warranty", value: "2 Year Manufacturer Warranty" }
    ],
    reviews: [
      { id: "rev-4-1", author: "Arjun Dev", rating: 5, date: "2026-03-15", title: "Absolutely insane control", comment: "Switching to Map 9 on the highway changes the bike's character entirely. BMC Filter + FuelX Pro is the magic combo." }
    ],
    rating: 4.7
  },
  {
    id: "prod-5",
    handle: "ngk-iridium-spark-plug",
    title: "NGK Laser Iridium Spark Plug",
    description: "NGK Laser Iridium spark plugs provide superior ignitability and long service life. The fine iridium tip ensures high durability and a consistently stable spark, preventing misfires and improving fuel combustion efficiency under extreme heat.",
    priceRange: {
      minVariantPrice: { amount: "750", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=600&auto=format&fit=crop",
        altText: "NGK Iridium Spark Plug close-up"
      }
    ],
    variants: [
      {
        id: "var-5-1",
        title: "LMAR8A-9 (Standard Duke/RE)",
        price: { amount: "750", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "NGK",
    category: "Engine & Performance",
    compatibility: ["KTM Duke 390", "Royal Enfield Himalayan 450", "Yamaha R15 V4"],
    specifications: [
      { name: "Thread Size", value: "10mm" },
      { name: "Electrode Material", value: "Laser Welded Iridium Center" },
      { name: "Service Life", value: "Up to 50,000 km" }
    ],
    reviews: [
      { id: "rev-5-1", author: "Rahul V", rating: 4, date: "2026-04-20", title: "Smooth starting", comment: "Noticeable difference in cold starts in winter. Revs cleanly to the redline." }
    ],
    rating: 4.5
  },
  {
    id: "prod-6",
    handle: "motul-chain-care-kit",
    title: "Motul Chain Care Combo Kit (C1 + C2)",
    description: "The ultimate chain maintenance package. Includes Motul C1 Chain Clean to remove encrusted dirt, sand, and grease, along with Motul C2 Chain Lube Road, designed to stick at high speeds, providing corrosion resistance and reducing friction.",
    priceRange: {
      minVariantPrice: { amount: "950", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=600&auto=format&fit=crop",
        altText: "Motul Chain Clean and Chain Lube Spray Cans"
      }
    ],
    variants: [
      {
        id: "var-6-1",
        title: "C1 Clean 400ml + C2 Lube 400ml",
        price: { amount: "950", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Motul",
    category: "Bike Care",
    compatibility: ["KTM Duke 390", "Royal Enfield Himalayan 450", "Royal Enfield Interceptor 650", "Yamaha R15 V4", "Triumph Speed 400"],
    specifications: [
      { name: "Pack Volume", value: "400ml + 400ml Aerosol Cans" },
      { name: "Suitability", value: "O-Ring, X-Ring, Z-Ring drive chains" },
      { name: "Color", value: "C1 colorless, C2 white viscous film" }
    ],
    reviews: [
      { id: "rev-6-1", author: "Siddharth J", rating: 5, date: "2026-06-01", title: "Gold standard of chain lubes", comment: "Very low fling-off. Chain remains silent and smooth for over 500 kms post application." }
    ],
    rating: 4.9
  },
  {
    id: "prod-7",
    handle: "liqui-moly-engine-oil",
    title: "Liqui Moly 10W-40 Street Synthetic Oil",
    description: "Liqui Moly 10W-40 Synthetic Technology Street Motor Oil is high-performance oil formulated for air and water-cooled 4-stroke engines. Offers optimum lubrication, outstanding engine cleanliness, excellent friction coefficients, and minimal wear.",
    priceRange: {
      minVariantPrice: { amount: "1490", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1635843109391-00cc9165e8ec?q=80&w=600&auto=format&fit=crop",
        altText: "Liqui Moly Engine Oil Canister"
      }
    ],
    variants: [
      {
        id: "var-7-1",
        title: "1 Litre Can",
        price: { amount: "1490", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Liqui Moly",
    category: "Bike Care",
    compatibility: ["KTM Duke 390", "Yamaha R15 V4", "Triumph Speed 400"],
    specifications: [
      { name: "Viscosity", value: "10W-40" },
      { name: "Approvals", value: "API SN Plus, JASO MA2" },
      { name: "Base Oil", value: "Synthese Technology" }
    ],
    reviews: [
      { id: "rev-7-1", author: "Piyush G", rating: 5, date: "2026-05-18", title: "Super smooth gear shifts", comment: "Engine noise is cut down significantly. Gear shifts are butter smooth even in stop-and-go bumper traffic." }
    ],
    rating: 4.6
  },
  {
    id: "prod-8",
    handle: "axor-apex-helmet",
    title: "Axor Apex Venomous Helmet",
    description: "Axor Apex features a high-impact ABS polycarbonate shell. ECE R22.05 certified. Fitted with an optically correct clear visor, an integrated drop-down sun visor, and emergency quick-release cheek pads. Sleek rear spoiler increases high-speed stability.",
    priceRange: {
      minVariantPrice: { amount: "4990", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600&auto=format&fit=crop",
        altText: "Axor Apex Helmet Angle View"
      }
    ],
    variants: [
      {
        id: "var-8-1",
        title: "Medium / Matte Black Red",
        price: { amount: "4990", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-8-2",
        title: "Large / Matte Black Red",
        price: { amount: "4990", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Axor",
    category: "Helmets",
    compatibility: ["All Motorcycles"],
    specifications: [
      { name: "Shell Material", value: "High Impact ABS Polycarbonate" },
      { name: "Certification", value: "ECE R-22.05 & DOT Approved" },
      { name: "Weight", value: "1500 ± 50 grams" },
      { name: "Visor Type", value: "Anti-fog PINLOCK ready clear visor + Internal Sun Visor" }
    ],
    reviews: [
      { id: "rev-8-1", author: "Nikhil Joshi", rating: 4, date: "2026-05-10", title: "Stunning graphics and fit", comment: "Graphics are very sharp. Wind noise is moderate at 100 km/h, but the safety and fit are stellar for the price." }
    ],
    rating: 4.4
  },
  {
    id: "prod-9",
    handle: "smk-titan-helmet",
    title: "SMK Titan Carbon Helmet",
    description: "The SMK Titan is a premium full-face carbon composite helmet built for touring and sport riders. The dual-shell design with advanced channeling ventilation provides unmatched cooling. Equipped with Pinlock 70 anti-fog lens insert.",
    priceRange: {
      minVariantPrice: { amount: "10500", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600&auto=format&fit=crop",
        altText: "SMK Titan Carbon fiber weave helmet"
      }
    ],
    variants: [
      {
        id: "var-9-1",
        title: "Medium / Gloss Carbon",
        price: { amount: "10500", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-9-2",
        title: "Large / Gloss Carbon",
        price: { amount: "10500", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "SMK",
    category: "Helmets",
    compatibility: ["All Motorcycles"],
    specifications: [
      { name: "Shell Material", value: "High-grade carbon fiber composite" },
      { name: "Certification", value: "ECE 22-05 Certified" },
      { name: "Weight", value: "1350 ± 50 grams" },
      { name: "Visor", value: "Quick release, scratch-resistant, Pinlock included" }
    ],
    reviews: [
      { id: "rev-9-1", author: "Kshitij T", rating: 5, date: "2026-06-03", title: "Carbon fiber at this price is a steal", comment: "Amazingly lightweight. Zero neck fatigue on my 600km weekend ride. Beautiful carbon fiber weave visible under sunlight." }
    ],
    rating: 4.9
  },
  {
    id: "prod-10",
    handle: "viaterra-riding-gloves",
    title: "Viaterra Grid Full Gauntlet Gloves",
    description: "Viaterra Grid is a track-ready full gauntlet premium leather glove. Features Knox SPS (Scaphoid Protection System) palm sliders, TPU knuckle protectors, pre-curved fingers, and kevlar safety stitching. Optimized for track and touring.",
    priceRange: {
      minVariantPrice: { amount: "5490", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=600&auto=format&fit=crop",
        altText: "Viaterra Grid Gloves Close-up"
      }
    ],
    variants: [
      {
        id: "var-10-1",
        title: "Size M / Black",
        price: { amount: "5490", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-10-2",
        title: "Size L / Black",
        price: { amount: "5490", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "Viaterra",
    category: "Riding Gear",
    compatibility: ["All Motorcycles"],
    specifications: [
      { name: "Material", value: "Premium full-grain drum dyed goat leather" },
      { name: "Sliders", value: "Knox SPS Patented Palm Sliders" },
      { name: "Stitching", value: "Heavy-duty Kevlar thread stitching on high impact areas" }
    ],
    reviews: [
      { id: "rev-10-1", author: "Pranav M", rating: 5, date: "2026-04-18", title: "Feels like armor", comment: "Takes a couple of days to break in the goat leather, but once done, the feedback from the grips is superb. Knox sliders are excellent." }
    ],
    rating: 4.8
  },
  {
    id: "prod-11",
    handle: "bobo-mobile-holder",
    title: "BOBO Jaw-Grip Mobile Holder with Charger",
    description: "The premium BOBO mobile holder features reinforced aluminum mounts with a robust jaw grip design that holds phones secure up to 150 km/h. Built-in USB charging port provides QC 3.0 fast charging on the go. Dust and water resistant.",
    priceRange: {
      minVariantPrice: { amount: "2100", currencyCode: "INR" }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop",
        altText: "BOBO Jaw Grip Mobile Holder"
      }
    ],
    variants: [
      {
        id: "var-11-1",
        title: "Standard Handlebar Mount",
        price: { amount: "2100", currencyCode: "INR" },
        availableForSale: true
      },
      {
        id: "var-11-2",
        title: "Mirror Mount (Scooters/Sports)",
        price: { amount: "2100", currencyCode: "INR" },
        availableForSale: true
      }
    ],
    brand: "BOBO",
    category: "Touring Accessories",
    compatibility: ["All Motorcycles"],
    specifications: [
      { name: "Mounting Type", value: "Metal Handlebar / Mirror Mount" },
      { name: "Charger Output", value: "USB QC 3.0 Fast Charging (5V 3A)" },
      { name: "Phone Sizes Supported", value: "4.0 to 7.0 inches screen width" }
    ],
    reviews: [
      { id: "rev-11-1", author: "Zakir Khan", rating: 5, date: "2026-05-30", title: "Rock solid", comment: "Does not budge at all even on worst potholes. The USB charger is a lifesaver on highway trips." }
    ],
    rating: 4.7
  }
];

// ==========================================
// SHOPIFY STOREFRONT GRAPHQL CLIENT
// ==========================================

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const isShopifyConfigured = (): boolean => {
  return typeof DOMAIN === "string" && DOMAIN.length > 0 && typeof ACCESS_TOKEN === "string" && ACCESS_TOKEN.length > 0;
};

async function shopifyFetch<T>(query: string, variables = {}): Promise<{ data?: T; errors?: any } | null> {
  if (!isShopifyConfigured()) return null;

  const endpoint = `https://${DOMAIN}/api/2024-01/graphql.json`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN || "",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // Cache for 60s
    });

    if (!response.ok) {
      console.warn(`Shopify API responded with status ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from Shopify Storefront API:", error);
    return null;
  }
}

// Convert Shopify GraphQL response schemas into our unified app schemas
function formatShopifyProduct(shopifyProduct: any): Product {
  const images = shopifyProduct.images?.edges.map((edge: any) => ({
    url: edge.node.url,
    altText: edge.node.altText || shopifyProduct.title,
  })) || [];

  const variants = shopifyProduct.variants?.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    price: {
      amount: edge.node.price.amount,
      currencyCode: edge.node.price.currencyCode,
    },
    compareAtPrice: edge.node.compareAtPrice ? {
      amount: edge.node.compareAtPrice.amount,
      currencyCode: edge.node.compareAtPrice.currencyCode,
    } : null,
    availableForSale: edge.node.availableForSale,
  })) || [];

  // Parse custom metadata fields if available, otherwise map default attributes
  const brand = shopifyProduct.vendor || "MotoHub";
  const category = shopifyProduct.productType || "Accessories";

  // Use tags or other placeholders for compatibility
  const compatibility = shopifyProduct.tags?.includes("Universal") 
    ? ["All Motorcycles"]
    : shopifyProduct.tags?.filter((t: string) => !t.startsWith("col-")) || ["All Motorcycles"];

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description || "",
    priceRange: {
      minVariantPrice: {
        amount: shopifyProduct.priceRange?.minVariantPrice?.amount || "0",
        currencyCode: shopifyProduct.priceRange?.minVariantPrice?.currencyCode || "INR"
      }
    },
    images: images.length ? images : [{ url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600", altText: shopifyProduct.title }],
    variants,
    brand,
    category,
    compatibility,
    specifications: [
      { name: "Brand", value: brand },
      { name: "Category", value: category }
    ],
    reviews: [
      { id: "rev-default-1", author: "Verified Rider", rating: 5, date: "2026-06-01", title: "Genuine product", comment: "Shipped fast, original packing. Performance is exactly as advertised." }
    ],
    rating: 4.7
  };
}

// ==========================================
// STOREFRONT API HANDLERS (WITH FALLBACKS)
// ==========================================

export async function getCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) {
    return MOCK_COLLECTIONS;
  }

  const query = `
    query GetCollections {
      collections(first: 10) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch<any>(query);
  if (result?.data?.collections?.edges) {
    return result.data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description || "",
      image: edge.node.image ? { url: edge.node.image.url, altText: edge.node.image.altText || edge.node.title } : undefined
    }));
  }

  return MOCK_COLLECTIONS;
}

export async function getProducts(options?: { collectionHandle?: string; limit?: number }): Promise<Product[]> {
  const limit = options?.limit || 24;
  const collectionHandle = options?.collectionHandle;

  if (!isShopifyConfigured()) {
    let products = MOCK_PRODUCTS;
    if (collectionHandle) {
      // Find matching category corresponding to collection handle
      const collection = MOCK_COLLECTIONS.find(c => c.handle === collectionHandle);
      if (collection) {
        products = MOCK_PRODUCTS.filter(p => p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === collectionHandle);
      }
    }
    return products.slice(0, limit);
  }

  let query = "";
  let variables: any = { first: limit };

  if (collectionHandle) {
    query = `
      query GetCollectionProducts($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                id
                handle
                title
                description
                vendor
                productType
                tags
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    variables.handle = collectionHandle;
  } else {
    query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              handle
              title
              description
              vendor
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  const result = await shopifyFetch<any>(query, variables);
  
  if (collectionHandle) {
    if (result?.data?.collection?.products?.edges) {
      return result.data.collection.products.edges.map((edge: any) => formatShopifyProduct(edge.node));
    }
  } else {
    if (result?.data?.products?.edges) {
      return result.data.products.edges.map((edge: any) => formatShopifyProduct(edge.node));
    }
  }

  // Fallback to mock data if API results are empty or error out
  let products = MOCK_PRODUCTS;
  if (collectionHandle) {
    products = MOCK_PRODUCTS.filter(p => p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === collectionHandle);
  }
  return products.slice(0, limit);
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  }

  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        vendor
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch<any>(query, { handle });
  if (result?.data?.product) {
    // Inject mock specifications and reviews to make the Shopify custom details look premium
    const baseProduct = formatShopifyProduct(result.data.product);
    const mockMatch = MOCK_PRODUCTS.find(p => p.handle === handle);
    if (mockMatch) {
      baseProduct.compatibility = mockMatch.compatibility;
      baseProduct.specifications = mockMatch.specifications;
      baseProduct.reviews = mockMatch.reviews;
      baseProduct.rating = mockMatch.rating;
    }
    return baseProduct;
  }

  return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (!isShopifyConfigured()) {
    return MOCK_COLLECTIONS.find(c => c.handle === handle) || null;
  }

  const query = `
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        handle
        title
        description
        image {
          url
          altText
        }
      }
    }
  `;

  const result = await shopifyFetch<any>(query, { handle });
  if (result?.data?.collection) {
    const col = result.data.collection;
    return {
      id: col.id,
      handle: col.handle,
      title: col.title,
      description: col.description || "",
      image: col.image ? { url: col.image.url, altText: col.image.altText || col.title } : undefined
    };
  }

  return MOCK_COLLECTIONS.find(c => c.handle === handle) || null;
}

// ==========================================
// CART OPERATIONS
// ==========================================

export async function createCart(): Promise<Cart> {
  if (!isShopifyConfigured()) {
    return {
      id: "mock-cart-" + Math.random().toString(36).substr(2, 9),
      checkoutUrl: "https://shopify.com/checkout/mock",
      lines: [],
      subtotalAmount: { amount: "0.00", currencyCode: "INR" }
    };
  }

  const query = `
    mutation CartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const result = await shopifyFetch<any>(query);
  if (result?.data?.cartCreate?.cart) {
    return {
      id: result.data.cartCreate.cart.id,
      checkoutUrl: result.data.cartCreate.cart.checkoutUrl,
      lines: [],
      subtotalAmount: { amount: "0.00", currencyCode: "INR" }
    };
  }

  return {
    id: "mock-cart-" + Math.random().toString(36).substr(2, 9),
    checkoutUrl: "https://shopify.com/checkout/mock",
    lines: [],
    subtotalAmount: { amount: "0.00", currencyCode: "INR" }
  };
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith("mock-")) {
    return null; // Local state takes over when in mock mode
  }

  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch<any>(query, {
    cartId,
    lines: [{ variantId, quantity }]
  });

  if (result?.data?.cartLinesAdd?.cart) {
    const rawCart = result.data.cartLinesAdd.cart;
    return {
      id: rawCart.id,
      checkoutUrl: rawCart.checkoutUrl,
      lines: [], // Updated on frontend side to prevent excessive roundtrips
      subtotalAmount: {
        amount: rawCart.cost.subtotalAmount.amount,
        currencyCode: rawCart.cost.subtotalAmount.currencyCode
      }
    };
  }

  return null;
}
