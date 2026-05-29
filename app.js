/* ============================================================
   TPV - HORT SANT PATRICI S.L.
   CIF: B57442501
   Camí de Sant Patrici S/N - Tel: +34 971 71 37 16
   ============================================================ */

// ============== CONFIGURACIÓN EMPRESA ==============
const EMPRESA = {
    nombre: "HORT SANT PATRICI S.L.",
    cif: "B57442501",
    direccion: "Camí de Sant Patrici S/N",
    telefono: "+34 971 71 37 16",
    cajero: "Admin"
};

// ============== CATÁLOGO DE PRODUCTOS ==============
// IVA: 4% (queso), 10% (alimentación), 21% (vino y alcohol)
const PRODUCTOS = [
    // ===== QUESOS (4% IVA) =====
    { id: 1,  cat: "Quesos", nombre: "Queso Mahón Curado 500g",   precio: 18.50, iva: 4 },
    { id: 2,  cat: "Quesos", nombre: "Queso Mahón Semi 500g",     precio: 14.00, iva: 4 },
    { id: 3,  cat: "Quesos", nombre: "Queso Mahón Tierno 500g",   precio: 11.00, iva: 4 },
    { id: 4,  cat: "Quesos", nombre: "Queso Reserva 1kg",          precio: 38.00, iva: 4 },
    { id: 5,  cat: "Quesos", nombre: "Cuña Mahón 250g",            precio: 7.50,  iva: 4 },
    { id: 6,  cat: "Quesos", nombre: "Lote Degustación",           precio: 25.00, iva: 4 },

    // ===== ALIMENTACIÓN (10% IVA) =====
    { id: 10, cat: "Alimentación", nombre: "Pan Payés",              precio: 3.20,  iva: 10 },
    { id: 11, cat: "Alimentación", nombre: "Sobrasada 250g",         precio: 6.50,  iva: 10 },
    { id: 12, cat: "Alimentación", nombre: "Mermelada Casera",       precio: 5.50,  iva: 10 },
    { id: 13, cat: "Alimentación", nombre: "Aceite Oliva Virgen",    precio: 12.00, iva: 10 },
    { id: 14, cat: "Alimentación", nombre: "Miel Menorquina 500g",   precio: 9.00,  iva: 10 },
    { id: 15, cat: "Alimentación", nombre: "Carne Picada 500g",      precio: 7.00,  iva: 10 },
    { id: 16, cat: "Alimentación", nombre: "Embutido Variado",       precio: 15.00, iva: 10 },

    // ===== VINOS Y ALCOHOL (21% IVA) =====
    { id: 20, cat: "Vinos", nombre: "Vino Tinto Binifadet",     precio: 15.00, iva: 21 },
    { id: 21, cat: "Vinos", nombre: "Vino Blanco Binifadet",    precio: 14.00, iva: 21 },
    { id: 22, cat: "Vinos", nombre: "Vino Rosado",              precio: 12.00, iva: 21 },
    { id: 23, cat: "Vinos", nombre: "Cava Brut",                precio: 18.00, iva: 21 },
    { id: 24, cat: "Vinos", nombre: "Gin Xoriguer 70cl",        precio: 22.00, iva: 21 },
    { id: 25, cat: "Vinos", nombre: "Pomada (Gin + Limón)",     precio: 4.50,  iva: 21 }
];

// ============== ESTADO DEL TPV ==============
let ticket = [];               // Productos en el ticket actual
let categoriaActiva = "Todos"; // Filtro de categoría
let formaPagoSeleccionada = null;
let numeroTicket = parseInt(localStorage.getItem('numeroTicket') || '1');

// ============== INICIALIZACIÓN ==============
document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    cargarCategorias();
    cargarProductos();
    document.getElementById('cajero-actual').textContent = EMPRESA.cajero;
});

// ============== FECHA Y HORA ==============
function actualizarFechaHora() {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES');
    const hora = ahora.toLocaleTimeString('es-ES');
    document.getElementById('fecha-hora').textContent = `${fecha} ${hora}`;
}

// ============== CATEGORÍAS ==============
function cargarCategorias() {
    const categorias = ["Todos", ...new Set(PRODUCTOS.map(p => p.cat))];
    const cont = document.getElementById('categorias-lista');
    cont.innerHTML = categorias.map(cat => `
        <button class="categoria-btn ${cat === categoriaActiva ? 'activa' : ''}" 
                onclick="filtrarCategoria('${cat}')">
            ${cat}
        </button>
    `).join('');
}

function filtrarCategoria(cat) {
    categoriaActiva = cat;
    cargarCategorias();
    cargarProductos();
}

// ============== PRODUCTOS ==============
function cargarProductos() {
    const lista = categoriaActiva === "Todos" 
        ? PRODUCTOS 
        : PRODUCTOS.filter(p => p.cat === categoriaActiva);

    const cont = document.getElementById('productos-lista');
    cont.innerHTML = lista.map(p => `
        <div class="producto-card" onclick="añadirProducto(${p.id})">
            <div class="producto-nombre">${p.nombre}</div>
            <div class="producto-precio">${p.precio.toFixed(2)} €</div>
            <div class="producto-iva">IVA ${p.iva}%</div>
        </div>
    `).join('');
}

// ============== TICKET / CARRITO ==============
function añadirProducto(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    const existente = ticket.find(item => item.id === id);
    if (existente) {
        existente.cantidad++;
    } else {
        ticket.push({ ...producto, cantidad: 1 });
    }

    renderTicket();
}

