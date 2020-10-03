# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import getdate, nowdate

class MediaEntry(Document):

	def on_submit(self):
		media_movement_items=[]
		for item in self.get('film_items'):
			doc = frappe.get_doc('Media NS', item.media_id)
			doc.update({
				"external_id":item.external_id,
				"media_owner":item.media_owner,
				"title":item.title
			})
			doc.save(ignore_permissions = True)	
			media_movement_items.append({"media_id":item.media_id,"external_id":item.external_id,"media_owner":item.media_owner,"media_type":"Film"})	

		for item in self.get('tape_items'):
			doc = frappe.get_doc('Media NS', item.media_id)
			doc.update({
				"external_id":item.external_id,
				"media_owner":item.media_owner,
				"title":item.title
			})
			doc.save(ignore_permissions = True)	
			media_movement_items.append({"media_id":item.media_id,"external_id":item.external_id,"media_owner":item.media_owner,"media_type":"Tape"})	
		
		for item in self.get('data_devices'):
			doc = frappe.get_doc('Media NS', item.media_id)
			doc.update({
				"external_id":item.external_id,
				"media_owner":item.data_device_owner,
				"data_device_type":item.type,
				"data_device_capacity":item.capacity,
				"data_device_brand":item.brand,
				"has_datacable":item.has_datacable,
				"has_psu":item.has_psu,
				"has_box":item.has_box
			})
			doc.save(ignore_permissions = True)	
			media_movement_items.append({"media_id":item.media_id,"external_id":item.external_id,"media_owner":item.data_device_owner,"media_type":"Data Device"})				

		doc=frappe.get_doc({
			'doctype': 'Media Movement',
			'movement_type': 'Inbound',
			'transit_method':'By Hand',
			'transaction_date':getdate(nowdate()),
			"customer":self.customer,
			"project":self.project,			
			'target':frappe.db.get_single_value('Media Management Settings', 'default_company_address'),
			'media_items': media_movement_items
		}).insert(ignore_permissions = True) 
	
		self.db_set("media_movement", doc.name)

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
		return 1
		

	def create_Media_NS(self,media_type):
		doc = frappe.new_doc('Media NS')
		doc.media_type=media_type
		doc.insert()
		doc.reload()
		doc.save()
		return doc.name	

@frappe.whitelist()
def delete_Media_NS(media_id):
	frappe.delete_doc('Media NS', media_id)			

