// Copyright (c) 2016, GreyCube Technologies and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Project Media"] = {
	"filters": [
		{
			fieldname: "current_media",
			label: __("Current Media"),
			fieldtype: "Select",
			options: [
				{ "value": "1", "label": __("Current Media") },
				{ "value": "0", "label": __("All Media") },
			],
			default:"0"
		}
	]
};
