#!/usr/bin/env python3
"""One-time SanMar -> Supabase sync.

Reads credentials from environment variables (so nothing is committed).
Intended to run from GitHub Actions (see .github/workflows/sanmar-sync.yml).

Required env vars:
  SANMAR_SFTP_HOST       (default: ftp.sanmar.com)
  SANMAR_SFTP_PORT       (default: 2200)
  SANMAR_SFTP_USER
  SANMAR_SFTP_PASSWORD
  SANMAR_REMOTE_PATH     (default: /SanMarPDD/SanMar_EPDD.csv)
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
"""
import csv
import io
import os
import sys
import time
import paramiko
import requests

SFTP_HOST = os.environ.get("SANMAR_SFTP_HOST", "ftp.sanmar.com")
SFTP_PORT = int(os.environ.get("SANMAR_SFTP_PORT", "2200"))
SFTP_USER = os.environ["SANMAR_SFTP_USER"]
SFTP_PASS = os.environ["SANMAR_SFTP_PASSWORD"]
REMOTE_PATH = os.environ.get("SANMAR_REMOTE_PATH", "/SanMarPDD/SanMar_EPDD.csv")
SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

# Curated allowlist - matches lib/catalog/curated.ts (uppercased, flattened).
CURATED_STYLES = {
    # tshirts
    "PC61", "PC55", "PC54", "DT6000", "BC3001", "NL6210", "ST350", "ST450",
    # hoodies-sweatshirts
    "PC78H", "PC90H", "PC850H", "F281", "ST254", "DT6100", "F497", "PC850ZH",
    # polos
    "K500", "K540", "K510", "K100", "ST640", "ST650",
    # jerseys-uniforms
    "ST380", "T474", "ST700", "ST710",
    # hats
    "C112", "C932", "C104", "NE1000", "CP80", "C938",
    # jackets-outerwear
    "J317", "J754", "J305", "ST236", "JST72", "J342",
    # bottoms
    "ST855", "PT38", "ST800", "ST310",
    # bags-accessories
    "BG107", "BG204", "BG980", "BG408",
}

VALID_STATUSES = {"Active", "New", "Coming Soon", "Regular", "Discontinued"}


def normalize_status(raw):
    s = (raw or "").strip()
    return s if s in VALID_STATUSES else "Regular"


def first_nonempty(*vals):
    for v in vals:
        t = (v or "").strip()
        if t:
            return t
    return None


def clean(v):
    return (v or "").strip()


# ---------- Step 1: SFTP download ----------
print(f"[1/4] Connecting to {SFTP_HOST}:{SFTP_PORT}...", flush=True)
t0 = time.time()
transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)
print(f"    connected in {time.time()-t0:.1f}s", flush=True)

print(f"[2/4] Downloading {REMOTE_PATH}...", flush=True)
t0 = time.time()
with sftp.open(REMOTE_PATH, "rb") as rf:
    rf.prefetch()
    raw = rf.read()
sftp.close()
transport.close()
print(f"    {len(raw)/1024/1024:.1f} MB in {time.time()-t0:.1f}s", flush=True)

# ---------- Step 2: Parse CSV ----------
print("[3/4] Parsing CSV and filtering to curated styles...", flush=True)
t0 = time.time()
try:
    text = raw.decode("utf-8")
except UnicodeDecodeError:
    text = raw.decode("latin-1")

reader = csv.DictReader(io.StringIO(text))
header_sample = reader.fieldnames
print(f"    header cols: {len(header_sample)} - first 6: {header_sample[:6]}", flush=True)

style_col = None
for cand in ("STYLE#", "STYLE_NO", "STYLE_NUMBER", "STYLE", "style#"):
    if cand in header_sample:
        style_col = cand
        break
if not style_col:
    print(f"!!! Could not find a style-number column. Headers were: {header_sample}", flush=True)
    sys.exit(1)
print(f"    style column: {style_col!r}", flush=True)

