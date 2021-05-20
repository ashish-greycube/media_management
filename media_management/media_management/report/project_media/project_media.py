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
        {"label": _("External ID"), 'width': 120, "fieldname": "External ID", 'fieldtype': 'Data'},
		{"label":_("Media Type"), 'width': 100, "fieldname": "Type", 'fieldtype': 'Data'},
		{"label": _("SubType"), 'width': 80, "fieldname": "SubType", 'fieldtype': 'Data'},
		{"label": _("Media Owner"), 'width': 120, "fieldname": "Owner", 'fieldtype': 'Data'},
		{"label": _("Receipt ID"), 'width': 110, "fieldname": "Receipt ID", 'fieldtype': 'Link','options':'Media Transfer'},
 		{"label": _("Receipt Date"), 'width': 105, "fieldname": "Receipt Date", 'fieldtype': 'Date'},
		{"label":_("Return ID"), 'width': 110, "fieldname": "Return ID", 'fieldtype': 'Link','options':'Media Transfer'},
		{"label":_("Return Date"), 'width': 105, "fieldname": "Return Date", 'fieldtype': 'Date'}
    ]

def get_project_media(filters):

	conditions = ""
	if filters.current_media=='1':
		conditions=' and a.tr_name is not null and  b.tr_name is null'

	project_media= frappe.db.sql("""with fn as
(
	select tr.creation, tr.customer, tr.project,
	m.name media_id, m.external_id, m.media_type, m.media_sub_type, m.media_owner,
	tr.transfer_type, tr.tr_name, tr.transfer_date,m.creation as media_creation,
	ROW_NUMBER() over (PARTITION by tr.media_id, tr.transfer_type ORDER BY tr.creation) rn
	from `tabMedia` m
	left outer join 
	(
		select mt.name tr_name, mt.customer, mt.transfer_date, mt.transfer_type, mt.project,
		coalesce(fei.media_id,tei.media_id,dei.media_id) media_id,
		mt.creation
		from `tabMedia Transfer` mt
		left outer join `tabFilm Entry Item` fei on fei.parent = mt.name
		left outer join `tabTape Entry Item` tei on tei.parent = mt.name
		left outer join `tabDrive Entry Item` dei on dei.parent = mt.name
	) tr on tr.media_id = m.name
-- 	where m.name = 'F200406'
) 
select
a.customer `Customer`,
a.project `Project`,
a.media_id `Media ID` ,
a.external_id `External ID`,   
a.media_type `Type`, 
a.media_sub_type `SubType`, 
a.media_owner `Owner`,
a.tr_name `Receipt ID`, a.transfer_date `Receipt Date`,
b.tr_name `Return ID`, b.transfer_date `Return Date`,
case 
when a.tr_name is not null and  b.tr_name is null then 1
else 0 end `current_media`
from fn a
left outer join fn b on b.media_id = a.media_id and b.rn = a.rn and b.transfer_type = 'Return'
left outer join
(
	select coalesce(fei.media_id, tei.media_id, dei.media_id) media_id,
	sum(if(mt.transfer_type='Receipt',1,0)) net_count
	from `tabMedia Transfer` mt 
	left outer join `tabFilm Entry Item` fei on fei.parent = mt.name
	left outer join `tabTape Entry Item` tei on tei.parent = mt.name
	left outer join `tabDrive Entry Item` dei on dei.parent = mt.name
	group by coalesce(fei.media_id, tei.media_id, dei.media_id)
) cur on cur.media_id = a.media_id 
where  (a.transfer_type is null or a.transfer_type = 'Receipt' ) %s
order by a.media_creation DESC,a.creation DESC, a.media_type
""" % (conditions,))
	return project_media	
