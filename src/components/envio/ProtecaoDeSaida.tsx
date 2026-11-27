import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { DialogoConfirmacao } from "@/components/ui/DialogoConfirmacao";

/**
 * Enquanto o envio roda, segura a saída da página. Fechar ou recarregar a aba
 * dispara o aviso do navegador (`beforeunload`). Um clique em qualquer link
 * da página abre a confirmação. O clique é pego em captura no `document`,
 * antes do roteador do Next.
 *
 * O botão de voltar do celular não passa por aqui: o roteador do Next não
 * avisa antes de trocar de página.
 */
export function ProtecaoDeSaida({
  ativa,
  aoSair,
}: {
  ativa: boolean;
  aoSair: () => void;
}) {
  const [destino, setDestino] = useState<string | null>(null);
  const saindo = useRef(false);

  useEffect(() => {
    if (!ativa) return;

    function antesDeSair(evento: BeforeUnloadEvent) {
      if (saindo.current) return;
      evento.preventDefault();
    }

    function aoClicar(evento: MouseEvent) {
      // Ctrl, Cmd, Shift ou o botão do meio abrem outra aba: o envio segue.
      if (
        evento.defaultPrevented ||
        evento.button !== 0 ||
        evento.metaKey ||
        evento.ctrlKey ||
        evento.shiftKey ||
        evento.altKey
      ) {
        return;
      }
      const alvo = evento.target instanceof Element ? evento.target : null;
      const link = alvo?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      evento.preventDefault();
      evento.stopPropagation();
      setDestino(link.href);
    }

    window.addEventListener("beforeunload", antesDeSair);
    document.addEventListener("click", aoClicar, true);
    return () => {
      window.removeEventListener("beforeunload", antesDeSair);
      document.removeEventListener("click", aoClicar, true);
    };
  }, [ativa]);

  return (
    <DialogoConfirmacao
      aberto={ativa && destino !== null}
      aoFechar={() => setDestino(null)}
      titulo="Sair antes de terminar o envio?"
      descricao="Os arquivos que ainda não foram enviados ficam de fora. Os que já foram continuam na pasta da loja."
    >
      <Button variant="secondary" onClick={() => setDestino(null)}>
        Continuar enviando
      </Button>
      <Button
        variant="danger-solid"
        onClick={() => {
          if (!destino) return;
          saindo.current = true;
          aoSair();
          window.location.assign(destino);
        }}
      >
        Sair e parar o envio
      </Button>
    </DialogoConfirmacao>
  );
}
