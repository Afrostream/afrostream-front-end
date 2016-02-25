const defaultFormat = /(\d{1,4})/g;
const cards = [
  {
    type: 'visaelectron',
    patterns: [4026, 417500, 4405, 4508, 4844, 4913, 4917],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'maestro',
    patterns: [5018, 502, 503, 56, 58, 639, 6220, 67],
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'forbrugsforeningen',
    patterns: [600],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'dankort',
    patterns: [5019],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'visa',
    patterns: [4],
    format: defaultFormat,
    length: [13, 16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'mastercard',
    patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'amex',
    patterns: [34, 37],
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvcLength: [3, 4],
    luhn: true
  }, {
    type: 'dinersclub',
    patterns: [30, 36, 38, 39],
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    length: [14],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'discover',
    patterns: [60, 64, 65, 622],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }, {
    type: 'unionpay',
    patterns: [62, 88],
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvcLength: [3],
    luhn: false
  }, {
    type: 'jcb',
    patterns: [35],
    format: defaultFormat,
    length: [16],
    cvcLength: [3],
    luhn: true
  }
];

const cardFromNumber = (num)=> {
  var card, p, pattern, _i, _j, _len, _len1, _ref;
  num = (num + '').replace(/\D/g, '');
  for (_i = 0, _len = cards.length; _i < _len; _i++) {
    card = cards[_i];
    _ref = card.patterns;
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      pattern = _ref[_j];
      p = pattern + '';
      if (num.substr(0, p.length) === p) {
        return card;
      }
    }
  }
};

const cardFromType = (type)=> {
  var card, _i, _len;
  for (_i = 0, _len = cards.length; _i < _len; _i++) {
    card = cards[_i];
    if (card.type === type) {
      return card;
    }
  }
};

const luhnCheck = (num) => {
  var digit, digits, odd, sum, _i, _len;
  odd = true;
  sum = 0;
  digits = (num + '').split('').reverse();
  for (_i = 0, _len = digits.length; _i < _len; _i++) {
    digit = digits[_i];
    digit = parseInt(digit, 10);
    if ((odd = !odd)) {
      digit *= 2;
    }
    if (digit > 9) {
      digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const hasTextSelected = ($target) => {
  var _ref;
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
    return true;
  }
  if ((typeof document !== 'undefined' && document !== null ? (_ref = document.selection) != null ? _ref.createRange : void 0 : void 0) != null) {
    if (document.selection.createRange().text) {
      return true;
    }
  }
  return false;
};

const safeVal = (value, $target)=> {
  var cursor, error, last;
  try {
    cursor = $target.prop('selectionStart');
  } catch (_error) {
    error = _error;
    cursor = null;
  }
  last = $target.val();
  $target.val(value);
  if (cursor !== null && $target.is(':focus')) {
    if (cursor === last.length) {
      cursor = value.length;
    }
    $target.prop('selectionStart', cursor);
    return $target.prop('selectionEnd', cursor);
  }
};

const replaceFullWidthChars = (str)=> {
  var chars, chr, fullWidth, halfWidth, idx, value, _i, _len;
  if (str == null) {
    str = '';
  }
  fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19';
  halfWidth = '0123456789';
  value = '';
  chars = str.split('');
  for (_i = 0, _len = chars.length; _i < _len; _i++) {
    chr = chars[_i];
    idx = fullWidth.indexOf(chr);
    if (idx > -1) {
      chr = halfWidth[idx];
    }
    value += chr;
  }
  return value;
};

const reFormatNumeric = (e)=> {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = value.replace(/\D/g, '');
    return safeVal(value, $target);
  });
};

const reFormatCardNumber = (e)=> {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = $.payment.formatCardNumber(value);
    return safeVal(value, $target);
  });
};

const formatCardNumber = (e)=> {
  var $target, card, digit, length, re, upperLength, value;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  $target = $(e.currentTarget);
  value = $target.val();
  card = cardFromNumber(value + digit);
  length = (value.replace(/\D/g, '') + digit).length;
  upperLength = 16;
  if (card) {
    upperLength = card.length[card.length.length - 1];
  }
  if (length >= upperLength) {
    return;
  }
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
    return;
  }
  if (card && card.type === 'amex') {
    re = /^(\d{4}|\d{4}\s\d{6})$/;
  } else {
    re = /(?:^|\s)(\d{4})$/;
  }
  if (re.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value + ' ' + digit);
    });
  } else if (re.test(value + digit)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value + digit + ' ');
    });
  }
};

