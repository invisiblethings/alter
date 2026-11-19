"""Writes SEO/ownership metadata (EXIF, IPTC and XMP) into the guide images.

Run from the repository root after rendering the images:
    python3 scripts/images/add-metadata.py
Needs pyexiv2 (pip install pyexiv2). Each entry: file -> title, description, keywords.
"""
import pathlib
import pyexiv2
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
DIR = ROOT / 'public/images/guides/roof-leak-repair-cost'
SITE = 'https://alterphaseroofing.com'
PAGE = SITE + '/cost-to-repair-roof-leak/'
BRAND = 'Alter Phase Roofing Contracting'
COPY = '© 2026 Alter Phase Roofing Contracting. All rights reserved.'
BASE_KW = ['roof leak repair', 'roof leak repair cost', 'NYC roofing', 'Staten Island roofer', BRAND]

IMAGES = {
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

for name, (title, desc, kw) in IMAGES.items():
    path = DIR / name
    keywords = BASE_KW + kw
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
            'Iptc.Application2.City': 'Staten Island',
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
            'Xmp.photoshop.City': 'Staten Island',
            'Xmp.photoshop.State': 'NY',
            'Xmp.photoshop.Country': 'United States',
            'Xmp.xmpRights.Marked': 'True',
            'Xmp.xmpRights.WebStatement': PAGE,
        })
    w, h = Image.open(path).size
    print(f'{name}: {w}x{h}, {path.stat().st_size // 1024} KB, metadata written')
