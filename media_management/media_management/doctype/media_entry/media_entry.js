// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt
frappe.ui.form.on('Media Entry', {
	setup: function (frm) {
		frm.set_query('project', () => {
			return {
				filters: {
					customer: frm.doc.customer
				}
			}
		})
	},
	project: function (frm) {
		if (frm.doc.project && !frm.doc.customer) {
			frappe.db.get_value('Project', frm.doc.project, 'customer')
			.then(r => {
				let customer=r.message.customer
				frm.set_value('customer', customer)
			})			
		}
	},
	print_barcodes: function (frm) {
		let selected = frm.get_selected()
		let data_devices = selected['data_devices']
		let film_items = selected['film_items']
		let tape_items = selected['tape_items']
		let selected_items = {};
		let count=0;
		for (const film in film_items) {
			for (const i in frm.doc.film_items) {
				let row = frm.doc.film_items[i]
				if (row.name==film_items[film]) {
				selected_items[count] = row.media_id
				count=count+1;
				}
			}
		}
		for (const tape in tape_items) {
			for (const i in frm.doc.tape_items) {
				let row = frm.doc.tape_items[i]
				if (row.name==tape_items[tape]) {
				selected_items[count] = row.media_id
				count=count+1;
				}
			}
		}		
		for (const device in data_devices) {
			for (const i in frm.doc.data_devices) {
				let row = frm.doc.data_devices[i]
				if (row.name==data_devices[device]) {
				selected_items[count] = row.media_id;
				count=count+1;
				}
			}
		}
		frappe.call({
			method: 'media_management.api.get_label_pdf',
			args: {
				'selected_items': selected_items,
			},
			async:false,
			callback: (r) => {
				console.log(r)
				printJS(r.message)
			},
			error: (r) => {
				// on error
			}
		})
	},
	create_and_print_barcode: function (frm) {
		
		frm.set_df_property('no_of_films', 'read_only', 1)
		frm.set_df_property('no_of_tapes', 'read_only', 1)
		frm.set_df_property('no_of_data_device', 'read_only', 1)
		frm.save()

		setTimeout(function(){ 
			frm.call({
				doc: frm.doc,
				method: 'create_and_print_barcode',
				freeze: true,
				callback: function (r) {
					console.log(r)
					if (r.message) {
						frm.refresh()
						frm.dirty()
						// frm.save()
						let selected_items = {};
						console.log('selected_items',selected_items)
						let count=0;
						for (const i in frm.doc.film_items) {
							let row = frm.doc.film_items[i]
							selected_items[count] = row.media_id
							count=count+1;
						}	
						for (const i in frm.doc.tape_items) {
							let row = frm.doc.tape_items[i]
							selected_items[count] = row.media_id
							count=count+1;
						}	
						for (const i in frm.doc.data_devices) {
							let row = frm.doc.data_devices[i]
							selected_items[count] = row.media_id;
							count=count+1;
						}	
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
				}
			})			
		
		}, 700);

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