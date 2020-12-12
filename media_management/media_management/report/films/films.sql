select name as "ID:Link/Media:150",
media_type as Type,
media_sub_type as `Sub Type`,
media_owner as Owner,
external_id as `Ext ID`,
film_title as `Title`,
film_element as `Film Element`,
film_sound as `Film Sound`,
film_colour as `Film Colour`,
film_era as `Film Era`,
film_approximate_length_feet as `Film Length`,
is_checkerboard as `Is Checkerboard:Check:30`,
content_description as Content,
notes as Notes
from `tabMedia`
where media_type='Film'
order by modified desc