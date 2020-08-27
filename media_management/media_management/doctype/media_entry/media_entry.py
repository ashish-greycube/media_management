# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MediaEntry(Document):
	def create_and_print_barcode(self):
		if hasattr(self, 'film_items') and (len(self.film_items) < self.no_of_films):
			for file in range(self.no_of_films):
				new_media_ns=self.create_Media_NS('Film')
				row = self.append('film_items', {})
				row.media_id=new_media_ns
		if  hasattr(self, 'tape_items') and len(self.tape_items) < self.no_of_tapes:				
			for file in range(self.no_of_tapes):
				new_media_ns=self.create_Media_NS('Tape')
				row = self.append('tape_items', {})
				row.media_id=new_media_ns
		if  hasattr(self, 'data_devices') and len(self.data_devices) < self.no_of_data_device:				
			for file in range(self.no_of_data_device):
				new_media_ns=self.create_Media_NS('Data Device')
				row = self.append('data_devices', {})
				row.media_id=new_media_ns		
			

	def create_Media_NS(self,media_type):
		doc = frappe.new_doc('Media NS')
		doc.media_type=media_type
		doc.customer=self.customer
		doc.project=self.project
		doc.insert()
		return doc.name	

@frappe.whitelist()
def delete_Media_NS(media_id):
	frappe.delete_doc('Media NS', media_id)			

