// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media Movement', {
	setup: function (frm) {
		frm.set_query('project', () => {
			return {
				filters: {
					customer: frm.doc.customer
				}
			}
		})
		frm.set_query('filter_project', () => {
			return {
				filters: {
					customer: frm.doc.filter_customer
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
	filter_project: function (frm) {
		if (frm.doc.filter_project && !frm.doc.filter_customer) {
			frappe.db.get_value('Project', frm.doc.filter_project, 'customer')
			.then(r => {
				let customer=r.message.customer
				frm.set_value('filter_customer', customer)
			})			
		}
	},	

});
