// Copyright (c) 2020, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on('Media', {
	onload_post_render: function (frm) {
		$(".grid-buttons").hide();
		$(".grid-row-check").remove();
		$("div.edit-grid-row").text('Open')
	},
	setup: function (frm) {
		frm.set_query("media_sub_type", function () {
			return {
				filters: {
					'media_type': frm.doc.media_type
				}
			};
		});
	},
	media_type: function (frm) {
		frm.set_value('media_sub_type', '')
	},
	refresh: function (frm) {
		if (!frm.is_new()) {
			frm.add_custom_button('Print Label', () => {
				let selected_items = {};
				selected_items[0] = frm.doc.name
				frappe.call({
					method: 'media_management.api.get_label_pdf',
					args: {
						'selected_items': selected_items,
					},
					async: false,
					callback: (r) => {
						printJS(r.message)
					},
					error: (r) => {
						console.log(r)
						// on error
					}
				})
			})
		}
	}
});