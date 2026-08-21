import type { InstagramDataProvider } from './InstagramDataProvider'
import type { InstagramMedia, InstagramProfile } from '../types'

export class MockInstagramDataProvider implements InstagramDataProvider {
  private demoProfiles: Record<string, InstagramProfile> = {
    demo_cafe: {
      username: 'demo_cafe',
      display_name: 'Artisan Cafe & Bakery | Hyderabad',
      bio: 'Fresh coffee, artisanal pastries & good vibes ☕🥐\nServing Banjara Hills, Hyderabad.\nVisit us today!',
      profile_image_url:
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
      category: 'Cafe / Bakery',
      website_url: 'https://demo-cafe.example.com',
      followers_count: 4280,
      following_count: 612,
      posts_count: 146,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'MOCK',
    },
    demo_salon: {
      username: 'demo_salon',
      display_name: 'Luxe Hair & Beauty Studio',
      bio: 'Premium Hair, Skin & Nail Care ✨\nAward-winning Stylists in Indiranagar, Bengaluru.\nBook your appointment below 👇',
      profile_image_url:
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80',
      category: 'Beauty Salon & Spa',
      website_url: 'https://luxesalon.example.com/booking',
      followers_count: 9850,
      following_count: 420,
      posts_count: 280,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'MOCK',
    },
    demo_fitness: {
      username: 'demo_fitness',
      display_name: 'Pulse HIIT & Strength Gym',
      bio: 'Transform your body & mind 💪\nHIIT, CrossFit & Personal Training | Bandra West, Mumbai\nDM "TRANSFORM" for free trial pass!',
      profile_image_url:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80',
      category: 'Gym & Fitness Center',
      website_url: 'https://pulsefitness.example.com',
      followers_count: 15400,
      following_count: 890,
      posts_count: 412,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'MOCK',
    },
    demo_realestate: {
      username: 'demo_realestate',
      display_name: 'Apex Luxury Living | Real Estate',
      bio: 'Premium Residential Homes & High-Return Commercial Properties in Delhi NCR 🏙️\nTrusted real estate consultancy.\nContact us today for private tours.',
      profile_image_url:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80',
      category: 'Real Estate Agency',
      website_url: 'https://apexproperties.example.com',
      followers_count: 6720,
      following_count: 310,
      posts_count: 94,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'MOCK',
    },
    demo_clothing: {
      username: 'demo_clothing',
      display_name: 'Urban Thread Co.',
      bio: 'Sustainable Streetwear & Essentials 🌿👕\nDesigned & Handcrafted in Chennai.\nWorldwide Shipping ✈️ Shop new drops now!',
      profile_image_url:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=80',
      category: 'Clothing Brand',
      website_url: 'https://urbanthread.example.com',
      followers_count: 22100,
      following_count: 150,
      posts_count: 530,
      is_business_account: true,
      is_creator_account: true,
      data_source: 'MOCK',
    },
  }

  async getProfile(username: string): Promise<InstagramProfile> {
    const key = username.toLowerCase().replace(/^@/, '')
    if (this.demoProfiles[key]) {
      return this.demoProfiles[key]
    }

    // Dynamic generator for arbitrary usernames
    const formattedName = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    return {
      username: key,
      display_name: `${formattedName} | Official`,
      bio: `Welcome to ${formattedName}'s official Instagram page ✨\nSharing daily updates, tips & offers.\nConnect with us!`,
      profile_image_url:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      category: 'Business & Brand',
      website_url: `https://${key}.com`,
      followers_count: 3450,
      following_count: 480,
      posts_count: 112,
      is_business_account: true,
      is_creator_account: false,
      data_source: 'MOCK',
    }
  }

  async getMedia(username: string): Promise<InstagramMedia[]> {
    const key = username.toLowerCase().replace(/^@/, '')

    if (key === 'demo_cafe') {
      return this.generateCafeMedia()
    } else if (key === 'demo_salon') {
      return this.generateSalonMedia()
    } else if (key === 'demo_fitness') {
      return this.generateFitnessMedia()
    } else if (key === 'demo_realestate') {
      return this.generateRealEstateMedia()
    } else if (key === 'demo_clothing') {
      return this.generateClothingMedia()
    }

    return this.generateGenericMedia(key)
  }

