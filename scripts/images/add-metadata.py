"""Writes SEO/ownership metadata (EXIF, IPTC and XMP) into the guide images.

Run from the repository root after rendering the images:
    python3 scripts/images/add-metadata.py
Needs pyexiv2 (pip install pyexiv2). Each entry: file -> title, description, keywords.
"""
import pathlib
import pyexiv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
SITE = 'https://alterphaseroofing.com'
BRAND = 'Alter Phase Roofing Contracting'
COPY = '© 2026 Alter Phase Roofing Contracting. All rights reserved.'
# Each guide: image folder, page URL, base keywords and images
# (file -> title, description, extra keywords).
LEAK = {
    'roof-leak-repair-nyc-flashing-repair.jpg': (
        'Roof leak repair in NYC: sealing roof flashing',
        'An Alter Phase Roofing Contracting roofer sealing new flashing on a flat roof to stop a roof leak in New York City.',
        ['flashing repair', 'flat roof leak repair', 'roofer at work'],
    ),
    'roof-leak-repair-cost-nyc-price-chart.jpg': (
        'Roof leak repair cost in NYC (2026) price chart',
        'Chart of 2026 roof leak repair prices in NYC: pipe boot $150-$400, small leak patch $300-$650, shingle repair $350-$800, flashing $450-$900, flat roof leak $400-$1,200, skylight $500-$1,200, valley $400-$1,500, storm damage $1,500-$3,500. Average prices from hundreds of Alter Phase Roofing Contracting jobs.',
        ['roof repair prices', 'cost to fix a leaking roof', '2026 prices', 'infographic'],
    ),
    'where-roofs-leak-diagram-repair-costs.jpg': (
        'Where roofs leak: 7 leak points and repair costs',
        'Diagram of the 7 places NYC roofs leak, with repair costs: chimney flashing, pipe boot, valley, skylight, missing shingles, flat roof seams and gutters/drip edge.',
        ['where roofs leak', 'leak sources', 'chimney leak', 'skylight leak', 'diagram'],
    ),
    'roof-leaking-what-to-do-first.jpg': (
        'Roof leaking right now? 5 things to do first',
        'Checklist for a leaking roof: catch the water, stay away from wet electrics, relieve a bulging ceiling, take photos for insurance, stay off the roof and call a roofer.',
        ['what to do if your roof is leaking', 'emergency roof leak', 'checklist'],
    ),
    'roof-leak-repair-or-replace-guide.jpg': (
        'Roof leak: repair or replace the roof?',
        'Guide to deciding whether to repair a leaking roof or replace it, based on roof age, number of leaks, shingle condition and the roof deck.',
        ['repair or replace roof', 'roof replacement', 'infographic'],
    ),
}

REPLACE = {
    'roof-replacement-cost-nyc-by-roof-size.jpg': (
        'Roof replacement cost in NYC by roof size (2026)',
        'Roof replacement cost in NYC by roof size, 2026: 1,000 sq ft asphalt shingle roof $3,000-$10,000 and flat roof $5,000-$14,000; 1,500 sq ft $4,500-$15,000 and $7,500-$21,000; 2,000 sq ft $6,000-$20,000 and $10,000-$28,000; 3,000 sq ft $9,000-$30,000 and $15,000-$42,000. Average prices from Alter Phase Roofing Contracting jobs.',
        ['roof replacement cost by size', '2,000 sq ft roof cost', 'new roof cost', 'infographic'],
    ),
    'roof-replacement-cost-per-square-foot-by-material.jpg': (
        'Roof replacement cost per square foot by material, NYC 2026',
        'Installed roof replacement cost per square foot in NYC, 2026: asphalt shingles $3-$10, EPDM $5-$12, modified bitumen $9-$13, TPO $9-$14, PVC $10-$16, metal $12-$18, tile $15-$25, slate $20-$40, with lifespans.',
        ['roof cost per square foot', 'roofing materials cost', 'shingle roof cost', 'flat roof cost', 'infographic'],
    ),
    'flat-roof-replacement-cost-by-nyc-borough.jpg': (
        'Flat roof replacement cost by NYC borough (2026)',
        'Typical cost to replace a 1,000 sq ft flat roof in 2026: Manhattan $8,000-$22,000+, Brooklyn $6,500-$17,000, Queens $5,500-$15,000, Bronx $6,000-$16,000, Staten Island $5,000-$13,000.',
        ['flat roof replacement cost', 'Manhattan roof cost', 'Brooklyn roof cost', 'Queens roof cost', 'Bronx roof cost', 'infographic'],
    ),
}

