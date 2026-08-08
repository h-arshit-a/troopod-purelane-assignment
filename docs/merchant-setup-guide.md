# Merchant Setup Guide: Purelane Development Store Data

This guide details the exact product data, collections, tags, and metafields required in the Shopify Development Store to populate the Purelane homepage sections dynamically.

---

### 1. Required Products (At Least 8 Products)

Create the following 8 products under **Products** in your Shopify Admin:

| Product Title | Category Tag | Price | Compare At Price | Image | Inventory / Availability | Special Edge Case Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Purelane Foaming Tap Cleaner & Limescale Remover** | `Kitchen`, `Bathroom` | ₹200.00 | ₹299.00 | `tap-cleaner.png` | In Stock (50) | Best Seller Tag |
| **Purelane Foaming Kitchen Cleaner & Degreaser** | `Kitchen` | ₹200.00 | ₹299.00 | `kitchen-cleaner.png` | In Stock (100) | Best Seller Tag |
| **Purelane Copper, Bronze & Brass Cleaner** | `Kitchen` | ₹250.00 | ₹349.00 | `metal-cleaner.png` | In Stock (25) | Top Rated Tag |
| **Purelane Washing Machine Cleaner & Descaler (Concentrated Formula for Front & Top Loaders)** | `Laundry` | ₹299.00 | ₹399.00 | `wm-cleaner.png` | In Stock (40) | **Long Title Edge Case Test** |
| **Purelane Natural Toilet Bowl Cleaner Gel** | `Bathroom` | ₹180.00 | ₹249.00 | `toilet-cleaner.png` | **Sold Out (0)** | **Sold Out Edge Case Test** |
| **Purelane Ultra-Gentle Plant Dishwash Gel** | `Kitchen` | ₹220.00 | ₹299.00 | *No Image* | In Stock (80) | **Missing Image Edge Case Test** |
| **Purelane Natural Laundry Detergent Liquid** | `Laundry` | ₹350.00 | ₹450.00 | `laundry-liquid.png` | In Stock (60) | Top Rated Tag |
| **Purelane Botanical Handwash Gel** | `Bathroom` | ₹190.00 | ₹250.00 | `handwash-gel.png` | In Stock (90) | New Tag |

---

### 2. Standard Product Rating Metafield

Purelane uses Shopify's standard Product Rating metafield definition:

- **Namespace & Key**: `reviews.rating`
- **Type**: `Rating` (Scale 1.0 to 5.0)
- **Values**:
  - Rating: `4.8`
  - Scale Max: `5.0`
- **Count Metafield**: `reviews.rating_count` (Integer, e.g. `237`)

---

### 3. Required Collections

Create the following collections under **Products > Collections** and set collection rules or assign products accordingly:

1. **Kitchen Essentials**: Contains Kitchen cleaner, Dishwash gel, Tap cleaner.
2. **Bathroom & Hard Water**: Contains Toilet cleaner, Tap cleaner, Handwash.
3. **Laundry Care**: Contains Laundry liquid, Washing machine cleaner.
4. **Floor & Surfaces**: Contains Floor cleaner, Multi-surface spray.
5. **All Purelane Products**: Main homepage shop collection.
