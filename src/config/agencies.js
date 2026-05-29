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

// Maps an agency-scoped role to the single agency slug it controls
export const ROLE_TO_AGENCY_SLUG = {
  nscdc_admin: 'nscdc',
  naptip_admin: 'naptip',
  fcta_admin: 'fcta',
  police_admin: 'police',
};

/** Returns the slugs the given role is allowed to access, or all slugs for super_admin. */
export function getAllowedAgencySlugs(role) {
  if (role === 'super_admin') return AGENCIES_LIST.map((a) => a.slug);
  const slug = ROLE_TO_AGENCY_SLUG[role];
  return slug ? [slug] : [];
}
