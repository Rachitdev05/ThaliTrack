export const dietPlans = [
  {
    id: "veg-weight-loss",
    title: "Pure Veg Weight Loss",
    subtitle: "Low calorie, high fiber Indian meals for shedding fat.",
    coverImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    tag: "Veg",
    duration: "1 week",
    color: "green",
    categories: [
      {
        title: "Breakfast Options",
        items: [
          { 
            name: "Oats with Milk & Almonds", 
            image: "https://www.zestandzing.com/cdn/shop/articles/Photo_29-01-2018_9_27_01_am_69823529-a582-440b-8f09-3b1a0101492e_1280x.jpg?v=1768909908",
            description: "A fiber-rich start to your day that keeps you full longer.",
            ingredients: [
                "30g Rolled Oats",
                "200ml Skimmed Milk / Almond Milk",
                "5 Soaked Almonds",
                "1 tsp Chia Seeds",
                "No Sugar (Use Stevia if needed)"
            ],
            nutrition: {
                calories: 300, protein: 12, carbs: 40, fat: 8,
                fiber: "6g", sugar: "4g", calcium: "250mg", iron: "2mg", magnesium: "45mg"
            }
          },
          { 
            name: "Daliya (Broken Wheat) Khichdi", 
            image: "https://i.ytimg.com/vi/HU4BzemuzAs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCAZIHfHJ9bjKwrCepKVZQitdgltg",
            description: "Traditional savory porridge loaded with seasonal veggies.",
            ingredients: [
                "40g Daliya (Broken Wheat)",
                "1/2 Carrot (Chopped)",
                "1/4 cup Green Peas",
                "1 tsp Ghee",
                "Pinch of Turmeric & Jeera"
            ],
            nutrition: {
                calories: 280, protein: 10, carbs: 48, fat: 6,
                fiber: "8g", sugar: "2g", calcium: "40mg", iron: "1.5mg", magnesium: "30mg"
            }
          }
        ]
      },
      {
        title: "Lunch Options",
        items: [
          { 
            name: "2 Roti + Paneer Bhurji + Dal", 
            image:  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUqnKe4ZmMSzi30b3ZmqMC8YEu5Yx-RcilDw&s",
            description: "A balanced Indian thali with complex carbs and high quality protein.",
            ingredients: [
                "2 Whole Wheat Rotis (No Oil)",
                "100g Low Fat Paneer (Crumbled)",
                "1 Bowl Yellow Dal Tadka (Less Oil)",
                "Cucumber Salad"
            ],
            nutrition: {
                calories: 500, protein: 25, carbs: 60, fat: 18,
                fiber: "12g", sugar: "3g", calcium: "400mg", iron: "3.5mg", magnesium: "80mg"
            }
          },
          { 
            name: "Besan Chilla with Mint Chutney", 
            image:  "https://ministryofcurry.com/wp-content/uploads/2024/02/besan-chilla-2-500x375.jpg",
            description: "Savory gram flour pancakes, perfect for a light but protein-heavy lunch.",
            ingredients: [
                "2 Besan Chillas (Gram Flour)",
                "Onion, Tomato, Coriander Mix",
                "1 tbsp Mint Chutney",
                "1 tsp Oil for cooking"
            ],
            nutrition: {
                calories: 250, protein: 14, carbs: 30, fat: 8,
                fiber: "5g", sugar: "1g", calcium: "30mg", iron: "2mg", magnesium: "40mg"
            }
          }
        ]
      },
      {
        title: "Dinner Options",
        items: [
          { 
            name: "Soya Chunk Pulao", 
            image:  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFMFTM6ZIB-P2yDc0QDx4cVrPCe__ut9Gwig&s" ,
            description: "One-pot meal packed with plant-based protein.",
            ingredients: [
                "50g Soya Chunks",
                "1/2 cup Basmati Rice",
                "Whole Spices (Cardamom, Clove)",
                "1 tsp Ghee"
            ],
            nutrition: {
                calories: 450, protein: 20, carbs: 65, fat: 10,
                fiber: "9g", sugar: "0g", calcium: "150mg", iron: "6mg", magnesium: "90mg"
            }
          },
          { 
            name: "Rajma Chawal (Portion Controlled)", 
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrZZYV9Eu13fxu8qXT98ovX6SrG3hGOtpqPw&s" ,
            description: "Comfort food cooked with less oil and more spices.",
            ingredients: [
                "1 Bowl Rajma Curry",
                "1/2 Bowl Steamed Rice",
                "Onion Rings",
                "Lemon Wedge"
            ],
            nutrition: {
                calories: 400, protein: 12, carbs: 70, fat: 5,
                fiber: "10g", sugar: "1g", calcium: "80mg", iron: "4mg", magnesium: "60mg"
            }
          }
        ]
      }
    ]
  },
  // ... (Keep the Non-Veg and Detox plans structure similar)
  {
    id: "nonveg-muscle",
    title: "High Protein Muscle",
    subtitle: "Lean meats and eggs to maximize muscle growth.",
    coverImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    tag: "Non-Veg",
    duration: "1 week",
    color: "red",
    categories: [
      {
        title: "Breakfast Options",
        items: [
          { 
            name: "3 Boiled Eggs + Toast", 
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL4T8tFe9bKFdgWEYaVMSkZg4EGxWAnrrnLg&s",
            description: "Classic bodybuilder breakfast.",
            ingredients: ["3 Large Eggs (Boiled)", "1 Slice Multigrain Toast", "Black Pepper"],
            nutrition: { calories: 350, protein: 18, carbs: 15, fat: 20,
               fiber: "2g", sugar: "1g", calcium: "80mg", iron: "3mg", magnesium: "20mg" }
          },
          { 
             name: "Boiled Chicken & Rice", 
             image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCsvQxqcbiwd3wYf3YF331482iUDBh1YBUA&s",
             description: "Boiled Chicken with Boiled White Rice",
             ingredients: ["250 gram Chicken Breast Egg", "100 gram White Rice", "Spinach"],
             nutrition: { calories: 400, protein: 30, carbs: 5, fat: 18, 
              fiber: "1g", sugar: "0g", calcium: "100mg", iron: "4mg", magnesium: "30mg" }
          }
        ]
      },
      // ... Add Lunch/Dinner similarly with dummy nutrition data if needed
       {
        title: "Lunch Options",
        items: [
          { name: "Chicken Curry + 2 Roti",
             image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Jpjt4HDOJc0EOKFgguwNVAkZs0D35KA69w&s",
              ingredients: ["150g Chicken", "2 Roti"], 
              nutrition: { calories: 500, protein: 30, carbs: 40, fat: 15,
                fiber: "8g", sugar: "2g", calcium: "40mg", iron: "1.5mg", magnesium: "30mg"
                } 
            },
              { name: "Egg Bhurji + Roti", protein: 18, cals: 400,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQvi-vCWqn-1wI4_GotkQgVn_iDI2FNIU7Tg&s",
                ingredients: ["3 Whole eggs", "2 Roti"],
                nutrition: { calories: 500, protein: 30, carbs: 40, fat: 15 ,
                  fiber: "8g", sugar: "2g", calcium: "40mg", iron: "1.5mg", magnesium: "30mg"
                  } 
                 
                 } // Indian egg dish 
        ]
      },
      {
        title: "Dinner Options",
        items: [
          { name: "Grilled Fish Salad", protein: 25, cals: 300,
             image: "https://i0.wp.com/afrovitalityeats.com/wp-content/uploads/2018/11/Mixed-green-salad-with-Tilapia.jpg?resize=1200%2C1200&ssl=1",
             ingredients: ["300 Gram Fish Meat", "Cucumber","Tomato","Brocli","green Vegis"],
              nutrition: { calories: 500, protein: 30, carbs: 40, fat: 15  ,
                fiber: "8g", sugar: "2g", calcium: "40mg", iron: "1.5mg", magnesium: "30mg"
               }       
             },
          { name: "Egg Omelettte", protein: 20, cals: 300,
             image: "https://aayanshkitchen.com/wp-content/uploads/2023/12/Egg-Omelette.jpg",
              ingredients: ["2 Whole eggs & 2 egg whites", "Tata Salt","Red chili Powder","zira","Desi Ghee"],
               nutrition: { calories: 500, protein: 30, carbs: 40, fat: 15  ,
                fiber: "8g", sugar: "2g", calcium: "40mg", iron: "1.5mg", magnesium: "30mg"
                }    
             }
        ]
      }


    ]
  },
  {
      id: "detox-cleanse",
      title: "7-Day Detox",
      subtitle: "Light, refreshing meals.",
      coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      tag: "Detox",
      duration: "1 week",
      color: "blue",
      categories: [
        {
          title: "Daily Meals",
          items: [
            { name: "Green Smoothie",
               image:  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHqWWge9x5HL-88Ax3mJ1IhgN3meBvNIOh4Q&s",
                ingredients: ["Spinach", "Apple", "Cucumber"],
               nutrition: { calories: 150, protein: 2, carbs: 30, fat: 0,
                fiber: "1g", sugar: "0g", calcium: "100mg", iron: "4mg", magnesium: "30mg"
                }
               }
          ]
        }
      ]
  }
];