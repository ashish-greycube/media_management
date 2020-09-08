from __future__ import unicode_literals
import frappe
from frappe.utils import now_datetime, cint
import json
import pandas
from frappe.utils.pdf import get_pdf
from frappe.utils import get_site_url

@frappe.whitelist()
def get_label_pdf(selected_items):
    pdf_options = {
        # set margins
        "margin-left":"6mm",
        "margin-right":"0.1mm",# from 4 
        "margin-top": "3.1mm",#3.1
        "margin-bottom":"0.1mm",
        # "orientation": "Portrait",
        "orientation":"Landscape",
        "page-height" : "5.4cm",
        "page-width" : "2.9cm",
        "no-outline": None
    }
    template_path = "templates/media_barcode_print.html"
    barcode_items=frappe._dict(frappe.parse_json(selected_items))
    html = frappe.render_template(template_path, dict(barcode_items=barcode_items))
    pdf = get_pdf(html, pdf_options)
    user=frappe.session.user
   
    # del all existing pdf of the user
    doc_name_search='media_label_'+user.lower()+'_'
    file_names = frappe.get_all('File',filters={'file_name': ['like', '%{}%'.format(doc_name_search)]})
    for file_name in file_names:
        frappe.delete_doc('File', file_name.name)

    docname='media_label_'+user.lower()+'_'+frappe.generate_hash()[:8]
    _file = frappe.get_doc({
        "doctype": "File",
        "file_name": docname,
        "folder": "Home",
        "content": pdf})
    _file.save()
    return _file.file_url

