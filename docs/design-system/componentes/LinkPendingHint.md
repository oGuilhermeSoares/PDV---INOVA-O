# LinkPendingHint

Ponto que pulsa dentro de um `<Link>` do Next enquanto a navegação não termina. Fica em [`src/components/ui/LinkPendingHint.tsx`](../../../src/components/ui/LinkPendingHint.tsx).

**Quando usar:** em links de menu e de lista que levam a telas que demoram a carregar. Coloque-o como último filho do `<Link>`.

**O que você passa:** só `className`.

Ele lê `useLinkStatus()` do `next/link` e ocupa sempre 8 px, para o texto não pular. O ponto, em `primary-strong`, só aparece depois de 100 ms, para não piscar quando a tela chega rápido. As regras ficam em `.link-hint`, no `globals.css`. Com `prefers-reduced-motion`, ele aparece sem pulsar.
