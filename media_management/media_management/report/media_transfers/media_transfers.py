# Copyright (c) 2013, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
	columns, data = [], []
	columns=get_column()
	data=get_media_transfers(filters)
	return columns, data

def get_column():

    return [
        {"label": _("ID"), 'width': 120, "fieldname": "id", 'fieldtype': 'Link/Media Return'},
		{"label":_("Type"), 'width': 60, "fieldname": "type", 'fieldtype': 'Data'},
		{"label": _("Date"), 'width': 100, "fieldname": "transfer_date", 'fieldtype': 'Date'},
        {"label": _("Method"), 'width': 100, "fieldname": "transfer_method", 'fieldtype': 'Link/Transfer Method'},
		{"label":_("Status"), 'width': 85, "fieldname": "docstatus", 'fieldtype': 'Data'},
		{"label": _("Sender"), 'width': 180, "fieldname": "sender", 'fieldtype': 'Link/Contact'},
		{"label": _("Recipient"), 'width': 180, "fieldname": "recipient", 'fieldtype': 'Link/Employee'},
		{"label": _("Customer"), 'width': 180, "fieldname": "customer", 'fieldtype': 'Link/Customer'},
 		{"label": _("Project"), 'width': 180, "fieldname": "project", 'fieldtype': 'Link/Project'},
		{"label":_("F#"), 'width': 40, "fieldname": "name", 'fieldtype': 'Int'},
		{"label":_("T#"), 'width': 40, "fieldname": "name", 'fieldtype': 'Int'},
		{"label":_("D#"), 'width': 40, "fieldname": "name", 'fieldtype': 'Int'}			
    ]

def get_media_transfers(filters):
	media_transfers= frappe.db.sql("""
select media_return.name as id,
'Return' as type, 
media_return.transfer_date ,
media_return.transfer_method ,
IF(media_return.docstatus>1, "Cancelled", IF(media_return.docstatus=0, "Draft","Submitted" )),
media_return.sender ,
media_return.recipient ,
media_return.customer ,
media_return.project ,
count( distinct film_return.name) ,
count(distinct tape_return.name) ,
count(distinct drive_return.name) 
from `tabMedia Return` as media_return
left outer join `tabFilm Return Item` as film_return
on media_return.name=film_return.parent
left outer join `tabTape Return Item` as tape_return
on media_return.name=tape_return.parent
left outer join `tabDrive Return Item` as drive_return
on media_return.name=drive_return.parent
group by media_return.name
union
select media_receipt.name as id ,
'Receipt' as type,
media_receipt.transfer_date ,
media_receipt.transfer_method ,
IF(media_receipt.docstatus>1, "Cancelled", IF(media_receipt.docstatus=0, "Draft","Submitted" ))  ,
media_receipt.sender,
media_receipt.recipient ,
media_receipt.customer ,
media_receipt.project ,
count( distinct film_receipt.name) ,
count(distinct tape_receipt.name) ,
count(distinct drive_receipt.name)
from `tabMedia Receipt` as media_receipt
left outer join `tabFilm Entry Item` as film_receipt
on media_receipt.name=film_receipt.parent
left outer join `tabTape Entry Item` as tape_receipt
on media_receipt.name=tape_receipt.parent
left outer join `tabDrive Entry Item` as drive_receipt
on media_receipt.name=drive_receipt.parent
group by media_receipt.name
order by `transfer_date` desc
""")
	return media_transfers
