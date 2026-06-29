/* ============================================================
   TPV - HORT SANT PATRICI S.L. - SNACKS BAR v2
   CIF: B57442501
   Funciones: Mesas, Tickets Abiertos, Pre-factura, Cierre, Veri*Factu
   ============================================================ */

const EMPRESA = {
    nombre: "HORT SANT PATRICI S.L.",
    cif: "B57442501",
    direccion: "Camí de Sant Patrici S/N",
    telefono: "+34 971 71 37 16",
    cajero: "Admin",
    serie: "SP"   // Serie de facturación Veri*Factu
};

// 🔗 CONFIGURACIÓN GOOGLE SHEETS
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzzhsfTlw8wGKtyRjZRTKdazrX6QaYkHAun8E-Krm_asKVwfo4HusAu-sR5p4GCDdG5Pw/exec";

// 🖼️ LOGO DE LA EMPRESA (para el ticket)
const LOGO_URL = "https://santpatrici.es/wp-content/uploads/sites/98/2026/02/Logo-8.png";

// 🪑 CONFIGURACIÓN MESAS
const CONFIG_MESAS = {
    salon: 12,         // Número de mesas en salón (T1...T12)
    barra: 4,          // Tabures en barra (B1...B4)
    paraLlevar: true   // Habilitar tickets "Para llevar"
};

// ============== CATÁLOGO DE PRODUCTOS ==============
const PRODUCTOS = [
    { id: 100, cat: "Tablas", nombre: "Tabla quesos Sant Patrici", precio: 16.00, iva: 10 },
    { id: 101, cat: "Tablas", nombre: "Tabla jamón ibérico",       precio: 18.00, iva: 10 },
    { id: 102, cat: "Tablas", nombre: "Tabla Sant Patrici",          precio: 20.00, iva: 10 },
    { id: 200, cat: "Snacks", nombre: "Mini cóctel frutos secos",   precio: 1.80,  iva: 10 },
    { id: 201, cat: "Snacks", nombre: "Gilda de anchoa (ud.)",      precio: 2.00,  iva: 10 },
    { id: 202, cat: "Snacks", nombre: "Patatas clásicas",           precio: 2.50,  iva: 10 },
    { id: 203, cat: "Snacks", nombre: "Patatas pimienta",           precio: 2.70,  iva: 10 },
    { id: 204, cat: "Snacks", nombre: "Aceitunas rellenas",         precio: 4.40,  iva: 10 },
    { id: 205, cat: "Snacks", nombre: "Mejillones escabeche",       precio: 5.80,  iva: 10 },
    { id: 206, cat: "Snacks", nombre: "Berberechos al natural",     precio: 15.40, iva: 10 },
    { id: 207, cat: "Snacks", nombre: "Sandwich de Jamón y Queso",  precio: 8.50, iva: 10 },
    { id: 208, cat: "Snacks", nombre: "Sandwich de Sobrasada,Queso y Miel",  precio: 9.50, iva: 10 },
    { id: 250, cat: "Tapas", nombre: "Pan cristal con tomate",      precio: 6.00,  iva: 10 },
    { id: 251, cat: "Tapas", nombre: "Croquetas de Jamón Ibérico",  precio: 9.00,  iva: 10 },
    { id: 252, cat: "Tapas", nombre: "Croquetas de Boletus y Trufa",  precio: 9.00,  iva: 10 },
    { id: 253, cat: "Tapas", nombre: "Patatas Bravas",              precio: 8.50,  iva: 10 },
    { id: 254, cat: "Tapas", nombre: "Ensalada de la Huerta",       precio: 11.00,  iva: 10 },
    { id: 255, cat: "Tapas", nombre: "Ensalada Sant Patrici",       precio: 12.00,  iva: 10 },
    { id: 256, cat: "Tapas", nombre: "Ensalada de Pera y Queso Curado",  precio: 11.00,  iva: 10 },
    { id: 257, cat: "Tapas", nombre: "Vaso Gazpacho",               precio: 4.50,  iva: 10 },
    { id: 300, cat: "Cervezas", nombre: "Estrella Galicia 0.0",     precio: 4.00,  iva: 10 },
    { id: 301, cat: "Cervezas", nombre: "Estrella Galicia",         precio: 4.50,  iva: 10 },
    { id: 302, cat: "Cervezas", nombre: "Grahame Pearce Larger",    precio: 4.50,  iva: 10 },
    { id: 400, cat: "Refrescos", nombre: "Coca-Cola",               precio: 3.40,  iva: 10 },
    { id: 401, cat: "Refrescos", nombre: "Coca-Cola Zero",          precio: 3.40,  iva: 10 },
    { id: 402, cat: "Refrescos", nombre: "Fanta Limón",             precio: 3.40,  iva: 10 },
    { id: 403, cat: "Refrescos", nombre: "Fanta Naranja",           precio: 3.40,  iva: 10 },
    { id: 404, cat: "Refrescos", nombre: "Sprite",                  precio: 3.40,  iva: 10 },
    { id: 500, cat: "Vinos Copa", nombre: "Es Moll Rosado (copa)",      precio: 4.50, iva: 10 },
    { id: 501, cat: "Vinos Copa", nombre: "Es Rupit Blanco (copa)",     precio: 5.00, iva: 10 },
    { id: 502, cat: "Vinos Copa", nombre: "Sa Vermella Tinto (copa)",   precio: 6.00, iva: 10 },
    { id: 600, cat: "Vinos Botella", nombre: "Es Moll Rosado",          precio: 18.00, iva: 10 },
    { id: 601, cat: "Vinos Botella", nombre: "Es Rupit Blanco",         precio: 19.00, iva: 10 },
    { id: 602, cat: "Vinos Botella", nombre: "Sa Vermella Tinto",       precio: 22.00, iva: 10 },
    { id: 603, cat: "Vinos Botella", nombre: "Torralbenc Tinto",        precio: 31.40, iva: 10 },
    { id: 604, cat: "Vinos Botella", nombre: "Torralbenc Blanco",       precio: 26.60, iva: 10 },
    { id: 605, cat: "Vinos Botella", nombre: "Torralbenc Rosado",       precio: 24.20, iva: 10 },
    { id: 606, cat: "Vinos Botella", nombre: "Sa Caterina Rosado",      precio: 30.90, iva: 10 },
    { id: 607, cat: "Vinos Botella", nombre: "Sa Caterina Blanco",      precio: 38.00, iva: 10 },
    { id: 608, cat: "Vinos Botella", nombre: "Alba Rosado",             precio: 29.40, iva: 10 },
    { id: 609, cat: "Vinos Botella", nombre: "Sa Forana Blanco",        precio: 25.70, iva: 10 },
    { id: 610, cat: "Vinos Botella", nombre: "Alba Garnacha Blanco",    precio: 32.00, iva: 10 },
    { id: 611, cat: "Vinos Botella", nombre: "Alba Malvasía Blanco",    precio: 32.00, iva: 10 },
    { id: 612, cat: "Vinos Botella", nombre: "Vinya Sa Cudia Blanco",   precio: 39.00, iva: 10 },
    { id: 613, cat: "Vinos Botella", nombre: "Sa Cudia Blanco",         precio: 34.90, iva: 10 },
    { id: 700, cat: "Café", nombre: "Café",                             precio: 3.00,  iva: 10 },
    { id: 800, cat: "Té/Infusión", nombre: "Té/Infusión",               precio: 3.00,  iva: 10 },
    { id: 900, cat: "Agua", nombre: "Agua",                             precio: 3.00,  iva: 10 },
];

