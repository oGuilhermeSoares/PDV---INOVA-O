import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

import { CampoCodigo } from "@/components/entrada/CampoCodigo";
import { SeloComVisto } from "@/components/entrada/SeloComVisto";
import { Logo } from "@/components/marca/Logo";
import {
  ArquivoIcon,
  ROTULO_DO_TIPO,
  tipoDoArquivo,
} from "@/components/ui/ArquivoIcon";
import { Aviso } from "@/components/ui/Aviso";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { LinkPendingHint } from "@/components/ui/LinkPendingHint";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Select } from "@/components/ui/Select";
import { StatusBadge, type GrupoStatus } from "@/components/ui/StatusBadge";
import { Stepper } from "@/components/ui/Stepper";
import { Table, TableCell, TableHead } from "@/components/ui/Table";
import { Textarea } from "@/components/ui/Textarea";
import { VoltarLink } from "@/components/ui/VoltarLink";
import { CORES } from "@/lib/cores";

import { BotoesDeAviso, ExemploDeDialogo } from "./interativos";

/** As seções do catálogo, na ordem da página e do menu. */
export const SECOES = [
  { id: "cores", titulo: "Cores" },
  { id: "tipografia", titulo: "Tipografia" },
  { id: "botoes", titulo: "Botões" },
  { id: "campos", titulo: "Campos" },
  { id: "avisos", titulo: "Avisos" },
  { id: "selos", titulo: "Selos e situação" },
  { id: "etapas", titulo: "Etapas" },
  { id: "tabela", titulo: "Tabela e arquivos" },
  { id: "superficies", titulo: "Superfícies" },
  { id: "dialogo", titulo: "Diálogo" },
  { id: "navegacao", titulo: "Navegação" },
  { id: "marca", titulo: "Marca e painel" },
] as const;

type IdDaSecao = (typeof SECOES)[number]["id"];

