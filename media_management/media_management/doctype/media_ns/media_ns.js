// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media NS', {
	refresh: function(frm) {
		if (frm.doc.media_barcode == undefined && frm.is_new()==undefined) {
			frm.set_value('media_barcode', frm.doc.name)
			frm.save()	
		}

		if (!frm.is_new()) {
			frm.add_custom_button('Print', () => 
			{
			console.log('Clicked custom button')
			let selected_items = {};
			selected_items[0] = frm.doc.name
			frappe.call({
				method: 'media_management.api.get_label_pdf',
				args: {
					'selected_items': selected_items,
				},
				async:false,
				callback: (r) => {
					printJS(r.message)
				},
				error: (r) => {
					console.log(r)
					// on error
				}
			})			
		}
			)
		}		

	}
});
