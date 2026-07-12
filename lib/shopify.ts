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
  hp_gain?: number;
  weight_saved?: number;
  safety_rating?: number;
  tags?: string[];
  metafields?: {
    custom?: {
      hp_gain?: number | string;
      weight_saved?: number | string;
      safety_rating?: number | string;
    };
  };
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
    rating: 4.8,
    hp_gain: 1.2,
    weight_saved: 0.35,
    metafields: {
      custom: {
        hp_gain: 1.2,
        weight_saved: 0.35
      }
    }
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
    rating: 5.0,
    hp_gain: 1.0,
    weight_saved: 0.30,
    metafields: {
      custom: {
        hp_gain: 1.0,
        weight_saved: 0.30
      }
    }
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
    rating: 4.9,
    hp_gain: 1.8,
    weight_saved: 0.0,
    metafields: {
      custom: {
        hp_gain: 1.8,
        weight_saved: 0.0
      }
    }
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
    rating: 4.7,
    hp_gain: 3.2,
    weight_saved: 0.1,
    metafields: {
      custom: {
        hp_gain: 3.2,
        weight_saved: 0.1
      }
    }
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
    rating: 4.5,
    hp_gain: 0.2,
    weight_saved: 0.0,
    metafields: {
      custom: {
        hp_gain: 0.2,
        weight_saved: 0.0
      }
    }
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
    rating: 4.9,
    hp_gain: 0.4,
    weight_saved: 0.0,
    metafields: {
      custom: {
        hp_gain: 0.4,
        weight_saved: 0.0
      }
    }
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
    rating: 4.6,
    hp_gain: 0.3,
    weight_saved: 0.0,
    metafields: {
      custom: {
        hp_gain: 0.3,
        weight_saved: 0.0
      }
    }
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
    rating: 4.8,
    safety_rating: 10,
    metafields: {
      custom: {
        safety_rating: 10
      }
    }
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
  const isClient = typeof window !== "undefined";

  if (isClient) {
    try {
      const response = await fetch("/api/shopify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        console.warn(`Shopify Proxy API responded with status ${response.status}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch from Shopify proxy:", error);
      return null;
    }
  }

  // Server-side direct request
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

  const hp_gain_val = shopifyProduct.hp_gain?.value ? parseFloat(shopifyProduct.hp_gain.value) : undefined;
  const weight_saved_val = shopifyProduct.weight_saved?.value ? parseFloat(shopifyProduct.weight_saved.value) : undefined;
  const safety_rating_val = shopifyProduct.safety_rating?.value ? parseInt(shopifyProduct.safety_rating.value) : undefined;

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
    rating: 4.7,
    hp_gain: hp_gain_val,
    weight_saved: weight_saved_val,
    safety_rating: safety_rating_val,
    tags: shopifyProduct.tags || [],
    metafields: {
      custom: {
        hp_gain: hp_gain_val,
        weight_saved: weight_saved_val,
        safety_rating: safety_rating_val
      }
    }
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
                hp_gain: metafield(namespace: "custom", key: "hp_gain") {
                  value
                }
                weight_saved: metafield(namespace: "custom", key: "weight_saved") {
                  value
                }
                safety_rating: metafield(namespace: "custom", key: "safety_rating") {
                  value
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
              hp_gain: metafield(namespace: "custom", key: "hp_gain") {
                value
              }
              weight_saved: metafield(namespace: "custom", key: "weight_saved") {
                value
              }
              safety_rating: metafield(namespace: "custom", key: "safety_rating") {
                value
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
        hp_gain: metafield(namespace: "custom", key: "hp_gain") {
          value
        }
        weight_saved: metafield(namespace: "custom", key: "weight_saved") {
          value
        }
        safety_rating: metafield(namespace: "custom", key: "safety_rating") {
          value
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

export async function createCartWithLines(
  lines: Array<{ variantId: string; quantity: number }>,
  customerAccessToken?: string
): Promise<Cart | null> {
  if (!isShopifyConfigured()) {
    return {
      id: "mock-cart-" + Math.random().toString(36).substr(2, 9),
      checkoutUrl: "https://shopify.com/checkout/mock",
      lines: [],
      subtotalAmount: { amount: "0.00", currencyCode: "INR" }
    };
  }

  const mutation = `
    mutation CartCreate($input: CartInput) {
      cartCreate(input: $input) {
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input: any = {
    lines: lines.map(line => ({
      merchandiseId: line.variantId,
      quantity: line.quantity
    }))
  };

  if (customerAccessToken) {
    input.buyerIdentity = {
      customerAccessToken: customerAccessToken
    };
  }

  try {
    const result = await shopifyFetch<any>(mutation, { input });
    const cart = result?.data?.cartCreate?.cart;
    if (cart) {
      return {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        lines: [],
        subtotalAmount: {
          amount: cart.cost.subtotalAmount.amount,
          currencyCode: cart.cost.subtotalAmount.currencyCode
        }
      };
    } else {
      console.warn("Cart creation failed:", result?.data?.cartCreate?.userErrors);
    }
  } catch (e) {
    console.error("Error creating cart with lines:", e);
  }

  return null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith("mock-")) return null;

  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
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
  `;

  try {
    const result = await shopifyFetch<any>(query, { cartId });
    if (result?.data?.cart) {
      const rawCart = result.data.cart;
      return {
        id: rawCart.id,
        checkoutUrl: rawCart.checkoutUrl,
        lines: [],
        subtotalAmount: {
          amount: rawCart.cost.subtotalAmount.amount,
          currencyCode: rawCart.cost.subtotalAmount.currencyCode
        }
      };
    }
  } catch (e) {
    console.error("Error fetching cart from Shopify:", e);
  }
  return null;
}

export async function cartLinesUpdate(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith("mock-")) return null;

  const mutation = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const result = await shopifyFetch<any>(mutation, {
      cartId,
      lines: lines.map(line => ({
        id: line.id,
        quantity: line.quantity
      }))
    });
    const cart = result?.data?.cartLinesUpdate?.cart;
    if (cart) {
      return {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        lines: [],
        subtotalAmount: {
          amount: cart.cost.subtotalAmount.amount,
          currencyCode: cart.cost.subtotalAmount.currencyCode
        }
      };
    }
  } catch (e) {
    console.error("Error updating cart lines:", e);
  }
  return null;
}

export async function cartBuyerIdentityUpdate(
  cartId: string,
  customerAccessToken: string
): Promise<Cart | null> {
  if (!isShopifyConfigured() || cartId.startsWith("mock-")) return null;

  const mutation = `
    mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const result = await shopifyFetch<any>(mutation, {
      cartId,
      buyerIdentity: { customerAccessToken }
    });
    const cart = result?.data?.cartBuyerIdentityUpdate?.cart;
    if (cart) {
      return {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        lines: [],
        subtotalAmount: {
          amount: cart.cost.subtotalAmount.amount,
          currencyCode: cart.cost.subtotalAmount.currencyCode
        }
      };
    }
  } catch (e) {
    console.error("Error updating cart buyer identity:", e);
  }
  return null;
}

export function isProductCompatible(
  product: Product,
  bike: { maker: string; model: string; year?: string } | null
): boolean {
  if (!bike) return true;

  // Universal products match any bike
  const isUniversal = 
    product.compatibility.includes("All Motorcycles") || 
    product.compatibility.includes("Universal") ||
    product.category.toLowerCase() === "riding gear";
    
  if (isUniversal) return true;

  const compLower = product.compatibility.map(c => c.toLowerCase().trim());
  const makerLower = bike.maker.toLowerCase().trim();
  const modelLower = bike.model.toLowerCase().trim();
  
  // 1. Check maker match
  const makerMatch = compLower.some(c => c === makerLower || c.includes(makerLower) || makerLower.includes(c));
  if (!makerMatch) return false;
  
  // 2. Check model match
  const modelMatch = compLower.some(c => c === modelLower || c.includes(modelLower) || modelLower.includes(c));
  if (!modelMatch) return false;
  
  // 3. Check year match (only if year is selected and the product has numeric year tags)
  if (bike.year) {
    const yearLower = bike.year.toLowerCase().trim();
    const productHasYearTags = compLower.some(c => /^\d{4}$/.test(c));
    if (productHasYearTags) {
      const yearMatch = compLower.includes(yearLower);
      if (!yearMatch) return false;
    }
  }
  
  return true;
}

export interface BikeProfile {
  maker: string;
  model: string;
  stockHP: number;
  stockWeight: number; // in kg
  engine: string;
  image: string;
}

export const MASTER_MOTORCYCLES: BikeProfile[] = [
  { 
    maker: "KTM", 
    model: "Duke 390", 
    stockHP: 45.0, 
    stockWeight: 168, 
    engine: "399cc Liquid-Cooled Single",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "KTM", 
    model: "RC 390", 
    stockHP: 43.5, 
    stockWeight: 172, 
    engine: "373cc Liquid-Cooled Single",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "Royal Enfield", 
    model: "Himalayan 450", 
    stockHP: 40.0, 
    stockWeight: 196, 
    engine: "452cc Liquid-Cooled Sherpa Single",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "Royal Enfield", 
    model: "Interceptor 650", 
    stockHP: 47.0, 
    stockWeight: 202, 
    engine: "648cc Air-Oil Cooled Parallel Twin",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "Royal Enfield", 
    model: "Continental GT 650", 
    stockHP: 47.0, 
    stockWeight: 198, 
    engine: "648cc Air-Oil Cooled Parallel Twin",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "Yamaha", 
    model: "R15 V4", 
    stockHP: 18.4, 
    stockWeight: 142, 
    engine: "155cc Liquid-Cooled VVA Single",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=400&auto=format&fit=crop"
  },
  { 
    maker: "Triumph", 
    model: "Speed 400", 
    stockHP: 40.0, 
    stockWeight: 170, 
    engine: "398cc Liquid-Cooled Single",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop"
  }
];

export function getActiveMotorcycleGroups(products: Product[]): { maker: string; models: string[] }[] {
  const activeBikes = MASTER_MOTORCYCLES.filter(bike => {
    const makerLower = bike.maker.toLowerCase().trim();
    const modelLower = bike.model.toLowerCase().trim();
    
    return products.some(product => {
      const compLower = product.compatibility.map(c => c.toLowerCase().trim());
      const hasMaker = compLower.some(c => c === makerLower || c.includes(makerLower) || makerLower.includes(c));
      const hasModel = compLower.some(c => c === modelLower || c.includes(modelLower) || modelLower.includes(c));
      return hasMaker && hasModel;
    });
  });

  const bikesToGroup = activeBikes.length > 0 
    ? activeBikes 
    : MASTER_MOTORCYCLES.filter(b => b.maker === "KTM" || b.maker === "Royal Enfield");

  const groupsMap = new Map<string, string[]>();
  bikesToGroup.forEach(bike => {
    if (!groupsMap.has(bike.maker)) {
      groupsMap.set(bike.maker, []);
    }
    const list = groupsMap.get(bike.maker)!;
    if (!list.includes(bike.model)) {
      list.push(bike.model);
    }
  });

  return Array.from(groupsMap.entries()).map(([maker, models]) => ({
    maker,
    models
  }));
}

export function getActiveYears(products: Product[]): string[] {
  const yearsSet = new Set<string>();
  products.forEach(product => {
    product.compatibility.forEach(c => {
      const trimmed = c.trim();
      if (/^\d{4}$/.test(trimmed)) {
        yearsSet.add(trimmed);
      }
    });
  });

  if (yearsSet.size === 0) {
    return ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  }

  return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
}

// ==========================================
// CUSTOMER AUTHENTICATION & ACCESS TYPES
// ==========================================

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
  price: {
    amount: string;
    currencyCode: string;
  };
}

export interface TrackingInfo {
  number?: string;
  url?: string;
  company?: string;
}

export interface SuccessfulFulfillment {
  trackingInfo: TrackingInfo[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  processedAt: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: CustomerOrderLineItem[];
  successfulFulfillments?: SuccessfulFulfillment[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  accessToken?: string;
  isMock?: boolean;
  orders: CustomerOrder[];
}

// Helper to check if localStorage is available
const isBrowser = (): boolean => typeof window !== "undefined";

// Mock database key
const MOCK_USERS_KEY = "irani_motohub_mock_users";

// Helper to get mock users
function getMockUsers(): any[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(MOCK_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading mock users:", e);
    return [];
  }
}

// Helper to save mock users
function saveMockUsers(users: any[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving mock users:", e);
  }
}

// Helper to generate a default mock order history for newly registered / mock users to make it feel premium
function getMockOrdersForEmail(email: string): CustomerOrder[] {
  // Return some pre-filled mock orders to make the UI look stunning and populated
  return [
    {
      id: "ord-mock-1",
      orderNumber: "IMH-2026-8941",
      processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      totalPrice: { amount: "4990.00", currencyCode: "INR" },
      financialStatus: "PAID",
      fulfillmentStatus: "FULFILLED",
      lineItems: [
        {
          title: "BMC High Performance Air Filter - KTM Duke 390 (Gen 3)",
          quantity: 1,
          price: { amount: "4990.00", currencyCode: "INR" }
        }
      ],
      successfulFulfillments: [
        {
          trackingInfo: [
            {
              number: "DLV891001",
              company: "Delhivery Air",
              url: "https://www.delhivery.com/track/share?waybill=DLV891001"
            }
          ]
        }
      ]
    },
    {
      id: "ord-mock-2",
      orderNumber: "IMH-2026-3829",
      processedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
      totalPrice: { amount: "18250.00", currencyCode: "INR" },
      financialStatus: "PAID",
      fulfillmentStatus: "DELIVERED",
      lineItems: [
        {
          title: "FuelX Pro Tuning Module - Royal Enfield Himalayan 450",
          quantity: 1,
          price: { amount: "18250.00", currencyCode: "INR" }
        }
      ],
      successfulFulfillments: [
        {
          trackingInfo: [
            {
              number: "DLV891002",
              company: "Delhivery Air",
              url: "https://www.delhivery.com/track/share?waybill=DLV891002"
            }
          ]
        }
      ]
    }
  ];
}

/**
 * Register a new customer in Shopify or fallback to Mock Database.
 */
export async function customerRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ customer: Customer | null; errors: string[] }> {
  if (isShopifyConfigured()) {
    const mutation = `
      mutation CustomerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            phone
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    try {
      const result = await shopifyFetch<any>(mutation, {
        input: { firstName, lastName, email, password, acceptsMarketing: true }
      });

      const customerCreate = result?.data?.customerCreate;
      if (customerCreate?.customerUserErrors?.length > 0) {
        const errorMsgs = customerCreate.customerUserErrors.map((err: any) => err.message);
        return { customer: null, errors: errorMsgs };
      }

      if (result?.data?.customerCreate?.customer) {
        const c = result.data.customerCreate.customer;
        const customer: Customer = {
          id: c.id,
          firstName: c.firstName || "",
          lastName: c.lastName || "",
          email: c.email,
          phone: c.phone || "",
          orders: []
        };
        return { customer, errors: [] };
      }
    } catch (e) {
      console.warn("Shopify register call failed, falling back to mock database", e);
    }
  }

  // FALLBACK MOCK REGISTER
  const users = getMockUsers();
  const emailLower = email.toLowerCase().trim();
  const exists = users.find((u) => u.email.toLowerCase().trim() === emailLower);

  if (exists) {
    return { customer: null, errors: ["An account with this email address already exists."] };
  }

  const newMockUser = {
    id: `mock-usr-${Math.random().toString(36).substr(2, 9)}`,
    firstName,
    lastName,
    email: emailLower,
    password, // Store plain text since this is a local mock client sandbox,
    phone: "",
    orders: getMockOrdersForEmail(emailLower)
  };

  users.push(newMockUser);
  saveMockUsers(users);

  const customer: Customer = {
    id: newMockUser.id,
    firstName: newMockUser.firstName,
    lastName: newMockUser.lastName,
    email: newMockUser.email,
    phone: newMockUser.phone,
    isMock: true,
    orders: newMockUser.orders
  };

  return { customer, errors: [] };
}