// ============== ESTADO ==============
let vista = "mesas"; // "mesas" o "productos"
let mesaActiva = null;     // p.ej. "T3", "B1", "PARA_LLEVAR_1"
let ticket = [];
let categoriaActiva = "Todos";
let formaPagoSeleccionada = null;

// localStorage
let numeroTicket = parseInt(localStorage.getItem('tpv_numeroTicket') || '1');
let ticketsAbiertos = JSON.parse(localStorage.getItem('tpv_ticketsAbiertos') || '{}');
let ventasDia = JSON.parse(localStorage.getItem('tpv_ventasDia') || '[]');
let fechaApertura = localStorage.getItem('tpv_fechaApertura') || new Date().toISOString();

if (!localStorage.getItem('tpv_fechaApertura')) {
    localStorage.setItem('tpv_fechaApertura', fechaApertura);
}

// ============== INICIO ==============
document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    document.getElementById('cajero-actual').textContent = EMPRESA.cajero;
    const estado = document.getElementById('estado-sheets');
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('https://')) {
        estado.textContent = '📊 Sheets: ✅ Conectado';
    } else {
        estado.textContent = '📊 Sheets: ⚠️ No configurado';
    }
    mostrarMesas();
});

// ============================================================
// ===== IMPRESIÓN VÍA RAWBT (Netum Bluetooth) ================
// ============================================================
const ANCHO_TICKET = 32; // 32 para 58mm, 48 para 80mm

function rbtLinea(c = '-') { return c.repeat(ANCHO_TICKET); }
function rbtCentrar(txt) {
    if (txt.length >= ANCHO_TICKET) return txt;
    const esp = Math.floor((ANCHO_TICKET - txt.length) / 2);
    return ' '.repeat(esp) + txt;
}
function rbtFila(izq, der) {
    izq = String(izq); der = String(der);
    if (izq.length + der.length >= ANCHO_TICKET) {
        izq = izq.substring(0, ANCHO_TICKET - der.length - 1);
    }
    const esp = ANCHO_TICKET - izq.length - der.length;
    return izq + ' '.repeat(esp) + der;
}
function rbtProducto(cantidad, nombre, total) {
    const totalStr = total.toFixed(2);
    const prefijo = cantidad + 'x ';
    const maxNombre = ANCHO_TICKET - prefijo.length - totalStr.length - 1;
    let n = nombre.length > maxNombre ? nombre.substring(0, maxNombre) : nombre;
    const esp = ANCHO_TICKET - prefijo.length - n.length - totalStr.length;
    return prefijo + n + ' '.repeat(esp) + totalStr;
}

function enviarARawBT(texto) {
    try {
        // Codifica respetando UTF-8 (acentos y ñ)
        const base64 = btoa(unescape(encodeURIComponent(texto)));
        const url = 'rawbt:base64,' + base64;
        window.location.href = url;
        return true;
    } catch (e) {
        console.error('Error RawBT:', e);
        alert('No se pudo enviar a RawBT.\n' + e.message);
        return false;
    }
}

