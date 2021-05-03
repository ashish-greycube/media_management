select name as "Media ID:Link/Media:100",
media_sub_type as `Sub Type`,
media_owner as "Media Owner:Data:120",
external_id as `External ID::100`,
film_title as `Film Title`,
film_element as `Film Element::110`,
film_sound as `Film Sound::100`,
film_colour as `Film Colour::100`,
film_length as `Film Length (ft)::125`,
film_year as  `Film Year::95`,
is_checkerboard as `Is Checkerboard:Check:130`
from `tabMedia`
where media_type='Film'
order by modified desc