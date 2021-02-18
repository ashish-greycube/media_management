# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MediaReturn(Document):

	def get_film_media(self):
		film_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,media.media_sub_type as film_type,media.film_title,
media.film_element,media.film_sound,media.film_colour,media.is_checkerboard
from
(select count(film.media_id) as ct, film.media_id
from `tabFilm Entry Item` film
inner join `tabMedia Receipt` receipt
on receipt.name=film.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.docstatus=1
group by film.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(film_return.media_id) as ct, film_return.media_id
from `tabFilm Return Item` film_return
inner join `tabMedia Return` media_return
on media_return.name=film_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.docstatus=1
group by film_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0""".format(customer=self.customer,project=self.project), as_dict=1)	
		return film_list if len(film_list) else 'None'

	def get_tape_media(self):
		tape_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,
media.media_sub_type as tape_type,media.tape_title,media.tape_standard,
media.tape_manufacturer,media.tape_run_time_mins
from
(select count(tape.media_id) as ct, tape.media_id
from `tabTape Entry Item` tape
inner join `tabMedia Receipt` receipt
on receipt.name=tape.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.docstatus=1
group by tape.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(tape_return.media_id) as ct, tape_return.media_id
from `tabTape Return Item` tape_return
inner join `tabMedia Return` media_return
on media_return.name=tape_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.docstatus=1
group by tape_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0 """.format(customer=self.customer,project=self.project), as_dict=1)	
		return tape_list if len(tape_list) else 'None'		

	def get_drive_media(self):
		drive_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,
media.media_sub_type as drive_type,media.has_datacable,media.has_psu,
media.has_box,media.drive_capacity,media.drive_format,
media.drive_brand
from
(select count(drive.media_id) as ct, drive.media_id
from `tabDrive Entry Item` drive
inner join `tabMedia Receipt` receipt
on receipt.name=drive.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.docstatus=1
group by drive.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(drive_return.media_id) as ct, drive_return.media_id
from `tabDrive Return Item` drive_return
inner join `tabMedia Return` media_return
on media_return.name=drive_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.docstatus=1
group by drive_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0 """.format(customer=self.customer,project=self.project), as_dict=1)	
		return drive_list if len(drive_list) else 'None'

	def fetch_media(self):
			if not self.customer and not self.project :
				frappe.throw(_('Please input filter criteria for  Customer & Project.'))			

			if (not self.filter_project) and (not self.filter_customer):
				condition="and 1=1"
			elif self.filter_customer and (not self.filter_project):
				condition="and mmi.parent in (select name from `tabMedia Movement` mm where mm.customer='{0}')".format(self.filter_customer)
			elif self.filter_project and (not self.filter_customer):
				condition="and mmi.parent in (select name from `tabMedia Movement` mm where mm.project='{0}')".format(self.filter_project)
			elif self.filter_customer and self.filter_project:
				condition="and mmi.parent in (select name from `tabMedia Movement` mm where mm.customer='{0}' and mm.project='{1}' )".format(self.filter_customer,self.filter_project)							
				
			if not self.filter_media_type:
				type_condition="and 1=1"
			elif self.filter_media_type:
				type_condition="and mmi.media_type='{0}'".format(self.filter_media_type)
			media_ns_list=frappe.db.sql("""select mmi.media_id ,mmi.external_id,mmi.media_owner,mmi.media_type,mmi.parent 
										from `tabMedia Movement Item` mmi
										where mmi.docstatus=1
										{type_condition}
										group by mmi.media_id 
										having count(name)=1
										{condition}
										""".format(type_condition=type_condition,condition=condition), as_dict=1)
			if len(media_ns_list)>0:
				self.media_items=[]
				for media in media_ns_list:
					row = self.append('media_items', {})
					row.media_id = media.media_id
					row.external_id=media.external_id
					row.media_owner=media.media_owner
					row.media_type=media.media_type
			else:
				frappe.msgprint(_('No matching Media Items found.'), indicator = 'yellow')	
