const PRODUCTS = [
  {id:1,name:'Torta Chocolate',category:'chocolate',tag:'Favorita',price:24990,desc:'Torta de chocolate inspirada en las preparaciones que aparecen públicamente asociadas a Zury's.',img:'https://img02.restaurantguru.com/cf18-La-Cafeteria-de-Zurys-Maipu-chocolate-cake.jpg'},
  {id:2,name:'Red Velvet',category:'clasica',tag:'Clásica',price:25990,desc:'Bizcocho rojo y crema, presentada como opción demostrativa para el catálogo.',img:'https://img02.restaurantguru.com/cae0-La-Cafeteria-de-Zurys-Maipu-red-velvet-cake.jpg'},
  {id:3,name:'Torta de la Casa',category:'especial',tag:'Zury's',price:28990,desc:'Propuesta especial para celebraciones, con personalización de mensaje y fecha.',img:'https://img02.restaurantguru.com/cf5a-La-Cafeteria-de-Zurys-Maipu-dishes.jpg'},
  {id:4,name:'Torta Frutal',category:'frutal',tag:'Fresca',price:26990,desc:'Opción frutal de demostración para mostrar variedad dentro de la tienda.',img:'https://img02.restaurantguru.com/c478-La-Cafeteria-de-Zurys-Maipu-food.jpg'},
  {id:5,name:'Chocolate Intenso',category:'chocolate',tag:'Chocolate',price:27990,desc:'Una alternativa intensa para destacar la línea de tortas de chocolate.',img:'https://img02.restaurantguru.com/cf18-La-Cafeteria-de-Zurys-Maipu-chocolate-cake.jpg'},
  {id:6,name:'Red Velvet Especial',category:'especial',tag:'Celebración',price:29990,desc:'Versión demostrativa para cumpleaños y pedidos especiales.',img:'https://img02.restaurantguru.com/c6d8-La-Cafeteria-de-Zurys-red-velvet-cake.jpg'},
  {id:7,name:'Porción & Café',category:'clasica',tag:'Cafetería',price:8990,desc:'Ejemplo de venta complementaria para sumar porciones y bebidas al pedido.',img:'https://img02.restaurantguru.com/cccd-La-Cafeteria-de-Zurys-Maipu-beverage.jpg'},
  {id:8,name:'Caja Dulce',category:'especial',tag:'Especial',price:21990,desc:'Producto demostrativo para regalos, celebraciones o pedidos corporativos.',img:'https://img02.restaurantguru.com/c652-La-Cafeteria-de-Zurys-Maipu-meals.jpg'}
];

let cart = JSON.parse(localStorage.getItem('zurys-demo-cart') || '[]');
const fmt = value => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(value);
const grid = document.getElementById('productGrid');
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');

function renderProducts(filter='all'){
  const items = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===filter);
  grid.innerHTML = items.map(p=>`<article class="product-card">
    <div class="product-media"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div>
    <div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${fmt(p.price)}</span><button class="add-cart" onclick="addToCart(${p.id})" aria-label="Agregar ${p.name}">＋</button></div></div>
  </article>`).join('');
}

function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += 1; else cart.push({id,qty:1});
  saveCart();
  showToast('Agregado al carrito 💕');
}
function changeQty(id,delta){
  const item = cart.find(i=>i.id===id); if(!item)return;
  item.qty += delta; if(item.qty<=0) cart = cart.filter(i=>i.id!==id); saveCart();
}
function removeItem(id){cart=cart.filter(i=>i.id!==id);saveCart();}
function saveCart(){localStorage.setItem('zurys-demo-cart',JSON.stringify(cart));renderCart();}
function renderCart(){
  const count=cart.reduce((a,i)=>a+i.qty,0); document.getElementById('cartCount').textContent=count;
  const has=count>0; cartEmpty.style.display=has?'none':'block'; cartFooter.style.display=has?'block':'none';
  cartItems.innerHTML=cart.map(i=>{const p=PRODUCTS.find(p=>p.id===i.id);return `<div class="cart-item"><img src="${p.img}" alt="${p.name}"><div><h4>${p.name}</h4><small>${fmt(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">＋</button></div></div><button class="remove" onclick="removeItem(${p.id})" aria-label="Eliminar">×</button></div>`}).join('');
  const total=cart.reduce((sum,i)=>sum+PRODUCTS.find(p=>p.id===i.id).price*i.qty,0);document.getElementById('cartTotal').textContent=fmt(total);
}
function openCart(){drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll')}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('open');drawer.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
function showToast(text){const t=document.getElementById('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}

document.getElementById('openCart').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderProducts(btn.dataset.filter)}));
const navToggle=document.querySelector('.nav-toggle'),mainNav=document.querySelector('.main-nav');navToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');navToggle.setAttribute('aria-expanded',open)});mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));

document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(!cart.length)return;
  const date=document.getElementById('orderDate').value||'Por coordinar'; const note=document.getElementById('orderNote').value.trim()||'Sin observaciones';
  const lines=cart.map(i=>{const p=PRODUCTS.find(p=>p.id===i.id);return `• ${i.qty}x ${p.name} — ${fmt(p.price*i.qty)}`});
  const total=cart.reduce((sum,i)=>sum+PRODUCTS.find(p=>p.id===i.id).price*i.qty,0);
  const msg=`Hola Zury's! 🍰 Quiero cotizar este pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${fmt(total)}\nFecha deseada: ${date}\nDedicatoria/observaciones: ${note}\n\nEnviado desde la demo web.`;
  window.open(`https://wa.me/56911111111?text=${encodeURIComponent(msg)}`,'_blank');
});

renderProducts();renderCart();
