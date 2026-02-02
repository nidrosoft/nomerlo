export interface FeaturedProperty {
  id: string;
  name: string;
  address: string;
  property_type: string;
  photos?: string[];
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
}

export const createDemoProperties = (): FeaturedProperty[] => {
  return [
    {
      id: "demo-1",
      name: "Cascading Waters Villa of Serenity",
      address: "3891 Ranchview Dr. Richardson, California",
      property_type: "house",
      price: 5400,
      bedrooms: 5,
      bathrooms: 6,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-2",
      name: "Starlit Cove Private Villa Retreat",
      address: "3891 Ranchview Dr. Richardson, California",
      property_type: "house",
      price: 6200,
      bedrooms: 6,
      bathrooms: 8,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-3",
      name: "Golden Sands Haven by the Bay",
      address: "3891 Ranchview Dr. Richardson, California",
      property_type: "apartment",
      price: 4800,
      bedrooms: 4,
      bathrooms: 5,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-4",
      name: "Enchanted Garden View Villa Retreat",
      address: "3891 Ranchview Dr. Richardson, California",
      property_type: "apartment",
      price: 5500,
      bedrooms: 5,
      bathrooms: 6,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-5",
      name: "Sunset Ridge Modern Home",
      address: "1234 Sunset Blvd, Los Angeles, CA",
      property_type: "house",
      price: 7200,
      bedrooms: 4,
      bathrooms: 5,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-6",
      name: "Urban Oasis Penthouse",
      address: "789 City Center, New York, NY",
      property_type: "apartment",
      price: 9500,
      bedrooms: 3,
      bathrooms: 4,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-7",
      name: "Lakeside Family Retreat",
      address: "456 Lakeview Dr, Austin, TX",
      property_type: "house",
      price: 6700,
      bedrooms: 5,
      bathrooms: 7,
      photos: ["/images/featured-listing.png"],
    },
    {
      id: "demo-8",
      name: "Downtown Executive Loft",
      address: "321 Business Rd, Chicago, IL",
      property_type: "apartment",
      price: 8300,
      bedrooms: 2,
      bathrooms: 3,
      photos: ["/images/featured-listing.png"],
    },
  ];
};
