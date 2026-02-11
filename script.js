document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#criteria-table tbody');
  const totalPercentageEl = document.getElementById('total-percentage');
  const progressBarEl = document.getElementById('progress-bar');
  const exportBtn = document.getElementById('export-btn');
  const resetBtn = document.getElementById('reset-btn');
  const productNameEl = document.getElementById('product-name');
  const statusCardEl = document.getElementById('status-card');
  const statusIconEl = document.getElementById('status-icon');
  const statusTitleEl = document.getElementById('status-title');
  const statusDescriptionEl = document.getElementById('status-description');

  const successAlert = document.getElementById('success-alert');
  const closeAlertBtn = document.getElementById('close-alert-btn');

  const marginModal = document.getElementById('margin-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const calculateMarginBtn = document.getElementById('calculate-margin-btn');
  const marginResultContainer = document.getElementById('margin-result-container');
  const marginResultEl = document.getElementById('margin-result');

  const confettiCanvas = document.getElementById('confetti-canvas');
  const myConfetti = confetti.create(confettiCanvas, { resize: true });

  const criteria = [
    { id: 1, text: 'Resuelve un Problema Específico', tooltip: 'Un producto que soluciona un dolor real es más fácil de vender. La gente paga por soluciones, no por "vitaminas".', points: 3, checked: false },
    { id: 8, text: 'Tiene un Margen de Ganancia Saludable (+30% neto)', tooltip: 'Después de pagar el producto, el envío y la publicidad, ¿te queda al menos un 30% del precio de venta como ganancia limpia?', points: 3, checked: false, isKnockout: true, hasCalculator: true },
    { id: 5, text: 'Fiabilidad del Proveedor', tooltip: 'El mejor producto del mundo con un proveedor que no responde o envía tarde es una receta para el fracaso.', points: 3, checked: false, isKnockout: true },
    { id: 6, text: 'Potencial de Escalabilidad (Stock Suficiente)', tooltip: 'Un buen producto debe tener suficiente inventario para escalar ventas sin pausar campañas.', points: 3, checked: false },
    { id: 7, text: 'Nivel de Competencia (Mercado Poco Saturado)', tooltip: 'Busca productos con pocos competidores para tener una ventaja inicial.', points: 3, checked: false },
    { id: 2, text: 'Tiene un "Efecto Wow" (Fácil de demostrar en video)', tooltip: 'Debe capturar la atención en 3 segundos.', points: 2, checked: false },
    { id: 3, text: 'No se Encuentra Fácilmente en Tiendas Físicas', tooltip: 'La venta online en dropshipping se nutre de la novedad.', points: 2, checked: false },
    { id: 4, text: 'Se Dirige a una Audiencia Apasionada', tooltip: 'Es más fácil venderle a un nicho que se auto-identifica.', points: 2, checked: false },
    { id: 9, text: 'Precio de Venta Impulsivo', tooltip: 'Un producto de bajo o mediano costo se vende con más facilidad.', points: 2, checked: false },
    { id: 13, text: 'Contenido para anuncios', tooltip: 'Videos e imágenes de calidad aceleran la creación de campañas.', points: 2, checked: false },
    { id: 10, text: 'Es Simple de Usar y Entender', tooltip: 'Busca simplicidad para reducir fricción y devoluciones.', points: 2, checked: false },
    { id: 11, text: 'No es Frágil ni Complejo de Enviar', tooltip: 'Evita productos frágiles o complejos de logística.', points: 2, checked: false },
    { id: 12, text: 'Tiene Múltiples Ángulos de Marketing', tooltip: 'Si solo hay un gancho de venta, tu marketing será más frágil.', points: 2, checked: false },
    { id: 14, text: 'Potencial de Marca a Largo Plazo', tooltip: 'Pensar a largo plazo ayuda a construir un activo real.', points: 2, checked: false },
    { id: 15, text: 'Potencial de Recompra y Venta Cruzada (LTV)', tooltip: 'La rentabilidad real crece cuando puedes vender varias veces al mismo cliente.', points: 2, checked: false }
  ];

  const MAX_SCORE = criteria.reduce((acc, item) => acc + item.points, 0);
  const HIGH_POTENTIAL_PERCENT = 75;
  const CAUTION_PERCENT = 50;

  let hasShownConfetti = false;
  let alertTimer = null;

  const iconCancel = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
  const iconWarning = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
  const iconCheck = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';

  function renderTable() {
    tableBody.innerHTML = '';

    criteria.forEach((criterion, index) => {
      const row = document.createElement('tr');
      row.className = index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800';
      row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      const tooltipPositionClass = index < 3 ? 'tooltip-bottom' : 'tooltip-default';
      const calculatorIconHtml = criterion.hasCalculator
        ? '<div class="calculator-icon ml-2" aria-label="Abrir calculadora de margen"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1H7zM6 10a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1zm4 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-4 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clip-rule="evenodd"/></svg></div>'
        : '';

      row.innerHTML = `
        <td class="px-6 py-4 whitespace-normal text-sm font-medium text-zinc-100 flex items-center">
        <td class="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 flex items-center">
          <span class="font-semibold mr-2">${index + 1}.</span>
          <span>${criterion.text}</span>
          <div class="tooltip-container">
            <svg class="tooltip-icon w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
            <span class="tooltip-text ${tooltipPositionClass}">${criterion.tooltip}</span>
          </div>
          ${calculatorIconHtml}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
          <div class="flex items-center justify-center">
            <div class="relative inline-block w-12 mr-2 align-middle select-none">
              <input type="checkbox" id="toggle-${criterion.id}" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-zinc-100 border-4 appearance-none cursor-pointer" ${criterion.checked ? 'checked' : ''}>
              <label for="toggle-${criterion.id}" class="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-600 cursor-pointer"></label>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div class="flex items-center justify-center">
            <div class="relative inline-block w-12 mr-2 align-middle select-none">
              <input type="checkbox" id="toggle-${criterion.id}" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" ${criterion.checked ? 'checked' : ''}>
              <label for="toggle-${criterion.id}" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </td>`;
      tableBody.appendChild(row);
    });
  }

  function closeSuccessAlert() {
    if (successAlert.classList.contains('hidden')) {
      return;
    }
    successAlert.classList.add('translate-x-full');
    successAlert.classList.remove('translate-x-0');
    setTimeout(() => successAlert.classList.add('hidden'), 300);
  }

  function openSuccessAlert() {
    successAlert.classList.remove('hidden', 'translate-x-full');
    successAlert.classList.add('translate-x-0');
  }

  function updateStatusCard(percentage, isKnockedOut) {
    statusCardEl.classList.remove('bg-red-600', 'bg-amber-500', 'bg-green-600');

    if (isKnockedOut || percentage < CAUTION_PERCENT) {
      statusCardEl.classList.add('bg-red-600');
      statusIconEl.innerHTML = iconCancel;
      statusTitleEl.textContent = 'NO VIABLE / ALTO RIESGO';
      statusDescriptionEl.textContent = 'Alerta Roja. El producto falla en criterios críticos o acumula demasiadas debilidades.';
      return;
    }

    if (percentage < HIGH_POTENTIAL_PERCENT) {
      statusCardEl.classList.add('bg-amber-500');
      statusIconEl.innerHTML = iconWarning;
      statusTitleEl.textContent = 'POTENCIAL CON PRECAUCIÓN';
      statusDescriptionEl.textContent = 'Cuidado. El producto tiene potencial, pero presenta debilidades que debes resolver antes de invertir.';
      return;
    }

    statusCardEl.classList.add('bg-green-600');
    statusIconEl.innerHTML = iconCheck;
    statusTitleEl.textContent = 'PRODUCTO VIABLE / ALTO POTENCIAL';
    statusDescriptionEl.textContent = 'Excelente. El producto tiene una base sólida y cumple con criterios operativos y de marketing.';
  }

  function updateUI() {
    let currentScore = 0;
    let isKnockedOut = false;

    criteria.forEach((criterion) => {
      if (criterion.checked) {
        currentScore += criterion.points;
      }
      if (criterion.isKnockout && !criterion.checked) {
        isKnockedOut = true;
      }
    });

    const percentage = Math.round((currentScore / MAX_SCORE) * 100);
    totalPercentageEl.textContent = `${percentage}%`;
    progressBarEl.style.width = `${Math.min(100, Math.max(0, percentage))}%`;

    updateStatusCard(percentage, isKnockedOut);

    const shouldCelebrate = !isKnockedOut && percentage >= HIGH_POTENTIAL_PERCENT;

    if (shouldCelebrate && !hasShownConfetti) {
      myConfetti({ particleCount: 160, spread: 90, origin: { y: 0.6 }, colors: ['#fef08a', '#facc15', '#eab308', '#f59e0b'] });
      myConfetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
      openSuccessAlert();
      hasShownConfetti = true;
      clearTimeout(alertTimer);
      alertTimer = setTimeout(closeSuccessAlert, 5000);
      return;
    }

    if (!shouldCelebrate) {
      hasShownConfetti = false;
      clearTimeout(alertTimer);
      closeSuccessAlert();
    }
  }

  tableBody.addEventListener('change', (event) => {
    if (event.target.type !== 'checkbox') {
      return;
    }

    const criterionId = Number.parseInt(event.target.id.split('-')[1], 10);
    const criterion = criteria.find((item) => item.id === criterionId);

    if (!criterion) {
      return;
    }

    criterion.checked = event.target.checked;
    updateUI();
  });

  tableBody.addEventListener('click', (event) => {
    if (!event.target.closest('.calculator-icon')) {
      return;
    }
    marginModal.classList.add('active');
    marginModal.setAttribute('aria-hidden', 'false');
  });

  exportBtn.addEventListener('click', () => {
    const captureArea = document.getElementById('capture-area');
    const productName = productNameEl.value.trim().replace(/\s+/g, '_');
    const fileName = productName ? `analisis_${productName}.png` : 'analisis_producto.png';

    html2canvas(captureArea, { useCORS: true, scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });

  resetBtn.addEventListener('click', () => {
    productNameEl.value = '';
    criteria.forEach((criterion) => {
      criterion.checked = false;
    });
    renderTable();
    updateUI();
  });

  closeAlertBtn.addEventListener('click', () => {
    clearTimeout(alertTimer);
    closeSuccessAlert();
  });

  closeModalBtn.addEventListener('click', () => {
    marginModal.classList.remove('active');
    marginModal.setAttribute('aria-hidden', 'true');
  });

  marginModal.addEventListener('click', (event) => {
    if (event.target !== marginModal) {
      return;
    }
    marginModal.classList.remove('active');
    marginModal.setAttribute('aria-hidden', 'true');
  });

  calculateMarginBtn.addEventListener('click', () => {
    const salePrice = Number.parseFloat(document.getElementById('sale-price').value);
    const productCost = Number.parseFloat(document.getElementById('product-cost').value);
    const cacCost = Number.parseFloat(document.getElementById('cac-cost').value);

    if (Number.isNaN(salePrice) || Number.isNaN(productCost) || Number.isNaN(cacCost) || salePrice <= 0) {
      marginResultEl.textContent = 'Error';
      marginResultEl.classList.add('text-red-500');
      marginResultContainer.classList.remove('hidden');
      return;
    }

    const netProfit = salePrice - productCost - cacCost;
    const netMargin = (netProfit / salePrice) * 100;

    marginResultEl.textContent = `${netMargin.toFixed(2)}%`;
    marginResultEl.classList.remove('text-red-500');
    marginResultContainer.classList.remove('hidden');
  });

  renderTable();
  updateUI();
});
