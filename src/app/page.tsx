import { redirect } from "next/navigation";

// Por enquanto, quem abre o portal cai na entrada do associado. Quando o card
// #10 criar a sessão, esta página passa a ser a tela da loja.
export default function Inicio() {
  redirect("/entrar");
}