function modificarCantidad(id, delta) {
    const item = ticket.find(p => p.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        ticket = ticket.filter(p => p.id !== id);
    }
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

// ============== RENDER TICKET ==============
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

// ============== CÁLCULO TOTALES ==============
function calcularTotales() {
    const ivas = { 4: { base: 0, cuota: 0 }, 10: { base: 0, cuota: 0 }, 21: { base: 0, cuota: 0 } };
    let total = 0;

    ticket.forEach(item => {
        const totalLinea = item.cantidad * item.precio;
        const base = totalLinea / (1 + item.iva / 100);
        const cuota = totalLinea - base;
        ivas[item.iva].base += base;
        ivas[item.iva].cuota += cuota;
        total += totalLinea;
    });

    return { ivas, total };
}

function actualizarTotales() {
    const { ivas, total } = calcularTotales();
    document.getElementById('base-4').textContent  = `${ivas[4].base.toFixed(2)} €`;
    document.getElementById('base-10').textContent = `${ivas[10].base.toFixed(2)} €`;
    document.getElementById('base-21').textContent = `${ivas[21].base.toFixed(2)} €`;
    const totalIva = ivas[4].cuota + ivas[10].cuota + ivas[21].cuota;
    document.getElementById('total-iva').textContent  = `${totalIva.toFixed(2)} €`;
    document.getElementById('total-final').textContent = `${total.toFixed(2)} €`;
}

// ============== MODAL DE COBRO ==============
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

    // Generar datos del ticket
    const datosTicket = {
        numeroTicket: String(numeroTicket).padStart(6, '0'),
        fecha: new Date(),
        cajero: EMPRESA.cajero,
        productos: [...ticket],
        formaPago: formaPagoSeleccionada
    };

    // Imprimir
    imprimirTicket(datosTicket);

    // Incrementar nº ticket
    numeroTicket++;
    localStorage.setItem('numeroTicket', numeroTicket);

    // Limpiar
    ticket = [];
    renderTicket();
    cerrarModal();
}

// ============== IMPRESIÓN DEL TICKET ==============
function imprimirTicket(datos) {
    // Cálculos
    const ivasAg = { 4: { base: 0, cuota: 0 }, 10: { base: 0, cuota: 0 }, 21: { base: 0, cuota: 0 } };
    let total = 0;
    datos.productos.forEach(p => {
        const tl = p.cantidad * p.precio;
        const b = tl / (1 + p.iva / 100);
        ivasAg[p.iva].base += b;
        ivasAg[p.iva].cuota += tl - b;
        total += tl;
    });

    const f = datos.fecha;
    const fechaStr = `${String(f.getDate()).padStart(2,'0')}/${String(f.getMonth()+1).padStart(2,'0')}/${f.getFullYear()}`;
    const horaStr = `${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}:${String(f.getSeconds()).padStart(2,'0')}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Ticket ${datos.numeroTicket}</title>
<style>
@page { size: 80mm auto; margin: 0; }
@media print { html, body { width: 80mm; } }
body {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    width: 80mm;
    margin: 0;
    padding: 4mm;
    color: #000;
}
.center { text-align: center; }
.right { text-align: right; }
.bold { font-weight: bold; }
.sep { border-top: 1px dashed #000; margin: 5px 0; }
table { width: 100%; border-collapse: collapse; }
table td { padding: 1px 0; vertical-align: top; }
.empresa { font-size: 14px; font-weight: bold; }
.total-final { font-size: 18px; font-weight: bold; }
.footer { font-size: 11px; margin-top: 10px; }
h1, h2, h3 { margin: 0; padding: 0; }
</style>
</head>
<body>

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
        ${ivasAg[4].base > 0 ? `
            <tr><td>Base IVA 4%:</td><td class="right">${ivasAg[4].base.toFixed(2)} €</td></tr>
            <tr><td>Cuota IVA 4%:</td><td class="right">${ivasAg[4].cuota.toFixed(2)} €</td></tr>
        ` : ''}
        ${ivasAg[10].base > 0 ? `
            <tr><td>Base IVA 10%:</td><td class="right">${ivasAg[10].base.toFixed(2)} €</td></tr>
            <tr><td>Cuota IVA 10%:</td><td class="right">${ivasAg[10].cuota.toFixed(2)} €</td></tr>
        ` : ''}
        ${ivasAg[21].base > 0 ? `
            <tr><td>Base IVA 21%:</td><td class="right">${ivasAg[21].base.toFixed(2)} €</td></tr>
            <tr><td>Cuota IVA 21%:</td><td class="right">${ivasAg[21].cuota.toFixed(2)} €</td></tr>
        ` : ''}
    </table>

    <div class="sep"></div>

    <table>
        <tr class="total-final">
            <td>TOTAL:</td>
            <td class="right">${total.toFixed(2)} €</td>
        </tr>
    </table>

    <div class="sep"></div>

    <table>
        <tr><td class="bold">Forma de pago:</td><td class="right">${datos.formaPago}</td></tr>
    </table>

    <div class="sep"></div>

    <div class="center footer">
        ¡Gracias por su visita!<br><br>
        Conserve este ticket<br>
        para cualquier reclamación<br><br>
        ${EMPRESA.nombre}
    </div>

</body>
</html>
    `;

    // Abrir ventana e imprimir
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
        // Fallback por si onafterprint no funciona
        setTimeout(() => { try { ventana.close(); } catch(e){} }, 5000);
    };
}