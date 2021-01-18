select name as "ID:Link/Media:150",
media_type as Type,
media_sub_type as `Sub Type`,
media_owner as "Owner:Data:100",
external_id as `Ext ID::60`,
drive_brand as `Drive Brand`,
drive_capacity as `Drive Capacity::120`,
drive_format as `Drive Formatting`,
has_datacable as `Cable:Check:60`,
has_psu as `PSU:Check:60`,
has_box as `Box:Check:60`,
notes as 'Notes::100'
from `tabMedia`
where media_type='Drive'
order by modified desc