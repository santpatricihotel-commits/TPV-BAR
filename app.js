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
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwsrWIOgtatEivp90KJZTT1iQJNuzej_2aV1RT7W0A26voI0WaOnLO3W-PZhZs4c9wh/exec";

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
    { id: 102, cat: "Tablas", nombre: "Tabla degustación",          precio: 20.00, iva: 10 },
    { id: 200, cat: "Snacks", nombre: "Mini cóctel frutos secos",   precio: 1.80,  iva: 10 },
    { id: 201, cat: "Snacks", nombre: "Gilda de anchoa (ud.)",      precio: 2.00,  iva: 10 },
    { id: 202, cat: "Snacks", nombre: "Patatas clásicas",           precio: 2.50,  iva: 10 },
    { id: 203, cat: "Snacks", nombre: "Patatas pimienta",           precio: 2.70,  iva: 10 },
    { id: 204, cat: "Snacks", nombre: "Aceitunas rellenas",         precio: 4.40,  iva: 10 },
    { id: 205, cat: "Snacks", nombre: "Mejillones escabeche",       precio: 5.80,  iva: 10 },
    { id: 206, cat: "Snacks", nombre: "Pan cristal con tomate",     precio: 6.00,  iva: 10 },
    { id: 207, cat: "Snacks", nombre: "Berberechos al natural",     precio: 15.40, iva: 10 },
    { id: 300, cat: "Cervezas", nombre: "Estrella Galicia 0.0",     precio: 4.00,  iva: 10 },
    { id: 301, cat: "Cervezas", nombre: "Estrella Galicia",         precio: 4.50,  iva: 10 },
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
    { id: 613, cat: "Vinos Botella", nombre: "Sa Cudia Blanco",         precio: 34.90, iva: 10 }
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
let ultimoHash = localStorage.getItem('tpv_ultimoHash') || '0';

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

    // === VERI*FACTU: HASH ENCADENADO ===
    const datosHash = `${numTicket}|${fecha.toISOString()}|${EMPRESA.cif}|${total.toFixed(2)}|${ultimoHash}`;
    const hashActual = await sha256(datosHash);
    
    // === URL Veri*Factu para el QR ===
    const urlVerifactu = `https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif=${EMPRESA.cif}&numserie=${encodeURIComponent(numTicket)}&fecha=${fecha.toISOString().slice(0,10).split('-').reverse().join('-')}&importe=${total.toFixed(2)}`;

    const datosTicket = {
        numeroTicket: numTicket,
        fecha: fecha,
        cajero: EMPRESA.cajero,
        mesa: nombreMesa(mesaActiva),
        productos: [...ticket],
        formaPago: formaPagoSeleccionada,
        ivas, total,
        hashVerifactu: hashActual,
        hashAnterior: ultimoHash,
        urlVerifactu: urlVerifactu
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
        total: total,
        hash: hashActual
    });
    localStorage.setItem('tpv_ventasDia', JSON.stringify(ventasDia));
    
    ultimoHash = hashActual;
    localStorage.setItem('tpv_ultimoHash', ultimoHash);

    // Imprimir
    imprimirTicket(datosTicket);
    enviarAGoogleSheets(datosTicket);

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

// ============== HASH SHA-256 ==============
async function sha256(text) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
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
    
    // Imprimir cierre
    imprimirCierre(stats, fechaCierre);
    
    // Enviar a Sheets
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('https://')) {
        fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
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
            })
        });
    }
    
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
        total: +datos.total.toFixed(2),
        hashVerifactu: datos.hashVerifactu
    };

    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    }).catch(err => console.error('Error Sheets:', err));
}