function construirTextoTicket(datos) {
    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}`;
    const esPref = datos.prefactura === true;

    let t = '';
    t += rbtCentrar(EMPRESA.nombre) + '\n';
    t += rbtCentrar('CIF: ' + EMPRESA.cif) + '\n';
    t += rbtCentrar(EMPRESA.direccion) + '\n';
    t += rbtCentrar('Tel: ' + EMPRESA.telefono) + '\n';
    t += rbtLinea('=') + '\n';

    if (esPref) {
        t += rbtCentrar('*** PRE-FACTURA ***') + '\n';
        t += rbtCentrar('NO ES UN TICKET') + '\n';
        t += rbtLinea('=') + '\n';
    }

    t += rbtFila(esPref ? 'Doc:' : 'Ticket:', datos.numeroTicket) + '\n';
    t += rbtFila('Fecha:', fechaStr + ' ' + horaStr) + '\n';
    t += rbtFila('Cajero:', datos.cajero) + '\n';
    if (datos.mesa) t += rbtFila('Mesa:', datos.mesa) + '\n';
    t += rbtLinea() + '\n';

    datos.productos.forEach(p => {
        t += rbtProducto(p.cantidad, p.nombre, p.cantidad * p.precio) + '\n';
    });

    t += rbtLinea() + '\n';

    const iv = datos.ivas;
    if (iv[10] && iv[10].base > 0) {
        t += rbtFila('Base 10%:', iv[10].base.toFixed(2) + ' E') + '\n';
        t += rbtFila('IVA 10%:',  iv[10].cuota.toFixed(2) + ' E') + '\n';
    }
    if (iv[21] && iv[21].base > 0) {
        t += rbtFila('Base 21%:', iv[21].base.toFixed(2) + ' E') + '\n';
        t += rbtFila('IVA 21%:',  iv[21].cuota.toFixed(2) + ' E') + '\n';
    }

    t += rbtLinea('=') + '\n';
    t += rbtFila('TOTAL:', datos.total.toFixed(2) + ' EUR') + '\n';
    t += rbtLinea('=') + '\n';
    t += rbtFila('Pago:', datos.formaPago) + '\n';


    t += rbtLinea() + '\n';
    if (esPref) {
        t += rbtCentrar('Documento informativo') + '\n';
        t += rbtCentrar('Solicite ticket al pagar') + '\n';
    } else {
        t += rbtCentrar('Gracias por su visita') + '\n';
        t += rbtCentrar('Moltes gracies!') + '\n';
    }
    t += '\n\n\n'; // alimentación final
    return t;
}

function construirTextoCierre(stats, fechaCierre) {
    const fStr = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    let t = '';
    t += rbtCentrar(EMPRESA.nombre) + '\n';
    t += rbtCentrar('CIF: ' + EMPRESA.cif) + '\n';
    t += rbtLinea('=') + '\n';
    t += rbtCentrar('*** CIERRE DE CAJA ***') + '\n';
    t += rbtLinea('=') + '\n';
    t += rbtFila('Apertura:', fStr(new Date(fechaApertura))) + '\n';
    t += rbtFila('Cierre:', fStr(fechaCierre)) + '\n';
    t += rbtFila('Cajero:', EMPRESA.cajero) + '\n';
    t += rbtFila('Tickets:', stats.numTickets) + '\n';
    t += rbtLinea() + '\n';
    t += rbtCentrar('FORMAS DE PAGO') + '\n';
    t += rbtFila('Efectivo:', stats.efectivo.toFixed(2) + ' E') + '\n';
    t += rbtFila('Tarjeta:', stats.tarjeta.toFixed(2) + ' E') + '\n';
    t += rbtFila('Bizum:', stats.bizum.toFixed(2) + ' E') + '\n';
    t += rbtFila('Transfer:', stats.transferencia.toFixed(2) + ' E') + '\n';
    t += rbtLinea() + '\n';
    t += rbtCentrar('DESGLOSE IVA') + '\n';
    t += rbtFila('Base 10%:', stats.base10.toFixed(2) + ' E') + '\n';
    t += rbtFila('Cuota 10%:', stats.cuota10.toFixed(2) + ' E') + '\n';
    if (stats.base21 > 0) {
        t += rbtFila('Base 21%:', stats.base21.toFixed(2) + ' E') + '\n';
        t += rbtFila('Cuota 21%:', stats.cuota21.toFixed(2) + ' E') + '\n';
    }
    t += rbtLinea() + '\n';
    t += rbtCentrar('TOP PRODUCTOS') + '\n';
    stats.topProductos.forEach(p => {
        t += rbtProducto(p.cantidad, p.nombre, p.total) + '\n';
    });
    t += rbtLinea('=') + '\n';
    t += rbtFila('TOTAL DIA:', stats.total.toFixed(2) + ' EUR') + '\n';
    t += rbtLinea('=') + '\n';
    t += '\n\n\n';
    return t;
}

function actualizarFechaHora() {
    const ahora = new Date();
    document.getElementById('fecha-hora').textContent =
        `${ahora.toLocaleDateString('es-ES')} ${ahora.toLocaleTimeString('es-ES')}`;
}

// ============== NAVEGACIÓN MÓVIL (modo camarero) ==============
function toggleMobileTicket() {
    document.body.classList.toggle('ver-ticket');
}

// ============== MESAS ==============
function mostrarMesas() {
    vista = "mesas";
    mesaActiva = null;
    ticket = [];
    document.body.classList.remove('ver-ticket'); // cerrar vista ticket en móvil
    document.getElementById('ticket-mesa-actual').style.display = 'none';
    
    const zona = document.getElementById('zona-principal');
    let html = `<div class="titulo-zona">🪑 Selecciona Mesa</div>`;
    
    // Salón
    html += `<div class="mesas-grupo"><h3>🍽️ Salón</h3><div class="mesas-grid">`;
    for (let i = 1; i <= CONFIG_MESAS.salon; i++) {
        html += renderMesaCard(`T${i}`, `Mesa ${i}`);
    }
    html += `</div></div>`;
    
    // Barra
    html += `<div class="mesas-grupo"><h3>🍺 Barra</h3><div class="mesas-grid">`;
    for (let i = 1; i <= CONFIG_MESAS.barra; i++) {
        html += renderMesaCard(`B${i}`, `Barra ${i}`);
    }
    html += `</div></div>`;
    
    // Para llevar
    if (CONFIG_MESAS.paraLlevar) {
        html += `<div class="mesas-grupo"><h3>🥡 Para Llevar</h3><div class="mesas-grid">`;
        // Existentes + un slot nuevo
        const existentes = Object.keys(ticketsAbiertos).filter(k => k.startsWith('PL_'));
        existentes.forEach(k => {
            html += renderMesaCard(k, k.replace('PL_', 'P/Llevar '));
        });
        const nuevoNum = existentes.length + 1;
        html += `<div class="mesa-card libre" onclick="seleccionarMesa('PL_${nuevoNum}')" style="border-style:dashed;">
                    <div class="mesa-num">+</div>
                    <div class="mesa-info">Nuevo<br>Para llevar</div>
                </div>`;
        html += `</div></div>`;
    }
    
    zona.innerHTML = html;
    renderTicket();
}

function renderMesaCard(id, label) {
    const tieneTicket = ticketsAbiertos[id] && ticketsAbiertos[id].length > 0;
    const total = tieneTicket 
        ? ticketsAbiertos[id].reduce((s, p) => s + p.cantidad * p.precio, 0).toFixed(2)
        : null;
    return `
        <div class="mesa-card ${tieneTicket ? 'ocupada' : 'libre'}" onclick="seleccionarMesa('${id}')">
            <div class="mesa-num">${label.replace('Mesa ', 'T').replace('Barra ', 'B').replace('P/Llevar ', 'PL')}</div>
            <div class="mesa-info">${label}</div>
            ${tieneTicket ? `<div class="mesa-total">${total} €</div>` : '<div class="mesa-info">Libre</div>'}
        </div>
    `;
}

function seleccionarMesa(id) {
    mesaActiva = id;
    ticket = ticketsAbiertos[id] ? JSON.parse(JSON.stringify(ticketsAbiertos[id])) : [];
    mostrarProductos();
}

function nombreMesa(id) {
    if (id.startsWith('T')) return `Mesa ${id.substring(1)}`;
    if (id.startsWith('B')) return `Barra ${id.substring(1)}`;
    if (id.startsWith('PL_')) return `Para Llevar ${id.replace('PL_', '')}`;
    return id;
}

// ============== PRODUCTOS ==============
function mostrarProductos() {
    vista = "productos";
    const zona = document.getElementById('zona-principal');
    
    document.getElementById('ticket-mesa-actual').style.display = 'block';
    document.getElementById('ticket-mesa-actual').textContent = `📍 ${nombreMesa(mesaActiva)}`;
    
    const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.cat))];
    
    let html = `
        <div class="titulo-zona">
            <span>🍽️ Productos — ${nombreMesa(mesaActiva)}</span>
            <button class="btn-volver" onclick="mostrarMesas()">← Volver a mesas</button>
        </div>
        <div class="categorias">
            ${categorias.map(cat => `
                <button class="categoria-btn ${cat === categoriaActiva ? 'activa' : ''}" 
                        onclick="filtrarCategoria('${cat}')">${cat}</button>
            `).join('')}
        </div>
        <div class="productos-grid">
            ${(categoriaActiva === "Todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === categoriaActiva))
                .map(p => `
                    <div class="producto-card" onclick="añadirProducto(${p.id})">
                        <div class="producto-nombre">${p.nombre}</div>
                        <div class="producto-precio">${p.precio.toFixed(2)} €</div>
                    </div>
                `).join('')}
        </div>
    `;
    zona.innerHTML = html;
    renderTicket();
}

function filtrarCategoria(cat) {
    categoriaActiva = cat;
    mostrarProductos();
}

// ============== TICKET ==============
function añadirProducto(id) {
    if (!mesaActiva) {
        alert('Selecciona primero una mesa');
        return;
    }
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;
    const existente = ticket.find(item => item.id === id);
    if (existente) existente.cantidad++;
    else ticket.push({ ...producto, cantidad: 1 });
    renderTicket();
}

function modificarCantidad(id, delta) {
    const item = ticket.find(p => p.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) ticket = ticket.filter(p => p.id !== id);
    renderTicket();
}

function eliminarProducto(id) {
    ticket = ticket.filter(p => p.id !== id);
    renderTicket();
}

function cancelarTicket() {
    if (ticket.length === 0) return;
    if (!confirm('¿Seguro que quieres cancelar este ticket?')) return;
    ticket = [];
    if (mesaActiva && ticketsAbiertos[mesaActiva]) {
        delete ticketsAbiertos[mesaActiva];
        guardarAbiertosLS();
    }
    mostrarMesas();
}

function renderTicket() {
    const cont = document.getElementById('ticket-items');
    const hayProds = ticket.length > 0;
    
    if (!mesaActiva) {
        cont.innerHTML = `<div class="ticket-vacio">Selecciona una mesa para comenzar</div>`;
    } else if (!hayProds) {
        cont.innerHTML = `<div class="ticket-vacio">Añade productos al ticket pulsando sobre ellos</div>`;
    } else {
        cont.innerHTML = ticket.map(item => `
            <div class="ticket-item">
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, 1)">+</button>
                </div>
                <div>
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">${item.precio.toFixed(2)} € · IVA ${item.iva}%</div>
                </div>
                <div>
                    <span class="item-total">${(item.cantidad * item.precio).toFixed(2)} €</span>
                    <button class="btn-eliminar" onclick="eliminarProducto(${item.id})">×</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('btn-cancelar').disabled = !hayProds;
    document.getElementById('btn-guardar').disabled = !hayProds;
    document.getElementById('btn-prefactura').disabled = !hayProds;
    document.getElementById('btn-cambiar-mesa').disabled = !hayProds;
    document.getElementById('btn-cobrar').disabled = !hayProds;
    
    actualizarTotales();
}

