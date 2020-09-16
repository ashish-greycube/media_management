# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class MediaMovement(Document):
	def get_media(self):
			filters={}
			if self.customer:
				filters.update({'customer': self.customer})
			if self.project:
				filters.update({'project': self.project})
			if self.media_type:
				filters.update({'media_type': self.media_type})
			media_ns_list=frappe.db.get_all('Media NS',filters=filters,
									fields=['name', 'external_id','media_owner','media_type'],
									order_by='media_type asc,creation asc'
							)	
			if len(media_ns_list)>0:
				self.media_items=[]
				for media in media_ns_list:
					print('media',media)
					row = self.append('media_items', {})
					row.media_id = media.name
					row.external_id=media.external_id
					row.media_owner=media.media_owner
					row.media_type=media.media_type
			else:
				frappe.msgprint(frappe._('No matching Media Items found.'), indicator = 'yellow')