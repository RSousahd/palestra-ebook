/* ═══════════════════════════════════════════
   RAFAEL SOARES — UTILIDADES COMPARTILHADAS
   Sanitização, validação e funções auxiliares
═══════════════════════════════════════════ */

/**
 * Gera um token CSRF aleatório para proteção contra ataques
 */
function generateCSRFToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Armazena token CSRF na sessão
 */
function initCSRFProtection() {
  if (!sessionStorage.getItem('csrfToken')) {
    sessionStorage.setItem('csrfToken', generateCSRFToken());
  }
}

/**
 * Obtém token CSRF atual
 */
function getCSRFToken() {
  return sessionStorage.getItem('csrfToken') || '';
}

/**
 * Sanitiza texto para prevenir XSS
 * @param {string} text - Texto a sanitizar
 * @returns {string} Texto seguro
 */
function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Valida telefone brasileiro
 * @param {string} tel - Telefone a validar
 * @returns {boolean} True se válido
 */
function isValidPhone(tel) {
  const cleanTel = tel.replace(/\D/g, '');
  return cleanTel.length >= 10 && cleanTel.length <= 11;
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida se campo obrigatório está preenchido
 * @param {string} value - Valor a validar
 * @returns {boolean} True se preenchido
 */
function isRequired(value) {
  return value && value.trim().length > 0;
}

/**
 * Exibe mensagem de erro
 * @param {HTMLElement} element - Elemento para mostrar erro
 * @param {string} message - Mensagem de erro
 */
function showError(element, message) {
  if (!element) return;
  element.textContent = '❌ ' + message;
  element.style.display = 'block';
  element.style.color = '#c0392b';
  element.style.marginTop = '8px';
  element.style.fontSize = '0.85rem';
}

/**
 * Exibe mensagem de sucesso
 * @param {HTMLElement} element - Elemento para mostrar sucesso
 * @param {string} message - Mensagem de sucesso
 */
function showSuccess(element, message) {
  if (!element) return;
  element.textContent = '✅ ' + message;
  element.style.display = 'block';
  element.style.color = '#27ae60';
  element.style.marginTop = '8px';
  element.style.fontSize = '0.85rem';
}

/**
 * Valida formulário de contato
 * @returns {Object} Objeto com dados validados ou erro
 */
function validateContactForm() {
  const fields = {
    nome: document.getElementById('cNome'),
    wpp: document.getElementById('cWpp'),
    tipo: document.getElementById('cTipo'),
    email: document.getElementById('cEmail'),
    bairro: document.getElementById('cBairro'),
    msg: document.getElementById('cMsg'),
  };

  const errors = {};

  if (!isRequired(fields.nome.value)) {
    errors.nome = 'Nome é obrigatório';
  }

  if (!isRequired(fields.wpp.value)) {
    errors.wpp = 'WhatsApp é obrigatório';
  } else if (!isValidPhone(fields.wpp.value)) {
    errors.wpp = 'WhatsApp inválido (10-11 dígitos)';
  }

  if (!isRequired(fields.tipo.value)) {
    errors.tipo = 'Tipo de imóvel é obrigatório';
  }

  if (fields.email.value && !isValidEmail(fields.email.value)) {
    errors.email = 'E-mail inválido';
  }

  return Object.keys(errors).length === 0 
    ? { valid: true, data: {
        nome: sanitizeText(fields.nome.value.trim()),
        wpp: fields.wpp.value.trim(),
        tipo: fields.tipo.value.trim(),
        email: fields.email.value.trim(),
        bairro: sanitizeText(fields.bairro.value.trim()),
        msg: sanitizeText(fields.msg.value.trim()),
      }}
    : { valid: false, errors };
}

/**
 * Valida formulário de orçamento
 * @returns {Object} Objeto com dados validados ou erro
 */
function validateBudgetForm() {
  const fields = {
    nome: document.getElementById('oNome'),
    wpp: document.getElementById('oWpp'),
    email: document.getElementById('oEmail'),
    tipo: document.getElementById('oTipo'),
    urgencia: document.getElementById('oUrgencia'),
  };

  const errors = {};

  if (!isRequired(fields.nome.value)) {
    errors.nome = 'Nome é obrigatório';
  }

  if (!isRequired(fields.wpp.value)) {
    errors.wpp = 'WhatsApp é obrigatório';
  } else if (!isValidPhone(fields.wpp.value)) {
    errors.wpp = 'WhatsApp inválido (10-11 dígitos)';
  }

  if (!isRequired(fields.tipo.value)) {
    errors.tipo = 'Tipo de serviço é obrigatório';
  }

  if (fields.email.value && !isValidEmail(fields.email.value)) {
    errors.email = 'E-mail inválido';
  }

  return Object.keys(errors).length === 0 
    ? { valid: true, data: {
        nome: sanitizeText(fields.nome.value.trim()),
        wpp: fields.wpp.value.trim(),
        email: fields.email.value.trim(),
        tipo: fields.tipo.value.trim(),
        urgencia: fields.urgencia.value.trim(),
      }}
    : { valid: false, errors };
}

/**
 * Envia dados para WhatsApp com segurança
 * @param {Object} data - Dados do formulário
 * @param {string} tipo - Tipo de formulário ('contato' ou 'orcamento')
 */
function sendToWhatsApp(data, tipo) {
  let msg = '';

  if (tipo === 'contato') {
    msg = `Novo Contato\n`;
    msg += `Nome: ${data.nome}\n`;
    msg += `WhatsApp: ${data.wpp}\n`;
    msg += `Tipo de Imóvel: ${data.tipo}\n`;
    if (data.bairro) msg += `Bairro: ${data.bairro}\n`;
    if (data.email) msg += `E-mail: ${data.email}\n`;
    if (data.msg) msg += `Mensagem: ${data.msg}`;
  } else if (tipo === 'orcamento') {
    msg = `Solicitar Orçamento\n`;
    msg += `Nome: ${data.nome}\n`;
    msg += `WhatsApp: ${data.wpp}\n`;
    msg += `Tipo de Serviço: ${data.tipo}\n`;
    if (data.urgencia) msg += `Urgência: ${data.urgencia}\n`;
    if (data.email) msg += `E-mail: ${data.email}`;
  }

  const encodedMsg = encodeURIComponent(msg);
  const whatsappUrl = `https://wa.me/5562985558320?text=${encodedMsg}`;
  
  window.open(whatsappUrl, '_blank');
}

/**
 * Inicializa proteção CSRF ao carregar a página
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCSRFProtection);
} else {
  initCSRFProtection();
}