// ============== TOTALES ==============
function calcularTotales() {
    const ivas = { 4: { base: 0, cuota: 0 }, 10: { base: 0, cuota: 0 }, 21: { base: 0, cuota: 0 } };
    let total = 0;
    ticket.forEach(item => {
        const tl = item.cantidad * item.precio;
        const base = tl / (1 + item.iva / 100);
        ivas[item.iva].base += base;
        ivas[item.iva].cuota += tl - base;
        total += tl;
    });
    return { ivas, total };
}

function actualizarTotales() {
    const { ivas, total } = calcularTotales();
    document.getElementById('base-10').textContent = `${ivas[10].base.toFixed(2)} €`;
    document.getElementById('cuota-10').textContent = `${ivas[10].cuota.toFixed(2)} €`;
    document.getElementById('total-final').textContent = `${total.toFixed(2)} €`;

    // Actualizar botón flotante (móvil)
    const fabResumen = document.getElementById('fab-resumen');
    if (fabResumen) {
        const numItems = ticket.reduce((s, p) => s + p.cantidad, 0);
        fabResumen.textContent = `${numItems} · ${total.toFixed(2)} €`;
    }
}

// ============== TICKETS ABIERTOS ==============
function guardarTicketAbierto() {
    if (!mesaActiva || ticket.length === 0) return;
    ticketsAbiertos[mesaActiva] = JSON.parse(JSON.stringify(ticket));
    guardarAbiertosLS();
    mostrarMesas();
}

function guardarAbiertosLS() {
    localStorage.setItem('tpv_ticketsAbiertos', JSON.stringify(ticketsAbiertos));
}

function verTicketsAbiertos() {
    const cont = document.getElementById('abiertos-lista');
    const keys = Object.keys(ticketsAbiertos).filter(k => ticketsAbiertos[k].length > 0);
    
    if (keys.length === 0) {
        cont.innerHTML = `<p style="text-align:center; color:#999; padding:30px;">No hay tickets abiertos</p>`;
    } else {
        cont.innerHTML = keys.map(k => {
            const items = ticketsAbiertos[k];
            const total = items.reduce((s, p) => s + p.cantidad * p.precio, 0);
            const numProds = items.reduce((s, p) => s + p.cantidad, 0);
            return `
                <div class="ticket-abierto-card" onclick="cerrarModal('modal-abiertos'); seleccionarMesa('${k}');">
                    <div>
                        <strong>${nombreMesa(k)}</strong><br>
                        <small>${numProds} producto(s)</small>
                    </div>
                    <div style="font-size:18px; font-weight:bold; color:#0f6b5e;">${total.toFixed(2)} €</div>
                </div>
            `;
        }).join('');
    }
    document.getElementById('modal-abiertos').classList.add('activo');
}

// ============== CAMBIAR DE MESA ==============
function cambiarMesa() {
    if (!mesaActiva) return;
    const cont = document.getElementById('cambiar-mesa-lista');
    let html = '';
    for (let i = 1; i <= CONFIG_MESAS.salon; i++) {
        const id = `T${i}`;
        if (id === mesaActiva) continue;
        const ocupada = ticketsAbiertos[id] && ticketsAbiertos[id].length > 0;
        html += `<div class="mesa-card ${ocupada ? 'ocupada' : 'libre'}" onclick="ejecutarCambioMesa('${id}')">
                    <div class="mesa-num">T${i}</div>
                    <div class="mesa-info">${ocupada ? 'Ocupada' : 'Libre'}</div>
                </div>`;
    }
    for (let i = 1; i <= CONFIG_MESAS.barra; i++) {
        const id = `B${i}`;
        if (id === mesaActiva) continue;
        const ocupada = ticketsAbiertos[id] && ticketsAbiertos[id].length > 0;
        html += `<div class="mesa-card ${ocupada ? 'ocupada' : 'libre'}" onclick="ejecutarCambioMesa('${id}')">
                    <div class="mesa-num">B${i}</div>
                    <div class="mesa-info">${ocupada ? 'Ocupada' : 'Libre'}</div>
                </div>`;
    }
    cont.innerHTML = html;
    document.getElementById('modal-cambiar-mesa').classList.add('activo');
}

function ejecutarCambioMesa(nuevoId) {
    if (ticketsAbiertos[nuevoId] && ticketsAbiertos[nuevoId].length > 0) {
        if (!confirm(`La mesa ${nombreMesa(nuevoId)} ya tiene ticket. ¿Fusionar?`)) return;
        const fusionado = [...ticketsAbiertos[nuevoId]];
        ticket.forEach(item => {
            const ex = fusionado.find(p => p.id === item.id);
            if (ex) ex.cantidad += item.cantidad;
            else fusionado.push({...item});
        });
        ticketsAbiertos[nuevoId] = fusionado;
    } else {
        ticketsAbiertos[nuevoId] = JSON.parse(JSON.stringify(ticket));
    }
    delete ticketsAbiertos[mesaActiva];
    guardarAbiertosLS();
    cerrarModal('modal-cambiar-mesa');
    mostrarMesas();
}

// ============== PRE-FACTURA ==============
function imprimirPrefactura() {
    if (ticket.length === 0) return;
    const datos = {
        numeroTicket: 'PRE-FACT',
        fecha: new Date(),
        cajero: EMPRESA.cajero,
        mesa: nombreMesa(mesaActiva),
        productos: [...ticket],
        formaPago: '— PENDIENTE DE COBRO —',
        ...calcularTotales(),
        prefactura: true
    };
    imprimirTicket(datos);
}

// ============== MODAL COBRO ==============
function abrirCobro() {
    if (ticket.length === 0) return;
    const { total } = calcularTotales();
    document.getElementById('modal-total').textContent = `${total.toFixed(2)} €`;
    document.getElementById('modal-cobro').classList.add('activo');
    formaPagoSeleccionada = null;
    document.querySelectorAll('.pago-btn').forEach(b => b.classList.remove('activo'));
    document.getElementById('btn-confirmar-cobro').disabled = true;
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('activo');
}

