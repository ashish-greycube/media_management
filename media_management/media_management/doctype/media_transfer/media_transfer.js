// Copyright (c) 2021, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media Transfer', {
	receipt: function (frm) {
		// reverse of return logic
		// refresh
		var df = frappe.meta.get_docfield("Film Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 0;
		var df = frappe.meta.get_docfield("Tape Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 0;
		var df = frappe.meta.get_docfield("Drive Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 0;		
		$(".grid-add-row").removeClass('hidden')
		$(".grid-remove-rows").html('Delete')
		// original
		frm.set_value('naming_series', 'RC-.YY.-.MM.-.#')
		$('h6.form-section-heading.uppercase:contains("Return Details")').text('Receipt Details')
		$('label.control-label:contains("Media Return")').text('Media Receipt')
		// onload
		if (frm.doc.no_of_films != 0 || frm.doc.no_of_tapes != 0 || frm.doc.no_of_drives != 0 || frm.doc.docstatus != 0) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_drives', 'read_only', 1)
			frm.set_df_property('create_all_media', 'hidden', 1)
		}
		// onload_post_render
		$(".grid-add-row").html('Add New')
		if (frm.doc.docstatus == 0) {
			frm.events.check_and_add_blank_for_all_child_table(frm)
		}
		// refresh
		frm.fields_dict["create_all_media"].$wrapper.css('padding-top', "22px")
		if (frm.get_docfield('no_of_films').read_only == 1 || frm.get_docfield('no_of_tapes').read_only == 1 || frm.get_docfield('no_of_drives').read_only == 1) {
			frm.set_df_property('create_all_media', 'hidden', 1)
		}
		if (!frm.is_new()) {
			frm.add_custom_button(
				__('Print Lables'),
				() => frm.events.print_barcodes(frm)
			);
		}
		if (!frm.is_new() && frm.doc.docstatus == 0) {
			frm.add_custom_button(
				__('Save & Submit'),
				() => frm.savesubmit()
			);
		}


	},
	return: function (frm) {
		var df = frappe.meta.get_docfield("Film Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 1;
		var df = frappe.meta.get_docfield("Tape Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 1;
		var df = frappe.meta.get_docfield("Drive Entry Item","media_id", cur_frm.doc.name);
		df.read_only = 1;				
		$('h6.form-section-heading.uppercase:contains("Receipt Details")').text('Return Details')
		frm.set_value('naming_series', 'RT-.YY.-.MM.-.#')
		$('label.control-label:contains("Media Receipt")').text('Media Return')
		// onload
		cur_frm.set_query('customer_address', erpnext.queries.address_query);
		cur_frm.set_query('contact_person', erpnext.queries.contact_query);
		// onload_post_render
		$(".grid-remove-rows").html('Remove')
		// refresh
		$(".grid-add-row").addClass('hidden')
		frm.fields_dict["fetch_all"].$wrapper.css('padding-top', "16px")
		frappe.dynamic_link = {
			doc: cur_frm.doc,
			fieldname: 'customer',
			doctype: 'Customer'
		}
		if (!frm.is_new()) {
			frm.add_custom_button(__("Print Delivery Note"), function () {
				cur_frm.meta._default_print_format = 'Delivery Note'
				frm.print_doc();
			});
		}
	},
	media_transfer_type: function (frm) {
		if (frm.doc.media_transfer_type === 'Receipt') {
			frm.events.receipt(frm)
		} else if (frm.doc.media_transfer_type === 'Return') {
			frm.events.return(frm)
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
		frm.set_query('film_type', 'film_items', () => {
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
		frm.set_query('tape_type', 'tape_items', () => {
			return {
				filters: {
					media_type: 'Tape'
				}
			}
		})
		frm.set_query('media_id', 'drive_items', () => {
			return {
				filters: {
					media_type: 'Drive'
				}
			}
		})
		frm.set_query('drive_type', 'drive_items', () => {
			return {
				filters: {
					media_type: 'Drive'
				}
			}
		})
		const default_company = frappe.defaults.get_default('company');
		if (!frm.doc.company) {
			frm.set_value('company', default_company)

		}
	},
	onload: function (frm) {

		if (frm.doc.media_transfer_type === 'Receipt' &&
			(frm.doc.no_of_films != 0 || frm.doc.no_of_tapes != 0 || frm.doc.no_of_drives != 0 || frm.doc.docstatus != 0)) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_drives', 'read_only', 1)
			frm.set_df_property('create_all_media', 'hidden', 1)
		}
		if (frm.doc.media_transfer_type === 'Return') {
			cur_frm.set_query('customer_address', erpnext.queries.address_query);
			cur_frm.set_query('contact_person', erpnext.queries.contact_query);
		}
	},
	onload_post_render: function (frm) {
		if (frm.doc.media_transfer_type === 'Receipt') {
			$(".grid-add-row").html('Add New')
			if (frm.doc.docstatus == 0) {
				frm.events.check_and_add_blank_for_all_child_table(frm)
			}
		}
		if (frm.doc.media_transfer_type === 'Return') {
			$(".grid-remove-rows").html('Remove')
		}

	},
	refresh: function (frm) {
		frm.events.set_default_print_format()
		if (frm.doc.media_transfer_type === 'Receipt') {
			var df = frappe.meta.get_docfield("Film Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 0;
			var df = frappe.meta.get_docfield("Tape Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 0;
			var df = frappe.meta.get_docfield("Drive Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 0;				
			frm.fields_dict["create_all_media"].$wrapper.css('padding-top', "22px")
			if (frm.get_docfield('no_of_films').read_only == 1 || frm.get_docfield('no_of_tapes').read_only == 1 || frm.get_docfield('no_of_drives').read_only == 1) {
				frm.set_df_property('create_all_media', 'hidden', 1)
			}
			if (!frm.is_new()) {
				frm.add_custom_button(
					__('Print Lables'),
					() => frm.events.print_barcodes(frm)
				);
			}
			if (!frm.is_new() && frm.doc.docstatus == 0) {
				frm.add_custom_button(
					__('Save & Submit'),
					() => frm.savesubmit()
				);
			}
		}
		if (frm.doc.media_transfer_type === 'Return') {
			var df = frappe.meta.get_docfield("Film Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 1;
			var df = frappe.meta.get_docfield("Tape Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 1;
			var df = frappe.meta.get_docfield("Drive Entry Item","media_id", cur_frm.doc.name);
			df.read_only = 1;				
			$(".grid-add-row").addClass('hidden')
			frm.fields_dict["fetch_all"].$wrapper.css('padding-top', "16px")
			frappe.dynamic_link = {
				doc: cur_frm.doc,
				fieldname: 'customer',
				doctype: 'Customer'
			}
			if (!frm.is_new()) {
				frm.add_custom_button(__("Print Delivery Note"), function () {
					frm.print_doc();
				});
			}
		}
	},
	customer:function(frm){
		if (frm.doc.media_transfer_type === 'Receipt') {
			if (frm.doc.customer && frm.doc.project) {
				frappe.db.get_list('Project', {
					fields: ['name'],
					filters: {
						customer: frm.doc.customer
					}
				}).then(records => {
					let found = false
					records.forEach(element => {
						if (frm.doc.project == element.name) {
							found = true
						}
					});
					if (found == false) {
						frm.set_value('project', '')
					}
				})
			}			
		}
		if (frm.doc.media_transfer_type === 'Return') {
		erpnext.utils.get_party_details(frm);
		}
	},	
	customer_address: function(frm) {
		erpnext.utils.get_address_display(cur_frm, 'customer_address', 'address_display');
	},	
	contact_person: function(frm) {
		erpnext.utils.get_contact_details(frm);
	},
	fetch_all: function(frm) {
			frappe.call({
				method: "fetch_all_media",
				doc: frm.doc,
				callback: function (r) {
					if (r.message){
						if (frm.doc.fetch_films == 1 && frm.doc.customer && frm.doc.project) {
							if (r.message[0]!="None") {
								frm.set_value("film_items", r.message[0]);
								refresh_field("film_items");
								$(".grid-add-row").addClass('hidden')
							}else{
								frappe.show_alert({
									message:__('No film media found for mentioned customer & project.'),
									indicator:'red'
								}, 5);
								frm.set_value("film_items", '');
								refresh_field("film_items");	
								$(".grid-add-row").addClass('hidden')				
							}
						}
						if (frm.doc.fetch_tapes == 1 && frm.doc.customer && frm.doc.project) {
							if (r.message[1]!="None") {
								frm.set_value("tape_items", r.message[1]);
								refresh_field("tape_items");
								$(".grid-add-row").addClass('hidden')
							}else{
								frappe.show_alert({
									message:__('No tape media found for mentioned customer & project.'),
									indicator:'red'
								}, 5);
								frm.set_value("tape_items", '');
								refresh_field("tape_items");
								$(".grid-add-row").addClass('hidden')			
							}
						}
						if (frm.doc.fetch_drives == 1 && frm.doc.customer && frm.doc.project) {
							if (r.message[2]!="None") {
								frm.set_value("drive_items", r.message[2]);
								refresh_field("drive_items");
								$(".grid-add-row").addClass('hidden')
							}else{
								frappe.show_alert({
									message:__('No drive media found for mentioned customer & project.'),
									indicator:'red'
								}, 5);
								frm.set_value("drive_items", '');
								refresh_field("drive_items");
								$(".grid-add-row").addClass('hidden')			
							}
						}
					}

				}
			});			
	},
	
	
	check_and_add_blank_for_all_child_table: function(frm){
		frm.events.check_and_add_blank_row(frm, 'film_items', 'Film Entry Item')
		frm.events.check_and_add_blank_row(frm, 'tape_items', 'Tape Entry Item')
		frm.events.check_and_add_blank_row(frm, 'drive_items', 'Drive Entry Item')		
	},
	check_and_add_blank_row: function (frm, child_table = undefined, child_table_name = undefined) {
		// if (cur_frm.is_dirty() === true) {
		// 	frm.save().then(value => {
			console.log('-----------------')
		//case 1: for empty child, add a blank row
		if ((frm.doc[child_table] && frm.doc[child_table].length === 0) || (!frm.doc[child_table])) {
			frappe.model.add_child(frm.doc, child_table_name, child_table);
			frm.refresh_field(child_table)
			console.log('case 1')
			return
		}
		// find no of blank rows (without media_id)
		let child_table_length = frm.doc[child_table].filter(d => (!d.media_id)).length
		console.log('child_table_length', child_table_length)
		//case 2: for child table, having no blank media_id
		if (frm.doc[child_table] && child_table_length == 0) {
			frappe.model.add_child(frm.doc, child_table_name, child_table);
			frm.refresh_field(child_table)
			console.log('case 2')
			return
		}
		//case 3: child table, with  1 or more blank row, delete all rows where idx and length don't match
		if (frm.doc[child_table] && child_table_length > 0) {
			frm.doc[child_table] = frm.doc[child_table].filter(row => (!row.media_id && row.idx != frm.doc[child_table].length))
			console.log('case 3-1')
			return
		}

	// })}
	},
	project: function (frm) {
		if (frm.doc.project && !frm.doc.customer && frm.doc.media_transfer_type === 'Receipt') {
			frappe.db.get_value('Project', frm.doc.project, 'customer')
				.then(r => {
					let customer = r.message.customer
					frm.set_value('customer', customer)
				})
		}
	},	
	print_barcodes: function (frm) {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		let drive_items = frm.fields_dict.drive_items.grid.get_selected_children()
		if (cur_frm.is_dirty() === true) {
			frm.save().then(value => {
				frm.events.check_and_add_blank_for_all_child_table(frm)
				if (film_items.length === 0 && tape_items.length === 0 && drive_items.length === 0) {
					// there is no selection, so print all labels
					print_all_barcodes(frm)
				} else {
					print_selected_barcode(frm, film_items, tape_items, drive_items)
				}
			}, reason => {
				console.log(reason, 'it failed')
			});
		} else {
			if (film_items.length === 0 && tape_items.length === 0 && drive_items.length === 0) {
				// there is no selection, so print all labels
				print_all_barcodes(frm)
			} else {
				print_selected_barcode(frm, film_items, tape_items, drive_items)
			}
		}
	},
	create_all_media: function (frm) {
		if (cur_frm.is_dirty() === true) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_drives', 'read_only', 1)
			frm.save().then(value => {
				create_all_media_function(frm)
			}, reason => {
				console.log(reason, 'it failed create_all_media')
			});
		} else {
			create_all_media_function(frm)
		}

	},
	set_default_print_format: function() {
		if(cur_frm.doc.media_transfer_type=='Return') {
				cur_frm.meta._default_print_format = 'Delivery Note';
				cur_frm.meta.default_print_format = 'Delivery Note';
		}else {
				cur_frm.meta.default_print_format = null;
				cur_frm.meta._default_print_format = null;
		}
	}					
});

frappe.ui.form.on('Film Entry Item', {
	media_id: (frm, cdt, cdn) => {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		if (row.media_id) {
			frm.events.check_and_add_blank_row(frm, 'film_items', 'Film Entry Item')
			frappe.db.get_value('Media', row.media_id, 'is_checkerboard')
			.then(r => {
				row.is_checkerboard=r.message.is_checkerboard
			})			
			
			frm.set_value('no_of_films', frm.doc['film_items'].filter(d => (d.media_id)).length)
		}
	}
	},
	film_items_add(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		console.log(row, 'rows')
		frappe.db.insert({
			doctype: 'Media',
			media_type: 'Film',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("film_items")
			// console.log('added row idx', row.idx)
			frm.set_value('no_of_films', frm.doc['film_items'].filter(d => (d.media_id)).length)
			frm.save().then(() => {
				frm.events.check_and_add_blank_for_all_child_table(frm)
			});
		})
	}
	if (frm.doc.media_transfer_type === 'Return') {
		let row = locals[cdt][cdn];
		frappe.call({
			method: "get_film_media",
			doc: frm.doc,
			callback: function (r) {
				console.log(r)

				if (r.message!="None") {
					frm.set_value("film_items", r.message);
					refresh_field("film_items");
				}else{
					frappe.show_alert({
						message:__('No film media found for mentioned customer & project.'),
						indicator:'red'
					}, 5);
					frm.set_value("film_items", '');
					refresh_field("film_items");					
				}
			}
		});		
	}
	},
	before_film_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		set_film_items_to_remove(film_items)
		}
	},
	film_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		if (film_items.length === 0) {
			if (frm.is_dirty() === true) {
				frm.save().then(value => {
					delete_selected_items_film(frm, get_film_items_to_remove())
				}, reason => {
					console.log(reason, 'it failed')
				});
			} else {
				delete_selected_items_film(frm, get_film_items_to_remove())
			}
		}
	}
	}
});

frappe.ui.form.on('Tape Entry Item', {
	media_id: (frm, cdt, cdn) => {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		if (row.media_id) {
			frm.events.check_and_add_blank_row(frm, 'tape_items', 'Tape Entry Item')
			frm.set_value('no_of_tapes', frm.doc['tape_items'].filter(d => (d.media_id)).length)
		}
	}
	},
	tape_items_add(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		frappe.db.insert({
			doctype: 'Media',
			media_type: 'Tape',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("tape_items")
			// frm.set_value('no_of_tapes', frm.doc.no_of_tapes + 1)
			frm.set_value('no_of_tapes', frm.doc['tape_items'].filter(d => (d.media_id)).length)

			frm.save().then(() => {
				frm.events.check_and_add_blank_for_all_child_table(frm)
			});
		})
	}
	if (frm.doc.media_transfer_type === 'Return') {
		let row = locals[cdt][cdn];
		frappe.call({
			method: "get_tape_media",
			doc: frm.doc,
			callback: function (r) {
				if (r.message!="None") {
					frm.set_value("tape_items", r.message);
					refresh_field("tape_items");
				}else{
					frappe.show_alert({
						message:__('No tape media found for mentioned customer & project.'),
						indicator:'red'
					}, 5);
					frm.set_value("tape_items", '');
					refresh_field("tape_items");					
				}					
			}
		});		
	}
	},
	before_tape_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		set_tape_items_to_remove(tape_items)
		}
	},
	tape_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		if (tape_items.length === 0) {
			if (frm.is_dirty() === true) {
				frm.save().then(value => {
					delete_selected_items_tape(frm, get_tape_items_to_remove())
				}, reason => {
					console.log(reason, 'it failed')
				});
			} else {
				delete_selected_items_tape(frm, get_tape_items_to_remove())
			}
		}
	}
	}
});

