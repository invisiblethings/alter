// Markup for the NYC roof cost calculator (script lives in CostCalculator.astro).
export const calculatorHtml = `
<div class="calc" data-calc>
  <form onsubmit="return false">
    <div class="field">
      <label for="calc-material">Roofing material</label>
      <select id="calc-material" required>
        <option value="" disabled selected>Choose a material</option>
        <option value="5,10">Asphalt Shingles ($5 – $10 per sq ft)</option>
        <option value="6,12">EPDM (Rubber Roofing) ($6 – $12 per sq ft)</option>
        <option value="10,18">Metal Roofing ($10 – $18 per sq ft)</option>
        <option value="20,40">Slate Roofing ($20 – $40 per sq ft)</option>
        <option value="7,14">TPO (Thermoplastic Olefin) ($7 – $14 per sq ft)</option>
      </select>
    </div>
    <div class="field">
      <label for="calc-area">Roof area (square feet)</label>
      <input id="calc-area" type="number" min="50" step="10" inputmode="numeric" placeholder="e.g. 1,200" required />
    </div>
    <button class="btn btn-block" type="submit">Calculate my estimated cost</button>
  </form>
  <div class="calc-result" role="status" aria-live="polite" hidden></div>
</div>`;
