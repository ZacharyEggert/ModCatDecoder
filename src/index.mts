import { decodeMODCAT } from './decode.mjs';

if (typeof document !== 'undefined') {
  document.getElementById('decodeButton')?.addEventListener('click', () => {
    const inputElement = document.getElementById(
      'theMODCAT',
    ) as HTMLInputElement;
    if (!inputElement) return;
    decodeMODCAT(inputElement.value);
  });
}
