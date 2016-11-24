'use strict';

var StringMask = require('string-mask');
var maskFactory = require('mask-factory');

/**
 * FIXME: all numbers will have 9 digits after 2016.
 * see http://portal.embratel.com.br/embratel/9-digito/
 */
var phoneMask8D = new StringMask('0000-0000'), 			// without area code
	  phoneMask9D = new StringMask('00000-0000'), 			// without area code
		phoneMask0800 = new StringMask('0000-000-0000');

module.exports = maskFactory({
	clearValue: function (rawValue) {
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, 11);
	},
	format: function (cleanValue) {
		var formattedValue;

		if (cleanValue.indexOf('0800') === 0) {
			formattedValue = phoneMask0800.apply(cleanValue);
		} else if (cleanValue.length < 9) {
			formattedValue = phoneMask8D.apply(cleanValue) || '';
		} else if (cleanValue.length < 10) {
			formattedValue = phoneMask9D.apply(cleanValue) || '';
		}

		return formattedValue.trim().replace(/[^0-9]$/, '');
	},
	getModelValue: function (formattedValue, originalModelType) {
		var cleanValue = this.clearValue(formattedValue);
		return originalModelType === 'number' ? parseInt(cleanValue) : cleanValue;
	},
	validations: {
		brPhoneNumber: function (value) {
			var valueLength = value && value.toString().length;

			// 8- 8D without DD
			// 9- 9D without DD
			// 11- 0800
			return valueLength >= 8 && valueLength <= 11;
		}
	}
});