// ============== IMPRESIÓN TICKET ==============
function imprimirTicket(datos) {
    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}:${String(f.getSeconds()).padStart(2,'0')}`;
    const ivasAg = datos.ivas;
    const total = datos.total;
    const esPrefactura = datos.prefactura === true;

    // QR Veri*Factu (sólo en tickets reales)
    let qrHTML = '';
    if (!esPrefactura && datos.urlVerifactu && typeof qrcode !== 'undefined') {
        try {
            const qr = qrcode(0, 'M');
            qr.addData(datos.urlVerifactu);
            qr.make();
            qrHTML = qr.createImgTag(3, 4);
        } catch(e) { console.error(e); }
    }

    // Logo SVG (respaldo si la imagen no carga)
    const logoSVG = `
    <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" width="180" height="120">
        <defs>
            <pattern id="hatchT" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="#0f6b5e" stroke-width="1.5"/>
            </pattern>
        </defs>
        <path d="M 30 60 L 60 30 L 95 30 L 95 15 L 105 15 L 105 30 L 140 30 L 170 60 L 170 75 L 30 75 Z" fill="url(#hatchT)"/>
        <rect x="65" y="50" width="14" height="20" fill="white"/>
        <rect x="93" y="50" width="14" height="20" fill="white"/>
        <rect x="121" y="50" width="14" height="20" fill="white"/>
        <text x="100" y="95" text-anchor="middle" font-family="serif" font-size="9" fill="#0f6b5e" letter-spacing="3">1 9 1 8</text>
        <text x="100" y="112" text-anchor="middle" font-family="serif" font-size="15" fill="#0f6b5e" letter-spacing="3">SANT PATRICI</text>
        <text x="100" y="125" text-anchor="middle" font-family="serif" font-size="8" fill="#0f6b5e" letter-spacing="4">MENORCA</text>
    </svg>`;

    // Logo real (imagen). Si falla la carga, se muestra el SVG de respaldo.
    const logoHTML = `
        <img src="${LOGO_URL}" alt="${EMPRESA.nombre}"
             style="max-width:70px; height:auto; display:block; margin:0 auto;"
             onerror="this.style.display='none'; var fb=document.getElementById('logo-fallback'); if(fb){fb.style.display='block';}">
        <div id="logo-fallback" style="display:none;">${logoSVG}</div>`;

    const html = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Ticket ${datos.numeroTicket}</title>
<style>
@page { size: 80mm auto; margin: 0; }
@media print { html, body { width: 80mm; } }
body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; margin: 0; padding: 4mm; color: #000; }
.center { text-align: center; }
.right { text-align: right; }
.bold { font-weight: bold; }
.sep { border-top: 1px dashed #000; margin: 5px 0; }
table { width: 100%; border-collapse: collapse; }
table td { padding: 1px 0; vertical-align: top; }
.empresa { font-size: 13px; font-weight: bold; }
.total-final { font-size: 18px; font-weight: bold; }
.footer { font-size: 11px; margin-top: 10px; }
.prefactura-aviso {
    text-align: center; background: #000; color: #fff; padding: 6px;
    font-weight: bold; margin: 5px 0; font-size: 13px;
}
.qr-zona { text-align: center; margin: 8px 0; }
.qr-zona img { display: block; margin: 0 auto; }
.verifactu-info { font-size: 9px; text-align: center; margin-top: 4px; word-break: break-all; }
</style></head><body>

    <div class="center">${logoHTML}</div>
    <div class="center empresa">${EMPRESA.nombre}</div>
    <div class="center">
        CIF: ${EMPRESA.cif}<br>
        ${EMPRESA.direccion}<br>
        Tel: ${EMPRESA.telefono}
    </div>

    ${esPrefactura ? '<div class="prefactura-aviso">PRE-FACTURA · NO ES UN TICKET</div>' : ''}

    <div class="sep"></div>

    <table>
        <tr><td class="bold">${esPrefactura ? 'Doc:' : 'Ticket Nº:'}</td><td class="right">${datos.numeroTicket}</td></tr>
        <tr><td class="bold">Fecha:</td><td class="right">${fechaStr} ${horaStr}</td></tr>
        <tr><td class="bold">Cajero:</td><td class="right">${datos.cajero}</td></tr>
        ${datos.mesa ? `<tr><td class="bold">Mesa:</td><td class="right">${datos.mesa}</td></tr>` : ''}
    </table>

    <div class="sep"></div>

    <table>
        <tr class="bold">
            <td style="width:10%">Ud</td>
            <td style="width:50%">Descripción</td>
            <td style="width:15%" class="right">IVA</td>
            <td style="width:25%" class="right">Total</td>
        </tr>
    </table>
    <div class="sep"></div>
    <table>
        ${datos.productos.map(p => `
            <tr>
                <td>${p.cantidad}</td>
                <td>${p.nombre}</td>
                <td class="right">${p.iva}%</td>
                <td class="right">${(p.cantidad * p.precio).toFixed(2)}</td>
            </tr>
        `).join('')}
    </table>

    <div class="sep"></div>

    <table>
        ${ivasAg[10].base > 0 ? `
            <tr><td>Base IVA 10%:</td><td class="right">${ivasAg[10].base.toFixed(2)} €</td></tr>
            <tr><td>Cuota IVA 10%:</td><td class="right">${ivasAg[10].cuota.toFixed(2)} €</td></tr>` : ''}
        ${ivasAg[21].base > 0 ? `
            <tr><td>Base IVA 21%:</td><td class="right">${ivasAg[21].base.toFixed(2)} €</td></tr>
            <tr><td>Cuota IVA 21%:</td><td class="right">${ivasAg[21].cuota.toFixed(2)} €</td></tr>` : ''}
    </table>

    <div class="sep"></div>

    <table><tr class="total-final"><td>TOTAL:</td><td class="right">${total.toFixed(2)} €</td></tr></table>

    <div class="sep"></div>

    <table><tr><td class="bold">Forma de pago:</td><td class="right">${datos.formaPago}</td></tr></table>

    ${!esPrefactura && qrHTML ? `
        <div class="sep"></div>
        <div class="qr-zona">
            ${qrHTML}
            <div class="bold" style="margin-top:4px;">Factura verificable VERI*FACTU</div>
            <div class="verifactu-info">Hash: ${(datos.hashVerifactu || '').substring(0, 16)}...</div>
        </div>
    ` : ''}

    <div class="sep"></div>

    <div class="center footer">
        ${esPrefactura ? '<strong>DOCUMENTO INFORMATIVO</strong><br>Este documento NO sustituye al ticket.<br>Solicite ticket de cobro al pagar.' : '¡Gracias por su visita!<br>Moltes gràcies!<br><br>Conserve este ticket<br>para cualquier reclamación'}
        <br><br>${EMPRESA.nombre}
    </div>

</body></html>`;

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
    }, 600);
}
