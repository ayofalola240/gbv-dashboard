export const AGENCY_CONFIG = {
  nscdc: {
    slug: 'nscdc',
    label: 'NSCDC Dashboard',
    name: 'NSCDC',
    fullName: 'Nigeria Security and Civil Defence Corps',
    apiValue: 'NSCDC',
    count: 8,
  },
  naptip: {
    slug: 'naptip',
    label: 'NAPTIP Dashboard',
    name: 'NAPTIP',
    fullName: 'National Agency for the Prohibition of Trafficking in Persons',
    apiValue: 'NAPTIP',
    count: 5,
  },
  fcta: {
    slug: 'fcta',
    label: 'FCTA Dashboard',
    name: 'FCTA',
    fullName: 'FCT Administration Women Affairs Secretariat',
    apiValue: 'FCTA WAS',
    count: 12,
  },
  police: {
    slug: 'police',
    label: 'Police Dashboard',
    name: 'Police',
    fullName: 'Nigeria Police Force',
    apiValue: 'Police',
    count: 15,
  },
};

export const AGENCIES_LIST = Object.values(AGENCY_CONFIG);
