// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media Entry', {
	print_barcodes: function (frm) {
		let selected = frm.get_selected()
		console.log(selected)		
	},
	create_and_print_barcode: function (frm) {
		frm.set_df_property('no_of_films', 'read_only', 1)
		frm.set_df_property('no_of_tapes', 'read_only', 1)
		frm.set_df_property('no_of_data_device', 'read_only', 1)
		frm.call({
			doc: frm.doc,
			method: 'create_and_print_barcode',
			callback: function (r) {
				if (!r.message) {}
			}
		})
	}
});

frappe.ui.form.on('Media Entry Item', {
	film_items_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.insert({
			doctype: 'Media NS',
			media_type: 'Film',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("film_items")
			frm.set_value('no_of_films', frm.doc.no_of_films + 1)
		})
	},
	before_film_items_remove(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.delete_doc('Media NS', row.media_id)
		frm.set_value('no_of_films', frm.doc.no_of_films - 1)
		// frm.refresh_field("film_items")
		// frappe.call({
		//     method: "media_management.media_management.doctype.media_entry.media_entry.delete_Media_NS",
		//     args: {
		//         "media_id": row.media_id
		//     },
		//     // freeze: true,
		//     callback: function (r) {
		// 		if (r.message) {
		// 			// frm.set_value('no_of_films', frm.doc.no_of_films-1)
		// 		}
		// 	}
		// });		
	},
	tape_items_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.insert({
			doctype: 'Media NS',
			media_type: 'Tape',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("tape_items")
			frm.set_value('no_of_tapes', frm.doc.no_of_tapes + 1)
		})
	},
	before_tape_items_remove(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.delete_doc('Media NS', row.media_id)
		frm.set_value('no_of_tapes', frm.doc.no_of_tapes - 1)
	}
});

frappe.ui.form.on('Data Device Entry Item', {
	data_devices_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.insert({
			doctype: 'Media NS',
			media_type: 'Data Device',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("data_devices")
			frm.set_value('no_of_data_device', frm.doc.no_of_data_device + 1)
		})
	},
	before_data_devices_remove(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		frappe.db.delete_doc('Media NS', row.media_id)
		frm.set_value('no_of_data_device', frm.doc.no_of_data_device - 1)
	}
});