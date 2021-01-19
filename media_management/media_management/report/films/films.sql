select name as "ID:Link/Media:150",
media_type as Type,
media_sub_type as `Sub Type`,
media_owner as "Owner:Data:100",
external_id as `Ext ID::60`,
film_title as `Title`,
film_element as `Film Element::100`,
film_sound as `Film Sound::100`,
film_colour as `Film Colour::100`,
film_era as  `Film Year::80`,
film_approximate_length_feet as `Film Length::100`,
is_checkerboard as `Is Checkerboard:Check:130`,
content_description as 'Content::100',
notes as 'Notes::100'
from `tabMedia`
where media_type='Film'
order by modified desc