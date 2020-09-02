// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media NS', {
	refresh: function(frm) {
		if (frm.doc.media_barcode == undefined && frm.is_new()==undefined) {
			frm.set_value('media_barcode', frm.doc.name)
			frm.save()	
			frm.print_preview.printit(false);
		}

	}
});
