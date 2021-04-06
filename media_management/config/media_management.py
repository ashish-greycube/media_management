#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _


def get_data():
    config = [
{
    "label": _("Transfers"),
    "items": [

        {
            "type": "doctype",
            "label": "New Media Transfer",
            "name": "Media Transfer",
            "route": "#Form/Media Transfer/New Media Transfer 1"
        },
        {
            "type": "doctype",
             "name": "Media Transfer",
            "label": "Media Receipt List",
            "description": "Media Receipt",
            "route": "#List/Media Transfer/List?media_transfer_type=Receipt"
        },
        {
            "type": "doctype",
            "name": "Media Transfer",
            "label": "Media Return List",
            "description": "Media Return",
            "route": "#List/Media Transfer/List?media_transfer_type=Return"
        }
    ]
}, 
{
    "label": _("Media"),
    "items": [{
            "type": "report",
            "name": "Media",
            "label": "Media Report",
            "is_query_report": "True",
            "doctype": "Media"
        },
        {
            "type": "report",
            "name": "Films",
            "label": "Films Report",
            "is_query_report": "True",
            "doctype": "Media"
        },
        {
            "type": "report",
            "name": "Tapes",
            "label": "Tapes Report",
            "is_query_report": "True",
            "doctype": "Media"
        },
        {
            "type": "report",
            "name": "Drives",
            "label": "Drives Report",
            "is_query_report": "True",
            "doctype": "Media"
        },
        {
            "type": "doctype",
            "name": "Media",
            "label": "Media List",
            "description": "Media"
        }
    ]
}, 
{
    "label": _("Settings"),
    "items": [{
            "type": "doctype",
            "name": "Media Type",
            "label": "Media Types",
            "description": "Media Type"
        },
        {
            "type": "doctype",
            "name": "Media Sub Type",
            "label": "Media Sub Type",
            "description": "Media Sub Type"
        },
        {
            "type": "doctype",
            "name": "Transfer Method",
            "label": "Transfer Method",
            "description": "Transfer Method"
        },
        {
            "type": "doctype",
            "name": "Media Label Numbering",
            "label": "Media Label Numbering",
            "description": "Media Label Numbering"
        }
    ]
}, 
{
    "label": _("Film"),
    "items": [{
            "type": "doctype",
            "name": "Film Element",
            "label": "Film Element",
            "description": "Film Element"
        },
        {
            "type": "doctype",
            "name": "Film Colour",
            "label": "Film Colour",
            "description": "Film Colour"
        },
        {
            "type": "doctype",
            "name": "Film Sound",
            "label": "Film Sound",
            "description": "Film Sound"
        },
        {
            "type": "doctype",
            "name": "Film Year",
            "label": "Film Year",
            "description": "Film Year"
        }
    ]
}, 
{
    "label": _("Tape"),
    "items": [{
            "type": "doctype",
            "name": "Tape Standard",
            "label": "Tape Standard"
        },
        {
            "type": "doctype",
            "name": "Tape Manufacturer",
            "label": "Tape Manufacturer"
        },
        {
            "type": "doctype",
            "name": "Tape Runtime",
            "label": "Tape Runtime"
        }

    ]
}, 
{
    "label": _("Drive"),
    "items": [{
            "type": "doctype",
            "name": "Drive Brand",
            "label": "Drive Brand",
            "description": "Drive Brand"
        },
        {
            "type": "doctype",
            "name": "Drive Capacity",
            "label": "Drive Capacity",
            "description": "Drive Capacity"
        },
        {
            "type": "doctype",
            "name": "Drive Formatting",
            "label": "Drive Formatting",
            "description": "Drive Formatting"
        }
    ]
}, 
{
    "label": _("Reports"),
    "items": [
        {
            "type": "report",
            "name": "Project Media",
            "label": "Project Media",
            "is_query_report": "True",
            "doctype": "Media"
        },
        {
            "type": "doctype",
            "name": "Lookup Media",
            "label": "Lookup Media",
            "description": "Lookup Media"
        },
        {
            "type": "report",
            "name": "Media Transfers",
            "label": "Old Media Transfers Report",
            "is_query_report": "True",
            "doctype": "Media"
        }        
    ]
}
        ]

    return config
