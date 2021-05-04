# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Media(Document):

	# def validate(self):
	# 	self.title=self.media_type+': '+self.name

	def onload(self):
		if self.name and self.media_type=='Film':
			self.load_film_history()
		elif self.name and self.media_type=='Tape':
			self.load_tape_history()
		elif self.name and self.media_type=='Drive':
			self.load_drive_history()		

	def load_film_history(self):
		media_list=frappe.db.sql("""
		(select 'Media Transfer' as link_doctype,receipt.name as id,receipt.media_transfer_type as `media_transfer_type`,film.film_type as `type`,
		receipt.transfer_date as `date`,receipt.transfer_method as method,
		receipt.sender,receipt.recipient,receipt.customer,
		receipt.project,receipt.creation as creation
		from  `tabFilm Entry Item` film
		inner join `tabMedia Transfer` receipt
		on receipt.name=film.parent
		where film.media_id='{media_id}')
        order by `date` desc, creation desc""".format(media_id=self.name), as_dict=1)
		return self.fill_up_transfer_history(media_list) if len(media_list) else 0

	def load_tape_history(self):
		media_list=frappe.db.sql("""
		(select 'Media Transfer' as link_doctype,receipt.name as id,receipt.media_transfer_type as `media_transfer_type`,tape.tape_type as `type`,
		receipt.transfer_date as `date`,receipt.transfer_method as method,
		receipt.sender,receipt.recipient,receipt.customer,
		receipt.project,receipt.creation as creation
		from  `tabTape Entry Item` tape
		inner join `tabMedia Transfer` receipt
		on receipt.name=tape.parent
		where tape.media_id='{media_id}')
        order by `date` desc, creation desc""".format(media_id=self.name), as_dict=1)
		return self.fill_up_transfer_history(media_list) if len(media_list) else 0

	def load_drive_history(self):
		media_list=frappe.db.sql("""
		(select 'Media Transfer' as link_doctype,receipt.name as id,receipt.media_transfer_type as `media_transfer_type`, drive.drive_type as `type`,
		receipt.transfer_date as `date`,receipt.transfer_method as method,
		receipt.sender,receipt.recipient,receipt.customer,
		receipt.project,receipt.creation as creation
		from  `tabDrive Entry Item` drive
		inner join `tabMedia Transfer` receipt
		on receipt.name=drive.parent
		where drive.media_id='{media_id}')
        order by `date` desc, creation desc""".format(media_id=self.name), as_dict=1)
		return self.fill_up_transfer_history(media_list) if len(media_list) else 0

	def fill_up_transfer_history(self,media_list):
		self.transfer_history=[]
		for item in media_list:
			self.append("transfer_history", {
				"link_doctype":item.link_doctype,
				"id":item.id,
				"media_transfer_type": item.media_transfer_type,
				"date":item.date,
				"method":item.method,
				"sender":item.sender,
				"recipient":item.recipient,
				"customer":item.customer,
				"project":item.project
			})
