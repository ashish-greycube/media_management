// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt
frappe.ui.form.on('Media Entry', {
	onload: function (frm) {
		if (frm.doc.no_of_films!=0 || frm.doc.no_of_tapes!=0 || frm.doc.no_of_data_device!=0) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_data_device', 'read_only', 1)		
		}
	},
	setup: function (frm) {
		frm.set_query('project', () => {
			return {
				filters: {
					customer: frm.doc.customer
				}
			}
		})
		frm.set_query('media_id', 'film_items', () => {
			return {
				filters: {
					media_type: 'Film'
				}
			}
		})	
		frm.set_query('media_id', 'tape_items', () => {
			return {
				filters: {
					media_type: 'Tape'
				}
			}
		})
		frm.set_query('media_id', 'data_devices', () => {
			return {
				filters: {
					media_type: 'Data Device'
				}
			}
		})					
	},
	refresh: function (frm) {
		frm.toggle_display(['print_barcodes'], !(frm.is_new() === 1));
	},
	customer: function (frm) {
		if (frm.doc.customer && frm.doc.project) {
			frappe.db.get_list('Project', {
				fields: ['name'],
				filters: {
					customer: frm.doc.customer
				}
			}).then(records => {
				let found=false
				records.forEach(element => {
					if (frm.doc.project ==element.name) {
						found = true
					}
				});
				if (found==false){
					frm.set_value('project', '')
				}

			})
			
			
		}
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
	
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()	
		let data_devices = frm.fields_dict.data_devices.grid.get_selected_children()
		if (cur_frm.is_dirty()===1) {
			frm.save().then(value=> {print_selected_barcode(frm,film_items,tape_items,data_devices)},reason=>{console.log(reason,'it failed')});
		}else{
			print_selected_barcode(frm,film_items,tape_items,data_devices)
		}

	},
	create_and_print_barcode: function (frm) {
		if (cur_frm.is_dirty()===1) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_data_device', 'read_only', 1)
			frm.save().then(value=> {create_and_print_all_barcodes(frm)},reason=>{console.log(reason,'it failed create_and_print_barcode')});
		}else{
			create_and_print_all_barcodes(frm)
		}

	}
});

frappe.ui.form.on('Film Entry Item', {
	film_items_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		if (frm.doc.is_new_media===1) {
			frappe.db.insert({
				doctype: 'Media NS',
				media_type: 'Film',
				customer: frm.doc.customer,
				project: frm.doc.project
			}).then(doc => {
				row.media_id = doc.name
				frm.refresh_field("film_items")
				frm.set_value('no_of_films', frm.doc.no_of_films + 1)
				frm.save()
			})			
		}

	},
	before_film_items_remove(frm, cdt, cdn) {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		set_film_items_to_remove(film_items)
	},
	film_items_remove(frm, cdt, cdn) {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		if (film_items.length===0) {
			if (frm.is_dirty()===1) {
				frm.save().then(value=> {delete_selected_items_film(frm,get_film_items_to_remove())},reason=>{console.log(reason,'it failed')});
			}else{
				delete_selected_items_film(frm,get_film_items_to_remove())
			}		
		}

	}	
});

frappe.ui.form.on('Tape Entry Item', {
	tape_items_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		if (frm.doc.is_new_media===1) {		
		frappe.db.insert({
			doctype: 'Media NS',
			media_type: 'Tape',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("tape_items")
			frm.set_value('no_of_tapes', frm.doc.no_of_tapes + 1)
			frm.save()
		})}
	},
	before_tape_items_remove(frm, cdt, cdn) {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		set_tape_items_to_remove(tape_items)
	},
	tape_items_remove(frm, cdt, cdn) {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		if (tape_items.length===0) {
			if (frm.is_dirty()===1) {
				frm.save().then(value=> {delete_selected_items_tape(frm,get_tape_items_to_remove())},reason=>{console.log(reason,'it failed')});
			}else{
				delete_selected_items_tape(frm,get_tape_items_to_remove())
			}		
		}

	}	
});

