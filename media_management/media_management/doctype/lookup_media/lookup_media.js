frappe.ui.form.on('Lookup Media', {
	refresh: function (frm) {
		frm.disable_save();
		let scan_barcode_field = frm.get_field('scan_barcode');
		if (scan_barcode_field && scan_barcode_field.get_value()) {
			scan_barcode_field.set_value("");
		}
		// if (frappe.is_mobile()) {
			if (scan_barcode_field.$input_wrapper.find('.input-group').length) return;
			let $input_group = $('<div class="input-group">');
			scan_barcode_field.$input_wrapper.find('.control-input').append($input_group);
			$input_group.append(scan_barcode_field.$input);
			$(`<span class="input-group-btn" style="vertical-align: top">
						<button class="btn btn-default border" type="button">
							<i class="fa fa-camera text-muted"></i>
						</button>
					</span>`)
				.on('click', '.btn', () => {
					frappe.barcode.scan_barcode().then(barcode => {
						scan_barcode_field.set_value(barcode);
					});
				})
				.appendTo($input_group);
		// }
	},
	scan_barcode: function (frm) {
		let scan_barcode_field = frm.fields_dict["scan_barcode"];
		if ( frm.doc.scan_barcode) {
			frappe.db.exists('Media', frm.doc.scan_barcode).then(exists => {
				if (exists) {
					// window.open("#Form/Media NS/" + frm.doc.scan_barcode)
					frappe.set_route("Form", "Media",frm.doc.scan_barcode);
					scan_barcode_field.set_value('');
				} else {
					frappe.msgprint(__('Media does not exist'));
					scan_barcode_field.set_value('');
				}
				
			});
			return ;			
		}

	}
});