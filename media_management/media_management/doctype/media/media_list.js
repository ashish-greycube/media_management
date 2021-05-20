frappe.listview_settings['Media'] = {
    onload: function(list_view) {
    $('span.level-item:contains("Name")').text('Media ID')
    $('input[data-fieldname="name"]').attr('placeholder','Media ID')
    $('div[data-original-title="Name"]').attr('data-original-title',"Media ID")  

    $('span:contains("Sub Type")').text('Media Sub Type')
    $('input[data-fieldname="media_sub_type"]').attr('placeholder','Media Sub Type')
    $('div[data-original-title="Sub Type"]').attr('data-original-title',"Media Sub Type")    
    },   
    add_fields: ["media_type", "media_sub_type", "media_owner", "external_id"],
    hide_name_column: true
}

