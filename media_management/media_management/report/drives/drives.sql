select name as "ID:Link/Media:150",
media_type as Type,
media_sub_type as `Sub Type`,
media_owner as Owner,
external_id as `Ext ID`,
drive_brand as `Drive Brand`,
drive_capacity as `Drive Capacity`,
drive_format as `Drive Format`,
has_datacable as `Cable:Check:30`,
has_psu as `PSU:Check:30`,
has_box as `Box:Check:30`,
notes as Notes
from `tabMedia`
where media_type='Drive'
order by modified desc