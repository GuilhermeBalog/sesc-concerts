type UnitType = 'institucional' | 'capital' | 'interior' | 'litoral'

export interface Unit {
  name: string,
  group_id: number,
  group_slug: string,
  description: UnitType
}

export interface Activity {
  id: number,
  id_java?: number, // se nao tem id_java, provavelmente eh gratuito. id java eh usado para fazer request pro portal da bilheteria
  imagem: string,
  link: string,
  titulo: string,
  complemento: string,
  cancelado: string,
  esgotado: string,
  categorias: {
    cor: string,
    link: string,
    titulo: string,
  }[],
  qtdeIngressosWeb: number | null, // se eh null, provavelmente eh gratuito
  qtdeIngressosRede: number | null,
  quantDatas: string,
  dataProxSessao: string,
  dataPrimeiraSessao: string,
  dataUltimaSessao: string,
  unidade: {
    name: string | null,
    link: string,
  }[],
}

interface ActivitiesResponse {
  editorial: [],
  atividade: Activity[],
  total: {
    value: number,
    relation: 'eq'
  }
}

export class SescClient {
  public static readonly DOMAIN = "https://www.sescsp.org.br"
  public static readonly API_BASE_URL = this.DOMAIN + "/wp-json/wp/v1"

  public async getAllUnits() {
    const res = await fetch(`${SescClient.API_BASE_URL}/unidades`);
    const allUnits = await res.json() as Unit[];

    return allUnits;
  }

  public async getAllActivities() {
    const searchParams = new URLSearchParams({
      categoria: "musica-show",
      ppp: '1000',
      page: '1',
      tipo: "atividade",
    });

    const url = `${SescClient.API_BASE_URL}/atividades/filter?${searchParams.toString()}`;

    const res = await fetch(url);
    const body = await res.json() as ActivitiesResponse;

    return body;
  }
}