frappe.ui.form.on('Drive Entry Item', {
	media_id: (frm, cdt, cdn) => {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		if (row.media_id) {
			frm.events.check_and_add_blank_row(frm, 'drive_items', 'Drive Entry Item')
			frappe.db.get_value('Media', row.media_id, ['has_datacable', 'has_psu','has_box'])
			.then(r => {
				console.log('r',r)
				let values = r.message;
				row.has_datacable=values.has_datacable
				row.has_psu=values.has_psu
				row.has_box=values.has_box
				frm.refresh_field('drive_items')
				// frappe.model.set_value(cdt, cdn, 'has_datacable',values.has_datacable);
			})			
			frm.set_value('no_of_drives', frm.doc['drive_items'].filter(d => (d.media_id)).length)
		}
	}
	},
	drive_items_add(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let row = locals[cdt][cdn];
		frappe.db.insert({
			doctype: 'Media',
			media_type: 'Drive',
			customer: frm.doc.customer,
			project: frm.doc.project
		}).then(doc => {
			row.media_id = doc.name
			frm.refresh_field("drive_items")
			// frm.set_value('no_of_drives', frm.doc.no_of_drives + 1)
			frm.set_value('no_of_drives', frm.doc['drive_items'].filter(d => (d.media_id)).length)

			frm.save().then(() => {
				frm.events.check_and_add_blank_for_all_child_table(frm)
				// frm.events.check_and_add_blank_row(frm, 'drive_items', 'Drive Entry Item')
			});
		})
	}
	if (frm.doc.media_transfer_type === 'Return') {
		let row = locals[cdt][cdn];
		frappe.call({
			method: "get_drive_media",
			doc: frm.doc,
			callback: function (r) {
				if (r.message!="None") {
					frm.set_value("drive_items", r.message);
					refresh_field("drive_items");
				}else{
					frappe.show_alert({
						message:__('No drive media found for mentioned customer & project.'),
						indicator:'red'
					}, 5);
					frm.set_value("drive_items", '');
					refresh_field("drive_items");					
				}				
			}
		});
	}		
	
	},
	before_drive_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let drive_items_items = frm.fields_dict.drive_items.grid.get_selected_children()
		set_data_device_items_to_remove(drive_items_items)
		}
	},
	drive_items_remove(frm, cdt, cdn) {
		if (frm.doc.media_transfer_type === 'Receipt') {
		let drive_items_items = frm.fields_dict.drive_items.grid.get_selected_children()
		console.log('drive_items_items',drive_items_items)
		if (drive_items_items.length === 0) {
			if (frm.is_dirty() === true) {
				frm.save().then(value => {
					delete_selected_items_drives(frm, get_drive_items_to_remove())
				}, reason => {
					console.log(reason, 'it failed')
				});
			} else {
				delete_selected_items_drives(frm, get_drive_items_to_remove())
			}
		}
	}
	}
});