function seleccionarPago(forma) {
    formaPagoSeleccionada = forma;
    document.querySelectorAll('.pago-btn').forEach(b => {
        b.classList.toggle('activo', b.dataset.pago === forma);
    });
    document.getElementById('btn-confirmar-cobro').disabled = false;
}

async function confirmarCobro() {
    if (!formaPagoSeleccionada) return;

    const fecha = new Date();
    const numTicket = `${EMPRESA.serie}-${String(fecha.getFullYear()).slice(2)}${String(fecha.getMonth()+1).padStart(2,'0')}-${String(numeroTicket).padStart(5,'0')}`;
    const { ivas, total } = calcularTotales();

    const datosTicket = {
        numeroTicket: numTicket,
        fecha: fecha,
        cajero: EMPRESA.cajero,
        mesa: nombreMesa(mesaActiva),
        productos: [...ticket],
        formaPago: formaPagoSeleccionada,
        ivas, total
    };

    // Guardar venta del día
    ventasDia.push({
        numeroTicket: numTicket,
        fecha: fecha.toISOString(),
        formaPago: formaPagoSeleccionada,
        productos: ticket.map(p => ({id: p.id, nombre: p.nombre, cantidad: p.cantidad, precio: p.precio, iva: p.iva})),
        base10: ivas[10].base,
        cuota10: ivas[10].cuota,
        base21: ivas[21].base,
        cuota21: ivas[21].cuota,
        total: total
    });
    localStorage.setItem('tpv_ventasDia', JSON.stringify(ventasDia));

    // 1º enviar a Sheets, 2º imprimir (así no se pierde el envío en el móvil)
    enviarAGoogleSheets(datosTicket);
    imprimirTicket(datosTicket);

    // Limpiar
    numeroTicket++;
    localStorage.setItem('tpv_numeroTicket', numeroTicket);
    if (ticketsAbiertos[mesaActiva]) {
        delete ticketsAbiertos[mesaActiva];
        guardarAbiertosLS();
    }

    ticket = [];
    cerrarModal('modal-cobro');
    mostrarMesas();
}


// ============== CIERRE DE CAJA ==============
function abrirCierre() {
    const cont = document.getElementById('cierre-contenido');
    
    if (ventasDia.length === 0) {
        cont.innerHTML = `<p style="text-align:center; padding:30px; color:#999;">No hay ventas registradas hoy.</p>`;
        document.getElementById('modal-cierre').classList.add('activo');
        return;
    }
    
    const stats = calcularEstadisticasCierre();
    
    cont.innerHTML = `
        <div class="cierre-stat">
            <span>📅 Apertura:</span>
            <strong>${new Date(fechaApertura).toLocaleString('es-ES')}</strong>
        </div>
        <div class="cierre-stat">
            <span>🧾 Tickets emitidos:</span>
            <strong>${stats.numTickets}</strong>
        </div>
        
        <div class="cierre-total-grande">${stats.total.toFixed(2)} €</div>
        
        <div class="cierre-section">
            <h3>💰 Por forma de pago:</h3>
            <div class="cierre-stat"><span>💵 Efectivo:</span><strong>${stats.efectivo.toFixed(2)} €</strong></div>
            <div class="cierre-stat"><span>💳 Tarjeta:</span><strong>${stats.tarjeta.toFixed(2)} €</strong></div>
            <div class="cierre-stat"><span>📱 Bizum:</span><strong>${stats.bizum.toFixed(2)} €</strong></div>
            <div class="cierre-stat"><span>🏦 Transferencia:</span><strong>${stats.transferencia.toFixed(2)} €</strong></div>
        </div>
        
        <div class="cierre-section">
            <h3>📊 IVA:</h3>
            <div class="cierre-stat"><span>Base 10%:</span><strong>${stats.base10.toFixed(2)} €</strong></div>
            <div class="cierre-stat"><span>Cuota 10%:</span><strong>${stats.cuota10.toFixed(2)} €</strong></div>
            ${stats.base21 > 0 ? `
            <div class="cierre-stat"><span>Base 21%:</span><strong>${stats.base21.toFixed(2)} €</strong></div>
            <div class="cierre-stat"><span>Cuota 21%:</span><strong>${stats.cuota21.toFixed(2)} €</strong></div>` : ''}
        </div>
        
        <div class="cierre-section">
            <h3>🏆 Top 5 productos vendidos:</h3>
            ${stats.topProductos.map(p => `
                <div class="cierre-stat">
                    <span>${p.nombre}</span>
                    <strong>${p.cantidad} ud · ${p.total.toFixed(2)} €</strong>
                </div>
            `).join('')}
        </div>
        
        ${Object.keys(ticketsAbiertos).filter(k => ticketsAbiertos[k].length > 0).length > 0 ? `
            <div class="cierre-section" style="background:#fff3e0; padding:10px; border-radius:8px;">
                <h3 style="color:#e65100;">⚠️ Aviso:</h3>
                <p style="font-size:13px;">Hay <strong>${Object.keys(ticketsAbiertos).filter(k => ticketsAbiertos[k].length > 0).length}</strong> ticket(s) abierto(s) sin cobrar. Revísalos antes de cerrar caja.</p>
            </div>
        ` : ''}
    `;
    
    document.getElementById('modal-cierre').classList.add('activo');
}

function calcularEstadisticasCierre() {
    let efectivo = 0, tarjeta = 0, bizum = 0, transferencia = 0;
    let base10 = 0, cuota10 = 0, base21 = 0, cuota21 = 0, total = 0;
    const productosMap = {};
    
    ventasDia.forEach(v => {
        total += v.total;
        base10 += v.base10; cuota10 += v.cuota10;
        base21 += v.base21; cuota21 += v.cuota21;
        if (v.formaPago === 'EFECTIVO') efectivo += v.total;
        if (v.formaPago === 'TARJETA') tarjeta += v.total;
        if (v.formaPago === 'BIZUM') bizum += v.total;
        if (v.formaPago === 'TRANSFERENCIA') transferencia += v.total;
        v.productos.forEach(p => {
            if (!productosMap[p.id]) productosMap[p.id] = { nombre: p.nombre, cantidad: 0, total: 0 };
            productosMap[p.id].cantidad += p.cantidad;
            productosMap[p.id].total += p.cantidad * p.precio;
        });
    });
    
    const topProductos = Object.values(productosMap)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);
    
    return {
        numTickets: ventasDia.length,
        efectivo, tarjeta, bizum, transferencia,
        base10, cuota10, base21, cuota21, total, topProductos
    };
}