  private generateCafeMedia(): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    // 16 posts with strong Reels performance, weak bio CTA, irregular schedule
    const items = [
      { type: 'REEL', likes: 840, comments: 62, views: 14200, cat: 'BEHIND_THE_SCENES', daysAgo: 1, caption: 'Behind the espresso machine: How we craft our signature hazelnut mocha! ☕🔥' },
      { type: 'REEL', likes: 1250, comments: 94, views: 22100, cat: 'EDUCATIONAL', daysAgo: 3, caption: '3 secret coffee hacks every cold brew lover needs to know! 💡☕' },
      { type: 'IMAGE', likes: 110, comments: 8, views: 0, cat: 'PROMOTIONAL', daysAgo: 9, caption: 'Flat 10% off on all sourdough sandwiches this Tuesday! Drop by!' },
      { type: 'REEL', likes: 980, comments: 75, views: 18900, cat: 'ENTERTAINMENT', daysAgo: 14, caption: 'When the first sip hits after a long Monday morning 😂 #CafeRelatable' },
      { type: 'CAROUSEL', likes: 210, comments: 14, views: 0, cat: 'PRODUCT', daysAgo: 22, caption: 'Our fresh pastry lineup for the weekend. Which one are you grabbing first? 🥐' },
      { type: 'REEL', likes: 1450, comments: 112, views: 29000, cat: 'EDUCATIONAL', daysAgo: 26, caption: 'Why Arabica beans taste so much smoother than Robusta beans explained in 30 seconds!' },
      { type: 'IMAGE', likes: 95, comments: 6, views: 0, cat: 'OTHER', daysAgo: 35, caption: 'Rainy days call for warm lattes. Stay cozy!' },
      { type: 'IMAGE', likes: 130, comments: 9, views: 0, cat: 'PROMOTIONAL', daysAgo: 48, caption: 'Weekend special menu now live. Visit us today!' },
      { type: 'REEL', likes: 780, comments: 51, views: 13400, cat: 'BEHIND_THE_SCENES', daysAgo: 52, caption: 'Making 100 croissants from scratch at 5 AM 🥐✨' },
      { type: 'CAROUSEL', likes: 190, comments: 11, views: 0, cat: 'TESTIMONIAL', daysAgo: 58, caption: '"Best almond latte in Hyderabad!" — Thank you Rohan for the lovely review ❤️' },
      { type: 'IMAGE', likes: 88, comments: 4, views: 0, cat: 'PROMOTIONAL', daysAgo: 65, caption: 'Pre-order your birthday cakes 48 hrs in advance.' },
      { type: 'REEL', likes: 1120, comments: 84, views: 20500, cat: 'ENTERTAINMENT', daysAgo: 72, caption: 'Tag that friend who cannot function without coffee! 👇' },
      { type: 'IMAGE', likes: 105, comments: 7, views: 0, cat: 'PRODUCT', daysAgo: 80, caption: 'Matcha season is here! 🍵 Come try our Iced Vanilla Matcha Latte.' },
      { type: 'IMAGE', likes: 92, comments: 5, views: 0, cat: 'PROMOTIONAL', daysAgo: 90, caption: 'Open all days 8 AM to 11 PM.' },
      { type: 'CAROUSEL', likes: 165, comments: 12, views: 0, cat: 'COMMUNITY', daysAgo: 100, caption: 'Highlights from our weekend Latte Art Workshop! 🎨☕' },
    ]