styles = {}
total_rows = 0
curated_rows = 0
for row in reader:
    total_rows += 1
    style = clean(row.get(style_col)).upper()
    if not style or style not in CURATED_STYLES:
        continue
    curated_rows += 1
    entry = styles.get(style)
    if entry is None:
        entry = {
            "style_number": style,
            "product_title": clean(row.get("PRODUCT_TITLE")),
            "brand_name": clean(row.get("MILL")),
            "product_description": clean(row.get("PRODUCT_DESCRIPTION")),
            "sanmar_category": clean(row.get("CATEGORY_NAME")).split(";")[0].strip(),
            "sanmar_subcategory": clean(row.get("SUBCATEGORY_NAME")),
            "status": normalize_status(row.get("PRODUCT_STATUS")),
            "available_sizes": clean(row.get("AVAILABLE_SIZES")),
            "front_model_url": first_nonempty(row.get("FRONT_MODEL_IMAGE_URL")),
            "back_model_url": first_nonempty(row.get("BACK_MODEL_IMAGE_URL")),
            "front_flat_url": first_nonempty(row.get("FRONT_FLAT_IMAGE_URL"), row.get("FRONT_FLAT _IMAGE_URL")),
            "back_flat_url": first_nonempty(row.get("BACK_FLAT_IMAGE_URL"), row.get("BACK_FLAT _IMAGE_URL")),
            "spec_sheet_url": first_nonempty(row.get("DECORATION_SPEC_SHEET")),
            "_colors": [],
            "_color_keys": set(),
            "_sizes": [],
            "_size_keys": set(),
        }
        styles[style] = entry

    catalog_color = clean(row.get("SANMAR_MAINFRAME_COLOR")) or clean(row.get("COLOR_NAME"))
    display_color = clean(row.get("COLOR_NAME"))
    if catalog_color and catalog_color not in entry["_color_keys"]:
        entry["_color_keys"].add(catalog_color)
        entry["_colors"].append({
            "catalog_color": catalog_color,
            "display_color": display_color or catalog_color,
            "swatch_image_url": first_nonempty(row.get("COLOR_SQUARE_IMAGE")),
            "color_product_url": first_nonempty(row.get("COLOR_PRODUCT_IMAGE")),
            "pms_color": first_nonempty(row.get("PMS_COLOR")),
            "sort_order": len(entry["_colors"]),
        })

    size = clean(row.get("SIZE"))
    if catalog_color and size:
        size_key = f"{catalog_color}::{size}"
        if size_key not in entry["_size_keys"]:
            entry["_size_keys"].add(size_key)
            entry["_sizes"].append({
                "catalog_color": catalog_color,
                "size": size,
                "size_index": first_nonempty(row.get("SIZE_INDEX")),
            })

print(f"    parsed {total_rows} rows in {time.time()-t0:.1f}s", flush=True)
print(f"    {len(styles)} of {len(CURATED_STYLES)} curated styles found ({curated_rows} rows hit)", flush=True)
missing = sorted(CURATED_STYLES - set(styles.keys()))
if missing:
    print(f"    missing from SanMar CSV: {missing}", flush=True)

# ---------- Step 3: Upsert into Supabase ----------
print("[4/4] Upserting into Supabase...", flush=True)
t0 = time.time()


def supa_request(method, path, body=None, params=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    resp = requests.request(method, url, headers=headers, json=body, params=params, timeout=60)
    if resp.status_code >= 300:
        raise RuntimeError(f"{method} {path} {resp.status_code}: {resp.text[:500]}")
    return resp


# Products
product_rows = []
for s in styles.values():
    product_rows.append({
        "style_number": s["style_number"],
        "product_title": s["product_title"],
        "brand_name": s["brand_name"],
        "product_description": s["product_description"],
        "sanmar_category": s["sanmar_category"],
        "sanmar_subcategory": s["sanmar_subcategory"],
        "status": s["status"],
        "available_sizes": s["available_sizes"],
        "front_model_url": s["front_model_url"],
        "back_model_url": s["back_model_url"],
        "front_flat_url": s["front_flat_url"],
        "back_flat_url": s["back_flat_url"],
        "spec_sheet_url": s["spec_sheet_url"],
    })
supa_request(
    "POST",
    "sanmar_products",
    body=product_rows,
    params={"on_conflict": "style_number"},
)
print(f"    upserted {len(product_rows)} products", flush=True)

# Colors: delete existing for these styles, then insert fresh
style_list = ",".join(f'"{s}"' for s in styles.keys())
supa_request("DELETE", "sanmar_product_colors", params={"style_number": f"in.({style_list})"})
color_rows = []
for s in styles.values():
    for c in s["_colors"]:
        color_rows.append({
            "style_number": s["style_number"],
            "catalog_color": c["catalog_color"],
            "display_color": c["display_color"],
            "swatch_image_url": c["swatch_image_url"],
            "color_product_url": c["color_product_url"],
            "pms_color": c["pms_color"],
            "sort_order": c["sort_order"],
        })
for i in range(0, len(color_rows), 500):
    supa_request("POST", "sanmar_product_colors", body=color_rows[i:i+500])
print(f"    inserted {len(color_rows)} color rows", flush=True)

# Sizes: delete existing, then insert fresh
supa_request("DELETE", "sanmar_product_sizes", params={"style_number": f"in.({style_list})"})
size_rows = []
for s in styles.values():
    for sz in s["_sizes"]:
        size_rows.append({
            "style_number": s["style_number"],
            "catalog_color": sz["catalog_color"],
            "size": sz["size"],
            "size_index": sz["size_index"],
        })
for i in range(0, len(size_rows), 1000):
    supa_request("POST", "sanmar_product_sizes", body=size_rows[i:i+1000])
print(f"    inserted {len(size_rows)} size rows", flush=True)

print(f"    done in {time.time()-t0:.1f}s", flush=True)
print("[OK] Sync complete.", flush=True)