TOWNHOUSE = {
    'townhouse-roof-replacement-cost-brooklyn.jpg': (
        'Townhouse roof replacement cost in Brooklyn (2026)',
        'Townhouse roof replacement cost in Brooklyn, 2026: 600 sq ft row house roof $3,900-$10,200, 800 sq ft $5,200-$13,600, 1,000 sq ft brownstone $6,500-$17,000, 1,200 sq ft $7,800-$20,400. Most townhouse roof repairs $400-$1,200. Average prices from hundreds of Alter Phase Roofing Contracting jobs.',
        ['townhouse roof replacement cost', 'brownstone roof replacement', 'row house roof cost', 'infographic'],
    ),
    'townhouse-roof-anatomy-brooklyn-row-house.jpg': (
        'Anatomy of a Brooklyn townhouse roof',
        'Diagram of a Brooklyn townhouse flat roof: parapet wall and coping, base and counter flashing, party-wall flashing, roof membrane, tapered insulation, roof deck, roof hatch or skylight, and drain.',
        ['townhouse roof', 'row house roof', 'brownstone roof', 'flat roof parts', 'diagram'],
    ),
}

GUIDES = [
    ('public/images/guides/roof-leak-repair-cost', '/cost-to-repair-roof-leak/',
     ['roof leak repair', 'roof leak repair cost', 'NYC roofing', 'Staten Island roofer', BRAND], LEAK),
    ('public/images/guides/roof-replacement-cost-nyc', '/roof-replacement-guide-nyc/',
     ['roof replacement cost NYC', 'roof replacement NYC', 'new roof cost', 'NYC roofing', BRAND], REPLACE),
    ('public/images/guides/brooklyn-townhouse-roof', '/service-area/brooklyn-ny/townhouse-roof-replacement/',
     ['townhouse roof replacement', 'townhouse roof repair Brooklyn', 'Brooklyn roofer', BRAND], TOWNHOUSE),
]

for folder, page, base_kw, images in GUIDES:
  PAGE = SITE + page
  city = 'Brooklyn' if 'brooklyn' in folder else 'Staten Island'
  for name, (title, desc, kw) in images.items():
    path = ROOT / folder / name
    keywords = base_kw + kw
    with pyexiv2.Image(str(path)) as img:
        img.modify_exif({
            'Exif.Image.ImageDescription': desc,
            'Exif.Image.Artist': BRAND,
            'Exif.Image.Copyright': COPY,
            'Exif.Image.Software': 'alterphaseroofing.com',
        })
        img.modify_iptc({
            'Iptc.Application2.ObjectName': title[:64],
            'Iptc.Application2.Headline': title,
            'Iptc.Application2.Caption': desc,
            'Iptc.Application2.Keywords': keywords,
            'Iptc.Application2.Byline': BRAND,
            'Iptc.Application2.Credit': BRAND,
            'Iptc.Application2.Source': SITE,
            'Iptc.Application2.Copyright': COPY,
            'Iptc.Application2.City': city,
            'Iptc.Application2.ProvinceState': 'NY',
            'Iptc.Application2.CountryName': 'United States',
        })
        img.modify_xmp({
            'Xmp.dc.title': {'lang="x-default"': title},
            'Xmp.dc.description': {'lang="x-default"': desc},
            'Xmp.dc.subject': keywords,
            'Xmp.dc.creator': [BRAND],
            'Xmp.dc.rights': {'lang="x-default"': COPY},
            'Xmp.photoshop.Headline': title,
            'Xmp.photoshop.Credit': BRAND,
            'Xmp.photoshop.City': city,
            'Xmp.photoshop.State': 'NY',
            'Xmp.photoshop.Country': 'United States',
            'Xmp.xmpRights.Marked': 'True',
            'Xmp.xmpRights.WebStatement': PAGE,
        })
    w, h = Image.open(path).size
    print(f'{name}: {w}x{h}, {path.stat().st_size // 1024} KB, metadata written')
