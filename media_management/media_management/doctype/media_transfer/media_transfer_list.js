frappe.listview_settings['Media Transfer'] = {
	// onload() {
	// 	frappe.breadcrumbs.add('Accounts');
	// },    
    // colwidths: {"subject": 6}
    // filters:[["status","=", "Open"]]
	// column_render: {
	// 	"from_warehouse": function(doc) {
	// 		var html = "";
	// 		if(doc.from_warehouse) {
	// 			html += '<span class="filterable h6"\
	// 				data-filter="from_warehouse,=,'+doc.from_warehouse+'">'
	// 					+doc.from_warehouse+' </span>';
	// 		}
	// 		// if(doc.from_warehouse || doc.to_warehouse) {
	// 		// 	html += '<i class="fa fa-arrow-right text-muted"></i> ';
	// 		// }
	// 		if(doc.to_warehouse) {
	// 			html += '<span class="filterable h6"\
	// 			data-filter="to_warehouse,=,'+doc.to_warehouse+'">'+doc.to_warehouse+'</span>';
	// 		}
	// 		return html;
	// 	}
	// }    
    onload: function(list_view) {
        // total_fields:6,
        $('span.level-item:contains("Name")').text('Transfer ID')
        $('input[data-fieldname="name"]').attr('placeholder','Transfer ID')
        $('div[data-original-title="Name"]').attr('data-original-title',"Transfer ID")
        // list_view.page.add_field({
        //     fieldtype: "Select",
        //     label: __("Status"),
        //     fieldname: "docstatus",
        //     options: [
        //       { label: "All", value: '' },
        //       { label: "Draft", value: 0 },
        //       { label: "Submitted", value: 1 },
        //       { label: "Cancelled", value: 2 },
        //     ],
        //     onchange: function () {
        //         list_view.refresh();
        //     },
        //   });        
        },    
    add_fields: ["docstatus","transfer_type","customer","project" ],
    // has_indicator_for_draft: 1,
    // filters:[["docstatus","=", "Draft"]],
    hide_name_column: true

    
}