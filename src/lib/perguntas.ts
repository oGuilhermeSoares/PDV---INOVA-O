// Perguntas frequentes da página de entrada do associado. As respostas saem
// só do que está decidido na documentação do projeto (seções 6 e 10): mude
// aqui junto com a regra, nunca antes.

export const PERGUNTAS: readonly { pergunta: string; resposta: string }[] = [
  {
    pergunta: "Como eu entro no portal?",
    resposta:
      "Com o CNPJ de uma das suas lojas. Mandamos um código de 6 números para o e-mail cadastrado na Farmácias Associadas, e ele vale por 10 minutos. Não tem senha.",
  },
  {
    pergunta: "Não recebi o código. O que eu faço?",
    resposta:
      "Confira a caixa de spam e se o e-mail que aparece na tela é o seu. Depois de alguns segundos, dá para pedir outro código. Se o e-mail estiver errado, fale com a equipe de PDV.",
  },
  {
    pergunta: "Tenho mais de uma loja. Preciso entrar em cada uma?",
    resposta:
      "Não. Entrando com o CNPJ de qualquer uma delas, você vê todas as lojas do seu grupo.",
  },
  {
    pergunta: "Preciso entrar toda vez?",
    resposta:
      "Não. Depois de entrar, o portal lembra de você por 30 dias naquele aparelho. Para sair antes, toque em Sair.",
  },
  {
    pergunta: "Os arquivos abrem no celular?",
    resposta:
      "Sim. PDFs e vídeos abrem no navegador, e as planilhas são baixadas.",
  },
  {
    pergunta: "Como envio fotos e vídeos?",
    resposta:
      "Toque em Enviar fotos e vídeos. No celular, isso abre a galeria ou a câmera. Os arquivos vão direto para a pasta da loja, na qualidade original, e a equipe de PDV é avisada.",
  },
  {
    pergunta: "Quem vê o material da minha loja?",
    resposta:
      "Só você e a equipe de PDV. Cada associado vê apenas as próprias lojas.",
  },
];
