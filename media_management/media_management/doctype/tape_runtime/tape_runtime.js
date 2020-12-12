// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tape Runtime', {
	refresh: function(frm) {
		if (isNaN(frm.doc.tape_runtime))
		{
			frappe.throw(__('This is not a number'))
		}
	}
});