frappe.ui.form.on('Data Device Entry Item', {
	data_devices_add(frm, cdt, cdn) {
		let row = locals[cdt][cdn];
		if (frm.doc.is_new_media===1) {
		frappe.db.insert({
			doctype: 'Media NS',
			media_type: 'Data Device',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("data_devices")
			frm.set_value('no_of_data_device', frm.doc.no_of_data_device + 1)
			frm.save()
		})
	}
	},
	before_data_devices_remove(frm, cdt, cdn) {
		let data_devices_items = frm.fields_dict.data_devices.grid.get_selected_children()
		set_data_device_items_to_remove(data_devices_items)
	},
	data_devices_remove(frm, cdt, cdn) {
		let data_devices_items = frm.fields_dict.data_devices.grid.get_selected_children()
		if (data_devices_items.length===0) {
			if (frm.is_dirty()===1) {
				frm.save().then(value=> {delete_selected_items_data_devices(frm,get_data_device_items_to_remove())},reason=>{console.log(reason,'it failed')});
			}else{
				delete_selected_items_data_devices(frm,get_data_device_items_to_remove())
			}		
		}

	}
});

function create_and_print_all_barcodes(frm){
	frm.call({
		doc: frm.doc,
		method: 'create_and_print_barcode',
		freeze: true,
		callback: function (r) {
			console.log(r)
			if (r.message) {
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
				if (Object.keys(selected_items).length === 0 && selected_items.constructor === Object) {
					frappe.msgprint({
						title: __('Error'),
						indicator: 'red',
						message: __('No media is found. Barcode cannot be printed')
					});
				}
				else{	
				  frappe.call({
					method: 'media_management.api.get_label_pdf',
					args: {
						'selected_items': selected_items,
					},
					async:false,
					freeze: true,
					callback: (r) => {
						printJS(r.message)
						frm.save();
					},
					error: (r) => {
						console.log(r)
						// on error
					}
				})
			}
			}
		}
	})	
}

function print_selected_barcode(frm,film_items,tape_items,data_devices){
	let selected_items = {};
	let count=0;
	for (const film in film_items) {
		selected_items[count] = film_items[film].media_id
		count=count+1;
	}
	for (const tape in tape_items) {
		selected_items[count] = tape_items[tape].media_id
		count=count+1;
	}	
	for (const device in data_devices) {
		selected_items[count] = data_devices[device].media_id
		count=count+1;
	}
	if (Object.keys(selected_items).length === 0 && selected_items.constructor === Object) {
		frappe.msgprint({
			title: __('Error'),
			indicator: 'red',
			message: __('No media is selected. Barcode cannot be printed')
		});
	}
	else{
	frappe.call({
		method: 'media_management.api.get_label_pdf',
		args: {
			'selected_items': selected_items,
		},
		async:false,
		freeze: true,
		callback: (r) => {
			printJS(r.message)
		},
		error: (r) => {
			console.log(r,'error')
			// on error
		}
	})
}
}

var film_items_to_remove = 0;
function set_film_items_to_remove(film_items) {
	if (film_items_to_remove === 0) {
		film_items_to_remove = film_items
	}
}
function get_film_items_to_remove() {
	return film_items_to_remove;
}

var tape_items_to_remove = 0;
function set_tape_items_to_remove(tape_items) {
	if (tape_items_to_remove === 0) {
		tape_items_to_remove = tape_items
	}
}
function get_tape_items_to_remove() {
	return tape_items_to_remove;
}

var data_device_items_to_remove = 0;
function set_data_device_items_to_remove(data_device_items) {
	if (data_device_items_to_remove === 0) {
		data_device_items_to_remove = data_device_items
	}
}
function get_data_device_items_to_remove() {
	return data_device_items_to_remove;
}

function delete_selected_items_film(frm, selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		frappe.db.delete_doc('Media NS', row.media_id)
		
	}
	frm.set_value('no_of_films', frm.doc.no_of_films - selected_items.length)
	film_items_to_remove = 0;
	frm.save();
}

function delete_selected_items_tape(frm,selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		frappe.db.delete_doc('Media NS', row.media_id)
		
	}
	frm.set_value('no_of_tapes', frm.doc.no_of_tapes - selected_items.length)
	tape_items_to_remove = 0;
	frm.save();
}

function delete_selected_items_data_devices(frm,selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		frappe.db.delete_doc('Media NS', row.media_id)
		
	}
	frm.set_value('no_of_data_device', frm.doc.no_of_data_device - selected_items.length)
	data_device_items_to_remove = 0;
	frm.save();
}