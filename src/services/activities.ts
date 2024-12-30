import { PortalClient } from "@/clients/portal";
import { Activity, SescClient } from "@/clients/sesc";

export interface MusicActivity {
  id: number,
  image: string,
  link: string,
  title: string,
  subtitle: string
  places: (string | null)[],
  dates: string[],
  categories: string[],
  tickets: number | null,
}

export class ActivitiesService {
  constructor(private sesc: SescClient, private portal: PortalClient) {}

  public async getMusicActivities(): Promise<MusicActivity[]> {
    const activities = (await this.sesc.getAllActivities()).atividade;

    return await Promise.all(activities.map(a => this.formatActivity(a)))
  }

  private async getDates(activity: Activity): Promise<string[]> {
    if(!activity.id_java || activity.dataPrimeiraSessao === activity.dataUltimaSessao) {
      return [activity.dataPrimeiraSessao]
    }

    try{
      const sessions = (await this.portal.getSessions(activity.id_java)).sessoes
      return sessions.map(session => session.dataInicialSessaoFmt)
    } catch(error) {
      console.error(error);
    }

    return [activity.dataPrimeiraSessao]
  }

  private async formatActivity(activity: Activity): Promise<MusicActivity> {
    const dates = await this.getDates(activity)

    return {
      id: activity.id,
      image: activity.imagem,
      link: `${SescClient.DOMAIN}${activity.link}`,
      title: activity.titulo,
      subtitle: activity.complemento,
      places: activity.unidade.map(unit => unit.name),
      dates,
      categories: activity.categorias.map(category => category.titulo),
      tickets: activity.qtdeIngressosWeb,
    }
  }
}