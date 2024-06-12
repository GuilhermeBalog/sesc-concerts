type UnitType = 'institucional' | 'capital' | 'interior' | 'litoral'

export interface Unit {
  name: string,
  group_id: number,
  group_slug: string,
  description: UnitType
}

export interface Activity {
  id: number,
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

export class Sesc {
  public static readonly DOMAIN = "https://www.sescsp.org.br"
  public static readonly API_BASE_URL = this.DOMAIN + "/wp-json/wp/v1"

  private async getCapitalUnits() {
    const allUnits = await this.getAllUnits();

    return allUnits.filter(unit => unit.description === "capital").map(unit => unit.name)
  }

  public async getAllUnits() {
    const res = await fetch(`${Sesc.API_BASE_URL}/unidades`);
    const allUnits = await res.json() as Unit[];

    return allUnits;
  }

  private async getAlternativeUnits() {
    return [
      "Campinas",
      "Jundiaí",
      "Registro",
      "Santos",
      "São José dos Campos"
    ]
  }

  async getMusicConcerts() {
    const body = await this.getAllActivities();

    const capitalUnits = await this.getCapitalUnits()
    const alternativeUnits = await this.getAlternativeUnits();

    const targetUnits = new Set([
      ...capitalUnits,
      ...alternativeUnits,
    ]);

    const activities = body.atividade
      .filter(a =>
        this.isConcert(a) &&
        this.happensAtTargetUnit(a, targetUnits) &&
        this.isNotSoldOutOrCanceled(a)
      )
      .map(a => {
        return ({
          id: a.id,
          image: a.imagem,
          link: `${Sesc.DOMAIN}${a.link}`,
          title: `${a.titulo} - ${a.complemento}`,
          places: a.unidade.map(u => u.name).join(', '),
          datetime: this.formatDate(a.dataProxSessao)
        });
      });

    return activities;
  }

  public async getAllActivities() {
    const searchParams = new URLSearchParams({
      categoria: "musica-show",
      ppp: '1000',
      page: '1',
      tipo: "atividade",
    });

    const url = `${Sesc.API_BASE_URL}/atividades/filter?${searchParams.toString()}`;

    const res = await fetch(url);
    const body = await res.json() as ActivitiesResponse;
    return body;
  }

  private happensAtTargetUnit(activity: Activity, targetUnits: Set<string | null>) {
    return activity.unidade.some(unit => targetUnits.has(unit.name));
  }

  private isConcert(activity: Activity) {
    return activity.categorias.some(categoria => (
      (/show/i).test(categoria.titulo)
    ));
  }

  private isNotSoldOutOrCanceled(activity: Activity) {
    return !activity.esgotado && !activity.cancelado
  }

  private formatDate(dateString: string) {
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: "2-digit",
      month: '2-digit',
      year: 'numeric',
      hour: "2-digit",
      minute: "2-digit"
    });

    const date = new Date(dateString);

    return dateFormatter.format(date);
  }
}