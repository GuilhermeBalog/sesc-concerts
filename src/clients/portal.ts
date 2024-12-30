interface Session {
  idSessao: number,
  idAtividade: number,
  dataInicialSessaoFmt: string,
  dataFinalSessaoFmt: string,
  dataInicialVendaOnlineFmt: string,
  dataFinalVendaOnlineFmt: string,
  dataInicialVendaRedeFmt: string,
  dataFinalVendaRedeFmt: string,
  qtdeIngressosRede: number,
  qtdeIngressosWeb: number,
  ingressoOnlineDisponivel: boolean,
  gratuito: boolean,
  urlCompra: string,
  statusSessaoSesc: string,
}

interface SessionsResponse {
  idAtividade: number,
  sessoes: Session[]
  totalSessoes: number,
}

// https://portal.sescsp.org.br/v2/bilheteria/atividade.action?idAtividade=237056

export class PortalClient {
  public static readonly PORTAL_API_BASE_URL = "https://portal.sescsp.org.br"

  public async getSessions(java_id: number) {
    const res = await fetch(`${PortalClient.PORTAL_API_BASE_URL}/v2/bilheteria/atividade.action?idAtividade=${java_id}`);
    const body = await res.json() as SessionsResponse;

    return body
  }
}