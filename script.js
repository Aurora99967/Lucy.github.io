/* ===================================================================
   GlobalMart — 首页交互脚本
   - 商品渲染 / 多币种 / 多语言 / 轮播 / 购物车 / 倒计时 / 移动菜单
   =================================================================== */

/* ---------- 商品数据（基准价以 USD 计，演示用） ---------- */
const PRODUCTS = [
  { emoji:"📱", title:"4G 三防工业手机 解锁版",        rating:4.6, reviews:1280, price:189, moq:"起批 10 件", tag:"畅销" },
  { emoji:"🎧", title:"无线降噪蓝牙耳机 入耳式",        rating:4.4, reviews:3420, price:25.9, moq:"起批 50 件", tag:"爆款" },
  { emoji:"💡", title:"太阳能庭院灯 LED 防水",           rating:4.7, reviews:890,  price:8.5,  moq:"起批 100 件", tag:"新品" },
  { emoji:"🧴", title:"便携美容仪 负离子导入",           rating:4.3, reviews:560,  price:32,   moq:"起批 20 件", tag:"" },
  { emoji:"⌚", title:"智能手表 心率血氧监测",            rating:4.5, reviews:2100, price:21.5, moq:"起批 30 件", tag:"热卖" },
  { emoji:"👜", title:"真皮通勤双肩包 大容量",            rating:4.6, reviews:740,  price:45,   moq:"起批 5 件", tag:"" },
  { emoji:"🔌", title:"65W 氮化镓快充充电器",            rating:4.8, reviews:1560, price:13.9, moq:"起批 50 件", tag:"好评" },
  { emoji:"👟", title:"轻量运动跑鞋 透气网面",            rating:4.4, reviews:980,  price:28,   moq:"起批 20 件", tag:"" },
  { emoji:"🪑", title:"人体工学办公椅 可躺",              rating:4.5, reviews:430,  price:99,   moq:"起批 5 件", tag:"优选" },
  { emoji:"🍵", title:"有机绿茶礼盒 出口装",              rating:4.7, reviews:610,  price:18,   moq:"起批 30 盒", tag:"" },
];

/* ---------- 静态汇率（演示，USD 为基准） ---------- */
const RATES = { USD:1, CNY:7.18, EUR:0.92, GBP:0.79, JPY:151 };
const SYMBOL = { USD:"$", CNY:"¥", EUR:"€", GBP:"£", JPY:"¥" };

let currentCurrency = "USD";

function formatPrice(usd){
  const v = usd * RATES[currentCurrency];
  const symbol = SYMBOL[currentCurrency];
  const decimals = currentCurrency === "JPY" ? 0 : 2;
  return symbol + v.toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
}

/* ---------- 渲染商品 ---------- */
function renderProducts(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map((p,i)=>`
    <div class="product-card">
      <div class="product-thumb">${p.emoji}</div>
      <div class="product-body">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:`<span class="product-tag" style="visibility:hidden">·</span>`}
        <div class="product-title">${p.title}</div>
        <div class="product-rating"><span class="stars">${"★".repeat(Math.round(p.rating))}</span> ${p.rating} (${p.reviews.toLocaleString()})</div>
        <div class="product-price">${formatPrice(p.price)} <small>/ 件</small></div>
        <div class="product-meta">${p.moq} · 全球直发</div>
        <button class="product-btn" data-i18n="addCart" onclick="addToCart(${i})">加入购物车</button>
      </div>
    </div>`).join("");
}

/* ---------- 购物车 ---------- */
let cart = 0;
function addToCart(i){
  cart++;
  document.getElementById("cartCount").textContent = cart;
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = (LANG==="zh"?"已加入 ✓":"Added ✓");
  btn.style.background = "var(--green)";
  btn.style.color = "#fff";
  setTimeout(()=>{ btn.textContent = original; btn.style.background=""; btn.style.color=""; }, 1200);
}

/* ---------- 货币切换 ---------- */
document.getElementById("currency").addEventListener("change", e=>{
  currentCurrency = e.target.value;
  renderProducts();
});

