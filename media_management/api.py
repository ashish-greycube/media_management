from __future__ import unicode_literals
import frappe
from frappe.utils import now_datetime, cint
import json
import pandas
from frappe.utils.pdf import get_pdf
from frappe.utils import get_site_url

@frappe.whitelist()
def get_label_pdf(selected_items):
    docname='barcode'
#vr
    pdf_options = {
        # set margins
        "margin-left": "0mm",
        "margin-right": "0mm",
        "margin-top": "0mm",
        "margin-bottom": "0mm",
        "page-height": "51mm",
		"page-width": "30mm",
        "orientation":"Landscape"
    }
# vr    
    # pdf_options = {
    #     # set margins
    #     "margin-left":"6mm",
    #     "margin-right":"4mm",
    #     "margin-top": "3.1mm",
    #     "margin-bottom":"0.1mm",
    #     # "orientation": "Portrait",
    #     "orientation":"Landscape",
    #     "page-height" : "5.4cm",
	# 	"page-width" : "2.9cm",
    #     "no-outline": None
    # }
    template_path = "templates/vr.html"
    # template_path = "templates/media_barcode_print.html"
    barcode_items=frappe._dict(frappe.parse_json(selected_items))
    print('selected_items',selected_items)
    print('barcode_items----------------------------------------',barcode_items)
    html = frappe.render_template(
        template_path, dict(barcode_items=barcode_items))
    pdf = get_pdf(html, pdf_options)
    print('pdf',pdf)
    _file = frappe.get_doc({
        "doctype": "File",
        "file_name": "Manufacturing Order %s.pdf" % frappe.generate_hash()[:8],
        "folder": "Home",
        "content": pdf})
    _file.save()

    frappe.response.filename = f"{docname}_{frappe.utils.now_datetime()}.pdf"
    frappe.response.filecontent = pdf
    frappe.response.type = "download"
