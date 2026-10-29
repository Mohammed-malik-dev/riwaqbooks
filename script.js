const books = [
 {id:1,title:"أرض زيكولا",author:"عمرو عبد الحميد",category:"روايات",price:8500,old:10000,rating:"★★★★★",badge:"الأكثر مبيعاً",cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=85"},
 {id:2,title:"العادات الذرية",author:"جيمس كلير",category:"تطوير الذات",price:12000,old:14500,rating:"★★★★★",badge:"اختيار القراء",cover:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=85"},
 {id:3,title:"فن اللامبالاة",author:"مارك مانسون",category:"تطوير الذات",price:9500,old:null,rating:"★★★★☆",badge:"",cover:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=85"},
 {id:4,title:"قوة الآن",author:"إيكهارت تول",category:"تطوير الذات",price:11000,old:13000,rating:"★★★★★",badge:"خصم 15%",cover:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=400&q=85"},
 {id:5,title:"رحلات ابن بطوطة",author:"ابن بطوطة",category:"تاريخ",price:14000,old:null,rating:"★★★★☆",badge:"",cover:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=85"},
 {id:6,title:"مختصر تاريخ العالم",author:"إرنست غومبرتش",category:"تاريخ",price:13500,old:16000,rating:"★★★★★",badge:"جديد",cover:"https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=85"},
 {id:7,title:"رحلة إلى مركز الأرض",author:"جول فيرن",category:"علوم",price:7800,old:null,rating:"★★★★☆",badge:"",cover:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=400&q=85"},
 {id:8,title:"كيف تكسب الأصدقاء",author:"ديل كارنيجي",category:"أعمال",price:10500,old:12000,rating:"★★★★★",badge:"الأكثر طلباً",cover:"https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=85"},
 {id:9,title:"رسائل من القرآن",author:"أدهم شرقاوي",category:"روايات",price:9000,old:null,rating:"★★★★★",badge:"",cover:"https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=400&q=85"},
 {id:10,title:"الأمير الصغير",author:"أنطوان دو سانت",category:"أطفال",price:6500,old:7500,rating:"★★★★★",badge:"مناسب للجميع",cover:"https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=85"}
];
let cart = JSON.parse(localStorage.getItem("riwaq-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("riwaq-wishlist") || "[]");
let currentFilter = "الكل";
const featuredGrid = document.getElementById("featuredGrid");
const bestsellerGrid = document.getElementById("bestsellerGrid");
const toast = document.getElementById("toast");

function money(n){return n.toLocaleString("en-US")+" جنيه";}
function bookCard(book){
 const wished = wishlist.includes(book.id);
 return `<article class="book-card" data-id="${book.id}">
  <div class="book-cover-wrap"><img class="book-cover" src="${book.cover}" alt="غلاف كتاب ${book.title}" loading="lazy"><span class="book-badge" ${book.badge?"":"hidden"}>${book.badge}</span><button class="wish-btn ${wished?"active":""}" data-wish="${book.id}" aria-label="إضافة للمفضلة">${wished?"♥":"♡"}</button></div>
  <div class="book-info"><h3 title="${book.title}">${book.title}</h3><div class="book-author">${book.author}</div><div class="book-rating">${book.rating} <span>(تقييم القراء)</span></div><div class="price-line"><span class="price">${money(book.price)}</span>${book.old?`<span class="old-price">${money(book.old)}</span>`:""}</div><button class="add-cart" data-add="${book.id}">＋ أضف إلى السلة</button></div>
 </article>`;
}
function renderBooks(){
 const list=books.filter(b=>(currentFilter==="الكل"||b.category===currentFilter));
 featuredGrid.innerHTML=list.map(bookCard).join("")||'<p class="empty-results">لا توجد كتب في هذا التصنيف حالياً.</p>';
 bestsellerGrid.innerHTML=[...books].sort((a,b)=>b.id%3-a.id%3).slice(0,5).map(bookCard).join("");
 updateCart();
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderBooks();showToast("تمت إضافة الكتاب إلى سلتك ✓")}
function saveCart(){localStorage.setItem("riwaq-cart",JSON.stringify(cart));updateCart()}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("cartTotal").textContent=money(cart.reduce((sum,x)=>sum+(books.find(b=>b.id===x.id)?.price||0)*x.qty,0));
 const area=document.getElementById("cartItems");
 if(!cart.length){area.innerHTML='<p class="empty-cart">سلتك فارغة حالياً 📚</p>';return}
 area.innerHTML=cart.map(item=>{const b=books.find(x=>x.id===item.id);if(!b)return "";return `<div class="cart-row"><img src="${b.cover}" alt=""><div class="cart-row-info"><b>${b.title}</b><small>${money(b.price)}</small><div class="quantity"><button data-qty="${b.id}" data-delta="-1">−</button><span>${item.qty}</span><button data-qty="${b.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${b.id}">حذف</button></div>`}).join("");
}
function toggleWishlist(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];localStorage.setItem("riwaq-wishlist",JSON.stringify(wishlist));renderBooks();showToast(wishlist.includes(id)?"أُضيف الكتاب إلى المفضلة ♥":"تمت إزالة الكتاب من المفضلة")}
function setFilter(filter){currentFilter=filter;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b.dataset.filter===filter));renderBooks()}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){addToCart(Number(add.dataset.add));return}
 const wish=e.target.closest("[data-wish]");if(wish){toggleWishlist(Number(wish.dataset.wish));return}
 const filter=e.target.closest("[data-filter]");if(filter){setFilter(filter.dataset.filter);return}
 const cat=e.target.closest("[data-category]");if(cat){document.querySelectorAll(".category-card").forEach(x=>x.classList.remove("chosen"));cat.classList.add("chosen");setFilter(cat.dataset.category);document.getElementById("featured").scrollIntoView({behavior:"smooth"});return}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);saveCart();updateCart()}return}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));saveCart();updateCart();return}
});
const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>showToast(cart.length?"تم تجهيز السلة! اربط الموقع ببوابة دفع لإتمام الطلب.":"أضف كتاباً إلى السلة أولاً"));
document.getElementById("searchForm").addEventListener("submit",e=>{
 e.preventDefault();const q=document.getElementById("searchInput").value.trim().toLowerCase();
 const found=books.filter(b=>(b.title+" "+b.author+" "+b.category).toLowerCase().includes(q));
 featuredGrid.innerHTML=found.map(bookCard).join("")||'<p class="empty-results">لم نعثر على كتاب بهذا الاسم. جرّب كلمة أخرى.</p>';
 document.getElementById("featured").scrollIntoView({behavior:"smooth"});
});
document.getElementById("wishlistShortcut").addEventListener("click",()=>{
 const favs=books.filter(b=>wishlist.includes(b.id));
 featuredGrid.innerHTML=favs.map(bookCard).join("")||'<p class="empty-results">لم تضف كتباً إلى المفضلة بعد ♡</p>';
 document.getElementById("featured").scrollIntoView({behavior:"smooth"});
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("شكراً لاشتراكك في رسائل رِواق ✉");e.target.reset()});
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("navBar").classList.toggle("mobile-open"));
document.getElementById("prevFeatured").addEventListener("click",()=>featuredGrid.scrollBy({left:220,behavior:"smooth"}));
document.getElementById("nextFeatured").addEventListener("click",()=>featuredGrid.scrollBy({left:-220,behavior:"smooth"}));
renderBooks();