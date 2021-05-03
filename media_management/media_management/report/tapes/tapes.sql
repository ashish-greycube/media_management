select name as "Media ID:Link/Media:100",
media_sub_type as `Sub Type`,
media_owner as "Media Owner:Data:120",
external_id as `External ID::100`,
tape_title as `Tape Title`,
tape_standard as `Tape Standard`,
tape_manufacturer as `Tape Manufacturer`,
tape_run_time_mins as `Tape Runtime (mins)`
from `tabMedia`
where media_type='Tape'
order by modified desc