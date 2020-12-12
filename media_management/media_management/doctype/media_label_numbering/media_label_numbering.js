// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media Label Numbering', {
	onload: function(frm) {
		frm.disable_save();
	},
	prefix: function(frm) {
		frappe.call({
			method: "get_current",
			doc: frm.doc,
			callback: function(r) {
				frm.refresh_field("current_value");
			}
		});
	},
});
