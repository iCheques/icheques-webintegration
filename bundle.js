(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('bipbop-webservice'), require('bipbop-websocket')) :
	typeof define === 'function' && define.amd ? define(['bipbop-webservice', 'bipbop-websocket'], factory) :
	(global.ICheques = factory(global.BipbopWebService,global.BipbopWebSocket));
}(this, (function (BIPBOP,WebSocket) { 'use strict';

	BIPBOP = BIPBOP && BIPBOP.hasOwnProperty('default') ? BIPBOP['default'] : BIPBOP;
	WebSocket = WebSocket && WebSocket.hasOwnProperty('default') ? WebSocket['default'] : WebSocket;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var humanInterval_1 = createCommonjsModule(function (module) {
	var humanInterval = module.exports = function humanInterval (time) {
	  if (!time) { return time }
	  if (typeof time === 'number') { return time }
	  time = swapLanguageToDecimals(time);
	  time = time.replace(/(second|minute|hour|day|week|month|year)s?(?! ?(s )?and |s?$)/, '$1,');
	  return time.split(/and|,/).reduce(function (sum, group) {
	    return sum + (group !== '' ? processUnits(group) : 0)
	  }, 0)
	};

	humanInterval.languageMap = {
	  'one': 1,
	  'two': 2,
	  'three': 3,
	  'four': 4,
	  'five': 5,
	  'six': 6,
	  'seven': 7,
	  'eight': 8,
	  'nine': 9,
	  'ten': 10
	};

	function swapLanguageToDecimals (time) {
	  var language = humanInterval.languageMap;
	  var languageMapRegex = new RegExp('(' + Object.keys(language).join('|') + ')', 'g');
	  var matches = time.match(languageMapRegex);
	  if (!matches) { return time }

	  matches.forEach(function (match) {
	    var matchStr = language[match] > 1 ? language[match] : language[match].toString().slice(1);
	    time = time.replace(match, matchStr);
	  });
	  return time
	}

	function processUnits (time) {
	  var unit;
	  var num = parseFloat(time, 10);
	  if (time.match(/(second|minute|hour|day|week|month|year)s?/) !== null) { unit = time.match(/(second|minute|hour|day|week|month|year)s?/)[1]; }
	  else { unit = undefined; }
	  if (!num) { num = 1; }

	  switch (unit) {
	    case 'second': unit = 1000;
	      break
	    case 'minute': unit = 1000 * 60;
	      break
	    case 'hour': unit = 1000 * 60 * 60;
	      break
	    case 'day': unit = 1000 * 60 * 60 * 24;
	      break
	    case 'week': unit = 1000 * 60 * 60 * 24 * 7;
	      break
	    case 'month': unit = 1000 * 60 * 60 * 24 * 30;
	      break
	    case 'year': unit = 1000 * 60 * 60 * 24 * 365;
	      break
	  }
	  return unit * num
	}
	});

	var bundle = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  module.exports = factory();
	}(commonjsGlobal, (function () {
	  var mod11 = {
	    isValid: isValid,
	    create: create,
	    apply: apply
	  };

	  function isValid(input) {
	    var checkDigitIndex = input.length - 1;
	    return input.substr(checkDigitIndex) === create(input.substr(0, checkDigitIndex));
	  }

	  function apply(input) {
	    return input + create(input);
	  }

	  function create(input) {
	    var sum = 0;
	    input.split('').reverse().forEach(function (value, index) {
	      sum += parseInt(value, 10) * (index % 6 + 2);
	    });
	    var sumMod11 = sum % 11;
	    if (sumMod11 === 0) {
	      return '0';
	    } else if (sumMod11 === 1) {
	      return '-';
	    } else {
	      return (11 - sumMod11) + '';
	    }
	  }

	  var mod10 = {
	    isValid: isValid$1,
	    create: create$1,
	    apply: apply$1
	  };

	  function isValid$1(input) {
	    var checkDigitIndex = input.length - 1;
	    return input.substr(checkDigitIndex) === create$1(input.substr(0, checkDigitIndex));
	  }

	  function apply$1(input) {
	    return input + create$1(input);
	  }

	  function create$1(input) {
	    var sum = 0;
	    input.split('').reverse().forEach(function (value, index) {
	      var weight = (index + 1) % 2 + 1;
	      sum += digitSum(parseInt(value, 10) * weight);
	    });
	    var sumMod10 = sum % 10;
	    if (sumMod10 === 0) {
	      return '0';
	    } else {
	      return (10 - sumMod10) + '';
	    }
	  }

	  function digitSum(number) {
	    var sum = number > 9 ? 1 : 0;
	    return sum + number % 10;
	  }

	  var mod11$1 = mod11;
	  var mod10$1 = mod10;

	  var checkdigit = {
	  	mod11: mod11$1,
	  	mod10: mod10$1
	  };

	  var CMC7_GROUPS = /(\d{7})(\d{1})(\d{10})(\d{1})(\d{10})(\d{1})/;
	  var NON_NUMBERS = /[^\d]/g;

	  var CMC7Validator = function CMC7Validator(code) {
	    var execution = CMC7_GROUPS.exec(code.replace(NON_NUMBERS, ''));
	    if (!execution) {
	      return;
	    }
	    this.dv1 = execution[4];
	    this.dv2 = execution[2];
	    this.dv3 = execution[6];
	    this.group1 = execution[1];
	    this.group2 = execution[3];
	    this.group3 = execution[5];
	  };

	  CMC7Validator.prototype.isValid = function isValid () {
	    if (!this.dv1) {
	      return false;
	    }

	    var dv1 = checkdigit.mod10.create(this.group1);
	    var dv2 = checkdigit.mod10.create(this.group2);
	    var dv3 = checkdigit.mod10.create(this.group3);

	    return this.dv1 === dv1 && this.dv2 === dv2 && this.dv3 === dv3;
	  };

	  return CMC7Validator;

	})));
	});

	var cpf = createCommonjsModule(function (module, exports) {
	(function(commonjs){
	  // Blacklist common values.
	  var BLACKLIST = [
	    "00000000000",
	    "11111111111",
	    "22222222222",
	    "33333333333",
	    "44444444444",
	    "55555555555",
	    "66666666666",
	    "77777777777",
	    "88888888888",
	    "99999999999",
	    "12345678909"
	  ];

	  var STRICT_STRIP_REGEX = /[.-]/g;
	  var LOOSE_STRIP_REGEX = /[^\d]/g;

	  var verifierDigit = function(numbers) {
	    numbers = numbers
	      .split("")
	      .map(function(number){ return parseInt(number, 10); })
	    ;

	    var modulus = numbers.length + 1;

	    var multiplied = numbers.map(function(number, index) {
	      return number * (modulus - index);
	    });

	    var mod = multiplied.reduce(function(buffer, number){
	      return buffer + number;
	    }) % 11;

	    return (mod < 2 ? 0 : 11 - mod);
	  };

	  var CPF = {};

	  CPF.format = function(number) {
	    return this.strip(number).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
	  };

	  CPF.strip = function(number, strict) {
	    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
	    return (number || "").toString().replace(regex, "");
	  };

	  CPF.isValid = function(number, strict) {
	    var stripped = this.strip(number, strict);

	    // CPF must be defined
	    if (!stripped) { return false; }

	    // CPF must have 11 chars
	    if (stripped.length !== 11) { return false; }

	    // CPF can't be blacklisted
	    if (BLACKLIST.indexOf(stripped) >= 0) { return false; }

	    var numbers = stripped.substr(0, 9);
	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return numbers.substr(-2) === stripped.substr(-2);
	  };

	  CPF.generate = function(formatted) {
	    var numbers = "";

	    for (var i = 0; i < 9; i++) {
	      numbers += Math.floor(Math.random() * 9);
	    }

	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return (formatted ? this.format(numbers) : numbers);
	  };

	  if (commonjs) {
	    module.exports = CPF;
	  } else {
	    window.CPF = CPF;
	  }
	})('object' !== "undefined");
	});

	var cpf$1 = /*#__PURE__*/Object.freeze({
		default: cpf,
		__moduleExports: cpf
	});

	var cnpj = createCommonjsModule(function (module, exports) {
	(function(commonjs){
	  // Blacklist common values.
	  var BLACKLIST = [
	    "00000000000000",
	    "11111111111111",
	    "22222222222222",
	    "33333333333333",
	    "44444444444444",
	    "55555555555555",
	    "66666666666666",
	    "77777777777777",
	    "88888888888888",
	    "99999999999999"
	  ];

	  var STRICT_STRIP_REGEX = /[-\/.]/g;
	  var LOOSE_STRIP_REGEX = /[^\d]/g;

	  var verifierDigit = function(numbers) {
	    var index = 2;
	    var reverse = numbers.split("").reduce(function(buffer, number) {
	      return [parseInt(number, 10)].concat(buffer);
	    }, []);

	    var sum = reverse.reduce(function(buffer, number) {
	      buffer += number * index;
	      index = (index === 9 ? 2 : index + 1);
	      return buffer;
	    }, 0);

	    var mod = sum % 11;
	    return (mod < 2 ? 0 : 11 - mod);
	  };

	  var CNPJ = {};

	  CNPJ.format = function(number) {
	    return this.strip(number).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
	  };

	  CNPJ.strip = function(number, strict) {
	    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
	    return (number || "").toString().replace(regex, "");
	  };

	  CNPJ.isValid = function(number, strict) {
	    var stripped = this.strip(number, strict);

	    // CNPJ must be defined
	    if (!stripped) { return false; }

	    // CNPJ must have 14 chars
	    if (stripped.length !== 14) { return false; }

	    // CNPJ can't be blacklisted
	    if (BLACKLIST.indexOf(stripped) >= 0) { return false; }

	    var numbers = stripped.substr(0, 12);
	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return numbers.substr(-2) === stripped.substr(-2);
	  };

	  CNPJ.generate = function(formatted) {
	    var numbers = "";

	    for (var i = 0; i < 12; i++) {
	      numbers += Math.floor(Math.random() * 9);
	    }

	    numbers += verifierDigit(numbers);
	    numbers += verifierDigit(numbers);

	    return (formatted ? this.format(numbers) : numbers);
	  };

	  if (commonjs) {
	    module.exports = CNPJ;
	  } else {
	    window.CNPJ = CNPJ;
	  }
	})('object' !== "undefined");
	});

	var cnpj$1 = /*#__PURE__*/Object.freeze({
		default: cnpj,
		__moduleExports: cnpj
	});

	var require$$0 = ( cpf$1 && cpf ) || cpf$1;

	var require$$1 = ( cnpj$1 && cnpj ) || cnpj$1;

	var cpf_cnpj = {
	  CPF: require$$0,
	  CNPJ: require$$1
	};
	var cpf_cnpj_1 = cpf_cnpj.CPF;
	var cpf_cnpj_2 = cpf_cnpj.CNPJ;

	var isImplemented = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") { return false; }
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
	};

	var isImplemented$1 = /*#__PURE__*/Object.freeze({
		default: isImplemented,
		__moduleExports: isImplemented
	});

	var isImplemented$2 = function () {
		try {
			return true;
		} catch (e) {
	 return false;
	}
	};

	var isImplemented$3 = /*#__PURE__*/Object.freeze({
		default: isImplemented$2,
		__moduleExports: isImplemented$2
	});

	// eslint-disable-next-line no-empty-function
	var noop = function () {};

	var noop$1 = /*#__PURE__*/Object.freeze({
		default: noop,
		__moduleExports: noop
	});

	var require$$0$1 = ( noop$1 && noop ) || noop$1;

	var _undefined = require$$0$1(); // Support ES3 engines

	var isValue = function (val) {
	 return (val !== _undefined) && (val !== null);
	};

	var isValue$1 = /*#__PURE__*/Object.freeze({
		default: isValue,
		__moduleExports: isValue
	});

	var isValue$2 = ( isValue$1 && isValue ) || isValue$1;

	var keys = Object.keys;

	var shim = function (object) {
		return keys(isValue$2(object) ? Object(object) : object);
	};

	var shim$1 = /*#__PURE__*/Object.freeze({
		default: shim,
		__moduleExports: shim
	});

	var require$$0$2 = ( isImplemented$3 && isImplemented$2 ) || isImplemented$3;

	var require$$1$1 = ( shim$1 && shim ) || shim$1;

	var keys$1 = require$$0$2()
		? Object.keys
		: require$$1$1;

	var keys$2 = /*#__PURE__*/Object.freeze({
		default: keys$1,
		__moduleExports: keys$1
	});

	var validValue = function (value) {
		if (!isValue$2(value)) { throw new TypeError("Cannot use null or undefined"); }
		return value;
	};

	var validValue$1 = /*#__PURE__*/Object.freeze({
		default: validValue,
		__moduleExports: validValue
	});

	var keys$3 = ( keys$2 && keys$1 ) || keys$2;

	var value = ( validValue$1 && validValue ) || validValue$1;

	var max   = Math.max;

	var shim$2 = function (dest, src /*, …srcn*/) {
		var arguments$1 = arguments;

		var error, i, length = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) { error = e; }
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments$1[i];
			keys$3(src).forEach(assign);
		}
		if (error !== undefined) { throw error; }
		return dest;
	};

	var shim$3 = /*#__PURE__*/Object.freeze({
		default: shim$2,
		__moduleExports: shim$2
	});

	var require$$0$3 = ( isImplemented$1 && isImplemented ) || isImplemented$1;

	var require$$1$2 = ( shim$3 && shim$2 ) || shim$3;

	var assign = require$$0$3()
		? Object.assign
		: require$$1$2;

	var assign$1 = /*#__PURE__*/Object.freeze({
		default: assign,
		__moduleExports: assign
	});

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) { obj[key] = src[key]; }
	};

	// eslint-disable-next-line no-unused-vars
	var normalizeOptions = function (opts1 /*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (!isValue$2(options)) { return; }
			process(Object(options), result);
		});
		return result;
	};

	var normalizeOptions$1 = /*#__PURE__*/Object.freeze({
		default: normalizeOptions,
		__moduleExports: normalizeOptions
	});

	// Deprecated

	var isCallable = function (obj) {
	 return typeof obj === "function";
	};

	var isCallable$1 = /*#__PURE__*/Object.freeze({
		default: isCallable,
		__moduleExports: isCallable
	});

	var str = "razdwatrzy";

	var isImplemented$4 = function () {
		if (typeof str.contains !== "function") { return false; }
		return (str.contains("dwa") === true) && (str.contains("foo") === false);
	};

	var isImplemented$5 = /*#__PURE__*/Object.freeze({
		default: isImplemented$4,
		__moduleExports: isImplemented$4
	});

	var indexOf = String.prototype.indexOf;

	var shim$4 = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};

	var shim$5 = /*#__PURE__*/Object.freeze({
		default: shim$4,
		__moduleExports: shim$4
	});

	var require$$0$4 = ( isImplemented$5 && isImplemented$4 ) || isImplemented$5;

	var require$$1$3 = ( shim$5 && shim$4 ) || shim$5;

	var contains = require$$0$4()
		? String.prototype.contains
		: require$$1$3;

	var contains$1 = /*#__PURE__*/Object.freeze({
		default: contains,
		__moduleExports: contains
	});

	var assign$2 = ( assign$1 && assign ) || assign$1;

	var normalizeOpts = ( normalizeOptions$1 && normalizeOptions ) || normalizeOptions$1;

	var isCallable$2 = ( isCallable$1 && isCallable ) || isCallable$1;

	var contains$2 = ( contains$1 && contains ) || contains$1;

	var d_1 = createCommonjsModule(function (module) {

	var d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains$2.call(dscr, 'c');
			e = contains$2.call(dscr, 'e');
			w = contains$2.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign$2(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable$2(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable$2(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains$2.call(dscr, 'c');
			e = contains$2.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign$2(normalizeOpts(options), desc);
	};
	});

	var d = /*#__PURE__*/Object.freeze({
		default: d_1,
		__moduleExports: d_1
	});

	var validCallable = function (fn) {
		if (typeof fn !== "function") { throw new TypeError(fn + " is not a function"); }
		return fn;
	};

	var validCallable$1 = /*#__PURE__*/Object.freeze({
		default: validCallable,
		__moduleExports: validCallable
	});

	var d$1 = ( d && d_1 ) || d;

	var callable = ( validCallable$1 && validCallable ) || validCallable$1;

	var eventEmitter = createCommonjsModule(function (module, exports) {

	var apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) { data[type] = listener; }
		else if (typeof data[type] === 'object') { data[type].push(listener); }
		else { data[type] = [data[type], listener]; }

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) { return this; }
		data = this.__ee__;
		if (!data[type]) { return this; }
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) { data[type] = listeners[i ? 0 : 1]; }
					else { listeners.splice(i, 1); }
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var arguments$1 = arguments;
		var this$1 = this;

		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) { return; }
		listeners = this.__ee__[type];
		if (!listeners) { return; }

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) { args[i - 1] = arguments$1[i]; }

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this$1, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments$1[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d$1(on),
		once: d$1(once),
		off: d$1(off),
		emit: d$1(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;
	});
	var eventEmitter_1 = eventEmitter.methods;

	function checkContent(objectResponse) {
	  return new Promise(function (accept, reject) {
	    var errorMessage = BIPBOP.get(objectResponse, 'BPQL.header.exception');
	    if (errorMessage) {
	      return reject(new Error(errorMessage));
	    }
	    return accept(BIPBOP.get(objectResponse, 'BPQL.body'));
	  });
	}

	var ICheques = function ICheques(apiKey) {
	  var this$1 = this;

	  this.apiKey = apiKey;
	  this.ws = new BIPBOP.WebService(apiKey);
	  this.ee = eventEmitter();
	  this.socket = new WebSocket(apiKey, function (e) { return this$1.ee.emit('message', e); });
	};

	ICheques.prototype.protestos = function protestos (documento) { /* CCF + CARTÓRIO */
	  return this.ws.request("SELECT FROM 'CCBUSCA'.'PROTESTOS'", {
	    documento: documento,
	  })
	    .then(function (response) { return response.text(); })
	    .then(function (textResponse) { return BIPBOP.WebService.parse(textResponse); })
	    .then(function (objectResponse) { return checkContent(objectResponse); });
	};

	ICheques.prototype.pesquisaCadastral = function pesquisaCadastral (documento) { /* TELEFONE + ENDEREÇO */
	  return this.ws.request("SELECT FROM 'FINDER'.'CONSULTA'", {
	    documento: documento,
	  })
	    .then(function (response) { return response.text(); })
	    .then(function (textResponse) { return BIPBOP.WebService.parse(textResponse); })
	    .then(function (objectResponse) { return checkContent(objectResponse); });
	};

	ICheques.prototype.chequeLegal = function chequeLegal (valor, vencimento, userCMC, documento) {
	    var this$1 = this;
	    var obj;

	  var cmc = userCMC.replace(/[^\d]/g, '');
	  if (!new bundle(cmc).isValid()) {
	    throw new Error(("O número de CMC7 " + userCMC + " não é válido, portanto o cheque não pode ser cadastrado."));
	  }

	  if (!cpf_cnpj_1.isValid(documento) && !cpf_cnpj_2.isValid(documento)) {
	    throw new Error(("O documento " + documento + " não é um CPF ou CNPJ válido, portanto o cheque não pode ser cadastrado."));
	  }

	  if (!vencimento || typeof vencimento.getMonth !== 'function') {
	    throw new Error('O vencimento configurado não é uma data válida');
	  }

	  return this.ws.request("SELECT FROM 'ICHEQUES'.'CHECK'", ( obj = {
	    cmc: cmc,
	    ammount: Math.ceil(valor * 100),
	    expire: vencimento.getFullYear() + (("0" + (vencimento.getMonth() + 1))).slice(-2) + (("0" + (vencimento.getDate()))).slice(-2)
	  }, obj[cpf_cnpj_1.isValid(documento) ? 'cpf' : 'cnpj'] = documento, obj ))
	    .then(function (response) { return response.text(); })
	    .then(function (textResponse) { return BIPBOP.WebService.parse(textResponse); })
	    .then(function (objectResponse) { return checkContent(objectResponse); })
	    .then(function (ref) {
	        var check = ref.check;

	        return (check.situation ? check : new Promise(function (resolve, reject) {
	      var timeout;

	      var event = function (ref) {
	          var method = ref.method;
	          var data = ref.data;

	        if (method !== 'ichequeUpdate') { return; }
	        if (!data.situation) { return; }
	        if (cmc !== data.cmc) { return; }
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }

	        resolve(data);
	        this$1.ee.off('message', event);
	      };

	      timeout = setTimeout(function () {
	        this$1.ee.off('message', event);
	        reject(new Error(("Não foi possível pesquisar o cheque " + userCMC + " em 3 minutos, tente novamente mais tarde.")));
	      }, humanInterval_1('3 minutes'));

	      this$1.ee.on('message', event);
	    }));
	    });
	};

	return ICheques;

})));
