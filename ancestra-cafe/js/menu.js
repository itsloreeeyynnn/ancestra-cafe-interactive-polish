/* Ancestra Cafe menu transcribed from the two menu-board images on ancestracafe.ph.
   Descriptions are copied/paraphrased from the board. This ordering/cart is a student-project demo. */
const MENU = [
  // Coffee (hot / iced)
  {id:"c1",name:"Americano",cat:"Coffee",group:"drink",price:120,emoji:"☕",desc:"Americano (hot / iced).",tags:[]},
  {id:"c2",name:"Latte / Cappuccino",cat:"Coffee",group:"drink",price:145,emoji:"☕",desc:"Latte / cappuccino (hot / iced).",tags:[]},
  {id:"c3",name:"White Mocha",cat:"Coffee",group:"drink",price:180,emoji:"☕",desc:"White mocha (hot / iced).",tags:[]},
  {id:"c4",name:"Salted Caramel Latte",cat:"Coffee",group:"drink",price:170,emoji:"☕",desc:"Salted caramel latte (hot / iced).",tags:[]},
  {id:"c5",name:"Macadamia Latte",cat:"Coffee",group:"drink",price:170,emoji:"☕",desc:"Macadamia latte (hot / iced).",tags:[]},
  {id:"c6",name:"Tableya Mocha",cat:"Coffee",group:"drink",price:170,emoji:"☕",desc:"Tableya mocha (hot / iced).",tags:[]},
  {id:"c7",name:"Coconut Latte",cat:"Coffee",group:"drink",price:180,emoji:"☕",desc:"Coconut latte (hot / iced).",tags:[]},
  {id:"c8",name:"Ube Spanish Latte",cat:"Coffee",group:"drink",price:180,emoji:"☕",desc:"Ube Spanish latte (hot / iced).",tags:[]},
  {id:"c9",name:"Cold Brew Black",cat:"Coffee",group:"drink",price:160,emoji:"🧊",desc:"Cold brew black.",tags:[]},
  {id:"c10",name:"Latik Foam Cold Brew",cat:"Coffee",group:"drink",price:170,emoji:"🧊",desc:"Cold brew with latik foam.",tags:[]},
  {id:"c11",name:"Extra Espresso Shot",cat:"Coffee",group:"addon",price:70,emoji:"☕",desc:"Extra espresso shot.",tags:[]},
  // Non-coffee
  {id:"n1",name:"Matcha Latte",cat:"Non-Coffee",group:"drink",price:195,emoji:"🍵",desc:"Matcha latte.",tags:[]},
  {id:"n2",name:"Coconut Matcha",cat:"Non-Coffee",group:"drink",price:215,emoji:"🍵",desc:"Coconut matcha.",tags:[]},
  {id:"n3",name:"English Tea",cat:"Non-Coffee",group:"drink",price:125,emoji:"🫖",desc:"English tea.",tags:[]},
  {id:"n4",name:"Hot Chocolate",cat:"Non-Coffee",group:"drink",price:150,emoji:"🍫",desc:"Hot chocolate.",tags:[]},
  {id:"n5",name:"Calamansi Iced Tea",cat:"Non-Coffee",group:"drink",price:135,emoji:"🍋",desc:"Calamansi iced tea.",tags:[]},
  {id:"n6",name:"Dalandan Soda",cat:"Non-Coffee",group:"drink",price:150,emoji:"🥤",desc:"Dalandan soda.",tags:[]},
  // Ice blended
  {id:"i1",name:"Latte Frappe",cat:"Ice Blended",group:"drink",price:185,emoji:"🥤",desc:"Coffee-based ice blended drink.",tags:[]},
  {id:"i2",name:"Tableya Mocha Frappe",cat:"Ice Blended",group:"drink",price:195,emoji:"🥤",desc:"Coffee-based ice blended drink.",tags:[]},
  {id:"i3",name:"White Mocha Frappe",cat:"Ice Blended",group:"drink",price:195,emoji:"🥤",desc:"Coffee-based ice blended drink.",tags:[]},
  {id:"i4",name:"Butterscotch Crunch Frappe",cat:"Ice Blended",group:"drink",price:195,emoji:"🥤",desc:"Coffee-based ice blended drink.",tags:[]},
  {id:"i5",name:"Banana Caramel Frappe",cat:"Ice Blended",group:"drink",price:195,emoji:"🥤",desc:"Coffee-based ice blended drink.",tags:[]},
  {id:"i6",name:"Mango Cream Frappe",cat:"Ice Blended",group:"drink",price:195,emoji:"🥭",desc:"Ice blended mango cream drink.",tags:[]},
  {id:"i7",name:"Calamansi Slush",cat:"Ice Blended",group:"drink",price:160,emoji:"🍋",desc:"Calamansi slush.",tags:[]},
  // Sandwiches
  {id:"s1",name:"Ancestra BLT",cat:"Sandwiches",group:"food",price:240,emoji:"🥪",desc:"Crispy bacon, lettuce, tomatoes, pickled onions, housemade sauce, sourdough, fries.",tags:[]},
  {id:"s2",name:"Grilled Cheese Pimiento",cat:"Sandwiches",group:"food",price:245,emoji:"🥪",desc:"Four cheese pimiento, sourdough, fries.",tags:[]},
  {id:"s3",name:"Chicken Pomodoro",cat:"Sandwiches",group:"food",price:245,emoji:"🥪",desc:"Grilled chicken, mozzarella, seasonal greens, tomato, sourdough, fries.",tags:[]},
  // Small plates
  {id:"sp1",name:"Honey Sriracha Cauliflower",cat:"Small Plates",group:"food",price:190,emoji:"🥦",desc:"Deep fried cauliflower, sriracha mayo.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"sp2",name:"Hanoi Wings",cat:"Small Plates",group:"food",price:195,emoji:"🍗",desc:"Deep fried wing drumettes, Vietnamese glaze.",tags:[],serving:"Starts serving at 10:30 AM"},
  // Pasta
  {id:"p1",name:"Ancestra Pasta",cat:"Pasta",group:"food",price:335,emoji:"🍝",desc:"Housemade coconut cream sauce, shrimp, linguine.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"p2",name:"Carbonara de Cebu",cat:"Pasta",group:"food",price:295,emoji:"🍝",desc:"Creamy carbonara with sweet chorizo de Cebu, parmesan, spaghetti.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"p3",name:"Malunggay Pesto Pasta",cat:"Pasta",group:"food",price:325,emoji:"🍝",desc:"Grilled chicken, malunggay, basil.",tags:[],serving:"Starts serving at 10:30 AM"},
  // Salad
  {id:"sa1",name:"Mandarin Chicken Salad",cat:"Salad",group:"food",price:270,emoji:"🥗",desc:"Seasonal greens, mandarin orange, cashews, crispy noodles, cider vinegar dressing.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"sa2",name:"Mango Shrimp Salad",cat:"Salad",group:"food",price:290,emoji:"🥗",desc:"Seasonal greens, mango, peanuts, red onions, carrots, Thai dressing.",tags:[],serving:"Starts serving at 10:30 AM"},
  // Mains
  {id:"m1",name:"Ancestra Humba",cat:"Mains",group:"food",price:385,emoji:"🍛",desc:"Humba, fried egg, served with rice and stir-fried cabbage.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"m2",name:"Chicken Katsu Curry",cat:"Mains",group:"food",price:290,emoji:"🍛",desc:"Breaded chicken katsu with Filipino curry, served with rice.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"m3",name:"Seafood Thai Green Curry",cat:"Mains",group:"food",price:365,emoji:"🍛",desc:"Shrimp, squid, mussels in a green curry, served with rice and pickled cucumber salad.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"m4",name:"Gambas al Ajillo",cat:"Mains",group:"food",price:295,emoji:"🍤",desc:"Shrimp, olive oil, paprika, garlic, served with rice and pickled cucumber salad.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"m5",name:"Loco Moco Burger Steak",cat:"Mains",group:"food",price:310,emoji:"🍔",desc:"Hawaiian style all-beef patty, coconut gravy, topped with fried egg and pickled cucumber salad.",tags:[],serving:"Starts serving at 10:30 AM"},
  {id:"m6",name:"Tenderloin Salpicao",cat:"Mains",group:"food",price:585,emoji:"🥩",desc:"Beef tenderloin, garlic and olive oil, stir-fried cabbage.",tags:[],serving:"Starts serving at 10:30 AM"},
  // Sides
  {id:"sd1",name:"Plain Rice",cat:"Sides",group:"food",price:40,emoji:"🍚",desc:"Plain rice.",tags:[]},
  {id:"sd2",name:"French Fries",cat:"Sides",group:"food",price:80,emoji:"🍟",desc:"French fries.",tags:[]}
];
const TILE = {"Coffee":"tile-coffee","Non-Coffee":"tile-tea","Ice Blended":"tile-dessert","Sandwiches":"tile-brunch","Small Plates":"tile-pastry","Pasta":"tile-brunch","Salad":"tile-tea","Mains":"tile-coffee","Sides":"tile-pastry"};
const CATS = ["All", "Coffee", "Non-Coffee", "Ice Blended", "Sandwiches", "Small Plates", "Pasta", "Salad", "Mains", "Sides"];
const state = {q:"",cat:"All",diet:"all",sort:"default",favOnly:false};
function renderPills(){document.getElementById("catPills").innerHTML=CATS.map(c=>`<button type="button" class="filter-pill ${state.cat===c?"active":""}" data-cat="${c}">${c}</button>`).join("");}
function filtered(){const favs=Store.get("favs",[]);let list=MENU.filter(m=>{const q=state.q.toLowerCase();const matchQ=!q||m.name.toLowerCase().includes(q)||m.desc.toLowerCase().includes(q)||m.cat.toLowerCase().includes(q);const matchC=state.cat==="All"||m.cat===state.cat;const matchD=state.diet==="all"||(state.diet==="drink"?(m.group==="drink"||m.group==="addon"):m.group==="food");const matchF=!state.favOnly||favs.includes(m.id);return matchQ&&matchC&&matchD&&matchF;});if(state.sort==="low")list.sort((a,b)=>a.price-b.price);if(state.sort==="high")list.sort((a,b)=>b.price-a.price);if(state.sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));return list;}
function renderMenu(){const favs=Store.get("favs",[]);const list=filtered();document.getElementById("resultCount").textContent=`${list.length} item${list.length===1?"":"s"}`;document.getElementById("emptyState").classList.toggle("d-none",list.length>0);document.getElementById("menuGrid").innerHTML=list.map(m=>`<div class="col"><article class="card-soft hover-lift h-100 d-flex flex-column overflow-hidden"><div class="menu-tile ${TILE[m.cat]}" aria-hidden="true">${m.emoji}</div><div class="p-3 d-flex flex-column flex-grow-1"><div class="d-flex justify-content-between align-items-start"><h3 class="h5 mb-1">${escapeHtml(m.name)}</h3><button class="fav-btn" data-fav="${m.id}" aria-label="${favs.includes(m.id)?"Remove from":"Add to"} favorites" aria-pressed="${favs.includes(m.id)}"><i class="bi ${favs.includes(m.id)?"bi-heart-fill":"bi-heart"}"></i></button></div><p class="small text-muted-2 mb-2 flex-grow-1">${escapeHtml(m.desc)}</p>${m.serving?`<p class="small text-muted-2 mb-2">${escapeHtml(m.serving)}</p>`:""}<div class="d-flex justify-content-between align-items-center mt-auto"><span class="price">${Peso(m.price)}</span><button class="btn btn-blue btn-sm" data-add="${m.id}"><i class="bi bi-plus-lg me-1"></i>Add</button></div></div></article></div>`).join("");}
document.addEventListener("DOMContentLoaded",()=>{if(!document.getElementById("menuGrid"))return;renderPills();renderMenu();document.getElementById("searchInput").addEventListener("input",e=>{state.q=e.target.value.trim();renderMenu();});document.getElementById("dietSelect").addEventListener("change",e=>{state.diet=e.target.value;renderMenu();});document.getElementById("sortSelect").addEventListener("change",e=>{state.sort=e.target.value;renderMenu();});document.getElementById("favToggle").addEventListener("change",e=>{state.favOnly=e.target.checked;renderMenu();});document.getElementById("resetFilters").addEventListener("click",()=>{Object.assign(state,{q:"",cat:"All",diet:"all",sort:"default",favOnly:false});document.getElementById("searchInput").value="";document.getElementById("dietSelect").value="all";document.getElementById("sortSelect").value="default";document.getElementById("favToggle").checked=false;renderPills();renderMenu();});document.getElementById("catPills").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;state.cat=b.dataset.cat;renderPills();renderMenu();});document.getElementById("menuGrid").addEventListener("click",e=>{const add=e.target.closest("[data-add]");if(add){const m=MENU.find(x=>x.id===add.dataset.add);Cart.add({id:m.id,name:m.name,price:m.price,emoji:m.emoji,group:m.group});return;}const fav=e.target.closest("[data-fav]");if(fav){let favs=Store.get("favs",[]);favs=favs.includes(fav.dataset.fav)?favs.filter(f=>f!==fav.dataset.fav):[...favs,fav.dataset.fav];Store.set("favs",favs);renderMenu();}});const preset=new URLSearchParams(location.search).get("cat");if(preset&&CATS.includes(preset)){state.cat=preset;renderPills();renderMenu();}});
