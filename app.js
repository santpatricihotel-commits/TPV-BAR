/* ============================================================
   TPV - HORT SANT PATRICI S.L. - SNACKS BAR
   CIF: B57442501
   ============================================================ */

const EMPRESA = {
    nombre: "HORT SANT PATRICI S.L.",
    cif: "B57442501",
    direccion: "Camí de Sant Patrici S/N",
    telefono: "+34 971 71 37 16",
    cajero: "Admin"
};

// ============================================================
// 🔗 CONFIGURACIÓN GOOGLE SHEETS
// Pega aquí la URL de tu Google Apps Script (ver instrucciones abajo).
// Si lo dejas vacío "", el TPV funciona igual pero sin guardar en Sheets.
// ============================================================

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzDXKJ6mfeWHgi91KmdfvKoNj8e8qy_WYK9sg-jyfqokXdgNV-Gn0E8e7pMatxn9Ce2/exec";

// ============== CATÁLOGO DE PRODUCTOS (SNACKS BAR) ==============
// IVA 10% en todo (hostelería, consumo en local)
const PRODUCTOS = [

    // ===== TABLAS =====
    { id: 100, cat: "Tablas", nombre: "Tabla quesos Sant Patrici", precio: 16.00, iva: 10 },
    { id: 101, cat: "Tablas", nombre: "Tabla jamón ibérico",       precio: 18.00, iva: 10 },
    { id: 102, cat: "Tablas", nombre: "Tabla degustación",          precio: 20.00, iva: 10 },

    // ===== SNACKS =====
    { id: 200, cat: "Snacks", nombre: "Mini cóctel frutos secos",   precio: 1.80,  iva: 10 },
    { id: 201, cat: "Snacks", nombre: "Gilda de anchoa (ud.)",      precio: 2.00,  iva: 10 },
    { id: 202, cat: "Snacks", nombre: "Patatas clásicas",           precio: 2.50,  iva: 10 },
    { id: 203, cat: "Snacks", nombre: "Patatas pimienta",           precio: 2.70,  iva: 10 },
    { id: 204, cat: "Snacks", nombre: "Aceitunas rellenas",         precio: 4.40,  iva: 10 },
    { id: 205, cat: "Snacks", nombre: "Mejillones escabeche",       precio: 5.80,  iva: 10 },
    { id: 206, cat: "Snacks", nombre: "Pan cristal con tomate",     precio: 6.00,  iva: 10 },
    { id: 207, cat: "Snacks", nombre: "Berberechos al natural",     precio: 15.40, iva: 10 },

    // ===== CERVEZAS =====
    { id: 300, cat: "Cervezas", nombre: "Estrella Galicia 0.0",     precio: 4.00,  iva: 10 },
    { id: 301, cat: "Cervezas", nombre: "Estrella Galicia",         precio: 4.50,  iva: 10 },

    // ===== REFRESCOS =====
    { id: 400, cat: "Refrescos", nombre: "Coca-Cola",               precio: 3.40,  iva: 10 },
    { id: 401, cat: "Refrescos", nombre: "Coca-Cola Zero",          precio: 3.40,  iva: 10 },
    { id: 402, cat: "Refrescos", nombre: "Fanta Limón",             precio: 3.40,  iva: 10 },
    { id: 403, cat: "Refrescos", nombre: "Fanta Naranja",           precio: 3.40,  iva: 10 },
    { id: 404, cat: "Refrescos", nombre: "Sprite",                  precio: 3.40,  iva: 10 },

    // ===== VINOS POR COPA =====
    { id: 500, cat: "Vinos Copa", nombre: "Es Moll Rosado (copa)",      precio: 4.50, iva: 10 },
    { id: 501, cat: "Vinos Copa", nombre: "Es Rupit Blanco (copa)",     precio: 5.00, iva: 10 },
    { id: 502, cat: "Vinos Copa", nombre: "Sa Vermella Tinto (copa)",   precio: 6.00, iva: 10 },

    // ===== VINOS BOTELLA =====
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
let ticket = [];
let categoriaActiva = "Todos";
let formaPagoSeleccionada = null;
let numeroTicket = parseInt(localStorage.getItem('numeroTicket') || '1');

// ============== INICIO ==============
document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarCategorias();
    cargarProductos();
    document.getElementById('cajero-actual').textContent = EMPRESA.cajero;
    
    // Estado de Sheets
    const estado = document.getElementById('estado-sheets');
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith('https://')) {
        estado.textContent = '📊 Sheets: ✅ Conectado';
    } else {
        estado.textContent = '📊 Sheets: ❌ No configurado';
    }
});

function actualizarFechaHora() {
    const ahora = new Date();
    document.getElementById('fecha-hora').textContent =
        `${ahora.toLocaleDateString('es-ES')} ${ahora.toLocaleTimeString('es-ES')}`;
}

// ============== CATEGORÍAS ==============
function cargarCategorias() {
    const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.cat))];
    document.getElementById('categorias-lista').innerHTML = categorias.map(cat => `
        <button class="categoria-btn ${cat === categoriaActiva ? 'activa' : ''}" 
                onclick="filtrarCategoria('${cat}')">${cat}</button>
    `).join('');
}

function filtrarCategoria(cat) {
    categoriaActiva = cat;
    cargarCategorias();
    cargarProductos();
}

