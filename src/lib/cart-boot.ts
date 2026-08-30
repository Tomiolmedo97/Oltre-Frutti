import { PRODUCTS, WHATSAPP_E164 } from "./products";

export const CART_STORAGE_KEY = "oltre-frutti-pedido";

const catalog = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, [p.name, p.price, p.unit] as const]),
);

export const CART_BOOT_SCRIPT = `(function(){
  if (window.__oltreBoot) return;
  window.__oltreBoot = true;
  var KEY = "${CART_STORAGE_KEY}";
  var WA = "${WHATSAPP_E164}";
  var CATALOG = ${JSON.stringify(catalog)};

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function checkout(){
    var s = read();
    return (s.state && s.state.checkout) || {name:"",address:"",neighborhood:"",notes:"",payment:""};
  }
  function items(){
    var s = read();
    return (s.state && s.state.items) || {};
  }
  function save(next){
    localStorage.setItem(KEY, JSON.stringify({ state: { items: next, checkout: checkout() }, version: 0 }));
  }
  function money(n){ return "$" + Math.round(Number(n)).toLocaleString("es-AR"); }
  function countOf(it){
    var n = 0;
    for (var k in it) if (Number(it[k] || 0) > 0) n += 1;
    return n;
  }
  function fmtQty(qty, unit){
    if (unit === "kg") {
      var g = Math.round(qty * 1000);
      if (g % 1000 === 0) return (g / 1000) + " kg";
      if (g >= 1000) return String(g / 1000).replace(".", ",") + " kg";
      return g + " g";
    }
    return qty + " " + unit;
  }
  function stepFor(unit){ return unit === "kg" ? 0.1 : 1; }
  function firstQty(unit){ return unit === "kg" ? 0.5 : 1; }
  function roundQty(qty, unit){
    if (qty <= 0) return 0;
    if (unit === "kg") {
      var g = Math.round(qty * 1000);
      return g < 50 ? 0 : g / 1000;
    }
    var n = Math.round(qty);
    return n < 1 ? 0 : n;
  }

  function toast(msg){
    var old = document.getElementById("oltre-fast-toast");
    if (old) old.remove();
    var n = document.createElement("div");
    n.id = "oltre-fast-toast";
    n.textContent = msg;
    n.setAttribute("role", "status");
    n.style.cssText = "position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);background:#1c5a30;color:#fffdf7;padding:.7rem 1.15rem;border-radius:999px;z-index:90;font:500 14px Figtree,system-ui,sans-serif;box-shadow:0 8px 24px rgba(21,36,24,.22)";
    document.body.appendChild(n);
    setTimeout(function(){ if (n.parentNode) n.remove(); }, 1400);
  }

  function badge(n){
    var el = document.getElementById("oltre-fast-badge");
    if (!el) {
      el = document.createElement("div");
      el.id = "oltre-fast-badge";
      el.style.cssText = "position:fixed;top:10px;right:14px;z-index:70;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#f4c400;color:#152418;font:700 12px Figtree,system-ui,sans-serif;display:none;place-items:center;pointer-events:none";
      document.body.appendChild(el);
    }
    el.textContent = String(n);
    el.style.display = n > 0 ? "grid" : "none";
  }

  function ensureCart(){
    var root = document.getElementById("oltre-fast-cart");
    if (root) return root;
    root = document.createElement("div");
    root.id = "oltre-fast-cart";
    root.innerHTML = '<div data-close-cart="1" style="position:absolute;inset:0;background:rgba(21,36,24,.5)"></div><aside style="position:relative;z-index:1;margin-left:auto;width:min(100%,28rem);height:100%;background:#f4efe4;color:#152418;display:flex;flex-direction:column"><div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(21,36,24,.08)"><h2 style="margin:0;font:600 1.4rem Oswald,sans-serif;letter-spacing:.02em;text-transform:uppercase">Tu pedido</h2><button type="button" data-close-cart="1" aria-label="Cerrar pedido" style="width:44px;height:44px;border:0;background:transparent;font-size:1.5rem;cursor:pointer">×</button></div><div id="oltre-fast-body" style="flex:1;overflow:auto"></div></aside>';
    document.body.appendChild(root);
    return root;
  }

  function paintCart(){
    var mount = document.getElementById("oltre-fast-body");
    if (!mount) return;
    var it = items();
    var ids = Object.keys(it);
    if (!ids.length) {
      mount.innerHTML = '<div style="padding:2.5rem 2rem;text-align:center"><p style="margin:0;font:600 1.4rem Oswald,sans-serif;text-transform:uppercase">Todavía vacío</p><p style="margin:.75rem 0 0;font-size:.9rem;color:#5c6b5e">Sumá productos del catálogo.</p><a href="#catalogo" data-close-cart="1" style="display:inline-flex;margin-top:1.25rem;height:48px;align-items:center;padding:0 1.5rem;border-radius:999px;background:#1c5a30;color:#fffdf7;text-decoration:none;font-weight:500">Ir al catálogo</a></div>';
      return;
    }
    var total = 0;
    var html = '<ul style="list-style:none;margin:0;padding:.75rem 1rem">';
    for (var i=0;i<ids.length;i++) {
      var id = ids[i];
      var meta = CATALOG[id];
      if (!meta) continue;
      var qty = Number(it[id]);
      var line = Math.round(qty * meta[1]);
      total += line;
      html += '<li style="display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.75rem 0;border-bottom:1px solid rgba(21,36,24,.08)"><div style="min-width:0;flex:1"><p style="margin:0;font:600 1.05rem Oswald,sans-serif;text-transform:uppercase">'+meta[0]+'</p><p style="margin:.15rem 0 0;font-size:.75rem;color:#5c6b5e">'+fmtQty(qty, meta[2])+' · '+money(meta[1])+'</p></div><div style="display:flex;align-items:center;gap:.25rem;flex-shrink:0"><button type="button" data-dec="'+id+'" style="width:44px;height:44px;border:1px solid rgba(28,90,48,.2);border-radius:999px;background:#fffdf7;color:#1c5a30;font-size:1.2rem;cursor:pointer">−</button><span style="min-width:1.5rem;text-align:center;font:600 1rem Oswald,sans-serif">'+fmtQty(qty, meta[2])+'</span><button type="button" data-add="'+id+'" style="width:44px;height:44px;border:1px solid rgba(28,90,48,.2);border-radius:999px;background:#fffdf7;color:#1c5a30;font-size:1.2rem;cursor:pointer">+</button></div></li>';
    }
    html += '</ul><div style="padding:1rem 1.25rem 1.25rem;border-top:1px solid rgba(21,36,24,.08);background:#fffdf7"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:.9rem;color:#5c6b5e">Total</span><span style="font:600 1.75rem Oswald,sans-serif">'+money(total)+'</span></div><a data-whatsapp="1" href="#" style="display:flex;margin-top:.75rem;height:48px;align-items:center;justify-content:center;border-radius:999px;background:#1c5a30;color:#fffdf7;text-decoration:none;font-weight:500">Pedir por WhatsApp</a></div>';
    mount.innerHTML = html;
  }

  function openCart(){
    window.__OLTRE_CART_OPEN = true;
    var root = ensureCart();
    paintCart();
    root.className = "is-open";
    root.style.cssText = "position:fixed;inset:0;z-index:80;display:flex;justify-content:flex-end";
    document.body.style.overflow = "hidden";
  }
  function closeCart(){
    window.__OLTRE_CART_OPEN = false;
    var root = document.getElementById("oltre-fast-cart");
    if (root) { root.className = ""; root.style.display = "none"; }
    document.body.style.overflow = "";
  }

  function setQty(id, qty){
    var it = items();
    if (qty <= 0) delete it[id];
    else it[id] = qty;
    save(it);
    badge(countOf(it));
    var root = document.getElementById("oltre-fast-cart");
    if (root && root.style.display !== "none" && root.className === "is-open") paintCart();
    return it[id] || 0;
  }

  function waHref(){
    var it = items();
    var ch = checkout();
    var lines = [];
    var total = 0;
    for (var id in it) {
      var meta = CATALOG[id];
      if (!meta) continue;
      var qty = Number(it[id]);
      var line = Math.round(qty * meta[1]);
      total += line;
      lines.push("• " + fmtQty(qty, meta[2]) + " " + meta[0] + " — " + money(line));
    }
    var details = ["Nombre: " + (ch.name||""), "Dirección: " + (ch.address||"")];
    if (ch.neighborhood) details.push("Barrio: " + ch.neighborhood);
    if (ch.payment) details.push("Pago: " + ch.payment);
    if (ch.notes) details.push("Nota: " + ch.notes);
    var text = "Hola Oltre Frutti! Quiero hacer este pedido:\\n\\n" + lines.join("\\n") + "\\n\\nTotal: " + money(total) + "\\n\\n" + details.join("\\n");
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  }

  document.addEventListener("click", function(e){
    if (window.__OLTRE_READY) return;
    var t = e.target;
    if (!t || !t.closest) return;
    var open = t.closest("[data-open-cart]");
    var close = t.closest("[data-close-cart]");
    var wa = t.closest("[data-whatsapp]");
    var add = t.closest("[data-add]");
    var dec = t.closest("[data-dec]");
    if (!open && !close && !wa && !add && !dec) return;
    e.preventDefault();
    e.stopPropagation();
    if (open) { openCart(); return; }
    if (close) { closeCart(); return; }
    if (wa) { wa.setAttribute("href", waHref()); window.open(waHref(), "_blank", "noopener,noreferrer"); return; }
    var id = (add && add.getAttribute("data-add")) || (dec && dec.getAttribute("data-dec"));
    if (!id) return;
    var it = items();
    var meta = CATALOG[id] || ["", 0, "unidad"];
    var unit = meta[2];
    var qty = Number(it[id] || 0);
    if (add) qty = qty <= 0 ? firstQty(unit) : qty + stepFor(unit);
    else qty = qty - stepFor(unit);
    qty = roundQty(qty, unit);
    setQty(id, qty);
    if (add && meta[0]) toast(meta[0] + " " + fmtQty(qty, unit) + " sumado al pedido");
  }, true);

  badge(countOf(items()));
})();`;
