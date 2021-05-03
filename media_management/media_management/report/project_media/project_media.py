# Copyright (c) 2013, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

#link not working
# filter condition
# in current media we are not showing orphans

def execute(filters=None):
	columns, data = [], []
	columns=get_column()
	data=get_project_media(filters)
	return columns, data

def get_column():

    return [
        {"label": _("Customer"), 'width': 100, "fieldname": "Customer", 'fieldtype': 'Data'},
		{"label":_("Project"), 'width': 80, "fieldname": "Project", 'fieldtype': 'Data'},
		{"label": _("Media ID"), 'width': 80, "fieldname": "Media ID", 'fieldtype': 'Link','options':'Media'},
        {"label": _("External ID"), 'width': 120, "fieldname": "Ext. ID", 'fieldtype': 'Data'},
		{"label":_("Media Type"), 'width': 100, "fieldname": "Type", 'fieldtype': 'Data'},
		{"label": _("SubType"), 'width': 80, "fieldname": "SubType", 'fieldtype': 'Data'},
		{"label": _("Media Owner"), 'width': 120, "fieldname": "Owner", 'fieldtype': 'Data'},
		{"label": _("Receipt ID"), 'width': 80, "fieldname": "Receipt ID", 'fieldtype': 'Link','options':'Media Receipt'},
 		{"label": _("Receipt Date"), 'width': 120, "fieldname": "Receipt Date", 'fieldtype': 'Date'},
		{"label":_("Return ID"), 'width': 80, "fieldname": "Return ID", 'fieldtype': 'Link','options':'Media Return'},
		{"label":_("Return Date"), 'width': 120, "fieldname": "Return Date", 'fieldtype': 'Date'}
    ]

def get_project_media(filters):
	conditions = ''
	print('filters'*100,filters)
	if filters.current_media=='0':
		conditions= 'where current_media in (0,1)'
	elif filters.current_media=='1':
		conditions='where current_media in (1)'
	print('conditions'*100,conditions)
	project_media= frappe.db.sql("""select * from (
	select
distinct mr.customer `Customer`, mr.project `Project`,
m.name `Media ID`, m.external_id `Ext. ID`, m.media_type `Type`, m.media_sub_type `SubType`, m.media_owner `Owner`,
mr.name `Receipt ID`, mr.transfer_date `Receipt Date`,mret.name `Return ID`, mret.transfer_date `Return Date`,
case 
when mr.name is not null and  mret.name is null then 1
else 0 end `current_media` 
from `tabMedia` m
left outer join `tabFilm Entry Item` fei on fei.media_id = m.name
left outer join `tabTape Entry Item` tei on tei.media_id = m.name
left outer join `tabDrive Entry Item` dei on dei.media_id = m.name
left outer join `tabMedia Transfer` mr on mr.name = coalesce(fei.parent, tei.parent, dei.parent)
left outer join `tabFilm Return Item` frei on frei.media_id = m.name
left outer join `tabTape Return Item` trei on trei.media_id = m.name
left outer join `tabDrive Return Item` drei on drei.media_id = m.name
left outer join `tabMedia Transfer` mret on mret.name = coalesce(frei.parent, trei.parent, drei.parent) 
and mret.customer =  mr.customer 
and mret.project = mr.project
and mr.media_transfer_type='Receipt'
and mret.media_transfer_type='Return'
order by m.creation desc,mr.transfer_date desc,mret.transfer_date IS NULL desc,mret.transfer_date desc, m.media_type) a
%s"""%conditions)
	return project_media	
