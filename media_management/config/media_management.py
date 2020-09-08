#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _


def get_data():
    config = [{'label': _('Transactions'), 'items': [{
        'type': 'doctype',
        'name': 'Media Entry',
        'label': 'Media Entry',
        'description': 'Media Entry',
        }, {
        'type': 'doctype',
        'name': 'Media Movement',
        'label': 'Media Movement',
        'description': 'Media Movement',
        }]}, {'label': _('General'), 'items': [{
        'type': 'doctype',
        'name': 'Media NS',
        'label': 'Media',
        'description': 'Media NS',
        }, {
        'type': 'doctype',
        'name': 'Media Type NS',
        'label': 'Media Type',
        'description': 'Media Type NS',
        }, {
        'type': 'doctype',
        'name': 'Era',
        'label': 'Era',
        'description': 'Era',
        }]}, {'label': _('Film'), 'items': [{
        'type': 'doctype',
        'name': 'Film Format',
        'label': 'Film Format',
        'description': 'Film Format',
        }, {
        'type': 'doctype',
        'name': 'Film Sound',
        'label': 'Film Sound',
        'description': 'Film Sound',
        }, {
        'type': 'doctype',
        'name': 'Film Colour',
        'label': 'Film Colour',
        'description': 'Film Colour',
        }, {
        'type': 'doctype',
        'name': 'Film Gauge',
        'label': 'Film Gauge',
        'description': 'Film Gauge',
        }]}, {'label': _('Tape'), 'items': [{
        'type': 'doctype',
        'name': 'Tape Format',
        'label': 'Tape Format',
        'description': 'Tape Format',
        }, {'type': 'doctype', 'name': 'Tape Standard',
            'label': 'Tape Standard'}]}, {'label': _('Data Device'),
                'items': [{
        'type': 'doctype',
        'name': 'Data Device Format',
        'label': 'Data Device Format',
        'description': 'Data Device Format',
        }, {
        'type': 'doctype',
        'name': 'Data Device Capacity',
        'label': 'Data Device Capacity',
        'description': 'Data Device Capacity',
        }, {
        'type': 'doctype',
        'name': 'Data Device Type',
        'label': 'Data Device Type',
        'description': 'Data Device Type',
        }]}]

    return config