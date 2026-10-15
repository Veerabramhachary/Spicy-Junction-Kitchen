import { RestaurantConfig } from "../types/config";

/**
 * ==============================================================================
 * RESTAURANT TEMPLATE CONFIGURATION HUB
 * ==============================================================================
 * To rebrand or customize this template for ANY restaurant (Pizzeria, Sushi Bar,
 * Cafe, Biryani, Steakhouse, etc.):
 *
 * Simply edit this single file!
 * - Change the brand name, tagline, address, and contact numbers.
 * - Update currency symbol ('₹', '$', '£', '€') and tax/packaging rules.
 * - Replace the Google Maps share link with your restaurant's listing.
 * - Modify the menu categories and items below.
 * All pages, SEO meta, schema.org markup, and order flows update automatically!
 * ==============================================================================
 */

export const restaurantConfig: RestaurantConfig = {
    brand: {
        name: "Spicy and hot Junction Kitchen",
        shortName: "Spicy Junction",
        tagline: "Authentic Hyderabadi Dum Biryani, Quick Bites & Small Plates",
        description:
            "Authentic Hyderabadi Dum Biryani, slow-simmered handi pots, quick bites, small plates, solo dining comfort and family kitchen on Almasguda Road, Badangpet, Hyderabad.",
        cuisineType: "Hyderabadi & North Indian",
        establishedYear: 2023,
        /**
         * Prefix for order and reservation ids. Single source of truth - both
         * are built from this in lib/ids.ts, so the two can never disagree.
         */
        idPrefix: "SJK",
        bannerNotice:
            "🔥 Fresh Dum Handis Daily · Lunch (11:30 AM – 3:30 PM) & Dinner (7:00 PM – 11:30 PM) · Free Street Parking",
    },

    currency: {
        symbol: "₹",
        code: "INR",
        placement: "prefix",
    },

    contact: {
        phone: "+91 7981901713",
        secondaryPhone: "+91 40 2938 4112",
        /**
         * THE WhatsApp number. The country code is REQUIRED.
         *
         * Formatting is flexible - lib/contact.ts strips "+" and spaces, so
         * both "+91 7981901713" and "917981901713" resolve to the same wa.me
         * target. But the country code is NOT optional: sanitisation removes
         * punctuation, it never adds "91", so omitting it produces links that
         * silently go nowhere.
         *
         * Single source of truth: order links, booking links, the contact page
         * button, the UPI id and the tel: hrefs all derive from this value.
         */
        whatsapp: "+91 7981901713",
        email: "hello@spicyandhotjunctionkitchen.in",
    },

    address: {
        shop: "Shop No 10",
        street: "Almasguda Rd, Hanuman Nagar",
        locality: "Badangpet",
        city: "Hyderabad",
        state: "Telangana",
        postalCode: "500113",
        country: "India",
        // Keep the trailing pincode here in step with `postalCode` above.
        // `e2e/contact.spec.ts` asserts it, because these two previously read
        // 500113 and 500112 respectively - two pincodes for one address, both
        // rendered publicly (contact page and the schema.org JSON-LD).
        full: "Shop No 10, Almasguda Rd, Hanuman Nagar, Hyderabad, Badangpet, Telangana 500113",
        landmark: "Near Hanuman Temple, Almasguda Main Junction",
        directionsNotes: {
            fromNorth:
                "From LB Nagar / Sagar Ring Rd: Approx. 12–15 mins via Badangpet main road.",
            fromSouth:
                "From Balapur / Chandrayangutta: Approx. 8–10 mins drive straight towards Almasguda.",
            parkingInfo:
                "Free street parking directly on both curbs along Almasguda Road outside the entrance.",
        },
    },

    googleMaps: {
        shareUrl: "https://share.google/ZGE2LbwhaIkwXfKNK2",
        searchUrl:
            "https://www.google.com/search?kgmid=/g/11xf2jzfwl&q=Spicy+hot+Junction+Kitchen",
        verifiedBadgeText: "Verified Google Business Profile",
    },

    timings: {
        lunch: "11:30 AM – 3:30 PM",
        dinner: "7:00 PM – 11:30 PM",
        days: "Open Daily (Monday – Sunday)",
        summary: "Daily Lunch & Dinner Service",
        timeSlots: {
            lunch: [
                "11:45 AM",
                "12:15 PM",
                "12:45 PM",
                "1:15 PM",
                "1:45 PM",
                "2:15 PM",
                "2:45 PM",
                "3:15 PM",
            ],
            dinner: [
                "7:15 PM",
                "7:45 PM",
                "8:15 PM",
                "8:45 PM",
                "9:15 PM",
                "9:45 PM",
                "10:15 PM",
                "10:45 PM",
                "11:15 PM",
            ],
        },
    },

    services: {
        takeaway: true,
        dineIn: true,
        delivery: false, // Can be set to true if delivery partner integration is added
        tableReservations: true,
    },

    pricing: {
        takeawayPackagingFee: 20,
        taxRatePercent: 0, // Set to 5 for 5% GST if billing requires it
        minOrderForDelivery: 200,
        deliveryFee: 40,
    },

    features: [
        {
            title: "Solo Dining Comfort",
            description:
                "Curated single-portion meal platters with complete sides. Fast turnover & zero awkwardness.",
            icon: "utensils",
        },
        {
            title: "Lunch & Dinner Service",
            description:
                "Slow-dum batches prepared twice daily for lunch (11:30–3:30) & dinner (7:00–11:30).",
            icon: "clock",
        },
        {
            title: "Free Street Parking",
            description:
                "Convenient open curbside parking right outside Shop No 7 along Almasguda Road.",
            icon: "car",
        },
        {
            title: "Good for Kids & Groups",
            description:
                "Spacious table configurations with mild spice options customized on request for children.",
            icon: "heart",
        },
    ],

    atmosphere: {
        badge: "Atmosphere: Casual & Welcoming",
        title: "Spacious Wooden Seating, Warm Lights & Aromas of Dum Handis",
        description:
            "At Spicy Junction Kitchen in Badangpet, Hyderabad, we built an unpretentious, welcoming culinary space where everyone feels at home—from a solo diner on lunch break to three generations dining together.",
        pillars: [
            {
                title: "Solo Dining Haven",
                badge: "Popular For",
                description:
                    "We take solo diners seriously. Our special Solo Biryani Platters come complete with boiled egg, chicken 65 quick bite, salan, raita, and salad—giving you the full Hyderabadi feast in a single-portion serving with swift service.",
                bulletPoint:
                    "Fast counter turnover · No awkward large minimums",
                icon: "utensils",
            },
            {
                title: "Lively Group Banquets",
                badge: "Crowd: Groups",
                description:
                    "Whether you are catching up with office peers over Friday lunch or hosting a weekend reunion of 12 people, our tables easily combine into expansive banquets. Shareable small plates and jumbo handis make passing plates seamless.",
                bulletPoint:
                    "Modular tables · Family packs & shareable starters",
                icon: "users",
            },
            {
                title: "Good for Kids & Families",
                badge: "Children Welcome",
                description:
                    "Indian dining is for the whole family. Our chefs happily prepare mild spice biryani portions and gentle paneer or corn quick bites for children. High chairs and friendly staff ensure parents can relax and enjoy dinner.",
                bulletPoint:
                    "Mild seasoning on request · High chairs available",
                icon: "heart",
            },
        ],
        parkingTitle: "Free Street Parking on Almasguda Road",
        parkingDescription:
            "Convenient curbside street parking is readily available directly in front of and adjacent to Shop No 7. No valet fees, no parking ticket hassles—pull right up for dining in or grabbing quick takeaway bags.",
    },

    heritage: {
        badge: "Our Kitchen Secret",
        title: "The Time-Honored Art of Hyderabadi Dum Cooking",
        description:
            "True Hyderabadi Biryani cannot be rushed on high heat. At Spicy Junction Kitchen, we marinate our chicken and mutton in curd, pounded ginger, garlic, and freshly roasted masala for hours before layering with parboiled aged basmati.",
        points: [
            {
                title: "Dough-Sealed Handis",
                description:
                    "Wet wheat dough seals the earthen pot rim so zero vapor escapes during the 45-minute dum cycle.",
                icon: "flame",
            },
            {
                title: "Pure Ghee & Saffron",
                description:
                    "Only authentic cow ghee and Kashmiri saffron strands are drizzled over the top rice layer.",
                icon: "shield",
            },
            {
                title: "Mirchi Ka Salan",
                description:
                    "Cooked from scratch with roasted peanuts, desiccated coconut, and fresh green chilies.",
                icon: "utensils",
            },
        ],
    },

    images: {
        hero: "/images/hero_hyderabadi_dum_biryani_1791709869533.jpg",
        soloPlatter: "/images/biryani_solo_platter_1791709890478.jpg",
        smallPlates:
            "/images/hyderabad_starters_small_plates_1791709913148.jpg",
        atmosphere: "/images/restaurant_casual_dining_1791709935010.jpg",
    },

    categories: [
        {
            id: "all",
            label: "All Offerings",
            description: "Everything from our kitchen",
        },
        {
            id: "biryani",
            label: "Hyderabadi Dum Biryani",
            description: "Handi-cooked aged basmati specialties",
        },
        {
            id: "solo-combos",
            label: "Solo Dining Combos",
            description: "Complete single-portion curated feasts",
        },
        {
            id: "small-plates",
            label: "Quick Bites & Small Plates",
            description: "Crispy starters & appetizers",
        },
        {
            id: "curries",
            label: "Curries & Breads",
            description: "Rich gravies & fresh flatbreads",
        },
        {
            id: "drinks-desserts",
            label: "Desserts & Beverages",
            description: "Traditional sweets & cooling coolers",
        },
    ],

    menu: [
        // --- BIRYANI DISHES ---
        {
            id: "biryani-special-chicken-dum",
            name: "Special Hyderabadi Chicken Dum Biryani",
            category: "biryani",
            categoryLabel: "Dum Biryani",
            description:
                "Aged long-grain basmati cooked with tender chicken cuts on dum with saffron, fried onions, and whole spices. Served with Mirchi Ka Salan & Dahi Raita.",
            price: 240,
            image: "/images/hero_hyderabadi_dum_biryani_1791709869533.jpg",
            dietary: "non-veg",
            spiceLevel: "medium",
            isPopular: true,
            serves: "1-2 persons (approx. 550g)",
        },
        {
            id: "biryani-mutton-dum",
            name: "Royal Nizami Mutton Dum Biryani",
            category: "biryani",
            categoryLabel: "Dum Biryani",
            description:
                "Slow-simmered tender baby goat mutton marinated in rich spices and mint, sealed in earthen handi. Rich, aromatic and deeply satisfying.",
            price: 360,
            image: "/images/hero_hyderabadi_dum_biryani_1791709869533.jpg",
            dietary: "non-veg",
            spiceLevel: "medium",
            isPopular: true,
            serves: "1-2 persons (approx. 580g)",
        },
        {
            id: "biryani-egg-dum",
            name: "Spicy Egg Dum Biryani",
            category: "biryani",
            categoryLabel: "Dum Biryani",
            description:
                "Double boiled country eggs tossed in roasted pepper masala, layered with fragrant saffron biryani rice. Quick, filling and flavorful.",
            price: 190,
            dietary: "egg",
            spiceLevel: "medium",
            serves: "1 person (approx. 500g)",
        },
        {
            id: "biryani-paneer-veg-dum",
            name: "Shahi Subz & Paneer Dum Biryani",
            category: "biryani",
            categoryLabel: "Dum Biryani",
            description:
                "Fresh malai paneer cubes, garden vegetables and golden birista slow-cooked with basmati rice and aromatic Kewra essence.",
            price: 210,
            dietary: "veg",
            spiceLevel: "mild",
            serves: "1-2 persons (approx. 520g)",
        },

        // --- SOLO DINING SPECIALS (Popular For Solo Dining) ---
        {
            id: "solo-chicken-biryani-combo",
            name: "Solo Dining Chicken Biryani Meal",
            category: "solo-combos",
            categoryLabel: "Solo Specials",
            description:
                "Curated single-portion Chicken Dum Biryani, 1 Boiled Egg, Mini Chicken 65 Quick Bite, Salan, Raita and Fresh Onion Lemon Salad.",
            price: 260,
            image: "/images/biryani_solo_platter_1791709890478.jpg",
            dietary: "non-veg",
            spiceLevel: "medium",
            isPopular: true,
            isSoloSpecial: true,
            serves: "Ideal for 1 person",
        },
        {
            id: "solo-quick-egg-box",
            name: "Solo Quick Bite Egg Biryani Box",
            category: "solo-combos",
            categoryLabel: "Solo Specials",
            description:
                "Single portion aromatic Dum Biryani rice with 2 spice-crusted boiled eggs, Salan, Raita, and crispy roasted papad.",
            price: 180,
            dietary: "egg",
            spiceLevel: "medium",
            isSoloSpecial: true,
            serves: "Ideal for 1 person",
        },
        {
            id: "solo-paneer-meal",
            name: "Solo Paneer Tikka Biryani Platter",
            category: "solo-combos",
            categoryLabel: "Solo Specials",
            description:
                "Portion of Veg Dum Biryani, 3 pcs Tandoori Paneer Tikka small plate, Dahi Raita, Salan, and Gulab Jamun dessert.",
            price: 230,
            dietary: "veg",
            spiceLevel: "mild",
            isSoloSpecial: true,
            serves: "Ideal for 1 person",
        },

        // --- QUICK BITES & SMALL PLATES ---
        {
            id: "small-chicken-65",
            name: "Hyderabadi Chicken 65 (Crispy Small Plate)",
            category: "small-plates",
            categoryLabel: "Quick Bites & Small Plates",
            description:
                "Boneless tender chicken tossed in spicy garlic red chili sauce, curry leaves, and tempered green chilies. The quintessential Hyderabad starter.",
            price: 190,
            image: "/images/hyderabad_starters_small_plates_1791709913148.jpg",
            dietary: "non-veg",
            spiceLevel: "fiery",
            isPopular: true,
            isQuickBite: true,
            isSmallPlate: true,
            serves: "2-3 persons shareable",
        },
        {
            id: "small-chilli-chicken",
            name: "Andhra Green Chilli Chicken Dry",
            category: "small-plates",
            categoryLabel: "Quick Bites & Small Plates",
            description:
                "Spicy chicken morsels sautéed with slit green chilies, cracked black pepper, and fresh coriander leaves.",
            price: 200,
            dietary: "non-veg",
            spiceLevel: "fiery",
            isQuickBite: true,
            isSmallPlate: true,
            serves: "2-3 persons shareable",
        },
        {
            id: "small-paneer-tikka-plate",
            name: "Tandoori Paneer Tikka Small Plate",
            category: "small-plates",
            categoryLabel: "Quick Bites & Small Plates",
            description:
                "Char-grilled cottage cheese cubes marinated in hung curd, carom seeds, and mustard oil, served with mint chutney and lemon wedges.",
            price: 180,
            image: "/images/hyderabad_starters_small_plates_1791709913148.jpg",
            dietary: "veg",
            spiceLevel: "mild",
            isSmallPlate: true,
            serves: "2 persons shareable",
        },
        {
            id: "small-veg-samosa-platter",
            name: "Crispy Samosa Quick Bite (3 Pcs)",
            category: "small-plates",
            categoryLabel: "Quick Bites & Small Plates",
            description:
                "Golden flaky pastry filled with spiced cumin potatoes and green peas, served with sweet tamarind and spicy mint dips.",
            price: 90,
            image: "/images/hyderabad_starters_small_plates_1791709913148.jpg",
            dietary: "veg",
            spiceLevel: "mild",
            isQuickBite: true,
            isSmallPlate: true,
            serves: "Quick snack for 1-2",
        },
        {
            id: "small-corn-pepper-fry",
            name: "Crispy Corn Pepper Fry (Small Plate)",
            category: "small-plates",
            categoryLabel: "Quick Bites & Small Plates",
            description:
                "Crispy sweet corn kernels tossed with crushed peppercorns, bell peppers, spring onion, and chaat spices.",
            price: 140,
            dietary: "veg",
            spiceLevel: "medium",
            isQuickBite: true,
            isSmallPlate: true,
            serves: "1-2 persons",
        },

        // --- CURRIES & BREADS (Dishes) ---
        {
            id: "curry-butter-chicken",
            name: "Old Delhi Style Butter Chicken",
            category: "curries",
            categoryLabel: "Curries & Dishes",
            description:
                "Tender chicken tikka simmered in creamy satin tomato makhani gravy enriched with butter and kasuri methi.",
            price: 240,
            dietary: "non-veg",
            spiceLevel: "mild",
            serves: "2 persons",
        },
        {
            id: "curry-mirchi-ka-salan-extra",
            name: "Traditional Mirchi Ka Salan (Side Dish)",
            category: "curries",
            categoryLabel: "Curries & Dishes",
            description:
                "Mild green bhavnagri peppers in roasted peanut, sesame, and coconut tamarind gravy. The soulmate of Hyderabadi Biryani.",
            price: 90,
            dietary: "veg",
            spiceLevel: "medium",
            serves: "1-2 persons",
        },
        {
            id: "bread-rumali-roti",
            name: "Handkerchief Rumali Roti (2 Pcs)",
            category: "curries",
            categoryLabel: "Curries & Dishes",
            description:
                "Paper-thin, soft whole wheat flatbread tossed on inverted iron wok.",
            price: 50,
            dietary: "veg",
            spiceLevel: "mild",
            serves: "1 person",
        },
        {
            id: "bread-butter-naan",
            name: "Butter Garlic Naan",
            category: "curries",
            categoryLabel: "Curries & Dishes",
            description:
                "Clay-oven baked fluffy bread brushed with roasted garlic and creamy dairy butter.",
            price: 60,
            dietary: "veg",
            spiceLevel: "mild",
            serves: "1 person",
        },

        // --- DESSERTS & DRINKS ---
        {
            id: "dessert-double-ka-meetha",
            name: "Hyderabadi Double Ka Meetha",
            category: "drinks-desserts",
            categoryLabel: "Desserts & Drinks",
            description:
                "Classic royal Hyderabadi bread pudding soaked in saffron cardamom milk, topped with pistachio slivers and silver vark.",
            price: 110,
            dietary: "veg",
            spiceLevel: "mild",
            isPopular: true,
            serves: "1 person",
        },
        {
            id: "drink-masala-chaas",
            name: "Cooling Masala Buttermilk (Chaas)",
            category: "drinks-desserts",
            categoryLabel: "Desserts & Drinks",
            description:
                "Fresh churned spiced yogurt drink with ginger, green chili, roasted cumin, and fresh mint leaves.",
            price: 50,
            dietary: "veg",
            spiceLevel: "mild",
            serves: "1 person (300ml)",
        },
    ],

    initialReviews: [
        {
            id: "g-rev-1",
            author: "Verified Diner on Google Maps",
            type: "Solo Diner",
            rating: 5,
            text: "Authentic Hyderabadi dum aroma and flavors on Almasguda Road. The solo dining biryani combo is well proportioned with egg, salan, raita and spicy chicken 65. Very quick service.",
            date: "Recent Google Review",
            source: "Google Maps",
            verifiedCustomer: true,
        },
        {
            id: "g-rev-2",
            author: "Local Family in Badangpet",
            type: "Family Group",
            rating: 5,
            text: "Great casual dining atmosphere for families. Free street parking right outside the shop made it so convenient. Mild spice option was helpful for the kids.",
            date: "Recent Google Review",
            source: "Google Maps",
            verifiedCustomer: true,
        },
        {
            id: "g-rev-3",
            author: "Takeaway Customer",
            type: "Takeaway Customer",
            rating: 5,
            text: "Takeaway was packed piping hot within 15 minutes in leak-resistant containers. Chicken was succulent and spiced thoroughly. Highly recommended in Hanuman Nagar.",
            date: "Recent Google Review",
            source: "Google Maps",
            verifiedCustomer: true,
        },
    ],

    faqs: [
        {
            question: "Do I need a reservation for lunch or dinner?",
            answer: "Walk-ins are always welcomed! We have ample casual seating for solo diners and regular groups. However, for large weekend groups (6+ guests), reserving a table online ensures your party is seated together immediately.",
        },
        {
            question: "How does Free Street Parking work outside?",
            answer: "There is complimentary, open curb street parking directly along Almasguda Road right in front of Shop No 7 and neighboring storefronts. It is safe, convenient, and easy for two-wheelers and cars.",
        },
        {
            question: "Are the dishes suitable for children?",
            answer: "Yes, very much so! We can make custom mild dum biryani rice or gentle Paneer Tikka and Veg Samosa small plates with negligible spice for kids. High chairs are also available.",
        },
        {
            question: "How fast is takeaway packaging prepared?",
            answer: "Takeaway orders typically take 15 to 20 minutes from the moment you place them. You can order online through our website bag or call ahead so it is hot and waiting when you arrive.",
        },
        {
            question: "What is the solo dining experience like?",
            answer: "Solo dining is one of our most popular offerings! We offer complete single-portion biryani meal platters with sides and quick bites so you do not need to order a massive family handi just for yourself.",
        },
    ],

    /**
     * ==============================================================================
     * INTEGRATIONS & DISPATCH CONFIGURATION
     * ==============================================================================
     * Connect your restaurant orders and table bookings to real communication channels:
     * 1. WhatsApp: Direct wa.me link generated with pre-formatted bill & customer info
     * 2. Google Sheets: Plug in your free Google Apps Script web app URL
     * 3. Custom Webhook: Plug in Zapier, Make, n8n, Formspree or your own API endpoint
     * 4. Email: Send notifications through an inbox dispatcher
     * ==============================================================================
     */
    integrations: {
        whatsappOrders: {
            enabled: true,
            // The number itself is NOT duplicated here. It lives once, in
            // `contact.whatsapp` above, and is read through lib/contact.ts.
            // Previously this held a second, conflicting number that silently
            // sent every order and booking to a different place than the one
            // the contact page advertised.
            promptDirectOpen: true,
        },
        // Optional: paste your Google Apps Script Web App URL or Formspree endpoint below
        googleSheetWebhookUrl: "",
        webhookUrl: "",
        notificationEmail: "hello@spicyandhotjunctionkitchen.in",
    },
};
