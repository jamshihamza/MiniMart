# Reporting visual review package (review-ready, NOT approved)
Source: docs/design/reports/source/MiniMartReports.dc.html (80 screens) + 6 grouped pages + index.
Open grouped pages via a local static server; all renders: docs/design/reports/renders/ (gitignored), also D:/mm-rpt2-render-<WxH>.
Review order: index.png -> 01 home -> 11 viewer -> 29..31 sales -> 39/45 cash & inventory -> 58/61/64/67 management/export -> 77-long, 78 decisions, 80 docs.
Send back to Claude Design: (1) fix 4 decision chips (DEC-RET-002, DEC-PAY-001, DEC-PUR-001 = PROPOSED; DEC-CUS-002 = VERIFY); (2) restore lang="en"; (3) sidebar footer note contrast 3.15:1 -> 4.5:1; (4) fix dangling "Back Office index" link; (5) optional: export dialog as overlay with focus-trap note.
No owner visual approval implied. MM-007 PENDING, DEC-HW-001 OPEN.
