select media_return.name as "ID:Link/Media Return:120",
'Return' as "Type:Data:60", 
media_return.transfer_date as `Date::100`,
media_return.transfer_method as "Method:Link/Transfer Method:100",
media_return.sender as "Sender:Link/Contact:180",
media_return.recipient as "Recipient:Link/Contact:180",
media_return.customer as "Customer:Link/Customer:180",
media_return.project as "Project:Link/Project:180",
count( distinct film_return.name) as "F#:Int:40",
count(distinct tape_return.name) as "T#:Int:40",
count(distinct drive_return.name) as "D#:Int:40"
from `tabMedia Return` as media_return
left outer join `tabFilm Return Item` as film_return
on media_return.name=film_return.parent
left outer join `tabTape Return Item` as tape_return
on media_return.name=tape_return.parent
left outer join `tabDrive Return Item` as drive_return
on media_return.name=drive_return.parent
group by media_return.name
union
select media_receipt.name as "ID:Link/Media Receipt:120",
'Receipt' as "Type::60",
media_receipt.transfer_date as `Date::100`,
media_receipt.transfer_method as "Method:Link/Transfer Method:100",
media_receipt.sender as "Sender:Link/Contact:180",
media_receipt.recipient as "Recipient:Link/Contact:180",
media_receipt.customer as "Customer:Link/Customer:180",
media_receipt.project as "Project:Link/Project:180",
count( distinct film_receipt.name) as "F#:Int:40",
count(distinct tape_receipt.name) as "T#:Int:40",
count(distinct drive_receipt.name) as "D#:Int:40"
from `tabMedia Receipt` as media_receipt
left outer join `tabFilm Entry Item` as film_receipt
on media_receipt.name=film_receipt.parent
left outer join `tabTape Entry Item` as tape_receipt
on media_receipt.name=tape_receipt.parent
left outer join `tabDrive Entry Item` as drive_receipt
on media_receipt.name=drive_receipt.parent
group by media_receipt.name
order by `Date::100` desc