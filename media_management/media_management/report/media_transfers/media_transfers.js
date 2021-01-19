
frappe.query_reports["Media Transfers"] = {
    formatter(value, row, column, data, format_cell) {
        if (column.fieldname == "id" && data.id) {
          let form_link = frappe.utils.get_form_link(
            data.type=='Receipt'?'Media Receipt':'Media Return',
            data.id
          );
          return `<a class="" href="${form_link}">${value}</a>`;
        }
        return format_cell(value, row, column, data);
      },
    }