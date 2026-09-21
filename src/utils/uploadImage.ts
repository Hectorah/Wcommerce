// Sube un archivo (imagen/video) al servidor de desarrollo y devuelve su URL pública.
// En producción (Vercel) el endpoint /api/upload NO existe; solo usar con import.meta.env.DEV.
export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, data: dataUrl }),
  });

  if (!response.ok) throw new Error('Upload failed');
  const { url } = await response.json();
  return url;
}