function print_all_barcodes(frm) {
	let selected_items = {};
	let count = 0;
	for (const i in frm.doc.film_items) {
		let row = frm.doc.film_items[i]
		selected_items[count] = row.media_id
		count = count + 1;
	}
	for (const i in frm.doc.tape_items) {
		let row = frm.doc.tape_items[i]
		selected_items[count] = row.media_id
		count = count + 1;
	}
	for (const i in frm.doc.drive_items) {
		let row = frm.doc.drive_items[i]
		selected_items[count] = row.media_id;
		count = count + 1;
	}
	if (Object.keys(selected_items).length === 0 && selected_items.constructor === Object) {
		frappe.msgprint({
			title: __('Error'),
			indicator: 'red',
			message: __('No media is found. Label cannot be printed')
		});
	} else {
		frappe.call({
			method: 'media_management.api.get_label_pdf',
			args: {
				'selected_items': selected_items,
			},
			async: false,
			freeze: true,
			callback: (r) => {
				printJS(r.message)
				// frm.save()
			},
			error: (r) => {
				console.log(r)
				// on error
			}
		})
	}
}



function create_all_media_function(frm) {
	frm.call({
		doc: frm.doc,
		method: 'create_all_media',
		freeze: true,
		callback: function (r) {
			if (r.message) {
			if(frm.is_dirty()==true){
				frm.save().then(() => {
					frm.events.check_and_add_blank_for_all_child_table(frm)
				});					
			}
			else{
				frm.events.check_and_add_blank_for_all_child_table(frm)
			}		
			}
		}
	})
}

