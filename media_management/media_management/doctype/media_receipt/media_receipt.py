# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import getdate, nowdate

class MediaReceipt(Document):

	def on_submit(self):
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
				"film_length":item.film_length
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
				"tape_run_time_mins":item.tape_run_time_mins
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
				"has_datacable":item.has_datacable,
				"has_psu":item.has_psu,
				"has_box":item.has_box,
				"drive_format":item.drive_format
			})
			doc.save(ignore_permissions = True)	


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

@frappe.whitelist()
def delete_Media_NS(media_id):
	frappe.delete_doc('Media', media_id)			

