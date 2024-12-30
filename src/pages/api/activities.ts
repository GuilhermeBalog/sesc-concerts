import { PortalClient } from '@/clients/portal';
import { SescClient } from '@/clients/sesc';
import { ActivitiesService, MusicActivity } from '@/services/activities';
import type { NextApiRequest, NextApiResponse } from 'next'

const sesc = new SescClient();
const portal = new PortalClient();
const service = new ActivitiesService(sesc, portal);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MusicActivity[]>
) {

  const activities = await service.getMusicActivities()

  res.status(200).json(activities)
}