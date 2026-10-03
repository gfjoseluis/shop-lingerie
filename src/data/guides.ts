// Conocimiento de lencería (de la investigación de la tienda).
// Nombres cruceños primero; alias internacional entre paréntesis.

export interface GuideEntry {
  value: string;
  label: string;
  help: string;
}

export const CUP_TYPES: GuideEntry[] = [
  { value: "completa", label: "Copa completa", help: "Cubre casi todo el busto y reparte el peso. Ideal para bustos grandes o jornadas largas." },
  { value: "media", label: "Media copa", help: "Cubre la mitad con escote diagonal. Para bustos pequeños o promedio y escotes en V." },
  { value: "balconette", label: "Balconette", help: "Copas horizontales que levantan desde abajo. Soporte con escotes abiertos y forma redondeada." },
  { value: "push-up", label: "Push-up", help: "Relleno angular que junta y eleva. Para busto pequeño o mediano que busca escote prominente." },
  { value: "relleno", label: "Con relleno", help: "Espuma uniforme que da volumen y disimula asimetrías." },
  { value: "soft", label: "Soft / sin aro", help: "Sin aros ni relleno, máxima comodidad y estilo visible." },
];

export const BRA_STYLES: GuideEntry[] = [
  { value: "clasico", label: "Clásico", help: "Bralette tradicional de encaje o algodón." },
  { value: "corset", label: "Tipo corset", help: "Estructura entallada estilo corset." },
  { value: "deportivo", label: "Deportivo", help: "Alta sujeción en microfibra para actividad física." },
];

export const CUT_TYPES: GuideEntry[] = [
  { value: "clasica", label: "Clásica", help: "Cobertura tradicional a media cadera. Máxima comodidad diaria." },
  { value: "bikini", label: "Bikini", help: "Pierna alta y laterales estrechos. Para pantalones de tiro medio o bajo." },
  { value: "brasilena", label: "Brasileña", help: "Bikini adelante y V atrás que cubre parcial. Punto medio sensual." },
  { value: "tanga", label: "Tanga / hilo", help: "Cobertura trasera mínima. Cero marcas bajo ropa ajustada." },
  { value: "cachetero", label: "Cachetero (hipster)", help: "Abraza las caderas con cobertura moderada, tipo short corto." },
  { value: "tiro-alto", label: "Tiro alto", help: "Hasta el ombligo: sujeta el abdomen y da mayor cobertura." },
  { value: "culotte", label: "Culotte", help: "Alargada al muslo, evita el roce entre piernas." },
  { value: "sin-costuras", label: "Sin costuras", help: "Bordes láser invisibles bajo prendas ajustadas." },
  { value: "reductora", label: "Reductora", help: "Compresión graduada que moldea abdomen y glúteos." },
];

export const MATERIALS: GuideEntry[] = [
  { value: "algodon", label: "Algodón", help: "Respirable e hipoalergénico, ideal diario." },
  { value: "licra", label: "Licra", help: "Elástica, se adapta al cuerpo." },
  { value: "encaje", label: "Encaje", help: "Delicado y visible, con forro de algodón." },
  { value: "saten", label: "Satén", help: "Tacto suave y fresco, ideal clima cruceño." },
  { value: "seda", label: "Seda", help: "Elegante para ocasiones especiales." },
  { value: "microfibra", label: "Microfibra", help: "Alta sujeción, uso deportivo." },
  { value: "silicona", label: "Silicona", help: "Adhesiva, sin costuras." },
];

export const ADHESIVE_KINDS: GuideEntry[] = [
  { value: "silicona", label: "Bras de silicona", help: "Se adhiere con pegamento, sin tiros ni broches. Viene por copa A–D." },
  { value: "pezonera", label: "Pezoneras", help: "Cubren solo el pezón. Talla única." },
  { value: "cinta", label: "Cinta levanta-busto", help: "Cinta adhesiva que levanta y da forma. Se corta a medida." },
];

export function guideHelp(list: GuideEntry[], value: string | null | undefined): string | null {
  if (!value) return null;
  return list.find((g) => g.value === value)?.help ?? null;
}

export function guideLabel(list: GuideEntry[], value: string | null | undefined): string | null {
  if (!value) return null;
  return list.find((g) => g.value === value)?.label ?? value;
}

// Presets de tallas por tipo de prenda
export const SIZE_PRESETS: Record<string, string[]> = {
  superior: ["32B", "34B", "34C", "36B", "36C", "38B", "38C", "38D"],
  inferior: ["S", "M", "L", "XL", "XXL"],
  silicona: ["A", "B", "C", "D"],
  unico: ["Único"],
};

// Guía de tallas inferior (cintura / cadera en cm)
export const BOTTOM_SIZE_GUIDE = [
  { size: "S", cintura: "64–68", cadera: "90–94" },
  { size: "M", cintura: "69–74", cadera: "95–100" },
  { size: "L", cintura: "75–81", cadera: "101–106" },
  { size: "XL", cintura: "82–88", cadera: "107–112" },
  { size: "XXL", cintura: "89–95", cadera: "113–118" },
];

// Guía superior: banda (contorno bajo busto) + letra de copa
export const BAND_GUIDE = [
  { banda: "32", contorno: "68–72" },
  { banda: "34", contorno: "73–77" },
  { banda: "36", contorno: "78–82" },
  { banda: "38", contorno: "83–87" },
  { banda: "40", contorno: "88–92" },
  { banda: "42", contorno: "93–97" },
  { banda: "44+", contorno: "98 o más" },
];

export const CUP_LETTERS = [
  { letra: "A", para: "Busto reducido" },
  { letra: "B", para: "Pequeño a mediano (la más común)" },
  { letra: "C", para: "Mediano a grande" },
  { letra: "D / DD+", para: "Grande, soporte estructurado" },
];
