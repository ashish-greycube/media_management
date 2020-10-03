# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _

class MediaMovement(Document):
	def get_media(self):
			if not self.filter_customer and not self.filter_project and not self.filter_media_type:
				frappe.throw(_('Please input at least one filter criteria from Customer , Project or Media Type.'))			

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