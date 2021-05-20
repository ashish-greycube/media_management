frappe.listview_settings['Media Sub Type'] = {
    onload: function(list_view) {
    $('div[data-fieldname="name"]').hide()
    $('span:contains("Sub Type")').text('Media Sub Type')
    $('input[data-fieldname="sub_type"]').attr('placeholder','Media Sub Type')
    $('div[data-original-title="Sub Type"]').attr('data-original-title',"Media Sub Type")     
    },
    hide_name_column: true,
}

