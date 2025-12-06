import { Decoder } from './decode.mjs';

export class DOMController {
  private decoder: Decoder;
  constructor(decoder: Decoder) {
    this.decoder = decoder;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const decodeButton = document.getElementById('decodeButton');
    if (decodeButton) {
      decodeButton.addEventListener('click', () => this.handleDecode());
    }
  }

  private handleDecode() {
    const inputElement = document.getElementById(
      'theMODCAT',
    ) as HTMLInputElement;
    if (!inputElement) return;
    const modcat = inputElement.value;
    this.decoder.decode(modcat);
    this.updateDOMFields();
  }

  private updateDOMFields() {
    const fields = this.decoder.getFields();
    for (const [fieldId, value] of Object.entries(fields)) {
      const element = document.getElementById(`${fieldId}Field`);
      if (element) {
        element.innerHTML = value;
      }
    }
  }
}

if (typeof document !== 'undefined') {
  const decoder = new Decoder();
  new DOMController(decoder);
}