function print_selected_barcode(frm, film_items, tape_items, drive_items) {
	let selected_items = {};
	let count = 0;
	for (const film in film_items) {
		if (film_items[film].media_id) {
			selected_items[count] = film_items[film].media_id
			count = count + 1;
		}
	}
	for (const tape in tape_items) {
		if (tape_items[tape].media_id) {
			selected_items[count] = tape_items[tape].media_id
			count = count + 1;
		}
	}
	for (const device in drive_items) {
		if (drive_items[device].media_id) {
			selected_items[count] = drive_items[device].media_id
			count = count + 1;
		}
	}
	if (Object.keys(selected_items).length === 0 && selected_items.constructor === Object) {
		frappe.msgprint({
			title: __('Error'),
			indicator: 'red',
			message: __('No media is selected. Barcode cannot be printed')
		});
	} else {
		frappe.call({
			method: 'media_management.api.get_label_pdf',
			args: {
				'selected_items': selected_items,
			},
			async: false,
			freeze: true,
			callback: (r) => {
				printJS(r.message)
			},
			error: (r) => {
				console.log(r, 'error')
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

var drive_items_to_remove = 0;

function set_data_device_items_to_remove(drive_items) {
	if (drive_items_to_remove === 0) {
		drive_items_to_remove = drive_items
	}
}

function get_drive_items_to_remove() {
	return drive_items_to_remove;
}

function delete_selected_items_film(frm, selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		if (row.media_id) {
			frappe.db.delete_doc('Media', row.media_id)

		}
	}
	film_items_to_remove = 0;
	frm.set_value('no_of_films', frm.doc['film_items'].filter(d => (d.media_id)).length)
	frm.save().then(r => {
		// frm.events.check_and_add_blank_row(frm, 'film_items', 'Film Entry Item')
		frm.events.check_and_add_blank_for_all_child_table(frm)
	});
}

function delete_selected_items_tape(frm, selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		if (row.media_id) {
			frappe.db.delete_doc('Media', row.media_id)
		}
	}
	// frm.set_value('no_of_tapes', frm.doc.no_of_tapes - selected_items.length)
	frm.set_value('no_of_tapes', frm.doc['tape_items'].filter(d => (d.media_id)).length)

	tape_items_to_remove = 0;
	frm.save().then(r => {
		// frm.events.check_and_add_blank_row(frm, 'tape_items', 'Tape Entry Item')
		frm.events.check_and_add_blank_for_all_child_table(frm)
	});
}

function delete_selected_items_drives(frm, selected_items) {
	for (const i in selected_items) {
		let row = selected_items[i]
		if (row.media_id) {
			frappe.db.delete_doc('Media', row.media_id)
		}
	}
	// frm.set_value('no_of_drives', frm.doc.no_of_drives - selected_items.length)
	frm.set_value('no_of_drives', frm.doc['drive_items'].filter(d => (d.media_id)).length)

	drive_items_to_remove = 0;
	frm.save().then(r => {
		frm.events.check_and_add_blank_for_all_child_table(frm)
		// frm.events.check_and_add_blank_row(frm, 'drive_items', 'Drive Entry Item')
	});
}