    items.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - item.daysAgo * 86400000)
      media.push({
        external_media_id: `cafe_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/cafe_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.15),
        save_count: Math.floor(item.likes * 0.1),
        engagement_rate: Number((((item.likes + item.comments) / 4280) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }

  private generateSalonMedia(): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    // 16 posts with high promotional intensity, strong visuals, low CTAs
    const items = [
      { type: 'IMAGE', likes: 140, comments: 9, views: 0, cat: 'PROMOTIONAL', daysAgo: 2, caption: 'Balayage perfection on our gorgeous client today! ✨ Book your hair transformation!' },
      { type: 'IMAGE', likes: 125, comments: 7, views: 0, cat: 'PROMOTIONAL', daysAgo: 4, caption: 'Glossy autumn hair tones 🍂 Call us for appointments.' },
      { type: 'IMAGE', likes: 160, comments: 12, views: 0, cat: 'PRODUCT', daysAgo: 7, caption: 'Restocked premium Kerastase hair serums! Available in store.' },
      { type: 'CAROUSEL', likes: 210, comments: 15, views: 0, cat: 'PROMOTIONAL', daysAgo: 10, caption: 'Bridal makeup trial highlights 👰‍♀️ Bookings open for wedding season!' },
      { type: 'IMAGE', likes: 115, comments: 6, views: 0, cat: 'PROMOTIONAL', daysAgo: 14, caption: 'Hydra facial session in progress. Experience glowing skin.' },
      { type: 'REEL', likes: 320, comments: 18, views: 4200, cat: 'BEHIND_THE_SCENES', daysAgo: 18, caption: 'Quick glance inside our luxury nail art lounge 💅' },
      { type: 'IMAGE', likes: 135, comments: 8, views: 0, cat: 'PROMOTIONAL', daysAgo: 22, caption: 'Festive offer: 20% off on all hair combo services this week!' },
      { type: 'IMAGE', likes: 102, comments: 5, views: 0, cat: 'PROMOTIONAL', daysAgo: 27, caption: 'Weekend makeover slots available.' },
      { type: 'CAROUSEL', likes: 180, comments: 11, views: 0, cat: 'TESTIMONIAL', daysAgo: 32, caption: 'Client love! Swati looking stunning post her keratin treatment ❤️' },
      { type: 'IMAGE', likes: 98, comments: 4, views: 0, cat: 'PROMOTIONAL', daysAgo: 38, caption: 'Nail extensions starting at ₹1,499. Book now.' },
      { type: 'REEL', likes: 290, comments: 14, views: 3800, cat: 'PROMOTIONAL', daysAgo: 45, caption: 'From dull to dazzling! Watch this haircut makeover 🔥' },
      { type: 'IMAGE', likes: 110, comments: 7, views: 0, cat: 'PROMOTIONAL', daysAgo: 50, caption: 'Professional scalp spa treatment for healthy hair growth.' },
      { type: 'IMAGE', likes: 89, comments: 3, views: 0, cat: 'PROMOTIONAL', daysAgo: 58, caption: 'Monsoon hair care specials available.' },
      { type: 'CAROUSEL', likes: 150, comments: 9, views: 0, cat: 'PRODUCT', daysAgo: 65, caption: 'Organic shampoo essentials now available at Luxe Studio.' },
      { type: 'IMAGE', likes: 120, comments: 8, views: 0, cat: 'PROMOTIONAL', daysAgo: 72, caption: 'Glam makeup for your special evening out ✨' },
    ]

    items.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - item.daysAgo * 86400000)
      media.push({
        external_media_id: `salon_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/salon_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.08),
        save_count: Math.floor(item.likes * 0.06),
        engagement_rate: Number((((item.likes + item.comments) / 9850) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }

  private generateFitnessMedia(): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    // High engagement rate, high Reels, but irregular gaps between posting bursts
    const items = [
      { type: 'REEL', likes: 1850, comments: 142, views: 38000, cat: 'EDUCATIONAL', daysAgo: 1, caption: 'Stop making these 3 mistakes on your squat form! Save for your leg day 🏋️‍♂️' },
      { type: 'REEL', likes: 2100, comments: 168, views: 45000, cat: 'AUTHORITY', daysAgo: 2, caption: 'How to build 3D shoulders without destroying your rotator cuff! 🔥' },
      { type: 'REEL', likes: 1420, comments: 98, views: 29000, cat: 'TESTIMONIAL', daysAgo: 3, caption: 'Karan lost 14 kg in 12 weeks with our HIIT program! Here is his full breakdown 💪' },
      { type: 'IMAGE', likes: 410, comments: 24, views: 0, cat: 'COMMUNITY', daysAgo: 18, caption: 'Saturday morning 7 AM sweaty community workout squad! 🔥' },
      { type: 'REEL', likes: 1950, comments: 135, views: 41000, cat: 'EDUCATIONAL', daysAgo: 19, caption: 'The ultimate high-protein post-workout smoothie under 400 calories 🥤' },
      { type: 'REEL', likes: 1680, comments: 110, views: 33000, cat: 'ENTERTAINMENT', daysAgo: 38, caption: 'POV: You said "just 5 more minutes of cardio" 😂' },
      { type: 'CAROUSEL', likes: 620, comments: 45, views: 0, cat: 'EDUCATIONAL', daysAgo: 39, caption: 'Full upper body dumbbell workout guide for busy professionals 📌' },
      { type: 'REEL', likes: 2400, comments: 190, views: 52000, cat: 'EDUCATIONAL', daysAgo: 60, caption: 'Fat loss vs Weight loss: What actually happens inside your body 🔥' },
      { type: 'IMAGE', likes: 380, comments: 18, views: 0, cat: 'PROMOTIONAL', daysAgo: 61, caption: 'New batch starting Monday! Only 4 slots left.' },
      { type: 'REEL', likes: 1350, comments: 88, views: 26000, cat: 'BEHIND_THE_SCENES', daysAgo: 82, caption: 'Behind the scenes at our monthly trainer fitness challenge 🏆' },
    ]

    items.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - item.daysAgo * 86400000)
      media.push({
        external_media_id: `fitness_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/fitness_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.2),
        save_count: Math.floor(item.likes * 0.25),
        engagement_rate: Number((((item.likes + item.comments) / 15400) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }

  private generateRealEstateMedia(): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    // Strong profile bio & authority, but lower creative quality, zero Reels
    const items = [
      { type: 'CAROUSEL', likes: 145, comments: 12, views: 0, cat: 'PRODUCT', daysAgo: 3, caption: '4 BHK Luxury Apartment in Greater Noida. 3200 sq.ft with private terrace garden. DM for pricing.' },
      { type: 'IMAGE', likes: 98, comments: 6, views: 0, cat: 'PROMOTIONAL', daysAgo: 7, caption: 'Commercial retail spaces available for lease in Golf Course Road Gurgaon.' },
      { type: 'CAROUSEL', likes: 160, comments: 14, views: 0, cat: 'EDUCATIONAL', daysAgo: 12, caption: '5 key factors to check before buying your first investment property in Delhi NCR 🏡' },
      { type: 'IMAGE', likes: 85, comments: 4, views: 0, cat: 'TESTIMONIAL', daysAgo: 17, caption: 'Congratulations to Mr. Verma on handing over the keys to his dream penthouse in Dwarka Expressway 🎉' },
      { type: 'IMAGE', likes: 110, comments: 8, views: 0, cat: 'PRODUCT', daysAgo: 24, caption: 'Exclusive gated villa community with private pool and club facilities.' },
      { type: 'CAROUSEL', likes: 130, comments: 9, views: 0, cat: 'AUTHORITY', daysAgo: 30, caption: 'Delhi NCR real estate market report Q3: Trends & growth predictions.' },
      { type: 'IMAGE', likes: 78, comments: 3, views: 0, cat: 'PROMOTIONAL', daysAgo: 36, caption: 'Book a site visit with our team this weekend.' },
      { type: 'IMAGE', likes: 92, comments: 5, views: 0, cat: 'PRODUCT', daysAgo: 45, caption: 'Ready to move 3 BHK apartments near cyber hub.' },
      { type: 'CAROUSEL', likes: 115, comments: 7, views: 0, cat: 'EDUCATIONAL', daysAgo: 52, caption: 'Understanding home loan interest rates & tax benefits under Section 24.' },
      { type: 'IMAGE', likes: 82, comments: 4, views: 0, cat: 'PROMOTIONAL', daysAgo: 60, caption: 'Prime commercial plot available in Sector 62 Noida.' },
    ]

    items.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - item.daysAgo * 86400000)
      media.push({
        external_media_id: `re_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/re_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.05),
        save_count: Math.floor(item.likes * 0.12),
        engagement_rate: Number((((item.likes + item.comments) / 6720) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }

  private generateClothingMedia(): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    // Strong visual aesthetics, high posting consistency, low educational value
    const items = [
      { type: 'REEL', likes: 1450, comments: 88, views: 24000, cat: 'ENTERTAINMENT', daysAgo: 1, caption: 'Styling our oversize heavy cotton hoodie 3 different ways 🔥 Drop 04 live now!' },
      { type: 'CAROUSEL', likes: 980, comments: 45, views: 0, cat: 'PRODUCT', daysAgo: 2, caption: 'Minimalist Earth Tone Oversize Tees 🌿 100% Organic Cotton. Swipe for details.' },
      { type: 'IMAGE', likes: 720, comments: 32, views: 0, cat: 'PRODUCT', daysAgo: 4, caption: 'Model wearing the Urban Cargo Pants in Olive Green. Shop link in bio.' },
      { type: 'REEL', likes: 1820, comments: 115, views: 31000, cat: 'BEHIND_THE_SCENES', daysAgo: 6, caption: 'Inside our Chennai design studio: From sketch to final sample ✂️' },
      { type: 'CAROUSEL', likes: 850, comments: 38, views: 0, cat: 'PRODUCT', daysAgo: 7, caption: 'New Drop Preview: Vintage Acid Wash Collection launching Friday at 6 PM!' },
      { type: 'IMAGE', likes: 640, comments: 26, views: 0, cat: 'COMMUNITY', daysAgo: 9, caption: 'Spotted: @aravind wearing our Signature Denim Jacket in Bangalore ⚡' },
      { type: 'REEL', likes: 1250, comments: 72, views: 21000, cat: 'ENTERTAINMENT', daysAgo: 11, caption: 'Packing 150 streetwear orders for dispatch today! Thank you for the love ❤️' },
      { type: 'IMAGE', likes: 590, comments: 21, views: 0, cat: 'PROMOTIONAL', daysAgo: 13, caption: 'Free shipping across India on orders above ₹1,999. Use code: FREESHIP' },
      { type: 'CAROUSEL', likes: 780, comments: 34, views: 0, cat: 'PRODUCT', daysAgo: 15, caption: 'The Everyday Heavyweight Tee details: 240 GSM, preshrunk, drop shoulder fit.' },
      { type: 'REEL', likes: 1620, comments: 95, views: 27000, cat: 'BEHIND_THE_SCENES', daysAgo: 17, caption: 'Behind the scenes at our beach lookbook shoot 📸' },
    ]

    items.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - item.daysAgo * 86400000)
      media.push({
        external_media_id: `apparel_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/apparel_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.12),
        save_count: Math.floor(item.likes * 0.18),
        engagement_rate: Number((((item.likes + item.comments) / 22100) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }

  private generateGenericMedia(username: string): InstagramMedia[] {
    const media: InstagramMedia[] = []
    const now = new Date()

    const templates = [
      { type: 'REEL', likes: 450, comments: 32, views: 8900, cat: 'EDUCATIONAL', caption: '3 key tips to elevate your presence on Instagram!' },
      { type: 'IMAGE', likes: 180, comments: 14, views: 0, cat: 'PROMOTIONAL', caption: 'Special discount available for our Instagram community this week.' },
      { type: 'CAROUSEL', likes: 290, comments: 21, views: 0, cat: 'PRODUCT', caption: 'Explore our latest collection & features. Swipe through!' },
      { type: 'REEL', likes: 620, comments: 48, views: 12400, cat: 'BEHIND_THE_SCENES', caption: 'A quick day in the life behind our brand operations ✨' },
      { type: 'IMAGE', likes: 160, comments: 11, views: 0, cat: 'TESTIMONIAL', caption: '"Outstanding experience working with this team!" — Client Review' },
      { type: 'CAROUSEL', likes: 240, comments: 18, views: 0, cat: 'EDUCATIONAL', caption: 'Common mistakes to avoid when scaling your business online 📌' },
      { type: 'REEL', likes: 510, comments: 39, views: 9800, cat: 'ENTERTAINMENT', caption: 'Tag someone who needs to see this today! 👇' },
      { type: 'IMAGE', likes: 140, comments: 8, views: 0, cat: 'COMMUNITY', caption: 'Happy weekend from our team to yours!' },
      { type: 'IMAGE', likes: 195, comments: 15, views: 0, cat: 'PROMOTIONAL', caption: 'Book a consultation session with us today.' },
      { type: 'CAROUSEL', likes: 275, comments: 22, views: 0, cat: 'PRODUCT', caption: 'New features unlocked. Here is everything you need to know.' },
    ]

    templates.forEach((item, idx) => {
      const pubDate = new Date(now.getTime() - (idx * 5 + 1) * 86400000)
      media.push({
        external_media_id: `${username}_media_${idx + 1}`,
        media_type: item.type as any,
        media_url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80`,
        thumbnail_url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80`,
        caption: item.caption,
        permalink: `https://instagram.com/p/${username}_${idx + 1}`,
        published_at: pubDate.toISOString(),
        like_count: item.likes,
        comment_count: item.comments,
        view_count: item.views,
        share_count: Math.floor(item.likes * 0.1),
        save_count: Math.floor(item.likes * 0.1),
        engagement_rate: Number((((item.likes + item.comments) / 3450) * 100).toFixed(2)),
        content_category: item.cat as any,
      })
    })

    return media
  }
}
