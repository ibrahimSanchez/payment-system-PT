const EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const CARD_NUMBER_REGEX = /^\d{16}$/;
const EXPIRATION_DATE_REGEX = /^(0[1-9]|1[0-2])\/(\d{4})$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:[ '\-][A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  if (
    trimmed.length === 0 ||
    trimmed.length > 254 ||
    trimmed.includes('..') ||
    trimmed.endsWith('.') ||
    trimmed.startsWith('.') ||
    trimmed.includes('@.') ||
    trimmed.includes('.@')
  ) {
    return false;
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return false;
  }

  const domain = parts[1];
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return false;
  }

  const last = domainParts[domainParts.length - 1];
  const prev = domainParts[domainParts.length - 2];
  if (last === prev) {
    return false;
  }

  return EMAIL_REGEX.test(trimmed);
};

const isValidPositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
};

const isValidAmount = (value) => {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return false;
  }

  const parsed = Number(value);
  return !Number.isNaN(parsed) && parsed > 0;
};

const isValidName = (value) => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const trimmed = value.trim();
  return (
    trimmed.length >= 2 &&
    trimmed.length <= 100 &&
    NAME_REGEX.test(trimmed)
  );
};

const isValidCardHolder = (value) => {
  return isValidName(value);
};

const isValidCardNumber = (value) =>
  typeof value === 'string' && CARD_NUMBER_REGEX.test(value.trim());

const isValidExpirationDate = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const match = value.trim().match(EXPIRATION_DATE_REGEX);
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = Number(match[2]);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
};

const isValidCardType = (value) => {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  return ['credito', 'debito'].includes(value.toLowerCase());
};

const isValidDescription = (value) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 255;
};

const validateUserPayload = ({ nombre, email }) => {
  const errors = [];

  if (!isNonEmptyString(nombre)) {
    errors.push('nombre es requerido');
  } else if (!isValidName(nombre)) {
    errors.push(
      'nombre debe tener entre 2 y 100 caracteres y sólo contener letras'
    );
  }

  if (!isNonEmptyString(email)) {
    errors.push('email es requerido');
  } else if (!isValidEmail(email)) {
    errors.push('email no tiene un formato válido');
  }

  return errors;
};

const validateCardPayload = ({
  numero_tarjeta,
  fecha_vencimiento,
  tipo,
}) => {
  const errors = [];

  if (!isNonEmptyString(numero_tarjeta)) {
    errors.push('numero_tarjeta es requerido');
  } else if (!isValidCardNumber(numero_tarjeta)) {
    errors.push('numero_tarjeta debe contener exactamente 16 dígitos');
  }

  if (!isNonEmptyString(fecha_vencimiento)) {
    errors.push('fecha_vencimiento es requerida');
  } else if (!isValidExpirationDate(fecha_vencimiento)) {
    errors.push(
      'fecha_vencimiento debe tener formato MM/YYYY y no puede estar vencida'
    );
  }

  if (!isValidCardType(tipo)) {
    errors.push("tipo debe ser 'credito' o 'debito'");
  }

  return errors;
};

const validatePaymentPayload = ({
  usuario_id,
  tarjeta_id,
  monto,
  descripcion,
}) => {
  const errors = [];

  if (!isValidPositiveInteger(usuario_id)) {
    errors.push('usuario_id es requerido y debe ser un entero positivo');
  }

  if (!isValidPositiveInteger(tarjeta_id)) {
    errors.push('tarjeta_id es requerido y debe ser un entero positivo');
  }

  if (!isValidAmount(monto)) {
    errors.push('monto es requerido y debe ser un número mayor a 0');
  }

  if (descripcion !== undefined && descripcion !== null) {
    if (!isValidDescription(descripcion)) {
      errors.push('descripcion debe ser una cadena entre 1 y 255 caracteres');
    }
  }

  return errors;
};

const validateUserUpdatePayload = ({ nombre, email }) => {
  const errors = [];

  if (nombre === undefined && email === undefined) {
    errors.push('Al menos nombre o email deben enviarse');
    return errors;
  }

  if (nombre !== undefined) {
    if (!isNonEmptyString(nombre)) {
      errors.push('nombre es requerido');
    } else if (!isValidName(nombre)) {
      errors.push(
        'nombre debe tener entre 2 y 100 caracteres y sólo contener letras, espacios, guiones o apóstrofes'
      );
    }
  }

  if (email !== undefined) {
    if (!isNonEmptyString(email)) {
      errors.push('email es requerido');
    } else if (!isValidEmail(email)) {
      errors.push('email no tiene un formato válido');
    }
  }

  return errors;
};

const validateCardUpdatePayload = ({
  numero_tarjeta,
  titular,
  fecha_vencimiento,
  tipo,
}) => {
  const errors = [];

  if (
    numero_tarjeta === undefined &&
    titular === undefined &&
    fecha_vencimiento === undefined &&
    tipo === undefined
  ) {
    errors.push('Al menos un campo debe actualizarse');
    return errors;
  }

  if (numero_tarjeta !== undefined) {
    if (!isNonEmptyString(numero_tarjeta)) {
      errors.push('numero_tarjeta es requerido');
    } else if (!isValidCardNumber(numero_tarjeta)) {
      errors.push('numero_tarjeta debe contener exactamente 16 dígitos');
    }
  }

  if (titular !== undefined) {
    if (!isNonEmptyString(titular)) {
      errors.push('titular es requerido');
    } else if (!isValidCardHolder(titular)) {
      errors.push(
        'titular debe tener entre 2 y 100 caracteres y sólo contener letras, espacios, guiones o apóstrofes'
      );
    }
  }

  if (fecha_vencimiento !== undefined) {
    if (!isNonEmptyString(fecha_vencimiento)) {
      errors.push('fecha_vencimiento es requerida');
    } else if (!isValidExpirationDate(fecha_vencimiento)) {
      errors.push(
        'fecha_vencimiento debe tener formato MM/YYYY y no puede estar vencida'
      );
    }
  }

  if (tipo !== undefined && !isValidCardType(tipo)) {
    errors.push("tipo debe ser 'credito' o 'debito'");
  }

  return errors;
};

const validatePaymentUpdatePayload = ({ descripcion, estado }) => {
  const errors = [];

  if (descripcion === undefined && estado === undefined) {
    errors.push('Al menos descripcion o estado deben enviarse');
    return errors;
  }

  if (descripcion !== undefined && !isValidDescription(descripcion)) {
    errors.push('descripcion debe ser una cadena entre 1 y 255 caracteres');
  }

  if (estado !== undefined) {
    const status = typeof estado === 'string' ? estado.toLowerCase() : estado;
    if (!['pendiente', 'aprobado', 'rechazado'].includes(status)) {
      errors.push("estado debe ser 'pendiente', 'aprobado' o 'rechazado'");
    }
  }

  return errors;
};

const validateIdParam = (value, fieldName = 'id') => {
  const errors = [];

  if (!isValidPositiveInteger(value)) {
    errors.push(`${fieldName} debe ser un entero positivo`);
  }

  return errors;
};

module.exports = {
  validateUserPayload,
  validateUserUpdatePayload,
  validateCardPayload,
  validateCardUpdatePayload,
  validatePaymentPayload,
  validatePaymentUpdatePayload,
  validateIdParam,
};