function confirmarCierre() {
    if (ventasDia.length === 0) {
        cerrarModal('modal-cierre');
        return;
    }
    if (!confirm('⚠️ Esto cerrará el día actual y reseteará los contadores diarios. ¿Continuar?')) return;
    
    const stats = calcularEstadisticasCierre();
    const fechaCierre = new Date();
    
    // 🔑 Enviar a Sheets ANTES de imprimir (en tablet la impresión navega y cancelaría el envío)
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('https://')) {
        enviarBeacon({
            tipo: 'cierre',
            fechaCierre: fechaCierre.toISOString(),
            fechaApertura: fechaApertura,
            numTickets: stats.numTickets,
            total: +stats.total.toFixed(2),
            efectivo: +stats.efectivo.toFixed(2),
            tarjeta: +stats.tarjeta.toFixed(2),
            bizum: +stats.bizum.toFixed(2),
            transferencia: +stats.transferencia.toFixed(2),
            base10: +stats.base10.toFixed(2),
            cuota10: +stats.cuota10.toFixed(2),
            base21: +stats.base21.toFixed(2),
            cuota21: +stats.cuota21.toFixed(2)
        });
    }

    // Imprimir cierre (después del envío)
    imprimirCierre(stats, fechaCierre);
    
    // Reset
    ventasDia = [];
    fechaApertura = new Date().toISOString();
    localStorage.setItem('tpv_ventasDia', '[]');
    localStorage.setItem('tpv_fechaApertura', fechaApertura);
    
    cerrarModal('modal-cierre');
    alert('✅ Cierre realizado correctamente.');
}

// ============== ENVÍO A GOOGLE SHEETS ==============
function enviarAGoogleSheets(datos) {
    if (!GOOGLE_SHEETS_URL || !GOOGLE_SHEETS_URL.startsWith('https://')) return;

    const payload = {
        tipo: 'venta',
        numeroTicket: datos.numeroTicket,
        fecha: datos.fecha.toISOString(),
        cajero: datos.cajero,
        mesa: datos.mesa,
        formaPago: datos.formaPago,
        productos: datos.productos.map(p => ({
            nombre: p.nombre,
            cantidad: p.cantidad,
            precio: p.precio,
            iva: p.iva,
            total: +(p.cantidad * p.precio).toFixed(2)
        })),
        base10: +datos.ivas[10].base.toFixed(2),
        cuota10: +datos.ivas[10].cuota.toFixed(2),
        base21: +datos.ivas[21].base.toFixed(2),
        cuota21: +datos.ivas[21].cuota.toFixed(2),
        total: +datos.total.toFixed(2)
    };

    enviarBeacon(payload);
}

// 🔑 Envío robusto que sobrevive a la navegación a rawbt: (tablet/móvil)
function enviarBeacon(payload) {
    const body = JSON.stringify(payload);
    // 1º intento: sendBeacon (no se cancela aunque cambiemos de página)
    try {
        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
            const ok = navigator.sendBeacon(GOOGLE_SHEETS_URL, blob);
            if (ok) return;
        }
    } catch (e) {
        console.error('sendBeacon falló, uso fetch:', e);
    }
    // 2º intento (fallback): fetch con keepalive
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body,
        keepalive: true
    }).catch(err => console.error('Error Sheets:', err));
}


// ============== IMPRESIÓN TICKET (PRINCIPAL) ==============
function imprimirTicket(datos) {
    // Guardar en histórico (solo si NO es prefactura y NO es una reimpresión/copia)
    if (!datos.prefactura && !datos.esCopia) {
        guardarEnHistorico(datos);
    }

    const esMovil = /Android/i.test(navigator.userAgent);

    if (esMovil) {
        // 📱 MÓVIL → usar RawBT (texto plano, más fiable)
        const texto = construirTextoTicket(datos);
        enviarARawBT(texto);
    } else {
        // 💻 PC → ventana HTML con impresión vía iframe oculto
        imprimirTicketHTML(datos);
    }
}

