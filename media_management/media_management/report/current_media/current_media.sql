select media.name as "Media:Link/Media:110",
media.media_type as "Type::100",
media.media_sub_type as "Sub Type::150",
media.media_owner as "Owner::200",
media.external_id as "External ID::90"
from `tabMedia` media
where media.name NOT IN
( select media_id from
`tabFilm Return Item` as media_item
where media_item.docstatus =1
UNION
select media_id from
`tabTape Return Item` as media_item
where media_item.docstatus =1
UNION
select media_id from
`tabDrive Return Item` as media_item
where media_item.docstatus =1
)
order by modified desc
