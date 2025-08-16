# 360° House Structure Report

## Actual Folder Structure (from filesystem scan)

Based on the scan of `public/assets/*/360` folders:

### Houses with 360° Tours

1. **Walnut** (4 rooms)
   - entry
   - guest  
   - bathroom
   - bedroom

2. **Laurel** (6 rooms) - LARGEST
   - bathroom
   - bathroom2
   - bedroom
   - bedroom2
   - kitchen
   - living

3. **Tamarack** (4 rooms)
   - bathroom
   - bedroom
   - kitchen
   - living

4. **Ponderosa** (4 rooms)
   - bathroom
   - bedroom
   - kitchen
   - living

5. **Oak** (6 rooms)
   - bathroom
   - bedroom
   - entry
   - full view to entry
   - kitchen
   - living

6. **Juniper** (3 rooms)
   - bathroom
   - bedroom
   - great room

7. **Birch** (5 rooms)
   - bathroom
   - bedroom
   - great room
   - hallaway
   - kitchen

8. **Cypress** (4 rooms)
   - bathroom
   - bedroom
   - kitchen
   - living

9. **Hemlock** (3 rooms) - SMALLEST
   - bathroom
   - bedroom
   - kitchen

10. **Spruce** (4 rooms)
    - bathroom
    - bedroom
    - kitchen
    - living

11. **Sage** (4 rooms)
    - bathroom
    - bedroom
    - kitchen
    - living

12. **Sapling** (4 rooms)
    - badroom (needs to be renamed to bedroom)
    - bathroom
    - entry
    - kitchen

### Houses without 360° Tours
- Pine (no 360 folder found)

## JSON Structure Status

### ✅ Correct Structure
- Walnut - correct rooms: entry, guest, bathroom, bedroom
- Laurel - correct rooms: bathroom, bathroom2, bedroom, bedroom2, kitchen, living
- Oak - correct rooms: bathroom, bedroom, entry, full view to entry, kitchen, living

### ⚠️ Needs Update
- Birch - currently has standard rooms, needs: bathroom, bedroom, great room, hallaway, kitchen
- Hemlock - needs to have only 3 rooms: bathroom, bedroom, kitchen
- Juniper - needs: bathroom, bedroom, great room
- Sapling - has "badroom" in folders (typo)

### ✓ Recently Fixed
- Pine - changed tour360Rooms to tour360
- Tamarack, Ponderosa - fixed room order to match actual folders

## Special Cases

1. **Room Name Variations**:
   - "great room" (with space) - Juniper, Birch
   - "full view to entry" - Oak
   - "bathroom2", "bedroom2" - Laurel
   - "hallaway" - Birch (probably meant to be "hallway")
   - "badroom" - Sapling (typo for "bedroom")

2. **House Size Range**:
   - Smallest: Hemlock (3 rooms)
   - Largest: Laurel, Oak (6 rooms)
   - Most common: 4 rooms

## Recommendations

1. Fix folder name "badroom" → "bedroom" in Sapling
2. Fix "hallaway" → "hallway" in Birch (or keep as is if intentional)
3. Update JSON for all houses that don't match actual folder structure
4. Ensure PanoramaViewerRedux.tsx handles all room name variations correctly
