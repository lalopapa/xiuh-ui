export async function copyText(text: string): Promise<boolean> {
  // Copia al portapapeles; fuera de https (o en navegadores viejos) usa un textarea temporal
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = Object.assign(document.createElement('textarea'), { value: text });
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}
