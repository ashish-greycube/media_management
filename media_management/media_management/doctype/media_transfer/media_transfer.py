# -*- coding: utf-8 -*-
# Copyright (c) 2021, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import get_link_to_form,today
from frappe import _
from erpnext.accounts.party import get_party_details

class MediaTransfer(Document):
	def autoname(self):
		from frappe.model.naming import set_name_by_naming_series
		if self.transfer_type == 'Receipt':
			self.naming_series = 'RC-.YY.-.MM.-.#'
		elif self.transfer_type == 'Return':
			self.naming_series = 'RT-.YY.-.MM.-.#'
		set_name_by_naming_series(self)

	def onload(self):
		if self.customer and self.transfer_type=='Return':
			customer_details=get_party_details(party=self.customer,party_type='Customer')
			self.contact_display=customer_details.get('contact_display')
			self.contact_mobile=customer_details.get('contact_mobile')
			self.address_display=customer_details.get('address_display')

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
and receipt.transfer_type='Receipt'
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
and media_return.transfer_type='Return'
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
and receipt.transfer_type='Receipt'
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
and media_return.transfer_type='Return'
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
and receipt.transfer_type='Receipt'
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
and media_return.transfer_type='Return'
and media_return.docstatus=1
group by drive_return.media_id) as returned
on received.media_id=returned.media_id
where received.ct-coalesce(returned.ct,0) > 0 """.format(customer=self.customer,project=self.project), as_dict=1)	
		return drive_list if len(drive_list) else 'None'

	def on_submit(self):
		if self.transfer_type=='Receipt':
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
	# 	return self.transfer_type + ':' + self.name	
	@frappe.whitelist()
	def make_transfer_return(self):

		film_list,tape_list,drive_list=[],[],[]
		if self.film_items:
			film_list=self.get_film_media()
		if self.tape_items:
			tape_list=self.get_tape_media()
		if self.drive_items:
			drive_list=self.get_drive_media()
		
		return_created_list=[['Media ID','Media Type','Sub Type','Owner','External ID']]

		for film_receipt in self.film_items:
			found_film=False
			if film_list!='None':
				for film_return in film_list:
					if film_receipt.media_id==film_return.media_id:
						found_film=True
						break
			if found_film==False:					
					return_created_list.append([
						frappe.bold(get_link_to_form('Media',film_receipt.media_id)), 
						'Film',
						film_receipt.film_type or '',
						film_receipt.media_owner or '', 
						film_receipt.external_id or ''
					])

		for tape_receipt in self.tape_items:
			found_tape=False
			if tape_list!='None':
				for tape_return in tape_list:
					if tape_receipt.media_id==tape_return.media_id:
						found_tape=True
						break
			if found_tape==False:					
					return_created_list.append([
						frappe.bold(get_link_to_form('Media',tape_receipt.media_id)), 
						'Tape',
						tape_receipt.tape_type or '',
						tape_receipt.media_owner or '', 
						tape_receipt.external_id or ''
					])

		for drive_receipt in self.drive_items:
			found_drive=False
			if drive_list!='None':
				for drive_return in drive_list:
					if drive_receipt.media_id==drive_return.media_id:
						found_drive=True
						break
			if found_drive==False:					
					return_created_list.append([
						frappe.bold(get_link_to_form('Media',drive_receipt.media_id)), 
						'Drive',
						drive_receipt.drive_type or '',
						drive_receipt.media_owner or '', 
						drive_receipt.external_id or ''
					])


		media_transfer_name=''
		if 	(len(film_list)>0 and film_list!='None') or (len(tape_list)>0 and tape_list!='None') or (len(drive_list)>0 and drive_list!='None') :
			media_transfer = frappe.new_doc('Media Transfer')
			media_transfer.transfer_type='Return'
			media_transfer.naming_series='RT-.YY.-.MM.-.#'
			media_transfer.transfer_date=today()
			media_transfer.transfer_method=self.transfer_method
			media_transfer.external_contact=self.external_contact
			media_transfer.internal_contact=self.internal_contact
			media_transfer.customer=self.customer
			media_transfer.project=self.project
			if len(film_list)>0 and film_list!='None':
				for film in film_list:
						media_transfer.append('film_items',film)
			if len(tape_list)>0 and tape_list!='None':
				for tape in tape_list:
						print('2244'*100,tape)
						media_transfer.append('tape_items',tape)				
			if len(drive_list)>0 and drive_list!='None':
				for drive in drive_list:
						media_transfer.append('drive_items',drive)				
			media_transfer.insert()
			media_transfer.run_method("onload")
			media_transfer_name=media_transfer.name
		
		if len(return_created_list)>1:
			frappe.msgprint(msg=return_created_list,title='The following media items have already been returned.',as_table=True)			
		if media_transfer_name:
			frappe.msgprint(msg=("Media Transfer record : {0} of type return is created.").format(frappe.bold(get_link_to_form("Media Transfer", media_transfer.name))))
		else:
			frappe.msgprint(msg=("No new media transfer record of type return is created."))				
			

@frappe.whitelist()
def delete_Media_NS(media_id):
	frappe.delete_doc('Media', media_id)	


					