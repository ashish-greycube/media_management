// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media Return', {
	setup: function (frm) {
		frm.set_query('project', () => {
			return {
				filters: {
					customer: frm.doc.customer
				}
			}	
		})
		const default_company = frappe.defaults.get_default('company');
		if (!frm.doc.company) {
			frm.set_value('company',default_company)
			
		}
	},
	refresh:function(frm){
		$(".grid-add-row").addClass('hidden')
		frm.fields_dict["fetch_all"].$wrapper.css('padding-top',"16px")
		if (frm.doc.docstatus==1) {
			frm.set_df_property('employee', 'hidden', 1)
		}		
		frappe.dynamic_link = {doc:cur_frm.doc, fieldname: 'customer', doctype: 'Customer'}
		if (!frm.is_new()) {
			frm.add_custom_button(__("Print Delivery Note"), function() {
			frm.print_doc();
			});				
		}		
	},
	onload:function(frm){
	
		cur_frm.set_query('customer_address', erpnext.queries.address_query);		
		cur_frm.set_query('contact_person', erpnext.queries.contact_query);
	},
	customer:function(frm){
		erpnext.utils.get_party_details(frm);
		// frm.events.toggle_button(frm)
	},
	customer_address: function(frm) {
		erpnext.utils.get_address_display(cur_frm, 'customer_address', 'address_display');
	},	
	
	onload_post_render: function (frm) {
		// $(".grid-add-row").html('Add All')
		$(".grid-remove-rows").html('Remove')

		// frm.events.toggle_button(frm)
	},
	toggle_button: function (frm) {
		setTimeout(function (){
			if (!frm.doc.customer || !frm.doc.project) {
				$(".grid-add-row").addClass('hidden')
		
			} else {
				$(".grid-add-row").removeClass('hidden')
			}
		} ,500)

	},
	project: function (frm) {
		// frm.events.toggle_button(frm)
	},
	contact_person: function(frm) {
		erpnext.utils.get_contact_details(frm);
	},
	fetch_all: function(frm) {
		if (frm.doc.all_films == 1 && frm.doc.customer && frm.doc.project) {
			frappe.call({
				method: "get_film_media",
				doc: frm.doc,
				callback: function (r) {
					console.log(r)
	
					if (r.message!="None") {
						frm.set_value("film_items", r.message);
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
			});			
		} 
		if (frm.doc.all_tapes == 1 && frm.doc.customer && frm.doc.project) {
			frappe.call({
				method: "get_tape_media",
				doc: frm.doc,
				callback: function (r) {
					if (r.message!="None") {
						frm.set_value("tape_items", r.message);
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
			});			
		}
		if (frm.doc.all_drives == 1 && frm.doc.customer && frm.doc.project) {
			frappe.call({
				method: "get_drive_media",
				doc: frm.doc,
				callback: function (r) {
					if (r.message!="None") {
						frm.set_value("drive_items", r.message);
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
			});		
		}
	
	}
});

frappe.ui.form.on('Film Return Item', {
	film_items_add(frm, cdt, cdn) {
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
});

frappe.ui.form.on('Tape Return Item', {
	tape_items_add(frm, cdt, cdn) {
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
});

frappe.ui.form.on('Drive Return Item', {
	drive_items_add(frm, cdt, cdn) {
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
});