import { obterDependencias } from "@/lib/arquivos/dependencias";
import { criarGetDoZip } from "@/lib/arquivos/rota-do-zip";

// Baixar tudo em .zip, da loja inteira ou de uma seção (?secao=depois).
// O zip sai em streaming; a função pode demorar com vídeos grandes.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export const GET = criarGetDoZip(obterDependencias);
