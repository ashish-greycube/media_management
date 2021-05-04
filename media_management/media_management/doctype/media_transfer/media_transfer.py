# -*- coding: utf-8 -*-
# Copyright (c) 2021, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import getdate, nowdate

class MediaTransfer(Document):
	@frappe.whitelist()
	def fetch_all_media(self):
		film_list=self.get_film_media()
		tape_list=self.get_tape_media()
		drive_list=self.get_drive_media()
		return film_list,tape_list,drive_list

	@frappe.whitelist()	
	def get_film_media(self):
		film_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,media.media_sub_type as film_type,media.film_title,
media.film_element,media.film_sound,media.film_colour,media.is_checkerboard,media.film_length_ft
from
(select count(film.media_id) as ct, film.media_id
from `tabFilm Entry Item` film
inner join `tabMedia Transfer` receipt
on receipt.name=film.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.media_transfer_type='Receipt'
and receipt.docstatus=1
group by film.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(film_return.media_id) as ct, film_return.media_id
from `tabFilm Entry Item` film_return
inner join `tabMedia Transfer` media_return
on media_return.name=film_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.media_transfer_type='Return'
and media_return.docstatus=1
group by film_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0""".format(customer=self.customer,project=self.project), as_dict=1)	
		return film_list if len(film_list) else 'None'

	@frappe.whitelist()
	def get_tape_media(self):
		tape_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,
media.media_sub_type as tape_type,media.tape_title,media.tape_standard,
media.tape_manufacturer,media.tape_runtime_mins
from
(select count(tape.media_id) as ct, tape.media_id
from `tabTape Entry Item` tape
inner join `tabMedia Transfer` receipt
on receipt.name=tape.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.media_transfer_type='Receipt'
and receipt.docstatus=1
group by tape.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(tape_return.media_id) as ct, tape_return.media_id
from `tabTape Entry Item` tape_return
inner join `tabMedia Transfer` media_return
on media_return.name=tape_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.media_transfer_type='Return'
and media_return.docstatus=1
group by tape_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0 """.format(customer=self.customer,project=self.project), as_dict=1)	
		return tape_list if len(tape_list) else 'None'		

	@frappe.whitelist()
	def get_drive_media(self):
		drive_list=frappe.db.sql("""select 
media.name as media_id,media.external_id,media.media_owner,
media.media_sub_type as drive_type,media.has_data_cable,media.has_psu,
media.has_box,media.drive_capacity,media.drive_format,
media.drive_brand
from
(select count(drive.media_id) as ct, drive.media_id
from `tabDrive Entry Item` drive
inner join `tabMedia Transfer` receipt
on receipt.name=drive.parent
and receipt.customer='{customer}'
and receipt.project='{project}'
and receipt.media_transfer_type='Receipt'
and receipt.docstatus=1
group by drive.media_id) as received
inner join `tabMedia` media
on received.media_id=media.name
left outer join
(select count(drive_return.media_id) as ct, drive_return.media_id
from `tabDrive Entry Item` drive_return
inner join `tabMedia Transfer` media_return
on media_return.name=drive_return.parent
and media_return.customer='{customer}'
and media_return.project='{project}'
and media_return.media_transfer_type='Return'
and media_return.docstatus=1
group by drive_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0 """.format(customer=self.customer,project=self.project), as_dict=1)	
		return drive_list if len(drive_list) else 'None'

	def on_submit(self):
		if self.media_transfer_type=='Receipt':
			for item in self.get('film_items'):
				doc = frappe.get_doc('Media', item.media_id)
				doc.update({
					"external_id":item.external_id,
					"media_owner":item.media_owner,
					"media_sub_type":item.film_type,
					"film_title":item.film_title,
					"film_element":item.film_element,
					"film_sound":item.film_sound,
					"film_colour":item.film_colour,
					"is_checkerboard":item.is_checkerboard,
					"film_year":item.film_year,
					"film_length_ft":item.film_length_ft
				})
				doc.save(ignore_permissions = True)	

			for item in self.get('tape_items'):
				doc = frappe.get_doc('Media', item.media_id)
				doc.update({
					"external_id":item.external_id,
					"media_owner":item.media_owner,
					"media_sub_type":item.tape_type,
					"tape_title":item.tape_title,
					"tape_standard":item.tape_standard,
					"tape_manufacturer":item.tape_manufacturer,
					"tape_runtime_mins":item.tape_runtime_mins
				})
				doc.save(ignore_permissions = True)	
			
			for item in self.get('drive_items'):
				doc = frappe.get_doc('Media', item.media_id)
				doc.update({
					"external_id":item.external_id,
					"media_owner":item.media_owner,
					"media_sub_type":item.drive_type,
					"drive_capacity":item.drive_capacity,
					"drive_brand":item.drive_brand,
					"has_data_cable":item.has_data_cable,
					"has_psu":item.has_psu,
					"has_box":item.has_box,
					"drive_format":item.drive_format
				})
				doc.save(ignore_permissions = True)	

	@frappe.whitelist()
	def create_all_media(self):
		if hasattr(self, 'film_items') and (len(self.film_items) < self.no_of_films):
			for file in range(self.no_of_films):
				new_media_ns=self.create_media('Film')
				row = self.append('film_items', {})
				row.media_id=new_media_ns
		if  hasattr(self, 'tape_items') and len(self.tape_items) < self.no_of_tapes:				
			for file in range(self.no_of_tapes):
				new_media_ns=self.create_media('Tape')
				row = self.append('tape_items', {})
				row.media_id=new_media_ns
		if  hasattr(self, 'drive_items') and len(self.drive_items) < self.no_of_drives:				
			for file in range(self.no_of_drives):
				new_media_ns=self.create_media('Drive')
				row = self.append('drive_items', {})
				row.media_id=new_media_ns	
		return 1
		

	def create_media(self,media_type):
		doc = frappe.new_doc('Media')
		doc.media_type=media_type
		doc.insert()
		doc.reload()
		doc.save()
		return doc.name	

	# def validate(self):
	# 	if not self.title:
	# 		self.title = self.get_title()


	# def get_title(self):
	# 	return self.media_transfer_type + ':' + self.name	

@frappe.whitelist()
def delete_Media_NS(media_id):
	frappe.delete_doc('Media', media_id)				