// ============== PRODUCTOS ==============
function cargarProductos() {
    const lista = categoriaActiva === "Todos" ? PRODUCTOS : PRODUCTOS.filter(p => p.cat === categoriaActiva);
    document.getElementById('productos-lista').innerHTML = lista.map(p => `
        <div class="producto-card" onclick="añadirProducto(${p.id})">
            <div class="producto-nombre">${p.nombre}</div>
            <div class="producto-precio">${p.precio.toFixed(2)} €</div>
            <div class="producto-iva">IVA ${p.iva}%</div>
        </div>
    `).join('');
}

// ============== TICKET ==============
function añadirProducto(id) {
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
    if (confirm('¿Seguro que quieres cancelar el ticket actual?')) {
        ticket = [];
        renderTicket();
    }
}

function renderTicket() {
    const cont = document.getElementById('ticket-items');
    if (ticket.length === 0) {
        cont.innerHTML = `<div class="ticket-vacio">Añade productos al ticket pulsando sobre ellos</div>`;
        document.getElementById('btn-cobrar').disabled = true;
    } else {
        cont.innerHTML = ticket.map(item => `
            <div class="ticket-item">
                <div class="item-cantidad">
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, -1)">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, 1)">+</button>
                </div>
                <div class="item-info">
                    <div class="item-nombre">${item.nombre}</div>
                    <div class="item-precio">${item.precio.toFixed(2)} € · IVA ${item.iva}%</div>
                </div>
                <div>
                    <span class="item-total">${(item.cantidad * item.precio).toFixed(2)} €</span>
                    <button class="btn-eliminar" onclick="eliminarProducto(${item.id})">×</button>
                </div>
            </div>
        `).join('');
        document.getElementById('btn-cobrar').disabled = false;
    }
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
    document.getElementById('base-21').textContent = `${ivas[21].base.toFixed(2)} €`;
    const totalIva = ivas[4].cuota + ivas[10].cuota + ivas[21].cuota;
    document.getElementById('total-iva').textContent = `${totalIva.toFixed(2)} €`;
    document.getElementById('total-final').textContent = `${total.toFixed(2)} €`;
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

function cerrarModal() {
    document.getElementById('modal-cobro').classList.remove('activo');
}

function seleccionarPago(forma) {
    formaPagoSeleccionada = forma;
    document.querySelectorAll('.pago-btn').forEach(b => {
        b.classList.toggle('activo', b.dataset.pago === forma);
    });
    document.getElementById('btn-confirmar-cobro').disabled = false;
}

function confirmarCobro() {
    if (!formaPagoSeleccionada) return;

    const datosTicket = {
        numeroTicket: String(numeroTicket).padStart(6, '0'),
        fecha: new Date(),
        cajero: EMPRESA.cajero,
        productos: [...ticket],
        formaPago: formaPagoSeleccionada,
        ...calcularTotales()
    };

    imprimirTicket(datosTicket);
    enviarAGoogleSheets(datosTicket);

    numeroTicket++;
    localStorage.setItem('numeroTicket', numeroTicket);

    ticket = [];
    renderTicket();
    cerrarModal();
}

// ============== ENVÍO A GOOGLE SHEETS ==============
function enviarAGoogleSheets(datos) {
    if (!GOOGLE_SHEETS_URL || !GOOGLE_SHEETS_URL.startsWith('https://')) return;

    const payload = {
        numeroTicket: datos.numeroTicket,
        fecha: datos.fecha.toISOString(),
        cajero: datos.cajero,
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

    // mode no-cors evita problemas CORS con Google Apps Script
    fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    }).then(() => {
        console.log('✅ Ticket enviado a Google Sheets');
    }).catch(err => {
        console.error('❌ Error enviando a Sheets:', err);
    });
}

// ============== IMPRESIÓN ==============
function imprimirTicket(datos) {
    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}:${String(f.getSeconds()).padStart(2,'0')}`;
    const ivasAg = datos.ivas;
    const total = datos.total;

    // Logo SVG en color verde Sant Patrici (para el ticket)
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
.logo { margin-bottom: 5px; }
</style></head><body>

    <div class="center logo">${logoSVG}</div>

    <div class="center empresa">${EMPRESA.nombre}</div>
    <div class="center">
        CIF: ${EMPRESA.cif}<br>
        ${EMPRESA.direccion}<br>
        Tel: ${EMPRESA.telefono}
    </div>

    <div class="sep"></div>

    <table>
        <tr><td class="bold">Ticket Nº:</td><td class="right">${datos.numeroTicket}</td></tr>
        <tr><td class="bold">Fecha:</td><td class="right">${fechaStr} ${horaStr}</td></tr>
        <tr><td class="bold">Cajero:</td><td class="right">${datos.cajero}</td></tr>
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

    <table>
        <tr class="total-final">
            <td>TOTAL:</td>
            <td class="right">${total.toFixed(2)} €</td>
        </tr>
    </table>

    <div class="sep"></div>

    <table><tr><td class="bold">Forma de pago:</td><td class="right">${datos.formaPago}</td></tr></table>

    <div class="sep"></div>

    <div class="center footer">
        ¡Gracias por su visita!<br>
        Moltes gràcies!<br><br>
        Conserve este ticket<br>
        para cualquier reclamación<br><br>
        ${EMPRESA.nombre}
    </div>

</body></html>`;

    const ventana = window.open('', '_blank', 'width=400,height=600');
    if (!ventana) {
        alert('⚠️ Permite las ventanas emergentes para poder imprimir el ticket.');
        return;
    }
    ventana.document.write(html);
    ventana.document.close();
    ventana.onload = () => {
        ventana.focus();
        ventana.print();
        ventana.onafterprint = () => ventana.close();
        setTimeout(() => { try { ventana.close(); } catch(e){} }, 5000);
    };
}