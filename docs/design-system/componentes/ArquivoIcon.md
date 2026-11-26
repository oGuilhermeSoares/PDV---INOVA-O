# ArquivoIcon

Ícone do tipo de arquivo: PDF, planilha, foto, vídeo ou outro. Fica em [`src/components/ui/ArquivoIcon.tsx`](../../../src/components/ui/ArquivoIcon.tsx).

**Quando usar:** nas listas de relatórios, estudos, fotos e vídeos da loja. É decorativo: escreva o nome ou o tipo do arquivo ao lado.

**O que você passa:** `tipo` e as props do Lucide, como o `className`. O tamanho é 16 px em linha e 20 px em destaque.

O componente também exporta:

- `tipoDoArquivo(nome)`, que acha o tipo pela extensão, sem diferenciar maiúsculas:
  - `pdf`: pdf;
  - `planilha`: xlsx, xls, csv e ods;
  - `imagem`: jpg, jpeg, png, heic, heif, webp e gif;
  - `video`: mp4, mov, m4v, webm, avi e 3gp;
  - `outro`: o resto;
- `ROTULO_DO_TIPO`, o nome do tipo para a tela: PDF, Planilha, Foto, Vídeo e Arquivo.

```tsx
const tipo = tipoDoArquivo("BRICK 2004 - PRODUTOS JUMAUTI - MAT04_2026.xlsx");
const icone = (
  <ArquivoIcon tipo={tipo} className="text-primary-strong size-5" />
);
```