function imprimirTicketHTML(datos) {
    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}:${String(f.getSeconds()).padStart(2,'0')}`;
    const esPref = datos.prefactura === true;
    const iv = datos.ivas;

    const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ticket ${datos.numeroTicket}</title>
<style>
@page { size: 80mm auto; margin: 0; }
* { box-sizing: border-box; }
body {
    font-family: 'Courier New', 'Consolas', monospace;
    font-size: 12px;
    width: 80mm;
    padding: 4mm;
    color: #000;
    margin: 0;
}
.logo-empresa {
    text-align: center;
    margin-bottom: 6px;
}
.logo-empresa img {
    max-width: 55px;
    height: auto;
    display: block;
    margin: 0 auto 4px auto;
}
.c { text-align: center; }
.r { text-align: right; }
.l { text-align: left; }
.b { font-weight: bold; }
.empresa-nombre {
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
}
.empresa-datos {
    text-align: center;
    font-size: 11px;
    line-height: 1.3;
    margin-bottom: 4px;
}
.sep { border-top: 1px dashed #555; margin: 6px 0; }
.dsep { border-top: 2px solid #000; margin: 6px 0; }
.info-ticket {
    width: 100%;
    font-size: 12px;
    margin: 4px 0;
}
.info-ticket td { padding: 1px 0; vertical-align: top; }
.info-ticket .lbl { font-weight: bold; width: 40%; }
.info-ticket .val { text-align: right; }

.tabla-prod {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
}
.tabla-prod thead td {
    font-weight: bold;
    border-bottom: 1px dashed #555;
    padding: 3px 0;
    font-size: 11px;
}
.tabla-prod tbody td {
    padding: 3px 0;
    vertical-align: top;
    font-size: 11px;
}
.col-ud { width: 8%; text-align: left; }
.col-desc { width: 52%; text-align: left; }
.col-iva { width: 15%; text-align: right; }
.col-tot { width: 25%; text-align: right; font-weight: bold; }

.bases {
    width: 100%;
    margin-top: 4px;
    font-size: 11px;
}
.bases td { padding: 1px 0; }
.bases .lbl { text-align: left; }
.bases .val { text-align: right; }

.total-box {
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    padding: 6px 0;
    margin: 6px 0;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
}

.pago-box {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin: 4px 0;
    font-weight: bold;
}

.pref-box {
    background: #f5f5f5;
    border: 2px dashed #000;
    padding: 8px;
    text-align: center;
    font-weight: bold;
    margin: 6px 0;
}

.qr-zona {
    text-align: center;
    margin: 10px 0 6px 0;
}
.qr-zona img {
    width: 130px !important;
    height: 130px !important;
    margin: 0 auto;
    display: block;
}

.verifactu-box {
    border: 1.5px solid #000;
    padding: 6px;
    text-align: center;
    margin: 6px 0;
    font-size: 11px;
}
.verifactu-box .titulo {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 3px;
}
.verifactu-box .hash {
    font-family: 'Courier New', monospace;
    font-size: 9px;
    word-break: break-all;
    color: #444;
}

.footer-msg {
    text-align: center;
    font-size: 11px;
    line-height: 1.5;
    margin-top: 6px;
}
.footer-msg .gracias {
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 2px;
}
.footer-empresa {
    text-align: center;
    font-size: 11px;
    margin-top: 10px;
    font-weight: bold;
    letter-spacing: 0.5px;
}
</style></head><body>

<div class="logo-empresa">
    <img src="${LOGO_URL}" alt="Logo" onerror="this.style.display='none'">
</div>

<div class="empresa-nombre">${EMPRESA.nombre}</div>
<div class="empresa-datos">
    CIF: ${EMPRESA.cif}<br>
    ${EMPRESA.direccion}<br>
    Tel: ${EMPRESA.telefono}
</div>

<div class="sep"></div>

${esPref ? '<div class="pref-box">*** PRE-FACTURA ***<br><span style="font-size:10px;">NO ES UN TICKET FISCAL</span></div>' : ''}

<table class="info-ticket">
    <tr><td class="lbl">${esPref ? 'Documento Nº:' : 'Ticket Nº:'}</td><td class="val b">${datos.numeroTicket}</td></tr>
    <tr><td class="lbl">Fecha:</td><td class="val">${fechaStr} ${horaStr}</td></tr>
    <tr><td class="lbl">Cajero:</td><td class="val">${datos.cajero}</td></tr>
    ${datos.mesa ? `<tr><td class="lbl">Mesa:</td><td class="val b">${datos.mesa}</td></tr>` : ''}
</table>

<div class="sep"></div>

<table class="tabla-prod">
    <thead>
        <tr>
            <td class="col-ud">Ud</td>
            <td class="col-desc">Descripción</td>
            <td class="col-iva">IVA</td>
            <td class="col-tot">Total</td>
        </tr>
    </thead>
    <tbody>
        ${datos.productos.map(p => `
            <tr>
                <td class="col-ud">${p.cantidad}</td>
                <td class="col-desc">${p.nombre}</td>
                <td class="col-iva">${p.iva}%</td>
                <td class="col-tot">${(p.cantidad*p.precio).toFixed(2)}</td>
            </tr>
        `).join('')}
    </tbody>
</table>

<div class="sep"></div>

<table class="bases">
    ${iv[10] && iv[10].base > 0 ? `
    <tr><td class="lbl">Base IVA 10%:</td><td class="val">${iv[10].base.toFixed(2)} €</td></tr>
    <tr><td class="lbl">Cuota IVA 10%:</td><td class="val">${iv[10].cuota.toFixed(2)} €</td></tr>` : ''}
    ${iv[21] && iv[21].base > 0 ? `
    <tr><td class="lbl">Base IVA 21%:</td><td class="val">${iv[21].base.toFixed(2)} €</td></tr>
    <tr><td class="lbl">Cuota IVA 21%:</td><td class="val">${iv[21].cuota.toFixed(2)} €</td></tr>` : ''}
</table>

<div class="total-box">
    <span>TOTAL:</span>
    <span>${datos.total.toFixed(2)} €</span>
</div>

<div class="pago-box">
    <span>Forma de pago:</span>
    <span>${datos.formaPago}</span>
</div>


<div class="sep"></div>

<div class="footer-msg">
    ${esPref ? `
        <div class="gracias">Documento informativo</div>
        Solicite ticket al pagar
    ` : `
        <div class="gracias">¡Gracias por su visita!</div>
        Moltes gràcies!<br><br>
        Conserve este ticket<br>
        para cualquier reclamación
    `}
</div>

<div class="footer-empresa">${EMPRESA.nombre}</div>

</body></html>`;

   // ===== IMPRESIÓN VÍA IFRAME OCULTO (no abre pestañas) =====
    let iframe = document.getElementById('print-iframe');
    if (iframe) iframe.remove();

    iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (e) {
            console.error('Error al imprimir:', e);
            alert('No se pudo imprimir: ' + e.message);
        }
        setTimeout(() => {
            try { iframe.remove(); } catch(e){}
        }, 3000);
    }, 1500);
}

// ============== IMPRESIÓN RAWBT (MÓVIL) ==============
function imprimirConRawBT(datos) {
    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}:${String(f.getSeconds()).padStart(2,'0')}`;
    const ivasAg = datos.ivas;
    const esPrefactura = datos.prefactura === true;
    const ANCHO = 32; // caracteres por línea (impresora 58mm). Usa 48 para 80mm.

    // --- Helpers de formato texto ---
    const centrar = (txt) => {
        if (txt.length >= ANCHO) return txt;
        const espacios = Math.floor((ANCHO - txt.length) / 2);
        return ' '.repeat(espacios) + txt;
    };
    const linea = (char = '-') => char.repeat(ANCHO);
    const dosCol = (izq, der) => {
        const espacio = ANCHO - izq.length - der.length;
        return izq + ' '.repeat(Math.max(1, espacio)) + der;
    };
    const cortar = (txt, max) => txt.length > max ? txt.substring(0, max) : txt;

    // --- Construir el ticket en texto plano ---
    let t = '';
    t += centrar(EMPRESA.nombre) + '\n';
    t += centrar('CIF: ' + EMPRESA.cif) + '\n';
    t += centrar(EMPRESA.direccion) + '\n';
    t += centrar('Tel: ' + EMPRESA.telefono) + '\n';

    if (esPrefactura) {
        t += linea('=') + '\n';
        t += centrar('PRE-FACTURA') + '\n';
        t += centrar('NO ES UN TICKET') + '\n';
        t += linea('=') + '\n';
    } else {
        t += linea() + '\n';
    }

    t += dosCol(esPrefactura ? 'Doc:' : 'Ticket:', datos.numeroTicket) + '\n';
    t += dosCol('Fecha:', fechaStr + ' ' + horaStr.substring(0,5)) + '\n';
    t += dosCol('Cajero:', datos.cajero) + '\n';
    if (datos.mesa) t += dosCol('Mesa:', datos.mesa) + '\n';

    t += linea() + '\n';
    t += dosCol('Ud Descripcion', 'IVA  Total') + '\n';
    t += linea() + '\n';

    datos.productos.forEach(p => {
        const ud = String(p.cantidad).padEnd(3);
        const nombre = cortar(p.nombre, ANCHO - 14);
        const total = (p.cantidad * p.precio).toFixed(2);
        const der = `${p.iva}%`.padStart(4) + ' ' + total.padStart(6);
        t += dosCol(ud + nombre, der) + '\n';
    });

    t += linea() + '\n';

    if (ivasAg[10].base > 0) {
        t += dosCol('Base IVA 10%:', ivasAg[10].base.toFixed(2) + ' E') + '\n';
        t += dosCol('Cuota IVA 10%:', ivasAg[10].cuota.toFixed(2) + ' E') + '\n';
    }
    if (ivasAg[21].base > 0) {
        t += dosCol('Base IVA 21%:', ivasAg[21].base.toFixed(2) + ' E') + '\n';
        t += dosCol('Cuota IVA 21%:', ivasAg[21].cuota.toFixed(2) + ' E') + '\n';
    }

    t += linea() + '\n';
    t += dosCol('TOTAL:', datos.total.toFixed(2) + ' EUR') + '\n';
    t += linea() + '\n';
    t += dosCol('F. Pago:', datos.formaPago) + '\n';

    if (!esPrefactura && datos.hashVerifactu) {
        t += linea() + '\n';
        t += centrar('VERI*FACTU') + '\n';
        t += centrar('Hash: ' + datos.hashVerifactu.substring(0, 16)) + '\n';
    }

    t += linea() + '\n';
    if (esPrefactura) {
        t += centrar('DOCUMENTO INFORMATIVO') + '\n';
        t += centrar('No sustituye al ticket') + '\n';
    } else {
        t += centrar('Gracies! Gracias!') + '\n';
        t += centrar('Conserve este ticket') + '\n';
    }
    t += '\n\n\n'; // alimentación de papel

    // --- Enviar a RawBT mediante intent:// ---
    const encoded = encodeURIComponent(t);
    const intentURL = `intent:${encoded}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;

    // Abrimos el intent (Android lo redirige a la app RawBT)
    window.location.href = intentURL;
}

