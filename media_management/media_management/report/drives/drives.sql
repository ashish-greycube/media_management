select name as "Media ID:Link/Media:100",
media_sub_type as `Sub Type`,
media_owner as "Media Owner:Data:120",
external_id as `External ID::100`,
drive_brand as `Drive Brand::110`,
drive_capacity as `Drive Capacity::120`,
drive_format as `Drive Formatting::130`,
has_data_cable as `Has Data Cable:Check:125`,
has_psu as `Has PSU:Check:80`,
has_box as `Has Box:Check:80`
from `tabMedia`
where media_type='Drive'
order by modified desc