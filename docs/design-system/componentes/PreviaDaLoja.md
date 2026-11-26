# PreviaDaLoja

Prévia da tela da loja numa moldura, que entra por cima da borda do hero e sobe ao rolar, como a do clinia. Fica em [`src/components/entrada/PreviaDaLoja.tsx`](../../../src/components/entrada/PreviaDaLoja.tsx).

**Quando usar:** logo depois do hero da página do associado, para ele ver o que tem lá dentro antes de entrar. Não recebe props.

**Como fica:**

- **No celular,** moldura de telefone (`border-8 border-gray-950`, cantos de 36 px), com os relatórios e as fotos de antes.
- **A partir de 640 px,** moldura de navegador (`rounded-2xl` e borda `gray-200`), com tudo: relatórios, estudo de mercado e fotos de antes e de depois.
- A classe `subir-ao-rolar` faz a moldura subir 64 px e crescer de 96% até o tamanho real, sem mudar a opacidade.

**Conteúdo:** a prévia mostra a estrutura de verdade da tela da loja, com os nomes das seções e dos tipos de arquivo. O que seria dado da loja vira barra cinza ou bloco com ícone, com as [miniaturas](SecoesDaPagina.md#miniaturasdaloja). Nada de nome, data ou foto inventados; o teste confere que não há data nem número no texto.

Para o leitor de tela, é uma imagem (`role="img"`) com a descrição: "Prévia da tela da loja, com o botão de enviar fotos e vídeos, os relatórios, o estudo de mercado e as fotos de antes e depois."