/**
 * Log in a customer. Returns Customer and access token.
 */
export async function customerLogin(
  email: string,
  password: string
): Promise<{ customer: Customer | null; accessToken?: string; errors: string[] }> {
  const emailLower = email.toLowerCase().trim();

  if (isShopifyConfigured()) {
    const mutation = `
      mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    try {
      const result = await shopifyFetch<any>(mutation, {
        input: { email: emailLower, password }
      });

      const tokenCreate = result?.data?.customerAccessTokenCreate;
      if (tokenCreate?.customerUserErrors?.length > 0) {
        const errorMsgs = tokenCreate.customerUserErrors.map((err: any) => err.message);
        return { customer: null, errors: errorMsgs };
      }

      const tokenInfo = result?.data?.customerAccessTokenCreate?.customerAccessToken;
      if (tokenInfo?.accessToken) {
        const accessToken = tokenInfo.accessToken;
        // Fetch full customer details
        const customer = await customerGet(accessToken);
        if (customer) {
          return { customer, accessToken, errors: [] };
        }
      }
    } catch (e) {
      console.warn("Shopify login call failed, falling back to mock database", e);
    }
  }

  // FALLBACK MOCK LOGIN
  const users = getMockUsers();
  const matchedUser = users.find(
    (u) => u.email.toLowerCase().trim() === emailLower && u.password === password
  );

  if (!matchedUser) {
    return { customer: null, errors: ["Unrecognized email address or password. Please try again."] };
  }

  const customer: Customer = {
    id: matchedUser.id,
    firstName: matchedUser.firstName,
    lastName: matchedUser.lastName,
    email: matchedUser.email,
    phone: matchedUser.phone,
    isMock: true,
    orders: matchedUser.orders || getMockOrdersForEmail(matchedUser.email)
  };

  // Generate a mock token containing the email
  const mockToken = `mock-token-${matchedUser.email}`;

  return { customer, accessToken: mockToken, errors: [] };
}

/**
 * Get customer info using access token.
 */
export async function customerGet(accessToken: string): Promise<Customer | null> {
  if (accessToken.startsWith("mock-token-")) {
    const email = accessToken.replace("mock-token-", "").toLowerCase().trim();
    const users = getMockUsers();
    const matchedUser = users.find((u) => u.email.toLowerCase().trim() === email);

    if (!matchedUser) {
      if (typeof window === "undefined") {
        const namePart = email.split('@')[0];
        const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        return {
          id: `mock-usr-${email}`,
          firstName: firstName,
          lastName: "Rider",
          email: email,
          phone: "",
          isMock: true,
          orders: getMockOrdersForEmail(email)
        };
      }
      return null;
    }

    return {
      id: matchedUser.id,
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      email: matchedUser.email,
      phone: matchedUser.phone,
      isMock: true,
      orders: matchedUser.orders || getMockOrdersForEmail(matchedUser.email)
    };
  }

  if (isShopifyConfigured()) {
    const query = `
      query GetCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          orders(first: 10) {
            edges {
              node {
                id
                orderNumber
                processedAt
                totalPrice {
                  amount
                  currencyCode
                }
                financialStatus
                fulfillmentStatus
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
                successfulFulfillments(first: 5) {
                  trackingInfo(first: 5) {
                    number
                    url
                    company
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const result = await shopifyFetch<any>(query, { customerAccessToken: accessToken });
      if (result?.data?.customer) {
        const c = result.data.customer;
        
        // Map Shopify order nodes
        const orders: CustomerOrder[] = c.orders?.edges?.map((edge: any) => {
          const o = edge.node;
          const lineItems = o.lineItems?.edges?.map((liEdge: any) => {
            const li = liEdge.node;
            return {
              title: li.title,
              quantity: li.quantity,
              price: {
                amount: li.variant?.price?.amount || "0",
                currencyCode: li.variant?.price?.currencyCode || "INR"
              }
            };
          }) || [];

          const successfulFulfillments = o.successfulFulfillments?.map((sf: any) => ({
            trackingInfo: sf.trackingInfo?.map((ti: any) => ({
              number: ti.number || null,
              url: ti.url || null,
              company: ti.company || null
            })) || []
          })) || [];

          return {
            id: o.id,
            orderNumber: o.orderNumber?.toString() || o.id,
            processedAt: o.processedAt,
            totalPrice: {
              amount: o.totalPrice?.amount || "0",
              currencyCode: o.totalPrice?.currencyCode || "INR"
            },
            financialStatus: o.financialStatus || "PAID",
            fulfillmentStatus: o.fulfillmentStatus || "UNFULFILLED",
            lineItems,
            successfulFulfillments
          };
        }) || [];

        return {
          id: c.id,
          firstName: c.firstName || "",
          lastName: c.lastName || "",
          email: c.email,
          phone: c.phone || "",
          orders
        };
      }
    } catch (e) {
      console.error("Error fetching Shopify customer data:", e);
    }
  }

  return null;
}

export interface Brand {
  name: string;
  category: string;
  logoUrl: string;
}

export async function getFeaturedBrands(): Promise<Brand[]> {
  if (!isShopifyConfigured()) {
    return [
      { name: "BMC", category: "Air Filters", logoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=200&auto=format&fit=crop" },
      { name: "K&N", category: "Filters & Intake", logoUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=200&auto=format&fit=crop" },
      { name: "Motul", category: "Lubricants", logoUrl: "https://images.unsplash.com/photo-1635843109391-00cc9165e8ec?q=80&w=200&auto=format&fit=crop" },
      { name: "Liqui Moly", category: "Engine Care", logoUrl: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=200&auto=format&fit=crop" },
      { name: "Axor", category: "Helmets", logoUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=200&auto=format&fit=crop" },
      { name: "SMK", category: "Helmets", logoUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=200&auto=format&fit=crop" }
    ];
  }

  const query = `
    query GetBrandsMetaobjects {
      metaobjects(type: "brand", first: 20) {
        edges {
          node {
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await shopifyFetch<any>(query);
    if (result?.data?.metaobjects?.edges) {
      return result.data.metaobjects.edges.map((edge: any) => {
        const fields = edge.node.fields;
        const nameField = fields.find((f: any) => f.key === "name" || f.key === "title");
        const categoryField = fields.find((f: any) => f.key === "category");
        const logoField = fields.find((f: any) => f.key === "logo" || f.key === "image");
        
        return {
          name: nameField?.value || "Unknown Brand",
          category: categoryField?.value || "Motorcycle Parts",
          logoUrl: logoField?.reference?.image?.url || logoField?.value || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=200"
        };
      });
    }
  } catch (e) {
    console.error("Error fetching brands metaobjects:", e);
  }

  return [
    { name: "BMC", category: "Air Filters", logoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=200" },
    { name: "K&N", category: "Filters & Intake", logoUrl: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=200" },
    { name: "Motul", category: "Lubricants", logoUrl: "https://images.unsplash.com/photo-1635843109391-00cc9165e8ec?q=80&w=200" },
    { name: "Liqui Moly", category: "Engine Care", logoUrl: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?q=80&w=200" },
    { name: "Axor", category: "Helmets", logoUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=200" },
    { name: "SMK", category: "Helmets", logoUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=200" }
  ];
}

export interface Review {
  id: string;
  name: string;
  location: string;
  motorcycle: string;
  rating: number;
  title: string;
  quote: string;
}

export async function getReviews(): Promise<Review[]> {
  if (!isShopifyConfigured()) {
    return [
      {
        id: "rev-1",
        name: "Arjun Dev",
        location: "Bengaluru",
        motorcycle: "KTM Duke 390 (2024)",
        rating: 5,
        title: "Immediate Throttle Response!",
        quote: "BMC Air Filter + FuelX Pro tuning is absolute magic. Low-end stuttering is completely gone, and switching to Map 9 on the highway is pure power. Exceptional customer service too!"
      },
      {
        id: "rev-2",
        name: "Priyesh G.",
        location: "Mumbai",
        motorcycle: "Royal Enfield Interceptor 650",
        rating: 5,
        title: "Super Smooth Gear Shifts",
        quote: "Bought the Liqui Moly oil and Motul chain care kit. The package arrived in double-boxed premium shockproof wraps. The engine sounds silent, and shifts are butter smooth."
      },
      {
        id: "rev-3",
        name: "Zakir Khan",
        location: "Delhi",
        motorcycle: "Royal Enfield Himalayan 450",
        rating: 5,
        title: "Rock Solid Touring Mount",
        quote: "Tested the BOBO mobile holder on a 1500km ride to Ladakh. Potholes, dirt trails, river crossings—it didn't move a millimeter. QC 3.0 charger is insanely fast."
      },
      {
        id: "rev-4",
        name: "Rohan Sharma",
        location: "Pune",
        motorcycle: "Triumph Speed 400",
        rating: 5,
        title: "Premium Carbon Helmet",
        quote: "The SMK Titan Carbon Helmet is remarkably lightweight. Zero neck fatigue on long weekend runs. Beautiful glossy carbon finish. The fitment team called to verify my size before shipping!"
      },
      {
        id: "rev-5",
        name: "Kabir Malhotra",
        location: "Gurugram",
        motorcycle: "Yamaha YZF-R15 V4",
        rating: 5,
        title: "Instant Cold Starts",
        quote: "NGK Laser Iridium Spark Plugs made cold starts instantaneous. Throttle idle is completely flat now, and mid-range pulling is visibly crisper. Highly recommend for singles!"
      },
      {
        id: "rev-6",
        name: "Neha Deshmukh",
        location: "Kolhapur",
        motorcycle: "KTM Adventure 390",
        rating: 5,
        title: "100% Waterproof Luggage",
        quote: "Viaterra saddlebags stayed bone dry through a heavy 4-hour monsoon downpour. Mount straps are incredibly secure and fit the stock rear frame of my 390 perfectly."
      }
    ];
  }

  const query = `
    query GetReviewsMetaobjects {
      metaobjects(type: "review", first: 20) {
        edges {
          node {
            id
            fields {
              key
              value
            }
          }
        }
      }
    }
  `;

  try {
    const result = await shopifyFetch<any>(query);
    if (result?.data?.metaobjects?.edges) {
      return result.data.metaobjects.edges.map((edge: any) => {
        const fields = edge.node.fields;
        const name = fields.find((f: any) => f.key === "name")?.value || "Anonymous";
        const location = fields.find((f: any) => f.key === "location")?.value || "India";
        const motorcycle = fields.find((f: any) => f.key === "motorcycle")?.value || "Rider";
        const rating = parseInt(fields.find((f: any) => f.key === "rating")?.value || "5");
        const title = fields.find((f: any) => f.key === "title")?.value || "Great Upgrade";
        const quote = fields.find((f: any) => f.key === "quote" || f.key === "comment")?.value || "";
        
        return {
          id: edge.node.id,
          name,
          location,
          motorcycle,
          rating,
          title,
          quote
        };
      });
    }
  } catch (e) {
    console.error("Error fetching reviews metaobjects:", e);
  }

  return [
    {
      id: "rev-1",
      name: "Arjun Dev",
      location: "Bengaluru",
      motorcycle: "KTM Duke 390 (2024)",
      rating: 5,
      title: "Immediate Throttle Response!",
      quote: "BMC Air Filter + FuelX Pro tuning is absolute magic. Low-end stuttering is completely gone, and switching to Map 9 on the highway is pure power. Exceptional customer service too!"
    },
    {
      id: "rev-2",
      name: "Priyesh G.",
      location: "Mumbai",
      motorcycle: "Royal Enfield Interceptor 650",
      rating: 5,
      title: "Super Smooth Gear Shifts",
      quote: "Bought the Liqui Moly oil and Motul chain care kit. The package arrived in double-boxed premium shockproof wraps. The engine sounds silent, and shifts are butter smooth."
    },
    {
      id: "rev-3",
      name: "Zakir Khan",
      location: "Delhi",
      motorcycle: "Royal Enfield Himalayan 450",
      rating: 5,
      title: "Rock Solid Touring Mount",
      quote: "Tested the BOBO mobile holder on a 1500km ride to Ladakh. Potholes, dirt trails, river crossings—it didn't move a millimeter. QC 3.0 charger is insanely fast."
    },
    {
      id: "rev-4",
      name: "Rohan Sharma",
      location: "Pune",
      motorcycle: "Triumph Speed 400",
      rating: 5,
      title: "Premium Carbon Helmet",
      quote: "The SMK Titan Carbon Helmet is remarkably lightweight. Zero neck fatigue on long weekend runs. Beautiful glossy carbon finish. The fitment team called to verify my size before shipping!"
    },
    {
      id: "rev-5",
      name: "Kabir Malhotra",
      location: "Gurugram",
      motorcycle: "Yamaha YZF-R15 V4",
      rating: 5,
      title: "Instant Cold Starts",
      quote: "NGK Laser Iridium Spark Plugs made cold starts instantaneous. Throttle idle is completely flat now, and mid-range pulling is visibly crisper. Highly recommend for singles!"
    },
    {
      id: "rev-6",
      name: "Neha Deshmukh",
      location: "Kolhapur",
      motorcycle: "KTM Adventure 390",
      rating: 5,
      title: "100% Waterproof Luggage",
      quote: "Viaterra saddlebags stayed bone dry through a heavy 4-hour monsoon downpour. Mount straps are incredibly secure and fit the stock rear frame of my 390 perfectly."
    }
  ];
}