// ============== IMPRESIÓN CIERRE ==============
function imprimirCierre(stats, fechaCierre) {
    const fStr = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    
    const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cierre de Caja</title>
<style>
@page { size: 80mm auto; margin: 0; }
body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 4mm; }
.center { text-align: center; }
.right { text-align: right; }
.bold { font-weight: bold; }
.titulo { font-size: 16px; font-weight: bold; text-align: center; margin: 8px 0; }
.sep { border-top: 1px dashed #000; margin: 5px 0; }
table { width: 100%; }
table td { padding: 2px 0; }
.total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 6px 0; }
</style></head><body>
    <div class="center bold">${EMPRESA.nombre}</div>
    <div class="center">CIF: ${EMPRESA.cif}</div>
    <div class="titulo">📊 CIERRE DE CAJA</div>
    <div class="sep"></div>
    <table>
        <tr><td>Apertura:</td><td class="right">${fStr(new Date(fechaApertura))}</td></tr>
        <tr><td>Cierre:</td><td class="right">${fStr(fechaCierre)}</td></tr>
        <tr><td>Cajero:</td><td class="right">${EMPRESA.cajero}</td></tr>
        <tr><td>Tickets:</td><td class="right bold">${stats.numTickets}</td></tr>
    </table>
    <div class="sep"></div>
    <div class="bold">FORMAS DE PAGO:</div>
    <table>
        <tr><td>Efectivo:</td><td class="right">${stats.efectivo.toFixed(2)} €</td></tr>
        <tr><td>Tarjeta:</td><td class="right">${stats.tarjeta.toFixed(2)} €</td></tr>
        <tr><td>Bizum:</td><td class="right">${stats.bizum.toFixed(2)} €</td></tr>
        <tr><td>Transferencia:</td><td class="right">${stats.transferencia.toFixed(2)} €</td></tr>
    </table>
    <div class="sep"></div>
    <div class="bold">DESGLOSE IVA:</div>
    <table>
        <tr><td>Base 10%:</td><td class="right">${stats.base10.toFixed(2)} €</td></tr>
        <tr><td>Cuota 10%:</td><td class="right">${stats.cuota10.toFixed(2)} €</td></tr>
        ${stats.base21 > 0 ? `
        <tr><td>Base 21%:</td><td class="right">${stats.base21.toFixed(2)} €</td></tr>
        <tr><td>Cuota 21%:</td><td class="right">${stats.cuota21.toFixed(2)} €</td></tr>` : ''}
    </table>
    <div class="sep"></div>
    <div class="bold">TOP PRODUCTOS:</div>
    <table>
        ${stats.topProductos.map(p => `
            <tr><td>${p.cantidad}x ${p.nombre}</td><td class="right">${p.total.toFixed(2)}</td></tr>
        `).join('')}
    </table>
    <div class="sep"></div>
    <table><tr class="total-final"><td>TOTAL DÍA:</td><td class="right">${stats.total.toFixed(2)} €</td></tr></table>
    <div class="sep"></div>
    <div class="center" style="margin-top:15px;">__________________<br>Firma responsable</div>
</body></html>`;

    // 🔀 Detectar dispositivo: móvil → RawBT, PC → impresión HTML
    const esMovil = /Android/i.test(navigator.userAgent);

    if (esMovil) {
        // 📱 MÓVIL ANDROID → enviar a RawBT (impresora térmica Bluetooth)
        const texto = construirTextoCierre(stats, fechaCierre);
        enviarARawBT(texto);
    } else {
        // 💻 PC → ventana HTML clásica
        const ventana = window.open('', '_blank', 'width=400,height=600');
        if (!ventana) { alert('⚠️ Permite las ventanas emergentes en el navegador'); return; }
        ventana.document.open();
        ventana.document.write(html);
        ventana.document.close();
        setTimeout(() => {
            try {
                ventana.focus();
                ventana.print();
            } catch (e) { console.error(e); }
            setTimeout(() => { try { ventana.close(); } catch(e){} }, 2000);
        }, 600);
    }
}

// ============== HISTÓRICO DE TICKETS ==============
let historicoTickets = JSON.parse(localStorage.getItem('tpv_historicoTickets') || '[]');

function guardarEnHistorico(datos) {
    // Convertir fecha a string para guardar en localStorage
    const ticketHist = {
        numeroTicket: datos.numeroTicket,
        fecha: datos.fecha.toISOString(),
        cajero: datos.cajero,
        mesa: datos.mesa,
        productos: datos.productos.map(p => ({
            id: p.id, nombre: p.nombre, cantidad: p.cantidad, precio: p.precio, iva: p.iva
        })),
        formaPago: datos.formaPago,
        ivas: datos.ivas,
        total: datos.total,
        hashVerifactu: datos.hashVerifactu,
        urlVerifactu: datos.urlVerifactu
    };
    historicoTickets.unshift(ticketHist); // los más recientes arriba
    // Limitar a últimos 500 para no saturar
    if (historicoTickets.length > 500) historicoTickets = historicoTickets.slice(0, 500);
    localStorage.setItem('tpv_historicoTickets', JSON.stringify(historicoTickets));
}

function abrirHistorico() {
    const cont = document.getElementById('historico-lista');
    if (historicoTickets.length === 0) {
        cont.innerHTML = `<p style="text-align:center;color:#999;padding:30px;">No hay tickets en el histórico.</p>`;
    } else {
        cont.innerHTML = historicoTickets.map((t, idx) => {
            const f = new Date(t.fecha);
            const fStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()} ${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}`;
            return `
                <div class="ticket-abierto-card" style="border-color:#0f6b5e;background:#e8f5f1;">
                    <div style="flex:1;">
                        <strong>${t.numeroTicket}</strong><br>
                        <small>${fStr} · ${t.mesa || '-'} · ${t.formaPago}</small>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:18px;font-weight:bold;color:#0f6b5e;">${t.total.toFixed(2)} €</div>
                        <button class="btn-accion btn-guardar" style="padding:6px 10px;font-size:11px;margin-top:4px;" onclick="reimprimirHistorico(${idx})">🖨️ Reimprimir</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    document.getElementById('modal-historico').classList.add('activo');
}

function reimprimirHistorico(idx) {
    const t = historicoTickets[idx];
    if (!t) return;
    const datos = {
        ...t,
        fecha: new Date(t.fecha),
        productos: t.productos
    };
    imprimirTicket({ ...datos, prefactura: false, esCopia: true }); // se imprime como copia (no se duplica en histórico)
}
