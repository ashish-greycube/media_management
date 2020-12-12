select name as "ID:Link/Media:150",
media_type as Type,
media_sub_type as `Sub Type`,
media_owner as Owner,
external_id as `Ext ID`,
tape_title as `Title`,
tape_standard as `Tape Standard`,
tape_manufacturer as `Tape Manufacturer`,
tape_run_time_mins as `Tape Runtime`,
content_description as Content,
notes as Notes
from `tabMedia`
where media_type='Tape'
order by modified desc