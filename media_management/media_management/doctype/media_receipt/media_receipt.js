// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt
frappe.ui.form.on('Media Receipt', {
	onload_post_render: function (frm) {
		$(".grid-add-row").html('Add New')
		// $(".grid-remove-rows").html('Remove')
		if (frm.doc.docstatus == 0) {
			console.log('from onload_post_render ')
			frm.events.check_and_add_blank_for_all_child_table(frm)
		}
	},
	onload: function (frm) {
		if (frm.doc.no_of_films != 0 || frm.doc.no_of_tapes != 0 || frm.doc.no_of_drives != 0 || frm.doc.docstatus != 0) {
			frm.set_df_property('no_of_films', 'read_only', 1)
			frm.set_df_property('no_of_tapes', 'read_only', 1)
			frm.set_df_property('no_of_drives', 'read_only', 1)
			frm.set_df_property('create_all_media', 'hidden', 1)
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
	},
	check_and_add_blank_for_all_child_table: function(frm){
		frm.events.check_and_add_blank_row(frm, 'film_items', 'Film Entry Item')
		frm.events.check_and_add_blank_row(frm, 'tape_items', 'Tape Entry Item')
		frm.events.check_and_add_blank_row(frm, 'drive_items', 'Drive Entry Item')		
	},
	check_and_add_blank_row: function (frm, child_table = undefined, child_table_name = undefined) {
		// if (cur_frm.is_dirty() === 1) {
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
	refresh: function (frm) {
		debugger;
		if (frm.get_docfield('no_of_films').read_only==1 ||frm.get_docfield('no_of_tapes').read_only==1 ||frm.get_docfield('no_of_drives').read_only==1  ) {
			frm.set_df_property('create_all_media', 'hidden', 1)
			// frm.refresh_field('create_all_media')
		}
		if (!frm.is_new()) {
			frm.add_custom_button(
				__('Print Lables'),
				() => frm.events.print_barcodes(frm)
			);			
			frm.add_custom_button(
				__('Save & Submit'),
				() => frm.savesubmit()
			);			

		}
	},
	customer: function (frm) {
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
	},
	project: function (frm) {
		if (frm.doc.project && !frm.doc.customer) {
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
		if (cur_frm.is_dirty() === 1) {
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
		if (cur_frm.is_dirty() === 1) {
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

	}
});

frappe.ui.form.on('Film Entry Item', {
	media_id: (frm, cdt, cdn) => {
		let row = locals[cdt][cdn];
		if (row.media_id) {
			frm.events.check_and_add_blank_row(frm, 'film_items', 'Film Entry Item')
			frappe.db.get_value('Media', row.media_id, 'is_checkerboard')
			.then(r => {
				row.is_checkerboard=r.message.is_checkerboard
			})			
			
			frm.set_value('no_of_films', frm.doc['film_items'].filter(d => (d.media_id)).length)
		}
	},
	film_items_add(frm, cdt, cdn) {
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

	},
	before_film_items_remove(frm, cdt, cdn) {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		set_film_items_to_remove(film_items)
	},
	film_items_remove(frm, cdt, cdn) {
		let film_items = frm.fields_dict.film_items.grid.get_selected_children()
		if (film_items.length === 0) {
			if (frm.is_dirty() === 1) {
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
});

frappe.ui.form.on('Tape Entry Item', {
	media_id: (frm, cdt, cdn) => {
		let row = locals[cdt][cdn];
		if (row.media_id) {
			frm.events.check_and_add_blank_row(frm, 'tape_items', 'Tape Entry Item')
			frm.set_value('no_of_tapes', frm.doc['tape_items'].filter(d => (d.media_id)).length)
		}
	},
	tape_items_add(frm, cdt, cdn) {
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
	},
	before_tape_items_remove(frm, cdt, cdn) {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		set_tape_items_to_remove(tape_items)
	},
	tape_items_remove(frm, cdt, cdn) {
		let tape_items = frm.fields_dict.tape_items.grid.get_selected_children()
		if (tape_items.length === 0) {
			if (frm.is_dirty() === 1) {
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
});

frappe.ui.form.on('Drive Entry Item', {
	media_id: (frm, cdt, cdn) => {
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
				// frappe.model.set_value(cdt, cdn, 'has_datacable',values.has_datacable);
			})			
			frm.set_value('no_of_drives', frm.doc['drive_items'].filter(d => (d.media_id)).length)
		}
	},
	drive_items_add(frm, cdt, cdn) {
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
	},
	before_drive_items_remove(frm, cdt, cdn) {
		let drive_items_items = frm.fields_dict.drive_items.grid.get_selected_children()
		set_data_device_items_to_remove(drive_items_items)
	},
	drive_items_remove(frm, cdt, cdn) {
		let drive_items_items = frm.fields_dict.drive_items.grid.get_selected_children()
		console.log('drive_items_items',drive_items_items)
		if (drive_items_items.length === 0) {
			if (frm.is_dirty() === 1) {
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
			console.log(r)
			if (r.message) {
				frm.events.check_and_add_blank_for_all_child_table(frm)
				// frm.dirty()
				// frm.save()
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