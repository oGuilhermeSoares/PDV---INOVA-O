import type { TomDoAviso } from "@/components/ui/Aviso";
import type { MotivoCnpjInvalido } from "@/lib/cnpj";

/** O que as ações das telas de entrada devolvem para a tela. */
export type RespostaDaEntrada = {
  /** Erro do campo, mostrado ao lado dele. */
  erro?: string;
  /** Aviso na página, embaixo do campo. */
  aviso?: { tom: TomDoAviso; texto: string };
  /** O que a pessoa digitou (ou o CNPJ já formatado), para não se perder. */
  valor?: string;
};

// Textos das telas de entrada, no molde "o que aconteceu + o que fazer".
export const MENSAGENS = {
  cnpjVazio: "Digite o CNPJ de uma das suas lojas.",
  cnpjTamanho: "O CNPJ tem 14 caracteres. Confira e digite de novo.",
  cnpjCaractere: "O CNPJ só tem letras e números. Confira e digite de novo.",
  cnpjNaoConfere: "Este CNPJ não confere. Confira os números e digite de novo.",
  acessoNaoLiberado:
    "O acesso pelo portal ainda não foi liberado. Por enquanto, a equipe de PDV continua mandando os relatórios por e-mail.",
  codigoFormato: "O código tem 6 números. Confira o e-mail e digite de novo.",
  codigoErrado: "Código errado. Você ainda tem 4 tentativas.",
  codigoVencido: "Este código venceu. Peça um novo.",
  codigoBloqueado: "Você errou o código 5 vezes. Peça um novo código.",
  codigoReenviado: (email: string) => `Enviamos um novo código para ${email}.`,
  equipeNaoLigada: "A entrada da equipe ainda não foi ligada.",
  equipeSemAcesso:
    "Sua conta ainda não tem acesso ao portal. Peça a liberação a quem administra o portal.",
  equipeForaDoDominio:
    "Use a sua conta @farmaciasassociadas.com.br. Contas pessoais não entram.",
} as const;

const MENSAGEM_DO_MOTIVO: Record<MotivoCnpjInvalido, string> = {
  vazio: MENSAGENS.cnpjVazio,
  tamanho: MENSAGENS.cnpjTamanho,
  caractere: MENSAGENS.cnpjCaractere,
  // Para quem digita, dígito errado e sequência repetida são o mesmo engano.
  digito: MENSAGENS.cnpjNaoConfere,
  repetido: MENSAGENS.cnpjNaoConfere,
};

export function mensagemDoCnpj(motivo: MotivoCnpjInvalido): string {
  return MENSAGEM_DO_MOTIVO[motivo];
}
