/* Ancestra Cafe menu transcribed from the two menu-board images on ancestracafe.ph.
   Descriptions are copied/paraphrased from the board. This ordering/cart is a student-project demo. */
const MENU = [
  // Coffee (hot / iced)
  {
    id: "c1",
    name: "Americano",
    cat: "Coffee",
    group: "drink",
    price: 120,
    emoji: "â˜•",
    image: "images/menu/americano.jpg",
    desc: "Americano (hot / iced).",
    tags: [],
  },
  {
    id: "c2",
    name: "Latte / Cappuccino",
    cat: "Coffee",
    group: "drink",
    price: 145,
    emoji: "â˜•",
    image: "images/menu/latte-cappuccino.jpg",
    desc: "Latte / cappuccino (hot / iced).",
    tags: [],
  },
  {
    id: "c3",
    name: "White Mocha",
    cat: "Coffee",
    group: "drink",
    price: 180,
    emoji: "â˜•",
    image: "images/menu/white-mocha.jpg",
    desc: "White mocha (hot / iced).",
    tags: [],
  },
  {
    id: "c4",
    name: "Salted Caramel Latte",
    cat: "Coffee",
    group: "drink",
    price: 170,
    emoji: "â˜•",
    image: "images/menu/salted-caramel-latte.jpg",
    desc: "Salted caramel latte (hot / iced).",
    tags: [],
  },
  {
    id: "c5",
    name: "Macadamia Latte",
    cat: "Coffee",
    group: "drink",
    price: 170,
    emoji: "â˜•",
    image: "images/menu/macadamia-latte.jpg",
    desc: "Macadamia latte (hot / iced).",
    tags: [],
  },
  {
    id: "c6",
    name: "Tableya Mocha",
    cat: "Coffee",
    group: "drink",
    price: 170,
    emoji: "â˜•",
    image: "images/menu/tableya-mocha.jpg",
    desc: "Tableya mocha (hot / iced).",
    tags: [],
  },
  {
    id: "c7",
    name: "Coconut Latte",
    cat: "Coffee",
    group: "drink",
    price: 180,
    emoji: "â˜•",
    image: "images/menu/coconut-latte.jpg",
    desc: "Coconut latte (hot / iced).",
    tags: [],
  },
  {
    id: "c8",
    name: "Ube Spanish Latte",
    cat: "Coffee",
    group: "drink",
    price: 180,
    emoji: "â˜•",
    image: "images/menu/ube-spanish-latte.jpg",
    desc: "Ube Spanish latte (hot / iced).",
    tags: [],
  },
  {
    id: "c9",
    name: "Cold Brew Black",
    cat: "Coffee",
    group: "drink",
    price: 160,
    emoji: "ðŸ§Š",
    image: "images/menu/cold-brew-black.jpg",
    desc: "Cold brew black.",
    tags: [],
  },
  {
    id: "c10",
    name: "Latik Foam Cold Brew",
    cat: "Coffee",
    group: "drink",
    price: 170,
    emoji: "ðŸ§Š",
    image: "images/menu/latik-foam-cold-brew.jpg",
    desc: "Cold brew with latik foam.",
    tags: [],
  },
  {
    id: "c11",
    name: "Extra Espresso Shot",
    cat: "Coffee",
    group: "addon",
    price: 70,
    emoji: "â˜•",
    image: "images/menu/extra-espresso-shot.jpg",
    desc: "Extra espresso shot.",
    tags: [],
  },
  // Non-coffee
  {
    id: "n1",
    name: "Matcha Latte",
    cat: "Non-Coffee",
    group: "drink",
    price: 195,
    emoji: "ðŸµ",
    image: "images/menu/matcha-latte.jpg",
    desc: "Matcha latte.",
    tags: [],
  },
  {
    id: "n2",
    name: "Coconut Matcha",
    cat: "Non-Coffee",
    group: "drink",
    price: 215,
    emoji: "ðŸµ",
    image: "images/menu/coconut-matcha.jpg",
    desc: "Coconut matcha.",
    tags: [],
  },
  {
    id: "n3",
    name: "English Tea",
    cat: "Non-Coffee",
    group: "drink",
    price: 125,
    emoji: "ðŸ«–",
    image: "images/menu/english-tea.jpg",
    desc: "English tea.",
    tags: [],
  },
  {
    id: "n4",
    name: "Hot Chocolate",
    cat: "Non-Coffee",
    group: "drink",
    price: 150,
    emoji: "ðŸ«",
    image: "images/menu/hot-chocolate.jpg",
    desc: "Hot chocolate.",
    tags: [],
  },
  {
    id: "n5",
    name: "Calamansi Iced Tea",
    cat: "Non-Coffee",
    group: "drink",
    price: 135,
    emoji: "ðŸ‹",
    image: "images/menu/calamansi-iced-tea.jpg",
    desc: "Calamansi iced tea.",
    tags: [],
  },
  {
    id: "n6",
    name: "Dalandan Soda",
    cat: "Non-Coffee",
    group: "drink",
    price: 150,
    emoji: "ðŸ¥¤",
    image: "images/menu/dalandan-soda.jpg",
    desc: "Dalandan soda.",
    tags: [],
  },
  // Ice blended
  {
    id: "i1",
    name: "Latte Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 185,
    emoji: "ðŸ¥¤",
    image: "images/menu/latte-frappe.jpg",
    desc: "Coffee-based ice blended drink.",
    tags: [],
  },
  {
    id: "i2",
    name: "Tableya Mocha Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 195,
    emoji: "ðŸ¥¤",
    image: "images/menu/tableya-mocha-frappe.jpg",
    desc: "Coffee-based ice blended drink.",
    tags: [],
  },
  {
    id: "i3",
    name: "White Mocha Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 195,
    emoji: "ðŸ¥¤",
    image: "images/menu/white-mocha-frappe.jpg",
    desc: "Coffee-based ice blended drink.",
    tags: [],
  },
  {
    id: "i4",
    name: "Butterscotch Crunch Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 195,
    emoji: "ðŸ¥¤",
    image: "images/menu/butterscotch-crunch-frappe.jpg",
    desc: "Coffee-based ice blended drink.",
    tags: [],
  },
  {
    id: "i5",
    name: "Banana Caramel Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 195,
    emoji: "ðŸ¥¤",
    image: "images/menu/banana-caramel-frappe.jpg",
    desc: "Coffee-based ice blended drink.",
    tags: [],
  },
  {
    id: "i6",
    name: "Mango Cream Frappe",
    cat: "Ice Blended",
    group: "drink",
    price: 195,
    emoji: "ðŸ¥­",
    image: "images/menu/mango-cream-frappe.jpg",
    desc: "Ice blended mango cream drink.",
    tags: [],
  },
  {
    id: "i7",
    name: "Calamansi Slush",
    cat: "Ice Blended",
    group: "drink",
    price: 160,
    emoji: "ðŸ‹",
    image: "images/menu/calamansi-slush.jpg",
    desc: "Calamansi slush.",
    tags: [],
  },
  // Sandwiches
  {
    id: "s1",
    name: "Ancestra BLT",
    cat: "Sandwiches",
    group: "food",
    price: 240,
    emoji: "ðŸ¥ª",
    image: "images/menu/ancestra-blt.jpg",
    desc: "Crispy bacon, lettuce, tomatoes, pickled onions, housemade sauce, sourdough, fries.",
    tags: [],
  },
  {
    id: "s2",
    name: "Grilled Cheese Pimiento",
    cat: "Sandwiches",
    group: "food",
    price: 245,
    emoji: "ðŸ¥ª",
    image: "images/menu/grilled-cheese-pimiento.jpg",
    desc: "Four cheese pimiento, sourdough, fries.",
    tags: [],
  },
  {
    id: "s3",
    name: "Chicken Pomodoro",
    cat: "Sandwiches",
    group: "food",
    price: 245,
    emoji: "ðŸ¥ª",
    image: "images/menu/chicken-pomodoro.jpg",
    desc: "Grilled chicken, mozzarella, seasonal greens, tomato, sourdough, fries.",
    tags: [],
  },
  // Small plates
  {
    id: "sp1",
    name: "Honey Sriracha Cauliflower",
    cat: "Small Plates",
    group: "food",
    price: 190,
    emoji: "ðŸ¥¦",
    image: "images/menu/honey-sriracha-cauliflower.jpg",
    desc: "Deep fried cauliflower, sriracha mayo.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "sp2",
    name: "Hanoi Wings",
    cat: "Small Plates",
    group: "food",
    price: 195,
    emoji: "ðŸ—",
    image: "images/menu/hanoi-wings.jpg",
    desc: "Deep fried wing drumettes, Vietnamese glaze.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  // Pasta
  {
    id: "p1",
    name: "Ancestra Pasta",
    cat: "Pasta",
    group: "food",
    price: 335,
    emoji: "ðŸ",
    image: "images/menu/ancestra-pasta.jpg",
    desc: "Housemade coconut cream sauce, shrimp, linguine.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "p2",
    name: "Carbonara de Cebu",
    cat: "Pasta",
    group: "food",
    price: 295,
    emoji: "ðŸ",
    image: "images/menu/carbonara-de-cebu.jpg",
    desc: "Creamy carbonara with sweet chorizo de Cebu, parmesan, spaghetti.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "p3",
    name: "Malunggay Pesto Pasta",
    cat: "Pasta",
    group: "food",
    price: 325,
    emoji: "ðŸ",
    image: "images/menu/malunggay-pesto-pasta.jpg",
    desc: "Grilled chicken, malunggay, basil.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  // Salad
  {
    id: "sa1",
    name: "Mandarin Chicken Salad",
    cat: "Salad",
    group: "food",
    price: 270,
    emoji: "ðŸ¥—",
    image: "images/menu/mandarin-chicken-salad.jpg",
    desc: "Seasonal greens, mandarin orange, cashews, crispy noodles, cider vinegar dressing.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "sa2",
    name: "Mango Shrimp Salad",
    cat: "Salad",
    group: "food",
    price: 290,
    emoji: "ðŸ¥—",
    image: "images/menu/mango-shrimp-salad.jpg",
    desc: "Seasonal greens, mango, peanuts, red onions, carrots, Thai dressing.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  // Mains
  {
    id: "m1",
    name: "Ancestra Humba",
    cat: "Mains",
    group: "food",
    price: 385,
    emoji: "ðŸ›",
    image: "images/menu/ancestra-humba.jpg",
    desc: "Humba, fried egg, served with rice and stir-fried cabbage.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "m2",
    name: "Chicken Katsu Curry",
    cat: "Mains",
    group: "food",
    price: 290,
    emoji: "ðŸ›",
    image: "images/menu/chicken-katsu-curry.jpg",
    desc: "Breaded chicken katsu with Filipino curry, served with rice.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "m3",
    name: "Seafood Thai Green Curry",
    cat: "Mains",
    group: "food",
    price: 365,
    emoji: "ðŸ›",
    image: "images/menu/seafood-thai-green-curry.jpg",
    desc: "Shrimp, squid, mussels in a green curry, served with rice and pickled cucumber salad.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "m4",
    name: "Gambas al Ajillo",
    cat: "Mains",
    group: "food",
    price: 295,
    emoji: "ðŸ¤",
    image: "images/menu/gambas-al-ajillo.jpg",
    desc: "Shrimp, olive oil, paprika, garlic, served with rice and pickled cucumber salad.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "m5",
    name: "Loco Moco Burger Steak",
    cat: "Mains",
    group: "food",
    price: 310,
    emoji: "ðŸ”",
    image: "images/menu/loco-moco-burger-steak.jpg",
    desc: "Hawaiian style all-beef patty, coconut gravy, topped with fried egg and pickled cucumber salad.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  {
    id: "m6",
    name: "Tenderloin Salpicao",
    cat: "Mains",
    group: "food",
    price: 585,
    emoji: "ðŸ¥©",
    image: "images/menu/tenderloin-salpicao.jpg",
    desc: "Beef tenderloin, garlic and olive oil, stir-fried cabbage.",
    tags: [],
    serving: "Starts serving at 10:30 AM",
  },
  // Sides
  {
    id: "sd1",
    name: "Plain Rice",
    cat: "Sides",
    group: "food",
    price: 40,
    emoji: "ðŸš",
    image: "images/menu/plain-rice.jpg",
    desc: "Plain rice.",
    tags: [],
  },
  {
    id: "sd2",
    name: "French Fries",
    cat: "Sides",
    group: "food",
    price: 80,
    emoji: "ðŸŸ",
    image: "images/menu/french-fries.jpg",
    desc: "French fries.",
    tags: [],
  },
];
/* Enrich menu items with nutrition/allergen/dietary data (defaults). */
MENU.forEach((m) => {
  if (typeof m.calories !== "number")
    m.calories = m.group === "drink" ? 160 : m.group === "addon" ? 40 : 420;
  if (!Array.isArray(m.allergens)) {
    const text = (m.name + " " + m.desc).toLowerCase();
    const a = [];
    if (/milk|cheese|cream|butter|latte|mozzarella|parmesan/.test(text)) a.push("Dairy");
    if (/shrimp|squid|mussels|seafood/.test(text)) a.push("Shellfish");
    if (/egg/.test(text)) a.push("Egg");
    if (/peanut|cashew|nut/.test(text)) a.push("Nuts");
    if (/wheat|bread|sourdough|pasta|spaghetti|linguine/.test(text)) a.push("Gluten");
    if (!a.length) a.push("None listed");
    m.allergens = a;
  }
  if (!Array.isArray(m.tags)) {
    const text = (m.name + " " + m.desc).toLowerCase();
    const t = [];
    if (m.group === "drink" || m.group === "addon") t.push("drink");
    else t.push("food");

    if (/coffee|espresso|latte|mocha|cappuccino|americano|brew/.test(text)) t.push("caffeine");
    m.tags = t;
  }
  if (!Array.isArray(m.pairsWith)) m.pairsWith = [];
});

// Only items whose listed ingredients clearly fit a vegetarian diet are tagged.
const VEGETARIAN_ITEM_IDS = new Set([
  "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11",
  "n1", "n2", "n3", "n4", "n5", "n6",
  "i1", "i2", "i3", "i4", "i5", "i6", "i7",
  "s2", "sd1", "sd2"
]);
MENU.forEach((item) => {
  if (VEGETARIAN_ITEM_IDS.has(item.id) && !item.tags.includes("vegetarian")) {
    item.tags.push("vegetarian");
  }
});

/* Pairing suggestions */
const PAIRS = {
  c1: ["s1", "sp2"],
  c2: ["s2", "sp1"],
  c6: ["p1", "m1"],
  p1: ["c2", "n3"],
  m1: ["sd1", "c6"],
};
Object.keys(PAIRS).forEach((k) => {
  const m = MENU.find((x) => x.id === k);
  if (m) m.pairsWith = PAIRS[k];
});

const TILE = {
  Coffee: "tile-coffee",
  "Non-Coffee": "tile-tea",
  "Ice Blended": "tile-dessert",
  Sandwiches: "tile-brunch",
  "Small Plates": "tile-pastry",
  Pasta: "tile-brunch",
  Salad: "tile-tea",
  Mains: "tile-coffee",
  Sides: "tile-pastry",
};
const CATS = [
  "All",
  "Coffee",
  "Non-Coffee",
  "Ice Blended",
  "Sandwiches",
  "Small Plates",
  "Pasta",
  "Salad",
  "Mains",
  "Sides",
];
/* Product photography references selected to match the closest menu item. */
const PHOTO_BY_ID = {
  c1: "https://cdn.pixabay.com/photo/2019/04/14/17/09/americano-4127162_1280.jpg",
  c2: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c3: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c4: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c5: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c6: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c7: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c8: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  c9: "https://cdn.pixabay.com/photo/2019/04/14/17/09/americano-4127162_1280.jpg",
  c10: "https://cdn.pixabay.com/photo/2019/04/14/17/09/americano-4127162_1280.jpg",
  c11: "https://cdn.pixabay.com/photo/2019/04/14/17/09/americano-4127162_1280.jpg",
  n1: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  n2: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  n3: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  n4: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  n5: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  n6: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  i1: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  i2: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  i3: "https://cdn.pixabay.com/photo/2017/08/07/22/57/coffee-2608864_1280.jpg",
  i4: "https://cdn.pixabay.com/photo/2022/06/07/20/52/curry-7249244_1280.jpg",
  i5: "https://cdn.pixabay.com/photo/2022/06/07/20/52/curry-7249244_1280.jpg",
  i6: "https://cdn.pixabay.com/photo/2022/06/07/20/52/curry-7249244_1280.jpg",
  i7: "https://cdn.pixabay.com/photo/2022/02/06/07/18/matcha-latte-6996428_1280.jpg",
  s1: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  s2: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  s3: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  sp1: "https://cdn.jalan.jp/jalan/img/8/spot/0218/KL/guide000000218528_7.jpg",
  sp2: "https://cdn.jalan.jp/jalan/img/8/spot/0218/KL/guide000000218528_7.jpg",
  p1: "https://cdn.pixabay.com/photo/2011/04/29/11/20/spaghetti-7113_1280.jpg",
  p2: "https://cdn.pixabay.com/photo/2011/04/29/11/20/spaghetti-7113_1280.jpg",
  p3: "https://cdn.pixabay.com/photo/2011/04/29/11/20/spaghetti-7113_1280.jpg",
  sa1: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  sa2: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  m1: "https://cdn.pixabay.com/photo/2021/03/30/13/40/chicken-curry-6136993_1280.jpg",
  m2: "https://cdn.pixabay.com/photo/2021/03/30/13/40/chicken-curry-6136993_1280.jpg",
  m3: "https://cdn.pixabay.com/photo/2022/06/07/20/52/curry-7249244_1280.jpg",
  m4: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
  m5: "https://cdn.pixabay.com/photo/2021/03/30/13/40/chicken-curry-6136993_1280.jpg",
  m6: "https://cdn.pixabay.com/photo/2021/03/30/13/40/chicken-curry-6136993_1280.jpg",
  sd1: "https://cdn.pixabay.com/photo/2021/03/30/13/40/chicken-curry-6136993_1280.jpg",
  sd2: "https://tb-static.uber.com/prod/image-proc/processed_images/72dc67b9bdc89451b9374493785864f8/783282f6131ef2258e5bcd87c46aa87e.jpeg",
};
const CAT_IMAGE = {
  Coffee: "images/menu/placeholder.png",
  "Non-Coffee": "images/menu/non-coffee.png",
  "Ice Blended": "images/menu/iceblended.png",
  Sandwiches: "images/menu/sandwiches.png",
  "Small Plates": "images/menu/smallplate.png",
  Pasta: "images/menu/pasta.png",
  Salad: "images/menu/salad.png",
  Mains: "images/menu/mains.png",
  Sides: "images/menu/sidedish.png",
};
const catImage = (m) => PHOTO_BY_ID[m.id] || CAT_IMAGE[m.cat] || "images/menu/placeholder.png";
const state = {
  q: "",
  cat: "All",
  diet: "all",
  allergen: "all",
  sort: "default",
  favOnly: false,
};
function renderPills() {
  document.getElementById("catPills").innerHTML = CATS.map(
    (c) =>
      `<button type="button" class="filter-pill ${state.cat === c ? "active" : ""}" data-cat="${c}">${c}</button>`,
  ).join("");
}
function filtered() {
  const favs = Store.get("favs", []);
  let list = MENU.filter((m) => {
    const q = state.q.toLowerCase();
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      m.cat.toLowerCase().includes(q);
    const matchC = state.cat === "All" || m.cat === state.cat;
    const matchD =
      state.diet === "all" ||
      (state.diet === "drink"
        ? m.group === "drink" || m.group === "addon"
        : m.group === "food");
    const matchA =
      state.allergen === "all" ||
      (state.allergen === "vegetarian"
        ? m.tags.includes("vegetarian")
        : !m.allergens.includes(state.allergen));
    const matchF = !state.favOnly || favs.includes(m.id);
    return matchQ && matchC && matchD && matchA && matchF;
  });
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function renderRecommended() {
  const box = document.getElementById("recommended");
  if (!box) return;
  const favs = Store.get("favs", []);
  const orders = Store.get("orders", []);
  const recentCats = new Set();
  favs.forEach((id) => {
    const m = MENU.find((x) => x.id === id);
    if (m) recentCats.add(m.cat);
  });
  orders.forEach((o) =>
    (o.items || []).forEach((i) => {
      const m = MENU.find((x) => x.name === i.name);
      if (m) recentCats.add(m.cat);
    }),
  );
  let recs = MENU.filter((m) => recentCats.has(m.cat) && !favs.includes(m.id));
  if (!recs.length)
    recs = MENU.filter((m) => ["c1", "c2", "p1", "m1"].includes(m.id));
  recs = recs.slice(0, 4);
  if (!recs.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML =
    `<p class="small text-muted-2 mb-2">Recommended for you</p>` +
    `<div class="d-flex flex-wrap gap-2">` +
    recs
      .map(
        (m) =>
          `<button type="button" class="btn btn-outline-blue btn-sm" data-rec="${m.id}">${escapeHtml(m.name)}</button>`,
      )
      .join("") +
    `</div>`;
}
function openItemModal(id) {
  const m = MENU.find((x) => x.id === id);
  if (!m) return;
  const pairs = (m.pairsWith || [])
    .map((pid) => MENU.find((x) => x.id === pid))
    .filter(Boolean);
  const content = document.getElementById("itemModalContent");
  if (!content) return;
  content.innerHTML = `
    <div class="row g-4 align-items-center">
      <div class="col-md-5"><img src="${escapeHtml(catImage(m))}" class="img-fluid rounded-3 w-100" alt="${escapeHtml(m.name)}" style="max-height:340px;object-fit:cover" onerror="this.src='images/menu/placeholder.png'"></div>
      <div class="col-md-7">
        <p class="eyebrow mb-1">${escapeHtml(m.cat)}</p><h3>${escapeHtml(m.name)}</h3>
        <p class="small text-muted-2">${escapeHtml(m.desc)}</p>
        ${m.serving ? `<p class="small text-muted-2">${escapeHtml(m.serving)}</p>` : ""}
        <p class="h5 mb-3" id="quickViewPrice">${Peso(m.price)}</p>
        ${m.group === "drink" ? `<label class="form-label small" for="quickSize">Size</label><select class="form-select mb-3" id="quickSize"><option value="Regular" data-extra="0">Regular</option><option value="Large" data-extra="30">Large (+₱30)</option></select>` : ""}
        <label class="form-label small" for="quickQty">Quantity</label><div class="input-group mb-3" style="max-width:150px"><button class="btn btn-outline-blue" type="button" id="quickMinus" aria-label="Decrease quantity">−</button><input class="form-control text-center" id="quickQty" type="number" min="1" max="20" value="1"><button class="btn btn-outline-blue" type="button" id="quickPlus" aria-label="Increase quantity">+</button></div>
        <div class="d-flex gap-2 flex-wrap"><button class="btn btn-blue" id="quickAddBtn" type="button" data-item="${m.id}">Add to cart</button><button class="btn btn-outline-blue" type="button" data-bs-dismiss="modal">Close</button></div>
        <p class="small text-muted-2 mt-3 mb-0">${m.allergens?.length ? `Allergens: ${m.allergens.join(", ")}` : "Ask our team about ingredients or dietary needs."}</p>
      </div>
    </div>`;
  const size = content.querySelector('#quickSize');
  const qty = content.querySelector('#quickQty');
  const updatePrice = () => { const extra = Number(size?.selectedOptions[0]?.dataset.extra || 0); content.querySelector('#quickViewPrice').textContent = Peso(m.price + extra); };
  size?.addEventListener('change', updatePrice);
  content.querySelector('#quickMinus').addEventListener('click', () => qty.value = Math.max(1, Number(qty.value || 1) - 1));
  content.querySelector('#quickPlus').addEventListener('click', () => qty.value = Math.min(20, Number(qty.value || 1) + 1));
  content.querySelector('#quickAddBtn').addEventListener('click', () => {
    const extra = Number(size?.selectedOptions[0]?.dataset.extra || 0);
    const label = size ? size.value : '';
    const item = { id: `${m.id}${label ? '-' + label.toLowerCase() : ''}`, baseId:m.id, name: `${m.name}${label ? ` (${label})` : ''}`, price:m.price + extra, emoji:m.emoji, group:m.group, qty: Math.max(1, Math.min(20, Number(qty.value || 1))) };
    for (let i=0;i<item.qty;i++) Cart.add(item);
    trackRecent(m.id);
    bootstrap.Modal.getInstance(document.getElementById('itemModal')).hide();
  });
  new bootstrap.Modal(document.getElementById("itemModal")).show();
}
function servingAvailable(m) {
  if (!m.serving) return true;
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(10, 30, 0, 0);
  return now >= cutoff;
}
function renderMenu() {
  const favs = Store.get("favs", []);
  const list = filtered();
  document.getElementById("resultCount").textContent =
    `${list.length} item${list.length === 1 ? "" : "s"}`;
  document
    .getElementById("emptyState")
    .classList.toggle("d-none", list.length > 0);
  document.getElementById("menuGrid").innerHTML = list
    .map((m) => {
      const fav = favs.includes(m.id);
      const disabledItems = Store.get("disabledItems", []);
      const unavailable = !servingAvailable(m) || disabledItems.includes(m.id);
      const tile = `<div class="menu-tile ${TILE[m.cat]}" aria-hidden="true"><img src="${escapeHtml(catImage(m))}" alt="" loading="lazy" decoding="async" onerror="this.src='images/menu/placeholder.png';this.parentElement.classList.add('is-placeholder')"><span class="menu-tile-fallback">${m.emoji}</span></div>`;
      const addBtn = unavailable
        ? `<button class="btn btn-blue btn-sm" data-add="${m.id}" disabled aria-disabled="true">Not yet</button>`
        : `<button class="btn btn-blue btn-sm" data-add="${m.id}">Add</button>`;
      return `<div class="col"><article class="card-soft hover-lift h-100 d-flex flex-column overflow-hidden ${unavailable ? "menu-item-unavailable" : ""}">${tile}<div class="p-3 d-flex flex-column flex-grow-1"><div class="d-flex justify-content-between align-items-start"><h3 class="h5 mb-1">${escapeHtml(m.name)}</h3><button class="fav-btn" data-fav="${m.id}" aria-label="${fav ? "Remove from" : "Add to"} favorites" aria-pressed="${fav}"><i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i></button></div><p class="small text-muted-2 mb-2 flex-grow-1">${escapeHtml(m.desc)}</p>${m.serving ? `<p class="small text-muted-2 mb-2"><span class="badge text-bg-secondary">${escapeHtml(m.serving)}</span></p>` : ""}<div class="d-flex justify-content-between align-items-center mt-auto"><span class="price">${Peso(m.price)}</span>${addBtn}</div></div></article></div>`;
    })
    .join("");
}
function trackRecent(id) {
  let list = Store.get("recentlyViewed", []);
  list = [id, ...list.filter((x) => x !== id)].slice(0, 6);
  Store.set("recentlyViewed", list);
  renderRecent();
}
function renderRecent() {
  const box = document.getElementById("recentlyViewed");
  if (!box) return;
  const ids = Store.get("recentlyViewed", []);
  if (!ids.length) {
    box.innerHTML = "";
    return;
  }
  const items = ids.map((id) => MENU.find((m) => m.id === id)).filter(Boolean);
  box.innerHTML =
    `<p class="small text-muted-2 mb-2">Recently viewed</p>` +
    `<div class="d-flex flex-wrap gap-2">` +
    items
      .map(
        (m) =>
          `<button type="button" class="btn btn-outline-blue btn-sm" data-recent="${m.id}">${escapeHtml(m.name)}</button>`,
      )
      .join("") +
    `</div>`;
}
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("menuGrid")) return;
  renderPills();
  renderMenu();
  renderRecent();
  renderRecommended();
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.q = e.target.value.trim();
    renderMenu();
  });
  document.getElementById("dietSelect").addEventListener("change", (e) => {
    state.diet = e.target.value;
    renderMenu();
  });
  const allergenSel = document.getElementById("allergenSelect");
  if (allergenSel)
    allergenSel.addEventListener("change", (e) => {
      state.allergen = e.target.value;
      renderMenu();
    });
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderMenu();
  });
  document.getElementById("favToggle").addEventListener("change", (e) => {
    state.favOnly = e.target.checked;
    renderMenu();
  });
  document.getElementById("resetFilters").addEventListener("click", () => {
    Object.assign(state, {
      q: "",
      cat: "All",
      diet: "all",
      allergen: "all",
      sort: "default",
      favOnly: false,
    });
    document.getElementById("searchInput").value = "";
    document.getElementById("dietSelect").value = "all";
    if (document.getElementById("allergenSelect"))
      document.getElementById("allergenSelect").value = "all";
    document.getElementById("sortSelect").value = "default";
    document.getElementById("favToggle").checked = false;
    renderPills();
    renderMenu();
  });
  document.getElementById("catPills").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    state.cat = b.dataset.cat;
    renderPills();
    renderMenu();
  });
  document.getElementById("menuGrid").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add && !add.disabled) {
      const m = MENU.find((x) => x.id === add.dataset.add);
      Cart.add({
        id: m.id,
        name: m.name,
        price: m.price,
        emoji: m.emoji,
        group: m.group,
      });
      trackRecent(m.id);
      return;
    }
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      let favs = Store.get("favs", []);
      favs = favs.includes(fav.dataset.fav)
        ? favs.filter((f) => f !== fav.dataset.fav)
        : [...favs, fav.dataset.fav];
      Store.set("favs", favs);
      renderMenu();
      return;
    }
    const card = e.target.closest("article");
    if (card) {
      const id = card.querySelector("[data-add]")?.dataset.add;
      if (id) openItemModal(id);
    }
  });
  const recentBox = document.getElementById("recentlyViewed");
  if (recentBox)
    recentBox.addEventListener("click", (e) => {
      const b = e.target.closest("[data-recent]");
      if (!b) return;
      const m = MENU.find((x) => x.id === b.dataset.recent);
      if (!m) return;
      document.getElementById("searchInput").value = m.name;
      state.q = m.name;
      renderMenu();
      window.scrollTo({ top: document.getElementById("menuGrid").offsetTop - 120, behavior: "smooth" });
    });

  const preset = new URLSearchParams(location.search).get("cat");
  if (preset && CATS.includes(preset)) {
    state.cat = preset;
    renderPills();
    renderMenu();
  }
});
