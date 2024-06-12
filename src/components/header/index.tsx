import { useActivities } from "@/contexts/activities"

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: "2-digit",
  month: '2-digit',
  year: 'numeric',
  hour: "2-digit",
  minute: "2-digit",
  second: '2-digit',
});

export function Header() {
  const { updatedAt, update, loading } = useActivities();

  return (
    <header>
      <h1>Pesquisar Shows do Sesc SP</h1>
      {updatedAt && (
        <p>
          Última atualização:{' '}
          {dateFormatter.format(updatedAt)}{' '}
          <button onClick={update} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </p>
      )}
    </header>
  )
}