/* ---------- 多语言 ---------- */
const I18N = {
  zh:{
    language:"语言", help:"帮助", sell:"开店入驻", hello:"您好", account:"账户 / 登录",
    ordersSmall:"查看", orders:"我的订单", cart:"购物车",
    searchPh:"搜索数百万跨境商品…", deals:"今日特惠", wholesale:"批发采购", global:"全球馆",
    cElec:"电子数码", cApp:"服装纺织", cMach:"机械工业", cHome:"家居园艺",
    cBeauty:"美妆个护", cFood:"食品生鲜", cAuto:"汽配零件", cMore:"更多分类",
    limited:"限时秒杀", dealTitle:"⚡ 今日特惠", dealH:"精选爆款 低至 5 折",
    catTitle:"🛍️ 按分类选购", trend:"热门：",
    dealP:"每日更新，先到先得。支持多币种结算与全球配送。", grab:"抢购 →",
    featTitle:"🔥 精选商品", seeAll:"查看全部 ›", addCart:"加入购物车",
    t1:"全球配送", t1s:"覆盖 200+ 国家与地区", t2:"安全支付", t2s:"多币种 · 加密结算",
    t3:"无忧退换", t3s:"30 天跨境退换保障", t4:"7×24 支持", t4s:"多语言客服团队",
    fGet:"购物指南", fSell:"商家服务", fAbout:"关于我们", fRegion:"选择地区",
    copy:"© 2026 GlobalMart International Trading Co. 跨境商品贸易平台 · 仅供演示",
    hero1Title:"连接全球供应商与买家", hero1Sub:"百万级 SKU，直连工厂与品牌，一站式全球采购。", shopNow:"立即选购 →",
    hero2Title:"批量采购，更低单价", hero2Sub:"注册企业账户，解锁阶梯报价与专属客户经理。", learnMore:"了解批发 →",
    hero3Title:"200+ 国家与地区送达", hero3Sub:"清关、税费预估与全程追踪，跨境更省心。", trackShip:"查询物流 →",
  },
  en:{
    language:"Language", help:"Help", sell:"Sell on GlobalMart", hello:"Hello", account:"Account / Sign in",
    ordersSmall:"View", orders:"My Orders", cart:"Cart",
    searchPh:"Search millions of cross-border products…", deals:"Today's Deals", wholesale:"Wholesale", global:"Global Store",
    cElec:"Electronics", cApp:"Apparel", cMach:"Machinery", cHome:"Home & Garden",
    cBeauty:"Beauty", cFood:"Grocery", cAuto:"Auto Parts", cMore:"More",
    limited:"Flash Sale", dealTitle:"⚡ Today's Deals", dealH:"Top Picks Up to 50% Off",
    catTitle:"🛍️ Shop by Category", trend:"Popular:",
    dealP:"Updated daily. Multi-currency checkout & worldwide delivery.", grab:"Shop Now →",
    featTitle:"🔥 Featured Products", seeAll:"See all ›", addCart:"Add to Cart",
    t1:"Worldwide Shipping", t1s:"200+ countries & regions", t2:"Secure Payment", t2s:"Multi-currency · encrypted",
    t3:"Easy Returns", t3s:"30-day cross-border warranty", t4:"24/7 Support", t4s:"Multilingual team",
    fGet:"Shopping Guide", fSell:"For Sellers", fAbout:"About Us", fRegion:"Select Region",
    copy:"© 2026 GlobalMart International Trading Co. Cross-border marketplace · Demo only",
    hero1Title:"Connect Global Suppliers & Buyers", hero1Sub:"Millions of SKUs, direct from factories & brands.", shopNow:"Shop Now →",
    hero2Title:"Buy in Bulk, Pay Less", hero2Sub:"Open a business account for tiered pricing & managers.", learnMore:"Learn More →",
    hero3Title:"Delivered to 200+ Regions", hero3Sub:"Customs, tax estimates & tracking made easy.", trackShip:"Track Order →",
  }
};
let LANG = "zh";
function applyLang(){
  document.documentElement.lang = LANG==="zh"?"zh-CN":"en";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(I18N[LANG][key]!==undefined) el.textContent = I18N[LANG][key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const key = el.getAttribute("data-i18n-ph");
    if(I18N[LANG][key]!==undefined) el.placeholder = I18N[LANG][key];
  });
  document.getElementById("langLabel").textContent = LANG==="zh"?"中文":"EN";
  renderProducts();
}
document.getElementById("langBtn").addEventListener("click", ()=>{
  LANG = LANG==="zh"?"en":"zh";
  applyLang();
});

/* ---------- 轮播 ---------- */
const slides = document.querySelectorAll(".hero-slide");
const dotsWrap = document.getElementById("heroDots");
let cur = 0;
slides.forEach((_,i)=>{
  const s = document.createElement("span");
  if(i===0) s.classList.add("active");
  s.addEventListener("click",()=>goSlide(i));
  dotsWrap.appendChild(s);
});
function goSlide(i){
  slides[cur].classList.remove("active");
  dotsWrap.children[cur].classList.remove("active");
  cur = (i+slides.length)%slides.length;
  slides[cur].classList.add("active");
  dotsWrap.children[cur].classList.add("active");
}
document.getElementById("heroNext").addEventListener("click",()=>goSlide(cur+1));
document.getElementById("heroPrev").addEventListener("click",()=>goSlide(cur-1));
let heroTimer = setInterval(()=>goSlide(cur+1),5000);
document.querySelector(".hero").addEventListener("mouseenter",()=>clearInterval(heroTimer));
document.querySelector(".hero").addEventListener("mouseleave",()=>heroTimer=setInterval(()=>goSlide(cur+1),5000));

/* ---------- 倒计时 ---------- */
let remain = 2*3600 + 14*60 + 36;
const timerEl = document.getElementById("dealTimer");
setInterval(()=>{
  remain = remain>0 ? remain-1 : 0;
  const h = String(Math.floor(remain/3600)).padStart(2,"0");
  const m = String(Math.floor(remain%3600/60)).padStart(2,"0");
  const s = String(remain%60).padStart(2,"0");
  timerEl.innerHTML = `<span>${h}</span>:<span>${m}</span>:<span>${s}</span>`;
},1000);

/* ---------- 移动菜单 ---------- */
document.getElementById("menuToggle").addEventListener("click",()=>{
  document.getElementById("deptNav").classList.toggle("open");
});

/* ---------- 搜索（简单演示） ---------- */
document.getElementById("searchInput").addEventListener("keydown",e=>{
  if(e.key==="Enter") alert((LANG==="zh"?"搜索：":"Search: ")+e.target.value);
});

/* ---------- 初始化 ---------- */
applyLang();
renderProducts();
