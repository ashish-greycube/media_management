# -*- coding: utf-8 -*-
# Copyright (c) 2021, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
# import frappe
from frappe.model.document import Document

class MediaTransfer(Document):

	def validate(self):
		if not self.title:
			self.title = self.get_title()

	def get_title(self):
		return self.pay_to_recd_from or self.accounts[0].account			