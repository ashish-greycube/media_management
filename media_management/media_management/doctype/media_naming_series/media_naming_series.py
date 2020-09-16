# -*- coding: utf-8 -*-
# Copyright (c) 2020, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

from frappe.utils import cstr
from frappe import msgprint, throw, _

from frappe.model.document import Document
from frappe.model.naming import parse_naming_series

class MediaNamingSeries(Document):
	def check_duplicate(self,prefix,new_value):
		new_name=prefix+cstr(new_value+1)
		select_doc_for_series='Media NS'
		media_ns = frappe.db.exists('Media NS', dict(
			name = new_name))
		if media_ns:
			frappe.throw(_("Series {0} already used in Media NS").format(new_name))

	def get_current(self, arg=None):
		"""get series current"""
		if self.prefix:
			prefix = self.parse_naming_series()
			self.current_value = frappe.db.get_value("Series",
				prefix, "current", order_by = "name")

	def update_series_start(self):
		
		if self.prefix:
			prefix = self.parse_naming_series()
			self.check_duplicate(prefix,self.current_value)
			# self.insert_series(prefix)
			frappe.db.sql("update `tabSeries` set current = %s where name = %s",
				(self.current_value, prefix))
			msgprint(_("Series Updated Successfully"))
		else:
			msgprint(_("Please choose Series first"))

	def parse_naming_series(self):
		parts = self.prefix.split('.')

		# Remove ### from the end of series
		if parts[-1] == "#" * len(parts[-1]):
			del parts[-1]

		prefix = parse_naming_series(parts)
		return prefix	
