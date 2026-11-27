import { useId, type Ref } from "react";

import type { OpcaoDeLoja } from "@/components/loja/SeletorDeLoja";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import type { Momento } from "@/lib/envio";
import { nomeDaLoja } from "@/lib/loja";

import { TituloDoPasso } from "./TituloDoPasso";

const MOMENTOS: { valor: Momento; rotulo: string; dica: string }[] = [
  { valor: "antes", rotulo: "Antes", dica: "Como a loja estava" },
  { valor: "depois", rotulo: "Depois", dica: "Como a loja ficou" },
];

/**
 * O passo 1 do envio: a loja e o momento. Com uma loja só, ela aparece
 * escrita; com duas ou mais, vira um campo de escolha, já na loja de onde o
 * associado veio.
 */
export function EscolhaDoDestino({
  lojas,
  lojaId,
  aoMudarLoja,
  momento,
  aoMudarMomento,
  erro,
  desabilitado,
  refDoMomento,
}: {
  lojas: OpcaoDeLoja[];
  lojaId: string;
  aoMudarLoja: (id: string) => void;
  momento?: Momento;
  aoMudarMomento: (momento: Momento) => void;
  erro?: string;
  desabilitado: boolean;
  refDoMomento: Ref<HTMLInputElement>;
}) {
  const loja = lojas.find(({ id }) => id === lojaId);

  return (
    <section aria-labelledby="passo-destino">
      <Card padding="lg">
        <TituloDoPasso numero={1} id="passo-destino">
          Para onde vão
        </TituloDoPasso>

        <div className="mt-5 flex flex-col gap-6">
          {lojas.length > 1 ? (
            <Field id="envio-loja" label="Loja">
              {(controle) => (
                <Select
                  {...controle}
                  value={lojaId}
                  disabled={desabilitado}
                  onChange={(evento) => aoMudarLoja(evento.target.value)}
                >
                  {lojas.map(({ id, nome }) => (
                    <option key={id} value={id}>
                      {nomeDaLoja(nome)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          ) : (
            <dl>
              <dt className="text-corpo font-semibold text-gray-900">Loja</dt>
              <dd className="text-corpo mt-1 text-gray-700">
                {loja ? nomeDaLoja(loja.nome) : null}
              </dd>
            </dl>
          )}

          <EscolhaDoMomento
            momento={momento}
            aoMudar={aoMudarMomento}
            erro={erro}
            desabilitado={desabilitado}
            refDoPrimeiro={refDoMomento}
          />
        </div>
      </Card>
    </section>
  );
}

/**
 * Antes ou depois da assessoria, em dois cartões de escolha. Nenhum vem
 * marcado: a foto na seção errada dá retrabalho para a equipe. É a pergunta 1
 * da Camila; se tudo for para "Enviadas pelo associado", este componente sai.
 */
export function EscolhaDoMomento({
  momento,
  aoMudar,
  erro,
  desabilitado,
  refDoPrimeiro,
}: {
  momento?: Momento;
  aoMudar: (momento: Momento) => void;
  erro?: string;
  desabilitado: boolean;
  refDoPrimeiro: Ref<HTMLInputElement>;
}) {
  const idDoErro = useId();

  return (
    <fieldset
      disabled={desabilitado}
      aria-describedby={erro ? idDoErro : undefined}
      className="min-w-0"
    >
      <legend className="text-corpo font-semibold text-gray-900">
        As fotos e os vídeos são de antes ou de depois da assessoria?
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {MOMENTOS.map(({ valor, rotulo, dica }, i) => (
          <label
            key={valor}
            className="has-checked:border-primary-strong has-checked:bg-primary-light flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border border-gray-300 bg-white p-4 transition-colors hover:border-gray-500 has-disabled:cursor-not-allowed has-disabled:opacity-60"
          >
            <input
              ref={i === 0 ? refDoPrimeiro : undefined}
              type="radio"
              name="momento"
              value={valor}
              checked={momento === valor}
              onChange={() => aoMudar(valor)}
              className="accent-primary-strong mt-0.5 size-5 shrink-0"
            />
            <span>
              <span className="text-corpo block font-semibold text-gray-900">
                {rotulo}
              </span>
              <span className="text-apoio block text-gray-600">{dica}</span>
            </span>
          </label>
        ))}
      </div>
      {erro && (
        <p
          id={idDoErro}
          role="alert"
          className="text-apoio mt-2 font-semibold text-red-700"
        >
          {erro}
        </p>
      )}
    </fieldset>
  );
}