const formatBackCardNumber = (e)=> {
  var $target, value;
  $target = $(e.currentTarget);
  value = $target.val();
  if (e.which !== 8) {
    return;
  }
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
    return;
  }
  if (/\d\s$/.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value.replace(/\d\s$/, ''));
    });
  } else if (/\s\d?$/.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value.replace(/\d$/, ''));
    });
  }
};

const reFormatExpiry = (e) => {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = $.payment.formatExpiry(value);
    return safeVal(value, $target);
  });
};

const formatExpiry = (e)=> {
  var $target, digit, val;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  $target = $(e.currentTarget);
  val = $target.val() + digit;
  if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val('0' + val + ' / ');
    });
  } else if (/^\d\d$/.test(val)) {
    e.preventDefault();
    return setTimeout(function () {
      var m1, m2;
      m1 = parseInt(val[0], 10);
      m2 = parseInt(val[1], 10);
      if (m2 > 2 && m1 !== 0) {
        return $target.val('0' + m1 + ' / ' + m2);
      } else {
        return $target.val('' + val + ' / ');
      }
    });
  }
};

const formatForwardExpiry = (e)=> {
  var $target, digit, val;
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  $target = $(e.currentTarget);
  val = $target.val();
  if (/^\d\d$/.test(val)) {
    return $target.val('' + val + ' / ');
  }
};

const formatForwardSlashAndSpace = (e)=> {
  var $target, val, which;
  which = String.fromCharCode(e.which);
  if (!(which === '/' || which === ' ')) {
    return;
  }
  $target = $(e.currentTarget);
  val = $target.val();
  if (/^\d$/.test(val) && val !== '0') {
    return $target.val('0' + val + ' / ');
  }
};

const formatBackExpiry = (e) => {
  var $target, value;
  $target = $(e.currentTarget);
  value = $target.val();
  if (e.which !== 8) {
    return;
  }
  if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
    return;
  }
  if (/\d\s\/\s$/.test(value)) {
    e.preventDefault();
    return setTimeout(function () {
      return $target.val(value.replace(/\d\s\/\s$/, ''));
    });
  }
};

const reFormatCVC = (e)=> {
  var $target;
  $target = $(e.currentTarget);
  return setTimeout(function () {
    var value;
    value = $target.val();
    value = replaceFullWidthChars(value);
    value = value.replace(/\D/g, '').slice(0, 4);
    return safeVal(value, $target);
  });
};

const restrictNumeric = (e)=> {
  var input;
  if (e.metaKey || e.ctrlKey) {
    return true;
  }
  if (e.which === 32) {
    return false;
  }
  if (e.which === 0) {
    return true;
  }
  if (e.which < 33) {
    return true;
  }
  input = String.fromCharCode(e.which);
  return !!/[\d\s]/.test(input);
};

const restrictCardNumber = (e) => {
  var $target, card, digit, value;
  $target = $(e.currentTarget);
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected($target)) {
    return;
  }
  value = ($target.val() + digit).replace(/\D/g, '');
  card = cardFromNumber(value);
  if (card) {
    return value.length <= card.length[card.length.length - 1];
  } else {
    return value.length <= 16;
  }
};

const restrictExpiry = (e) => {
  var $target, digit, value;
  $target = $(e.currentTarget);
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected($target)) {
    return;
  }
  value = $target.val() + digit;
  value = value.replace(/\D/g, '');
  if (value.length > 6) {
    return false;
  }
};

const restrictCVC = (e)=> {
  var $target, digit, val;
  $target = $(e.currentTarget);
  digit = String.fromCharCode(e.which);
  if (!/^\d+$/.test(digit)) {
    return;
  }
  if (hasTextSelected($target)) {
    return;
  }
  val = $target.val() + digit;
  return val.length <= 4;
};

const setCardType = (e) => {
  var $target, allTypes, card, cardType, val;
  $target = $(e.currentTarget);
  val = $target.val();
  cardType = $.payment.cardType(val) || 'unknown';
  if (!$target.hasClass(cardType)) {
    allTypes = (function () {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cards.length; _i < _len; _i++) {
        card = cards[_i];
        _results.push(card.type);
      }
      return _results;
    })();
    $target.removeClass('unknown');
    $target.removeClass(allTypes.join(' '));
    $target.addClass(cardType);
    $target.toggleClass('identified', cardType !== 'unknown');
    return $target.trigger('payment.cardType', cardType);
  }
};
