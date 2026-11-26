"use client";

import { useState } from "react";

import { avisar } from "@/components/ui/Avisos";
import { Button } from "@/components/ui/Button";
import { DialogoConfirmacao } from "@/components/ui/DialogoConfirmacao";

/** Botões que mostram os avisos flutuantes. */
export function BotoesDeAviso() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() => avisar("12 fotos enviadas para a equipe.")}
      >
        Mostrar aviso de sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          avisar(
            "Uma foto passou de 50 MB e ficou de fora. Envie uma menor.",
            "atencao",
          )
        }
      >
        Mostrar aviso de atenção
      </Button>
    </div>
  );
}

/** Abre a confirmação de uma ação que não dá para desfazer. */
export function ExemploDeDialogo() {
  const [aberto, setAberto] = useState(false);
  const fechar = () => setAberto(false);

  return (
    <>
      <Button variant="danger" onClick={() => setAberto(true)}>
        Excluir arquivo
      </Button>
      <DialogoConfirmacao
        aberto={aberto}
        aoFechar={fechar}
        titulo="Excluir o arquivo Medicamentos 1.jpeg?"
        descricao="O arquivo sai da pasta da loja no SharePoint. Não dá para desfazer."
      >
        <Button variant="secondary" onClick={fechar}>
          Manter arquivo
        </Button>
        <Button
          variant="danger-solid"
          onClick={() => {
            fechar();
            avisar("Arquivo excluído.");
          }}
        >
          Excluir arquivo
        </Button>
      </DialogoConfirmacao>
    </>
  );
}