function Secao({
  id,
  descricao,
  children,
}: {
  id: IdDaSecao;
  descricao?: ReactNode;
  children: ReactNode;
}) {
  const titulo = SECOES.find((secao) => secao.id === id)?.titulo;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-6 border-t border-gray-200 pt-10"
    >
      <SectionTitle id={`${id}-titulo`} tamanho="secao">
        {titulo}
      </SectionTitle>
      {descricao && (
        <p className="text-corpo mt-2 max-w-[72ch] text-gray-600">
          {descricao}
        </p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function SecaoCores() {
  return (
    <Secao
      id="cores"
      descricao="Os tokens de src/lib/cores.ts. Nos componentes, use a classe (bg-primary, text-gray-600), nunca o hex."
    >
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(CORES).map(([nome, hex]) => (
          <li key={nome}>
            <span
              aria-hidden="true"
              className="block h-14 rounded-xl border border-gray-200"
              style={{ backgroundColor: hex }}
            />
            <p className="text-apoio mt-2 font-semibold text-gray-900">
              {nome}
            </p>
            <p className="text-apoio text-gray-600 tabular-nums">{hex}</p>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

const ESTILOS_DE_TEXTO = [
  {
    nome: "vitrine",
    medida: "44 px · Barlow 600",
    classe: "font-titulo text-vitrine font-semibold tracking-tight",
    exemplo: "Tudo da sua loja, num lugar só.",
  },
  {
    nome: "pagina",
    medida: "32 px · Barlow 600",
    classe: "font-titulo text-pagina font-semibold tracking-tight",
    exemplo: "Entrar no portal",
  },
  {
    nome: "secao",
    medida: "24 px · Barlow 600",
    classe: "font-titulo text-secao font-semibold tracking-tight",
    exemplo: "Relatórios",
  },
  {
    nome: "destaque",
    medida: "18 px · Atkinson 600",
    classe: "text-destaque font-semibold",
    exemplo: "Estudo de mercado de novembro",
  },
  {
    nome: "corpo",
    medida: "16 px · Atkinson 400",
    classe: "text-corpo",
    exemplo: "A equipe de PDV já foi avisada e responde por aqui.",
  },
  {
    nome: "apoio",
    medida: "14 px · Atkinson 400",
    classe: "text-apoio text-gray-600",
    exemplo: "Última atualização em 25/11/2026 14:10",
  },
  {
    nome: "senha",
    medida: "32 px · Atkinson 700",
    classe: "text-senha font-bold tabular-nums",
    exemplo: "482 913",
  },
];

export function SecaoTipografia() {
  return (
    <Secao
      id="tipografia"
      descricao="Barlow só nos títulos grandes; o resto em Atkinson Hyperlegible Next, que diferencia 0 de O e 1 de l."
    >
      <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {ESTILOS_DE_TEXTO.map((estilo) => (
          <li
            key={estilo.nome}
            className="grid gap-2 p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:p-6"
          >
            <p className="text-apoio text-gray-600">
              <span className="font-semibold text-gray-900">{estilo.nome}</span>
              <br />
              {estilo.medida}
            </p>
            <p className={`text-gray-900 ${estilo.classe}`}>{estilo.exemplo}</p>
          </li>
        ))}
      </ul>
    </Secao>
  );
}

const VARIANTES = [
  { variant: "primary", texto: "Enviar fotos" },
  { variant: "secondary", texto: "Ver todas" },
  { variant: "ghost", texto: "Cancelar" },
  { variant: "danger", texto: "Excluir arquivo" },
  { variant: "danger-solid", texto: "Excluir arquivo" },
  { variant: "escuro", texto: "Entrar como equipe" },
] as const;

export function SecaoBotoes() {
  return (
    <Secao
      id="botoes"
      descricao="Pílulas com pelo menos 44 px de altura. Uma ação principal por área; o texto diz o que acontece."
    >
      <div className="space-y-4">
        {VARIANTES.map(({ variant, texto }) => (
          <div
            key={variant}
            className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4"
          >
            <p className="text-apoio w-28 font-semibold text-gray-600">
              {variant}
            </p>
            <Button variant={variant} size="sm">
              {texto}
            </Button>
            <Button variant={variant}>{texto}</Button>
            <Button variant={variant} size="lg">
              {texto}
            </Button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-apoio w-28 font-semibold text-gray-600">estados</p>
          <Button iconeFinal={ArrowRight}>Enviar código</Button>
          <Button pending>Enviando código…</Button>
          <Button disabled>Enviar código</Button>
        </div>
      </div>
    </Secao>
  );
}

export function SecaoCampos() {
  return (
    <Secao
      id="campos"
      descricao="Todo campo vai dentro de um Field, que liga o rótulo, a dica e o erro. Texto de 16 px, para o iPhone não dar zoom."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field
          id="previa-cnpj"
          label="CNPJ da loja"
          dica="Com ou sem pontuação."
        >
          {(controle) => (
            <Input {...controle} placeholder="00.000.000/0000-00" />
          )}
        </Field>
        <Field
          id="previa-cnpj-erro"
          label="CNPJ da loja"
          erro="Este CNPJ não confere. Confira os números e digite de novo."
        >
          {(controle) => (
            <Input {...controle} defaultValue="11.222.333/0001-82" />
          )}
        </Field>
        <Field id="previa-mensagem" label="Mensagem para o associado" opcional>
          {(controle) => (
            <Textarea
              {...controle}
              rows={3}
              placeholder="Ex.: O relatório de novembro já está no portal."
            />
          )}
        </Field>
        <Field
          id="previa-email"
          label="E-mail cadastrado"
          dica="Só a equipe de PDV muda o e-mail."
        >
          {(controle) => (
            <Input {...controle} disabled defaultValue="jo***@gmail.com" />
          )}
        </Field>
        <Field id="previa-loja" label="Loja">
          {(controle) => (
            <Select {...controle} defaultValue="jumalti">
              <option value="jumalti">Drogaria Jumalti - Caxias do Sul</option>
              <option value="geral">Farmácia Geral - Caxias do Sul</option>
            </Select>
          )}
        </Field>
        <Field id="previa-codigo" label="Código de acesso">
          {(controle) => <CampoCodigo {...controle} defaultValue="482" />}
        </Field>
      </div>
    </Secao>
  );
}

export function SecaoAvisos() {
  return (
    <Secao
      id="avisos"
      descricao="Na página, perto do que comentam. Os flutuantes respondem a uma ação; atenção e erro ficam até a pessoa fechar."
    >
      <div className="grid gap-3">
        <Aviso tom="info">O relatório de novembro sai até o dia 10.</Aviso>
        <Aviso tom="sucesso">
          12 fotos enviadas. A equipe de PDV já foi avisada.
        </Aviso>
        <Aviso tom="atencao">
          O acesso pelo portal ainda não foi liberado. Por enquanto, a equipe de
          PDV continua mandando os relatórios por e-mail.
        </Aviso>
        <Aviso tom="erro">
          Não deu para enviar as fotos. Confira a internet e tente de novo.
        </Aviso>
      </div>
      <div className="mt-6">
        <BotoesDeAviso />
      </div>
    </Secao>
  );
}

const SITUACOES: { grupo: GrupoStatus; texto: string }[] = [
  { grupo: "aberto", texto: "Novo envio" },
  { grupo: "andamento", texto: "Em análise" },
  { grupo: "aguardando", texto: "Aguardando você" },
  { grupo: "resolvido", texto: "Publicado" },
  { grupo: "recusado", texto: "Recusado" },
  { grupo: "cancelado", texto: "Desativado" },
];

export function SecaoSelos() {
  return (
    <Secao
      id="selos"
      descricao="A situação se lê pelo texto e pela forma, não só pela cor."
    >
      <div className="flex flex-wrap gap-2">
        <Badge>Loja</Badge>
        <Badge className="bg-accent-light text-accent-strong" dot>
          Novo
        </Badge>
        <Badge className="bg-primary-light text-primary-strong">PDF</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {SITUACOES.map(({ grupo, texto }) => (
          <StatusBadge key={grupo} grupo={grupo}>
            {texto}
          </StatusBadge>
        ))}
      </div>
    </Secao>
  );
}

export function SecaoEtapas() {
  return (
    <Secao
      id="etapas"
      descricao="Só quando as etapas são uma sequência de verdade. A atual leva aria-current."
    >
      <Stepper
        rotulo="Etapas da assessoria"
        etapas={[
          { rotulo: "Visita", estado: "concluida" },
          { rotulo: "Relatório", estado: "atual" },
          { rotulo: "Publicado", estado: "futura" },
        ]}
      />
      <Stepper
        className="mt-10"
        rotulo="Etapas do envio"
        etapas={[
          { rotulo: "Enviado", estado: "concluida" },
          { rotulo: "Em análise", estado: "concluida" },
          { rotulo: "Recusado", estado: "negativa" },
        ]}
      />
    </Secao>
  );
}

const ARQUIVOS = [
  { nome: "Assessoria GC - Jumauti Ltda (1).pdf", data: "28/10/2026" },
  {
    nome: "BRICK 2004 - Drogaria Jumauti Ltda - MAT04_2026.pdf",
    data: "14/10/2026",
  },
  {
    nome: "BRICK 2004 - PRODUTOS JUMAUTI - MAT04_2026.xlsx",
    data: "14/10/2026",
  },
  { nome: "Medicamentos 1.jpeg", data: "10/08/2026" },
  { nome: "Medicamentos 2.mp4", data: "10/08/2026" },
];

export function SecaoTabela() {
  return (
    <Secao
      id="tabela"
      descricao="Listas com várias colunas no computador. No celular, cada linha vira um cartão."
    >
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <Table>
          <thead>
            <tr>
              <TableHead>Arquivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Atualizado em</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ARQUIVOS.map(({ nome, data }) => {
              const tipo = tipoDoArquivo(nome);
              return (
                <tr key={nome}>
                  <TableCell>
                    <span className="flex items-center gap-3">
                      <ArquivoIcon
                        tipo={tipo}
                        className="text-primary-strong size-5 shrink-0"
                      />
                      <span className="min-w-0 font-semibold wrap-break-word text-gray-900">
                        {nome}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {ROTULO_DO_TIPO[tipo]}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-600 tabular-nums">
                    {data}
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Secao>
  );
}

// Um nome para cada um dos quatro tons do Avatar.
const PESSOAS = [
  "Equipe de PDV",
  "Camila Couto",
  "William Bica",
  "Guilherme Soares",
];

export function SecaoSuperficies() {
  return (
    <Secao
      id="superficies"
      descricao="Cartão só para o que é clicável ou flutua, sem cartão dentro de cartão."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="sm">
          <p className="text-destaque font-semibold">padding sm</p>
          <p className="text-apoio text-gray-600">16 px de respiro.</p>
        </Card>
        <Card>
          <p className="text-destaque font-semibold">padding md</p>
          <p className="text-apoio text-gray-600">24 px, o padrão.</p>
        </Card>
        <Card elevado>
          <p className="text-destaque font-semibold">elevado</p>
          <p className="text-apoio text-gray-600">Sombra para o que flutua.</p>
        </Card>
      </div>
      <Card className="mt-4" padding="none">
        <EmptyState
          as="h3"
          icon={Images}
          title="Nenhuma foto ainda"
          description="As fotos que você enviar aparecem aqui, separadas em antes e depois."
          action={<Button iconeFinal={ArrowRight}>Enviar fotos</Button>}
        />
      </Card>
      <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {PESSOAS.map((nome) => (
          <li key={nome} className="flex items-center gap-2">
            <Avatar nome={nome} />
            <span className="text-corpo">{nome}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <Avatar nome="Farmácia Geral" size="sm" />
          <span className="text-apoio text-gray-600">tamanho sm</span>
        </li>
      </ul>
    </Secao>
  );
}

export function SecaoDialogo() {
  return (
    <Secao
      id="dialogo"
      descricao="Antes de qualquer ação que não dá para desfazer. Os botões dizem o verbo; nunca OK e Cancelar."
    >
      <ExemploDeDialogo />
    </Secao>
  );
}

export function SecaoNavegacao() {
  return (
    <Secao
      id="navegacao"
      descricao="O link de volta leva o nome da tela de destino. O ponto pulsa se a próxima tela demorar."
    >
      <div className="flex flex-wrap items-center gap-6">
        <VoltarLink href="/previa">Prévia</VoltarLink>
        <Link
          href="/previa/cnpj"
          className="text-primary-strong inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
        >
          Abrir a tela de CNPJ
          <LinkPendingHint />
        </Link>
      </div>
    </Secao>
  );
}

export function SecaoMarca() {
  return (
    <Secao
      id="marca"
      descricao="No painel escuro, o logo vai numa placa branca; sobre o branco, vai sem placa. O realce só aparece sobre o petróleo."
    >
      <div className="superficie-escura from-petroleo-900 to-petroleo-950 relative overflow-hidden rounded-2xl bg-linear-to-br p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex rounded-full bg-white p-1.5 ring-4 ring-white/10">
            <Logo tamanho={36} />
          </span>
          <span className="flex rounded-full bg-white p-2 ring-4 ring-white/10">
            <Logo tamanho={64} />
          </span>
        </div>
        <p className="font-titulo text-pagina mt-6 font-semibold tracking-tight text-balance">
          Tudo da sua loja, <span className="text-realce">num lugar só.</span>
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          <SeloComVisto>Relatórios da assessoria</SeloComVisto>
          <SeloComVisto>Estudos de mercado</SeloComVisto>
          <SeloComVisto>Fotos de antes e depois</SeloComVisto>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6">
        <Logo tamanho={64} />
        <p className="text-corpo text-gray-600">
          Sobre o branco, a marca vai direto, com o nome do sistema ao lado.
        </p>
      </div>
    </Secao>
  );
}
